# RURAL JAPAN — Phase 1

UGATTAによる訪日外国人向け地方観光メディアのデザイントライアル。英語トップ、長野県根羽村の紹介、About、画像クレジットを実装しています。

**ローカル確認用です。DNS、GitHub Pages、ホスティング、UGATTA公式サイトは変更していません。** 将来のURLは `https://rural.ugatta-llc.com/`。現時点では公開設定・canonical・サイトマップを追加していません。

## 起動

Node.js 24 LTS（この環境では24.14.1）、npm、Gitを使用します。

```sh
npm ci
npm run dev
```

- トップ: http://127.0.0.1:4321/
- 根羽村: http://127.0.0.1:4321/places/neba/
- About: http://127.0.0.1:4321/about/
- 画像ライセンス: http://127.0.0.1:4321/credits/

PowerShellでスクリプト実行ポリシーにより `npm` が起動できない場合は、`npm.cmd ci` / `npm.cmd run dev` を使用してください。終了はターミナルで Ctrl+C。4321番ポートが使用中の場合は、Astroの表示する実際のURLを参照します。

### スマートフォンで確認

PCブラウザの開発者ツールでレスポンシブ表示に切り替えるか、同じ信頼できるLAN上のスマートフォンから確認できます。

```sh
npm run dev:lan
```

ターミナルの Network URL（`http://<PCのLAN内IP>:4321/`）をスマートフォンで開きます。Windows Firewallの許可が必要な場合はプライベートネットワークに限定してください。通常の `dev` はループバックのみで待ち受けます。外部トンネルやルーターのポート転送は不要です。

## デザインと技術構成

- 墨色 `#2c2d2e`、淡いグレー `#f2f2f2`、余白を中心としたエディトリアルデザイン。背景・文字・罫線を無彩色に揃え、写真には彩度変更やモノクロ化のフィルターを使用しません。
- Cormorant Garamondのセリフ体見出しとDM Sansの本文。フォントはnpmパッケージからローカル配信し、外部フォントサービスへのリクエストを発生させません。
- 実写の大きなヒーロー写真、左右非対称の地域紹介、写真と文章を交互に配置した地域ページ。
- Astro 7 + TypeScript + CSS。静的HTMLを生成し、React等のクライアントランタイム、DB、CMSは使用しません。
- JavaScriptはモバイルメニューの閉じる操作のみ。JavaScriptなしでもリンク、ページ本文、`details`メニューを利用可能です。
- レスポンシブなWebP（800px / 1920px）、サイズ属性、ヒーロー優先読込、下部画像の遅延読込。
- 見出し構造、スキップリンク、フォーカス表示、画像alt、reduced-motion対応。
- `noindex, nofollow` と `robots.txt: Disallow: /` を設定。これらはアクセス制限ではなく、今回の非公開状態はローカル起動で維持しています。

```text
src/
  components/Photo.astro      # 画像表示・共通クレジット
  data/photos.json           # 写真・著作者・出典・ライセンス台帳
  data/regions.ts             # 地域データと型
  layouts/BaseLayout.astro    # 共通ヘッダー・フッター
  layouts/RegionLayout.astro  # 地域共通テンプレート
  pages/places/[slug].astro   # 地域データから静的ページを生成
  pages/index.astro           # トップ
  pages/about.astro           # About
  pages/credits.astro         # 台帳からライセンス一覧を生成
  styles/global.css          # デザイントークンとレスポンシブスタイル
public/images/               # 配信するWebP画像
docs/                        # ライセンス証跡・公開前の確認事項
tests/                       # データ検証・ブラウザ検証
```

### 地域を追加する

1. 商用利用条件を確認した写真を追加し、`photos.json`に出典・ライセンス・alt・撮影時期を登録。
2. `regions.ts`の`regions`に、一意なslugと2桁の`number`、地域名、写真ID、紹介文、章（`label`は`NN / TITLE`形式、章ナビ用の`navLabel`を併記）、訪問メモ、一次情報源、読者向けの情報確認日`informationCheckedOn`（実際に一次情報へ照合した日。写真台帳の確認日やビルド日を流用しない）を追加。施設の`phone`・`hours`・`closed`・`season`・`amenities`と、特産品の`whereToFind`は確認できた情報だけを任意で登録します。
3. `RegionLayout.astro`を共用して `/places/<slug>/` が生成されます。トップにも地域データから導線を生成し、2地域以上では見出しラベルが `DESTINATIONS / NN` に変わります。
4. 内部の根拠・確認者・英語レビュー・承認の記録は `docs/editorial/<slug>.md` に残します（サイトには出力しません）。
5. 地域固有のコピーや写真の構図を確認し、下記の検証を実行。2地域目のレイアウト確認だけなら、データを追加せず `npm run dev -- --mode sample` で検証用地域を表示できます。

カードのコピー・写真・テーマ・観光協会リンクも地域データから反映します。トップのメインビジュアルと冒頭コピーは編集枠として別管理です。将来拡張を見込んだ最小構成で、CMSは未導入です。

### 写真の差し替え

`photos.json`の安定したIDを保って、画像ファイル、サイズ、alt、クレジット、出典、ライセンス情報を差し替えます。表示コンポーネントとクレジット一覧に共通反映されます。観光協会からの許諾文書、加工可否、掲載期限、指定クレジットは別途記録してください。

## 画像・フォントのライセンス

写真4点はすべて**根羽村の実写**。Asturio Cantabrio撮影、2022年6月、Wikimedia Commons、**CC BY-SA 4.0**です。商用利用可能ですが、出典・著作者・ライセンス・変更表示と、加工画像の同一ライセンス条件を守る必要があります。

- [画像ライセンス一覧](docs/IMAGE-LICENSES.md)
- [機械可読の画像台帳](src/data/photos.json)
- [確認時のCommons API証跡](docs/image-evidence.json)
- フォント: Cormorant Garamond / DM Sans、SIL Open Font License 1.1。パッケージのライセンス文を `public/licenses/` に同梱。

## ビルドモードと公開設定

`astro.config.mjs` の `site` は公開予定URL（仮）です。設定しているだけでは公開状態になりません。公開状態はビルドモードで切り替えます。

| モード | コマンド | 出力 |
| --- | --- | --- |
| 既定 | `npm run build` / `npm run dev` | `noindex, nofollow`、`robots.txt` は `Disallow: /`。canonical・OG・sitemap参照なし |
| `public` | `npm run build:public` / `npm run preview:public` | `index, follow`、`robots.txt` は `Allow: /` と `Sitemap:` 行、canonical、OG（既定画像 `public/og-default.png`）、`/sitemap.xml` |
| `sample` | `npm run build:sample` / `npm run dev -- --mode sample` | 既定と同じ非公開状態に、検証用地域 `/places/sample-village/` を追加 |

- モードごとの環境変数は `.env.public`（`PUBLIC_INDEXABLE=true`）と `.env.sample`（`PUBLIC_SAMPLE_REGION=true`）にあり、Git管理対象です。
- `robots.txt` と `sitemap.xml` は `src/pages/` のエンドポイントで生成します。`public/robots.txt` は廃止しました。
- 検証用地域は `tests/fixtures/sample-region.ts` にあり、`src/data/catalog.ts` が `sample` モードのときだけ地域一覧に連結します。既定・`public` のビルドに含まれないことを `npm run test:build` が検証します。
- 一般公開は、UGATTAの承認後に `public` モードの出力を配信して初めて完了します。配信先では `404.html` の404応答と、末尾スラッシュなしURLのリダイレクトを確認してください。

## 検証

```sh
npm run lint
npm run check
npm test
npm run test:build
npm run build
npm run test:e2e
```

- `lint`: ESLint（Astro / TypeScript / JavaScript）。
- `check`: AstroとTypeScriptの型検査。
- `test`: 画像台帳の必須属性・実ファイル・サイズ・ライセンス、地域slug/番号/章IDの重複、`navLabel`、情報確認日の形式、写真参照、検証用地域の整合を検証。
- `test:build`: 既定・`public`・`sample` の3モードを `.local/build-<mode>/` にビルドし、robots meta、`robots.txt`、canonical、OG、`sitemap.xml`、検証用地域の有無を検証。
- `test:e2e`: Playwright + axe。WindowsのMicrosoft Edgeを使用。1440px PC / 390pxモバイルエミュレーション、320px幅も確認。
- ブラウザ検証: 4ページの表示、画像読込、内部リンク、noindex、横はみ出し、主要導線、クレジットへの移動、メニュー、Escape、404、WCAG A/AAの自動検査。
- スクリーンショットは `.local/screenshots/` に保存（Git対象外）。スマートフォン実機、Safari、Firefoxでの検証は未実施。

依存関係の監査（2026-10-11）: `npm audit --omit=dev` は0件。開発用Astro ESLintパーサーの `fast-glob → micromatch → braces` にHigh 4件が残っています（同じDoS問題の依存連鎖）。`npm audit fix` では解消しません。現環境のNode 24.14.1互換のlint版を使用しており、修正済みの新系列を使うにはNode 24.16.0以上等への更新が必要です。これらは生成済みHTMLには含まれません。詳しくは引き継ぎ資料を参照してください。

Edgeがない環境では `npx playwright install chromium` の実行後、`playwright.config.ts`の `channel: 'msedge'` を削除してChromiumを使用できます。公開・CIの設定は含みません。

静的出力の手動確認:

```sh
npm run build
npm run preview
```

## 未実装・一般公開前

詳細は [Phase 1引き継ぎと公開前確認](docs/PHASE1-HANDOFF.md) を参照してください。

- DNS、公開環境、GitHub Pages、UGATTA公式サイトからの導線。
- 観光協会からの掲載許諾と写真差し替え、英語表現・現地情報の最終確認。
- 予約、アフィリエイト、検索、CMS、解析、問い合わせフォーム。
- SEO詳細、構造化データ、OG画像、canonical、サイトマップ。
- 実機と複数ブラウザでの確認、Claude Codeによる最終クロスレビュー。

アフィリエイトは将来の設計方針のみを引き継ぎ資料に記載しています。現時点で収益リンク、Cookie、トラッキング、外部スクリプトは追加していません。
