# RURAL JAPAN — Phase 2 事前調査（Claude Code）

調査日: 2026-10-11。対象: `C:\Users\highw\vs_highwing\rural_japan`（main、コミットなし、全ファイルがステージ済み）。実装・push・DNS・デプロイは行っていない。

## 0. ベースライン検証結果

| コマンド | 結果 |
| --- | --- |
| `npm run lint` | 成功（指摘0） |
| `npm run check` | 成功（16ファイル、エラー0・警告0） |
| `npm test` | 成功（2件） |
| `npm run build` | 成功（5ページ: `/`, `/about/`, `/credits/`, `/places/neba/`, `/404.html`） |
| `npm run test:e2e` | 成功（desktop 7件 + mobile 7件 = 14件、Edgeチャンネル） |
| `npm audit` | High 4件（開発依存のみ、後述） |

環境: Node 24.14.1 / npm 11.11.0 / Astro 7.3.8。ビルド出力は `noindex, nofollow` と `robots.txt: Disallow: /`。sitemap・canonical・OGは未出力。

## 1. 地域追加時に残る根羽村固有の前提

地域データ (`src/data/regions.ts`) と地域テンプレート (`src/layouts/RegionLayout.astro`) 自体は地域非依存。固有前提はその外側に残っている。

### 1-1. 文言としての固有前提（原稿反映で解消）

| 箇所 | 内容 | 扱い |
| --- | --- | --- |
| `src/pages/index.astro:14-18` | ヒーローのCTA `/places/neba/`、`NEBA, NAGANO 根羽村`、`01 / FIELD NOTES` | トップの編集枠。README通り「編集者が管理する枠」として残してよいが、2地域目以降は文言更新が必要 |
| `src/pages/index.astro:28` | `OUR FIRST DESTINATION / 01` | 2地域目で虚偽になる。`regions.length` から生成するか、固定文言を廃止 |
| `src/pages/index.astro:37,39` | 下部写真キャプション `Neba, Nagano`、終端リンク `/places/neba/` | 編集枠。更新手順に明記 |
| `src/pages/about.astro:6,9` | `We begin with Neba`、`first design preview`、`in this preview`、`Begin in Neba` | 公開文言へ修正（必須要件「試作版表記の修正」） |
| `src/pages/credits.astro:5-6` | description と本文に `design preview`、`All photographs in this preview depict Neba, Nagano` | 2地域目で虚偽になる。`photo.location` を使う文に変更 |
| `src/layouts/BaseLayout.astro:49` | フッター `Phase 1 · Design preview` | 運営者表記・連絡方法へ置換 |
| `regions.ts:63` | 訪問メモ `This first field guide is an introduction` | 英語レビュー時に「first」の扱いを決める |

### 1-2. 構造としての固有前提（テンプレート側の制約）

| 箇所 | 前提 | 影響 | 最小修正 |
| --- | --- | --- | --- |
| `RegionLayout.astro:16` | `chapter.label.split(' / ')[1]` で章ナビ文言を得る | `label` に ` / ` がないとナビのリンク文字が空になる（axeの「リンク名なし」で落ちる） | `Region.chapters[].navLabel` を追加するか、単体テストで ` / ` 形式を検証 |
| `global.css:146` | `.travel-notes{grid-template-columns:repeat(3,1fr)}` | 訪問メモが3件以外だと空セルや折返し崩れ | `repeat(auto-fit,minmax(240px,1fr))` に変更、または単体テストで件数3を固定 |
| `RegionLayout.astro:20` | `0{i + 1}` でメモ番号を生成 | 10件以上で `010` 表記 | 件数制約をテストに入れるか `String(i+1).padStart(2,'0')` |
| `global.css:141` | `.chapter:first-child img` だけ高さ620px・位置58% | 章の写真構図が1枚目前提 | 設計上の意図。写真差し替え時に確認項目へ |
| `regions.ts:6` | `number: '01'` は手入力 | 重複・欠番をテストしていない | 単体テストで一意性を検証 |
| `tests/browser/site.spec.ts` | `/places/neba/`、`Discover Neba`、`THE GREAT CEDAR`、`#great-cedar`、`#cedar`、`#river` を直書き | 2地域目を追加してもE2Eは根羽村しか見ない | `regions` からパス一覧を生成する形に変更（導線テストは根羽村固定で可） |

CSSは `.destination+.destination{margin-top:40px}` (`global.css:87`) があり、トップのカード複数表示には対応済み。

### 1-3. 情報確認日の不足（必須要件）

`Region` 型に「読者向けの情報確認日」がなく、`source-notes` にも表示がない。写真台帳の `verifiedAt` はあるが、要件通り記事の確認日に流用しない。

最小修正:

- `Region` に `informationCheckedOn: string`（`YYYY-MM-DD`）を追加。任意で `sources[].checkedOn`。
- `RegionLayout.astro:21` の `source-notes` 内に「Information checked on 11 October 2026」を表示。
- `tests/content.test.mjs` でISO日付形式と「未来日でない」ことを検証。
- 内部の根拠・承認記録は `docs/editorial/<slug>.md`（事実 / 出典 / 確認日 / 確認者 / 英語レビュー / 承認）として `src/` 外で管理。サイト側の型拡張は上記1項目に留める。

### 1-4. 根羽村記事で一次情報照合が必要な記述

- `regions.ts:45` 「around 1,800 years old」「The village describes it as」— 村の一次情報の該当ページと表現を照合。
- `regions.ts:51` 公園・吊り橋の案内 — 利用状況と案内可否を村・観光協会に確認。
- `regions.ts:62` 「close to Aichi and Gifu」— 事実確認は容易だが出典を記録。
- `regions.ts:39,67-69` 外部URL3件 — E2Eは内部リンクのみ検査するため、公開前に手動で到達確認し確認日を記録。

## 2. 個別許諾写真を扱う場合の型・表示・テストへの影響

### 現状の固定箇所

| ファイル | 固定内容 |
| --- | --- |
| `tests/content.test.mjs:14-16` | `license === 'CC BY-SA 4.0'`、`sourceUrl` がCommonsの `File:`、`licenseUrl` がCC BY-SA 4.0 deed |
| `src/pages/credits.astro:7` | 「License」行は必ずリンク、「Source」行のラベルが `Original file on Wikimedia Commons` 固定 |
| `src/components/Photo.astro:19` | `Photo: {author}` → `/credits/#id`。許諾写真でもそのまま使える |
| `docs/IMAGE-LICENSES.md` | 全件CC BY-SA前提の文章 |

`photos.json` は型定義なしのJSON import（Astroが構造から推論）。

### 最小修正案（タスク4。必要になった場合のみ）

- `photos.json` に `rights: "cc-by-sa-4.0" | "permission"` を追加。既存4件は `cc-by-sa-4.0`。
- `permission` のとき必須: `rightsHolder`（公開表記）、`permissionSummary`（公開用の一文、例 "Used with permission of ..."）、`permissionRef`（`docs/image-evidence.json` 等の内部参照ID。メール本文は含めない）、`verifiedAt`、`changes`、`capturedAt`。任意: `validUntil`、`sourceUrl`、`sourceLabel`。
- `tests/content.test.mjs`: `rights` で分岐。`cc-by-sa-4.0` は現行検証をそのまま、`permission` は上記必須項目を検証。「必須項目の検査を単に削除しない」を満たす。全件共通で `id`, `alt`, `author`, `verifiedAt`, `changes`, 実ファイル、サイズ、寸法は維持。
- `credits.astro`: License行を `rights` で分岐（CCはリンク、許諾は `permissionSummary` の文章）。Source行は `sourceUrl` がある場合のみ表示し、ラベルを `sourceLabel ?? 'Original file'` にする。
- `docs/IMAGE-LICENSES.md`: 「許諾写真」節を追加し、証跡の保管場所を記す（許諾メールは台帳と分離）。
- 任意: `src/data/photos.ts` に `Photo` 型を置き `satisfies Photo[]` で検証すると判別可能になるが、JSONのままでも文字列比較で動くため必須ではない。

写真IDは差し替え時も維持する（`Photo.astro` と `credits.astro` の `#id` アンカー、E2Eの `#cedar` / `#river` が依存）。

### OG画像にCC BY-SA写真を使う場合

共有カードには帰属表示が出ない。クレジットページで帰属を提供する運用で足りるかは判断事項として残す（要件10のOG画像判断に含める）。許諾写真なら用途として明記して確認する。

## 3. 公開用SEOと公開前設定を切り替える最小変更範囲

### 現状

- `astro.config.mjs`: `site` 未設定。
- `BaseLayout.astro:19`: `<meta name="robots" content="noindex, nofollow">` を固定出力。canonical・OGなし。
- `public/robots.txt`: `Disallow: /` の静的ファイル。
- `tests/browser/site.spec.ts:13`: noindex を必須にしている。
- `@astrojs/sitemap@3.7.4` は Astro 7 に対する peerDependencies を宣言しておらず、互換性が未検証。

### 最小変更案（タスク7。承認後に実施）

切替は「ビルドモード1つ」に集約し、ファイル・環境での分岐を増やさない。

| ファイル | 変更 |
| --- | --- |
| `astro.config.mjs` | `site: 'https://rural.ugatta-llc.com'`（URL確定後）。`trailingSlash: 'always'` は維持 |
| `.env.public`（新規・コミット対象） | `PUBLIC_INDEXABLE=true`。`.gitignore` に `!.env.public` を追加 |
| `package.json` | `build:public: astro build --mode public`、`preview:public`。既定の `build` は従来通り非公開状態を出力 |
| `src/layouts/BaseLayout.astro` | `import.meta.env.PUBLIC_INDEXABLE === 'true'` で robots meta を `index, follow` / `noindex, nofollow` に切替。`Astro.site` があるとき `<link rel="canonical">`、`og:title` / `og:description` / `og:type` / `og:url` / `og:site_name` / `og:image` / `twitter:card` を出力。`ogImage` を任意Propとして受け、既定は文字・ロゴ中心のOG画像（`public/og-default.png` 等、1200×630）|
| `public/robots.txt` → `src/pages/robots.txt.ts` | モードで `Allow` / `Disallow` を出し分け、公開時は `Sitemap:` 行を付ける |
| `src/pages/sitemap.xml.ts`（新規） | `/`, `/about/`, `/credits/` と `regions` のslugから生成。5URL程度なので `@astrojs/sitemap` を入れるより依存が少なく、Astro 7互換の確認も不要 |
| `playwright.config.ts` | `webServer` を配列にし、4321（既定）と4322（`astro dev --mode public --port 4322`）を起動。`public-desktop` プロジェクトを追加して `baseURL` を4322にする。Windowsでnpm scriptに環境変数を渡す問題（cross-env不要）を避けられる |
| `tests/browser/site.spec.ts` | プロジェクト名で期待値を切替（既定: noindex + `robots.txt` Disallow + sitemap 404、public: index + canonical一致 + `/sitemap.xml` 200 + 各URLが `trailingSlash` 付き） |

実装時に確認する点: Astro 7 CLIの `--mode` が `.env.public` を読むこと（Vite準拠のはず）。`Astro.url` から canonical を作る際に末尾スラッシュが保たれること。

### 公開移行時にホスティング側で確認する点（設定ではなく運用）

- `404.html` を404応答として配信する設定。
- `trailingSlash: 'always'` のため `/about` → `/about/` のリダイレクト有無。
- HTTPS、切り戻し（直前ビルドの再配信）手順。

## 4. 既知の開発依存問題の解消方法と実行環境への影響

### 現状の連鎖

```
eslint-plugin-astro@1.5.0
└─ astro-eslint-parser@1.4.0
   └─ fast-glob@3.3.3 → micromatch@4.0.8 → braces@3.0.3
```

GHSA-vfj7-8cjw-p6xm の影響範囲は `braces <= 3.0.3`、つまり公開済み全バージョン。修正版 `braces` は存在しない。解消は `astro-eslint-parser >= 2.1.0`（`fast-glob` を `tinyglobby` に置換）への更新のみで、`npm audit fix` が「fix available」と表示するが、plugin 1.x が parser `^1.3.0` を固定するため実際には適用されない（Phase 1資料の記録と一致）。

### 更新先と要件

| パッケージ | 版 | Node要件 |
| --- | --- | --- |
| `eslint-plugin-astro` | 3.2.1（最新） | `^22.22.3 \|\| ^24.16.0 \|\| >=26.3.0` |
| `astro-eslint-parser` | 3.2.0 | 同上 |
| 現在のNode | 24.14.1 | 要件未達 |

### 推奨

1. Node を 24系の最新（npmレジストリ上の `node` パッケージでは 24.21.0 が最新。nodejs.org の LTS 表示で再確認）へ更新。`package.json` の `engines.node` を `>=24.16.0` に上げる。
2. `eslint-plugin-astro@^3.2.1` へ更新。`eslint.config.mjs` の `astro.configs['flat/recommended']` がv3で同名か確認（名称が変わっていれば修正）。
3. `npm run lint` / `npm run check` / `npm audit` を再実行し、0件を記録。
4. `@types/node` は Node 24 に合わせ 24系のまま。`typescript` 7系への更新は今回不要。

Nodeを更新できない場合は、残存理由（開発時のみ・lintに外部入力を渡さない・配信物に含まれない）、影響、対応期限、承認者を公開判断に記録する。

### 実行環境の他の前提

- Playwright は `channel: 'msedge'` 固定。Edgeがない環境（CI等）では `npx playwright install chromium` と設定変更が必要（README記載済み）。
- `npm test` は Node の型ストリップで `regions.ts` を直接読む。Node 24 以上が前提。

## 5. 2地域目の入稿検証（タスク5）の実現方法

`.astro` は `node --test` から直接importできないため、Container API を使うには vitest 等の追加が要る。依存を増やさない案:

- `tests/fixtures/sample-region.ts` に検証用地域（既存写真ID `landscape` / `river` / `cedar` / `fields` を再利用し、新規画像は不要）。
- `src/data/catalog.ts`（新規）で `import.meta.env.PUBLIC_SAMPLE_REGION === 'true'` のときだけ `regions` に検証用地域を連結。`index.astro` と `places/[slug].astro` はこの配列を参照。
- Playwright の `sample` プロジェクトで `/places/sample-village/` の生成とトップのカード2件表示を確認。
- `tests/build.test.mjs`（新規）で `npm run build` 後の `dist/` に `sample-village` が存在しないことを検証し、「検証用記事は公開出力に残さない」を自動で担保。

## 6. 実装順序（Codex向け）

要件7の順序を前提に、依存関係を踏まえた順。

1. **依存関係とNode**（要件タスク6の前半）: Node更新 → lintプラグイン更新 → 全検証。以降の作業を新環境で行うため先に実施。
2. **構造修正**（1-2）: `navLabel` または形式テスト、訪問メモのグリッド、`number` 一意性テスト、E2Eの `regions` 駆動化。原稿反映の前に型を安定させる。
3. **情報確認日と編集記録**（タスク2、1-3）。
4. **承認済み原稿の反映**（タスク1、1-1）: トップ・About・クレジット・フッター・地域データ。運営者表記と連絡方法を含む。
5. **写真台帳の反映**（タスク3）と、必要な場合のみ **許諾写真対応**（タスク4、第2節）。
6. **2地域目の入稿検証**（タスク5、第5節）。
7. **表示・操作の修正**（タスク6の後半）: 実機・Firefox・iOS Safari での確認結果に基づく。
8. **承認後**: 公開設定（タスク7、第3節）。
9. **最終レビュー指摘の修正**（タスク8）。

各段階後に `npm run lint && npm run check && npm test && npm run build && npm run test:e2e` と `git diff` 確認。

## 7. 最終レビューで重点確認する回帰リスク

| 領域 | 確認内容 |
| --- | --- |
| 公開状態の切替 | 既定ビルドが noindex / Disallow のまま、公開モードのみ index / canonical / sitemap になること。両モードのE2Eが通ること |
| クレジット到達性 | 全 `Photo` の figcaption から `/credits/#id` へ到達し、写真差し替え後もIDとアンカーが維持されること |
| 英文修正後のレイアウト | `title` / `cardHeading` / 章タイトルの `\n` と `white-space: pre-line`（`global.css:86,124,142`）の改行位置。ヒーロー見出し `clamp(80px,8.7vw,132px)` での折返し |
| 写真の切り抜き | `object-position`（`global.css:47,100,127,141`）が差し替え写真でも主題を切らないこと |
| 狭幅・メニュー | 320px横はみ出し、`details` メニューのEscape、フォーカス可視 |
| アクセシビリティ | フッターに運営者・連絡先を追加した後の暗背景コントラスト、章ナビのリンク名、axe 0件 |
| 外部リンク | 村・観光協会URL3件の到達とラベルの `(Japanese)` 表記維持。E2Eは内部リンクのみ検査する |
| ビルド出力 | `dist/` に検証用地域・試作版文言（`preview`, `Phase 1`）が残らないこと |
| lint更新 | プラグインv3での設定名変更と新規ルールの誤検知 |
| ホスティング | `404.html` の配信、末尾スラッシュのリダイレクト、HTTPS |

## 8. 現状の不具合と機能提案の区分

### 不具合・要修正（現状のコードで問題になるもの）

- `credits.astro` の説明文が全写真を根羽村と断定しており、2地域目で虚偽になる（`credits.astro:6`）。
- `index.astro:28` の `OUR FIRST DESTINATION / 01` が2地域目で虚偽になる。
- 章ナビの `split(' / ')[1]` が入力形式に依存し、形式違反でリンク名が空になる（`RegionLayout.astro:16`）。
- 訪問メモのグリッドが3件固定（`global.css:146`）。
- `Region.number` の一意性が未検証（`tests/content.test.mjs`）。
- 記事の情報確認日を表示する仕組みがない（必須要件）。
- 試作版文言（`Phase 1 · Design preview`, `design preview`, `in this preview`）が公開文面に残っている。

### 機能提案（承認後・必要時）

- 許諾写真対応（第2節）。
- 公開モード切替、canonical、OG、sitemap、robots 出し分け（第3節）。
- 検証用地域のモード限定読み込みとビルド出力ガード（第5節）。
- 外部リンク到達確認スクリプト（任意。E2Eに含めると外部依存で不安定になるため別コマンド推奨）。

## 9. 未解決・UGATTA判断待ちで実装がブロックされる項目

- 運営者表記・連絡方法（フッター・About の文言を確定できない）。
- 本番URL（`site`、canonical、sitemap、OG の `og:url` に必要）。
- OG画像の方針（文字・ロゴ中心か写真か。写真ならライセンス上の扱い）。
- 現行写真の継続可否（継続なら許諾写真対応は不要）。
- 根羽村・観光協会への確認結果（樹齢表現、公園・吊り橋の案内範囲）。

## 10. 実装状況（Claude Code、2026-10-11）

判断待ちでない項目を実装した。運営者表記・承認済み原稿・写真差し替え・Node更新は未実施。

| 項目 | 変更 | 検証 |
| --- | --- | --- |
| 章ナビの `split(' / ')` 依存 | `Region.chapters[].navLabel` を追加し `RegionLayout.astro` で使用 | 単体テストで `navLabel` 必須・`label` 形式を検証 |
| 訪問メモのグリッド3件固定 | `global.css` を `repeat(auto-fit,minmax(240px,1fr))` に変更。番号は `padStart` | 単体テストで1–9件を検証 |
| `number` の一意性 | 単体テストで2桁・一意を検証 | `npm test` |
| 情報確認日 | `Region.informationCheckedOn` を追加し、`source-notes` に `Information checked on <time>` を表示。内部記録は `docs/editorial/neba.md` | 単体テストで形式と未来日を検証。ビルドテストで表示を検証 |
| トップの `OUR FIRST DESTINATION / 01` | 地域数から生成（2件以上は `DESTINATIONS / NN`） | `sample` ビルドで `DESTINATIONS / 02` を検証 |
| クレジットの「全写真が根羽村」断定 | `photos.json` の `location` から生成 | — |
| 公開モード切替 | `site` を仮URLで設定。`.env.public` + `npm run build:public` で robots meta / canonical / OG / `robots.txt` / `sitemap.xml` を出し分け。既定ビルドは非公開のまま。`public/robots.txt` をエンドポイントへ置換。既定OG画像 `public/og-default.png`（文字・ロゴのみ、システムフォント描画） | `tests/build/output.test.mjs` で3モードのビルド出力を検証（3件成功） |
| 2地域目の入稿検証 | `tests/fixtures/sample-region.ts` + `src/data/catalog.ts`。`--mode sample` のみ連結 | ビルドテストで既定・`public` 出力に含まれないことを検証 |
| ドキュメント | README にモード・検証・地域追加手順を追記 | — |

### 同時編集について

実装中に Codex が同じ作業ツリーで `regions.ts`、`RegionLayout.astro`、`global.css`、`tests/content.test.mjs`、`tests/browser/site.spec.ts` を編集していた（村ガイド・特産品・アクセス節の追加）。Claude Code の変更は保持されているが、以下は Codex 側の作業中であり未解決。

- `RegionLayout.astro` の新節に `NEBA GUIDE`、`GETTING TO NEBA`、`Neba has valleys...`、観光協会アクセスURL直書きなど地域固有文言が戻っている（第1節の指摘と同種）。
- E2E 14件中11件が失敗（Playwright、2026-10-11 23:4x）。確認できた原因は新しいガイド節の文字コントラスト不足（`#95999a` on `#e8e9e9`、2.36:1）。Codex が `global.css` を編集中のため、Claude Code 側では修正していない。
- Playwright 設定は単一サーバー構成に戻した。`sample` モードのブラウザ確認は `npm run dev -- --mode sample` で手動、出力検証は `npm run test:build` で自動。

Codex の作業完了後に `npm run lint && npm run check && npm test && npm run test:build && npm run build && npm run test:e2e` を再実行し、Claude Code の最終レビューを行う。
