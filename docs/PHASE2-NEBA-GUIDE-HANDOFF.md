# RURAL JAPAN — 根羽村ガイド補完（Codex引き継ぎ）

作成: Claude Code、2026-10-12。対象: `C:\Users\highw\vs_highwing\rural_japan`（main、コミットなし）。
根羽村観光協会サイト（https://neba-nagano.com/）を全ページ照合し、英語版に無い情報を洗い出した。この資料だけで実装に入れるよう、追加データは英文込みで記載する。

## 決定事項（Claude Codeの既定。変更があれば差し替え）

| 論点 | 決定 | 理由 |
| --- | --- | --- |
| 最新情報（WordPress投稿）の収録 | 収録しない | 静的サイト・CMS無しの方針。季節情報は「Seasonal events」節の文言で足りる |
| 電話・営業時間・定休日 | 掲載する | 原サイトに公開済みの事実情報。海外読者には国際形式の電話番号が有用 |
| 観光地の未収録4件 | 追加し、13件すべてを個別記事URLに紐付ける | 原サイトと同じ網羅性にする |
| 「その他」（商工会・郵便局・JA等） | 割愛 | 観光情報でない |
| フォトコンテスト・観光協会について・お問い合わせ・会員向け | 割愛 | 日本語応募前提、または対象外 |
| 原サイトの写真・文章 | 転載しない | 著作権は観光協会。現行のCC BY-SA写真4点を継続 |

## Goal

`/places/neba/` と下層8ページの施設情報を、観光協会サイトの全掲載内容（観光地13件、遊ぶ5件、食事7件、宿泊3件、買い物4件、特産品、アクセス）と同等にする。連絡先と設備情報を型に追加し、各項目のリンクを個別記事へ向ける。

## Relevant Files

- `src/data/regions.ts` — `Region` 型と根羽村データ（主な変更先）
- `src/layouts/RegionLayout.astro` — 地域ページのガイドカード（26行目）
- `src/layouts/GuidePageLayout.astro` — 下層ページのガイドカード（29行目）、特産品（34行目）
- `src/styles/global.css` — `.guide-card` 周辺（156–164行）と `.specialty-list`
- `tests/content.test.mjs` — `checkRegion` の項目検証（47–54行）
- `tests/fixtures/sample-region.ts` — 型変更に追従
- `docs/editorial/neba.md` — 根拠表に出典と確認日を追記
- `README.md` — 「地域を追加する」に新フィールドの説明を1行追加

## Changes

### 1. 型の拡張（`regions.ts`）

`guideSections[].items[]` に任意フィールドを追加する。すべて省略可。

```ts
items: {
  name: string; japaneseName: string; type: string; description: string;
  address?: string;
  /** International format, e.g. '+81 265-49-2580'. */
  phone?: string;
  /** Opening hours as published, e.g. '10:00–15:00 (Sat & Sun until 16:00)'. */
  hours?: string;
  /** Regular closing days, e.g. 'Mon, Wed & Thu (open daily in August)'. */
  closed?: string;
  /** Operating season, e.g. 'Late April to early November'. */
  season?: string;
  /** Toilets / parking as published by the tourism association. */
  amenities?: string;
  url: string;
}[];
```

`specialties[]` に `whereToFind?: string` を追加する。

### 2. 観光地（`see` セクション）を13件に再構成

既存7件のうち「Shingen memorial sites」を3件に、「Lake Chausu & the highlands」を2件に分割し、4件を追加する。URLは一覧ページ `?page_id=119` から個別記事へ変更する。掲載順は原サイトに合わせる。

```ts
{ name: 'Kameko Rock at Ikenotaira', japaneseName: '池の平 亀甲岩', type: 'Natural monument', description: 'A rock formation at Ikenotaira whose surface is patterned like a tortoise shell.', amenities: 'No toilets or parking', url: 'https://neba-nagano.com/?p=1298' },
{ name: 'Odona Valley', japaneseName: '小戸名渓谷', type: 'Valley', description: 'A wooded valley at Guminono where rock, river and seasonal foliage shape the view.', amenities: 'Parking available; no toilets', url: 'https://neba-nagano.com/?p=1308' },
{ name: 'Kamagairi Potholes', japaneseName: '釜ヶ入の甌穴', type: 'River geology', description: 'Rounded cavities at Hinohara, formed over time by stones turning in the current.', amenities: 'No toilets or parking', url: 'https://neba-nagano.com/?p=1310' },
{ name: 'Shingen-zuka', japaneseName: '信玄塚', type: 'Historic site', description: 'A memorial mound at Nakano associated with the final journey of the Sengoku-period warlord Takeda Shingen.', amenities: 'Parking across the road; no toilets', url: 'https://neba-nagano.com/?p=1313' },
{ name: 'Shingen Cavalry Ceramic Mural', japaneseName: '信玄騎馬隊 陶壁画', type: 'Public art', description: 'A ceramic mural of Shingen’s mounted warriors on the highway retaining wall at the entrance to Shingen-zuka. The tourism association describes it as 6 m high and 40 m wide, made from around 100,000 coloured tiles.', amenities: 'Parking across the road; no toilets', url: 'https://neba-nagano.com/?p=1315' },
{ name: 'Takeda Shingen Hōkyōintō', japaneseName: '武田信玄 宝篋印塔', type: 'Historic site', description: 'A stone memorial pagoda within the Shingen-zuka grounds.', amenities: 'Parking across the road; no toilets', url: 'https://neba-nagano.com/?p=1321' },
{ name: 'Tsukize Great Cedar', japaneseName: '月瀬の大杉', type: 'Ancient tree', description: 'The village’s best-known landmark: a cedar said locally to be about 1,800 years old, standing beside Ōsugi Park.', amenities: 'Toilets and parking at Ōsugi Park', url: 'https://neba-nagano.com/?p=1324' },
{ name: 'Tsuta Falls', japaneseName: 'つたの滝', type: 'Waterfall', description: 'A waterfall at Totte, tucked into Neba’s forested landscape.', amenities: 'No toilets or parking', url: 'https://neba-nagano.com/?p=1325' },
{ name: 'Tebukuro-yama', japaneseName: 'てぶくろやま', type: 'Viewpoint', description: 'A small hill at Ogawa listed among the village’s recommended natural spots.', amenities: 'Parking at the turning circle; no toilets', url: 'https://neba-nagano.com/?p=1327' },
{ name: 'Lake Chausu', japaneseName: '茶臼湖', type: 'Lake', description: 'A highland lake on the mountain edge of the village.', amenities: 'No toilets or parking', url: 'https://neba-nagano.com/?p=1328' },
{ name: 'Chausuyama Highland Lookout', japaneseName: '茶臼山高原 展望台', type: 'Lookout', description: 'A viewpoint over the Chausuyama highlands on the border with Aichi.', amenities: 'Parking available; no toilets', url: 'https://neba-nagano.com/?p=1334' },
{ name: 'Chausuyama Power Spot', japaneseName: '茶臼山 パワースポット', type: 'Local attraction', description: 'A spot promoted by the Frog Museum at Chausuyama; the museum tells the story in its own way.', address: '3370-1 Neba, Shimoina, Nagano (at the Frog Museum)', amenities: 'Toilets and parking', url: 'https://neba-nagano.com/?p=1335' },
{ name: 'Upper Yahagi River', japaneseName: '矢作川上流', type: 'River', description: 'The headwaters of the Yahagi River, which rises in Neba before flowing to Aichi.', amenities: 'No toilets or parking', url: 'https://neba-nagano.com/?p=1337' },
```

注: 原サイトの個別記事は所在地と設備の有無のみで説明文が無い。上記 `description` は新規の英文。「約1,800年」「6m×40m・10万枚」は観光協会の記載。

### 3. 遊ぶ・食事・宿泊・買い物に連絡先と営業情報を追加

既存の `name` / `description` / `url` はそのまま。以下のフィールドを足す。電話は `+81 265-49-XXXX` 形式。

| セクション | 項目 | phone | hours | closed | season |
| --- | --- | --- | --- | --- | --- |
| do | Chausuyama Frog Museum | +81 265-49-2580 | 10:00–15:00 (Sat & Sun until 16:00) | Mon, Wed & Thu (open daily in August) | Late April to early November |
| do | Neba River fishing | +81 265-49-2260 | — | — | — |
| do | Neba Country Club | +81 265-49-2311 | — | — | — |
| do / eat / stay / shop | Neverland | +81 265-49-2880 | — | — | — |
| eat | Café DECO | +81 265-49-2228 | — | — | — |
| eat | Carrot | +81 265-49-2280 | — | — | — |
| eat | Tako House | +81 265-49-2946 | — | — | — |
| eat | Fukuya | +81 265-49-2980 | 11:00–20:00 | — | — |
| eat | Fukushima Noodle Restaurant | +81 265-49-2617 | 11:00–14:00 / 17:00–20:00 | Thu | — |
| eat / shop | Sumiokaya | +81 265-49-2307 | — | Mon | — |
| shop | A-Coop Neba | +81 265-49-2663 | — | — | — |
| shop | Neba Forest Union | +81 265-49-2120 | 8:00–17:00, Mon–Fri | — | — |

Green House Morisawa と Matsuya Residence は原サイトに電話の記載なし。追加しない。

Neba River fishing の `description` は次に差し替える。「Local information and permits for fishing in the Neba River and surrounding streams. Day and season permits are sold; the ayu season opens in June.」（料金3,000円／12,000円は2026年6月の投稿に基づく年度情報なので本文に載せない。）

### 4. 特産品に生産者・入手先を追記（`whereToFind`）

| 品目 | whereToFind |
| --- | --- |
| Gohei-mochi | Fukuya, and from the village confectioner Sugikko by order or at events |
| Tomatoes | Grown by Kobayashi Farm; sold at Sumiokaya, A-Coop Neba and Neverland |
| Sweet corn | Direct sales at the Nebane rice centre (947-1 Neba) from mid-July to mid-August |
| Karasumi | Made by Sugikko, along with kusa-daifuku, mame-mochi and kashiwa-mochi; stocked at Sumiokaya |
| River fish | Sumiokaya, Fukuya and local restaurants when available |

### 5. イベントのURLを個別カテゴリへ変更

| 項目 | url |
| --- | --- |
| Mountain-stream fishing season | https://neba-nagano.com/?cat=12 |
| Tsukize Mawari-daiko | https://neba-nagano.com/?cat=13 （2026-10-12時点で投稿0件。リンクは維持し、説明文を変えない） |
| Bon dance gathering | https://neba-nagano.com/?cat=14 |
| Yamaai Festival | https://neba-nagano.com/?cat=15 |
| Neba Village Photo Contest | https://neba-nagano.com/?page_id=2166 |

### 6. 表示（`RegionLayout.astro` / `GuidePageLayout.astro`）

ガイドカードの `address` の下に、存在するフィールドだけを `<dl class="guide-facts">` で出す。順序: Season → Hours → Closed → Phone → Facilities。電話は `<a href="tel:+81265492580">` にする。両レイアウトで同じマークアップになるよう、`src/components/GuideCard.astro` に切り出してよい（任意）。特産品は `whereToFind` を説明の下に小さく出す。

CSS: `.guide-facts` は `.guide-card address` と同じ10px・`--muted`。文字コントラストはPhase 2で指摘のあった `#95999a` on `#e8e9e9`（2.36:1）を繰り返さないこと。axeの `color-contrast` をE2Eで確認する。

### 7. テスト（`tests/content.test.mjs`）

- `phone` があれば `/^\+81 \d{2,4}-\d{2,4}-\d{4}$/` に一致。
- `url` はセクション内で一意でなくてよいが、`see` セクションは全件 `?p=` 形式で一意であること。
- 根羽村の `see` が13件、`do` 5件、`eat` 7件、`stay` 3件、`shop` 4件であること（観光協会サイトとの件数一致を固定）。
- `sample-region.ts` は新フィールド無しで通ること（省略可の確認）。

### 8. 編集台帳（`docs/editorial/neba.md`）

根拠表に以下を追加: 観光地13件（各 `?p=` URL、2026-10-12、Claude Code、照合済み）、連絡先・営業情報（`?page_id=763/772/540/759`、2026-10-12）、特産品の生産者（`?page_id=1535`、2026-10-12）、陶壁画の寸法（`?p=1315`）。`informationCheckedOn` は実装時に `2026-10-12` へ更新する。

## Constraints

- 写真ID・章ID・セクションID（`see`/`do`/`eat`/`stay`/`shop`/`events`）と下層slug（`sights`等）は変更しない。E2Eとクレジットが依存する。
- 原サイトの写真・本文は転載しない。`description` は新規英文のみ。
- 営業時間・料金・解禁日は「掲載時点の情報」であり、本文で約束しない。既存の免責文（`source-notes`、`guide-page-note`）を残す。
- Astro静的サイト・依存追加なし・CMS無しを維持。
- `src/data/catalog.ts` と `sample` モードの仕組みを壊さない。

## Tests

```sh
npm run lint && npm run check && npm test && npm run test:build && npm run build && npm run test:e2e
```

既知の問題: `npm run test:e2e` で `/places/neba/` のモバイルだけ `browserContext.close: ENOENT ... .trace` で失敗することがある（2026-10-12に再現）。`--trace off` では成功し、内容の不具合ではない。Codexの並行テスト実行で `test-results/` が競合している可能性が高い。並行実行を避けて再実行し、それでも再現する場合は `playwright.config.ts` の `trace` を `'off'` にするか `outputDir` を分離する。

## Acceptance Criteria

1. `/places/neba/sights/` に13件が原サイトと同じ順で並び、各「Official listing」が個別記事へ到達する。
2. 遊ぶ・食事・買い物の各カードに電話（`tel:` リンク）、営業時間、定休日、営業期間が原サイトどおり表示される。記載のない項目は行自体が出ない。
3. 特産品に入手先が表示される。
4. 上記コマンドがすべて成功し、axeの指摘0件。
5. `docs/editorial/neba.md` に追加項目の出典・確認日が記録され、`informationCheckedOn` が更新されている。
6. `dist/` に `preview`、`Phase 1`、原サイトの画像URLが含まれない。
