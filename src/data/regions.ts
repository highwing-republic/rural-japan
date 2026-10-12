export interface GuideItem {
  name: string;
  japaneseName: string;
  type: string;
  description: string;
  address?: string;
  /** International format, e.g. '+81 265-49-2580'. */
  phone?: string;
  /** Opening hours as published by the source. */
  hours?: string;
  /** Regular closing days as published by the source. */
  closed?: string;
  /** Operating season as published by the source. */
  season?: string;
  /** Toilets and parking information published by the tourism association. */
  amenities?: string;
  url: string;
}

export interface Specialty {
  name: string;
  japaneseName: string;
  description: string;
  whereToFind?: string;
}

export interface Region {
  slug: string;
  name: string;
  japaneseName: string;
  prefecture: string;
  number: string;
  title: string;
  introduction: string;
  hero: string;
  cardImage: string;
  cardCaption: string;
  cardHeading: string;
  cardDescription: string;
  themes: string[];
  welcome: string;
  visitorUrl: string;
  visitorLabel: string;
  /** Date (YYYY-MM-DD) the editorial facts were last checked against primary sources. Shown to readers. */
  informationCheckedOn: string;
  chapters: { id: string; label: string; navLabel: string; title: string; body: string; image: string; caption: string }[];
  guideSections: {
    id: string;
    label: string;
    title: string;
    introduction: string;
    items: GuideItem[];
  }[];
  specialties: Specialty[];
  accessRoutes: { origin: string; duration: string; route: string }[];
  accessNote: string;
  /** Exactly three notes are expected by the current layout; the unit test enforces 1–9. */
  travelNotes: { title: string; body: string }[];
  sources: { label: string; url: string }[];
}

export const regions: Region[] = [
  {
    slug: 'neba',
    name: 'Neba',
    japaneseName: '根羽村',
    prefecture: 'Nagano',
    number: '01',
    title: 'A little closer\nto nature.',
    introduction: 'At the southwestern edge of Nagano, Neba is a village shaped by forests and water. Come for an extraordinary cedar tree. Stay a little longer for the quieter landscape around it.',
    hero: 'landscape',
    cardImage: 'landscape',
    cardCaption: 'An everyday landscape in Neba',
    cardHeading: 'Where the forest\nmeets the everyday.',
    cardDescription: 'A great cedar. Quiet rivers. Hills wrapped in green. Meet a small village at the edge of Nagano, where nature is part of daily life.',
    themes: ['Forests', 'Rivers', 'Village life'],
    welcome: 'ようこそ、根羽村へ。',
    visitorUrl: 'https://neba-nagano.com/',
    visitorLabel: 'Neba visitor information (Japanese)',
    informationCheckedOn: '2026-10-12',
    chapters: [
      {
        id: 'great-cedar', label: '01 / THE GREAT CEDAR', navLabel: 'THE GREAT CEDAR',
        title: 'Some things ask you\nto slow down.',
        body: 'The great cedar of Tsukize is a symbol of Neba. The village describes it as around 1,800 years old — a living presence that puts the pace of a day into perspective. Visit the park, look up through the branches, and give this place a little time.',
        image: 'cedar', caption: 'Tsukize no Osugi · The great cedar of Neba',
      },
      {
        id: 'riverside', label: '02 / FOLLOW THE WATER', navLabel: 'FOLLOW THE WATER',
        title: 'Let the river\nset the rhythm.',
        body: 'Rivers thread their way between Neba’s wooded slopes and small settlements. Around the great cedar, the village’s park and suspension bridge offer another way to take in the scenery. Leave room in your visit for the view along the water.',
        image: 'river', caption: 'A riverside view in Neba, Nagano',
      },
      {
        id: 'village-life', label: '03 / THE EVERYDAY LANDSCAPE', navLabel: 'THE EVERYDAY LANDSCAPE',
        title: 'The beauty\nin between.',
        body: 'Beyond a single landmark, there is a landscape of fields, homes and forested hills. Take the public roads at an unhurried pace. These are working places and people’s homes: admire the fields from outside, keep entrances clear, and ask before photographing residents.',
        image: 'fields', caption: 'Fields and forested hills in Neba',
      },
    ],
    guideSections: [
      {
        id: 'see', label: '04 / LANDSCAPES & HISTORY', title: 'What to see',
        introduction: 'Neba’s landmarks move between deep geological time, mountain water and stories from the Sengoku period. Many are small, open-air places rather than staffed attractions, so arrive prepared and follow local signs.',
        items: [
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
        ],
      },
      {
        id: 'do', label: '05 / TIME OUTDOORS', title: 'Things to do',
        introduction: 'The village tourism association highlights river fishing, waterside play, golf and forest experiences. Conditions are seasonal; contact each operator before making the drive.',
        items: [
          { name: 'Neba River fishing', japaneseName: '根羽川漁業協同組合', type: 'Fishing', description: 'Local information and permits for fishing in the Neba River and surrounding streams. Day and season permits are sold; the ayu season opens in June.', address: '2131-1 Neba, Shimoina, Nagano', phone: '+81 265-49-2260', url: 'https://neba-nagano.com/?page_id=763' },
          { name: 'Chausuyama Frog Museum', japaneseName: '茶臼山高原かえる館', type: 'Nature museum', description: 'A small seasonal museum connected with the locally discovered Nebatago frog and the surrounding forest.', address: '3370-1 Neba, Shimoina, Nagano', phone: '+81 265-49-2580', hours: '10:00–15:00 (Sat & Sun until 16:00)', closed: 'Mon, Wed & Thu (open daily in August)', season: 'Late April to early November', url: 'https://neba-nagano.com/?page_id=763' },
          { name: 'Green House Morisawa', japaneseName: 'グリーンハウス森沢', type: 'Outdoor stay', description: 'A base for spending time outdoors and staying close to the village landscape.', address: '208-1 Neba, Shimoina, Nagano', url: 'https://neba-nagano.com/?page_id=763' },
          { name: 'Neba Country Club', japaneseName: '根羽カントリークラブ', type: 'Golf', description: 'A mountain golf course in Neba’s wooded highlands.', address: '382-93 Neba, Shimoina, Nagano', phone: '+81 265-49-2311', url: 'https://neba-nagano.com/?page_id=763' },
          { name: 'Neverland', japaneseName: 'ネバーランド', type: 'Roadside stop', description: 'A visitor stop on Route 153 with food, local products and visitor services.', address: '4918-1 Neba, Shimoina, Nagano', phone: '+81 265-49-2880', url: 'https://neba-nagano.com/?page_id=763' },
        ],
      },
      {
        id: 'eat', label: '06 / A TABLE IN NEBA', title: 'Where to eat',
        introduction: 'Soba, gohei-mochi rice cakes, river fish and straightforward local cooking make good companions to a day on Route 153. Small businesses may change their hours, so check before visiting.',
        items: [
          { name: 'Café DECO', japaneseName: '喫茶DECO', type: 'Café', description: 'A village café listed by the Neba Tourism Association.', address: '3015-16 Neba, Shimoina, Nagano', phone: '+81 265-49-2228', url: 'https://neba-nagano.com/?page_id=772' },
          { name: 'Carrot', japaneseName: 'きゃろっと', type: 'Restaurant', description: 'A casual local stop with handmade items.', address: '1613-1 Neba, Shimoina, Nagano', phone: '+81 265-49-2280', url: 'https://neba-nagano.com/?page_id=772' },
          { name: 'Tako House', japaneseName: 'タコはうす', type: 'Casual dining', description: 'An informal village eatery.', address: '1597-1 Neba, Shimoina, Nagano', phone: '+81 265-49-2946', url: 'https://neba-nagano.com/?page_id=772' },
          { name: 'Fukuya', japaneseName: '富久屋', type: 'Local cuisine', description: 'Gohei-mochi, horse sashimi and river-fish dishes are among the house recommendations.', address: '5429 Neba, Shimoina, Nagano', phone: '+81 265-49-2980', hours: '11:00–20:00', url: 'https://neba-nagano.com/?page_id=772' },
          { name: 'Fukushima Noodle Restaurant', japaneseName: '福嶋麺類食堂', type: 'Noodles', description: 'A local noodle restaurant serving lunch and dinner.', address: '1810 Neba, Shimoina, Nagano', phone: '+81 265-49-2617', hours: '11:00–14:00 / 17:00–20:00', closed: 'Thu', url: 'https://neba-nagano.com/?page_id=772' },
          { name: 'Sumiokaya', japaneseName: '山のお店 住岡屋商店', type: 'Shop & takeaway', description: 'A mountain shop carrying prepared foods, local produce, river fish and regional drinks.', address: '1625-1 Neba, Shimoina, Nagano', phone: '+81 265-49-2307', closed: 'Mon', url: 'https://neba-nagano.com/?page_id=772' },
          { name: 'Neverland', japaneseName: 'ネバーランド', type: 'Restaurant & visitor stop', description: 'A convenient Route 153 stop for a meal and local products.', address: '4918-1 Neba, Shimoina, Nagano', phone: '+81 265-49-2880', url: 'https://neba-nagano.com/?page_id=772' },
        ],
      },
      {
        id: 'stay', label: '07 / STAY THE NIGHT', title: 'Where to stay',
        introduction: 'Options range from an old village house to outdoor accommodation and a larger roadside facility. Book directly and confirm meals, transport and check-in arrangements.',
        items: [
          { name: 'Matsuya Residence', japaneseName: 'まつや邸', type: 'Traditional house', description: 'A stay in a renovated old house in the village.', address: '1992 Neba, Shimoina, Nagano', url: 'https://neba-nagano.com/?page_id=540' },
          { name: 'Green House Morisawa', japaneseName: 'グリーンハウス森沢', type: 'Outdoor accommodation', description: 'Accommodation surrounded by Neba’s mountain landscape.', address: '208-1 Neba, Shimoina, Nagano', url: 'https://neba-nagano.com/?page_id=540' },
          { name: 'Neverland', japaneseName: 'ネバーランド', type: 'Visitor facility', description: 'A Route 153 facility listed by the tourism association for food, services and stays.', address: '4918-1 Neba, Shimoina, Nagano', phone: '+81 265-49-2880', url: 'https://neba-nagano.com/?page_id=540' },
        ],
      },
      {
        id: 'shop', label: '08 / TAKE SOMETHING HOME', title: 'Where to shop',
        introduction: 'Look for fresh vegetables, prepared foods, dairy products, river fish and goods made from the village’s forests. Availability follows the seasons.',
        items: [
          { name: 'A-Coop Neba', japaneseName: 'Aコープ根羽店', type: 'Grocery', description: 'Everyday groceries and a useful place to look for locally available food.', address: '1955 Neba, Shimoina, Nagano', phone: '+81 265-49-2663', url: 'https://neba-nagano.com/?page_id=759' },
          { name: 'Sumiokaya', japaneseName: '山のお店 住岡屋商店', type: 'Local shop', description: 'Local vegetables, fruit, prepared foods, river fish and selected drinks.', address: '1625-1 Neba, Shimoina, Nagano', phone: '+81 265-49-2307', closed: 'Mon', url: 'https://neba-nagano.com/?page_id=759' },
          { name: 'Neba Forest Union', japaneseName: '根羽村森林組合', type: 'Wood & forestry', description: 'The village forestry cooperative and a window into Neba’s timber culture.', address: '407-10 Neba, Shimoina, Nagano', phone: '+81 265-49-2120', hours: '8:00–17:00, Mon–Fri', url: 'https://neba-nagano.com/?page_id=759' },
          { name: 'Neverland', japaneseName: 'ネバーランド', type: 'Local products', description: 'A roadside place to browse local food and village products.', address: '4918-1 Neba, Shimoina, Nagano', phone: '+81 265-49-2880', url: 'https://neba-nagano.com/?page_id=759' },
        ],
      },
      {
        id: 'events', label: '09 / THE VILLAGE CALENDAR', title: 'Seasonal events',
        introduction: 'Fishing, summer gatherings and local performance traditions mark the year. Dates and formats change, so use these as starting points and confirm the current programme with the tourism association.',
        items: [
          { name: 'Mountain-stream fishing season', japaneseName: '渓流釣り', type: 'Seasonal outdoors', description: 'A seasonal reason to explore the headwaters and clear streams around Neba.', url: 'https://neba-nagano.com/?cat=12' },
          { name: 'Tsukize Mawari-daiko', japaneseName: '月瀬の廻り太鼓', type: 'Traditional performance', description: 'A local drum tradition associated with Tsukize.', url: 'https://neba-nagano.com/?cat=13' },
          { name: 'Bon dance gathering', japaneseName: '盆踊り大会', type: 'Summer festival', description: 'A village summer gathering centred on communal Bon dancing.', url: 'https://neba-nagano.com/?cat=14' },
          { name: 'Yamaai Festival', japaneseName: 'やまあいフェスティバル', type: 'Village festival', description: 'A community festival celebrating life in the mountains.', url: 'https://neba-nagano.com/?cat=15' },
        ],
      },
    ],
    specialties: [
      { name: 'Gohei-mochi', japaneseName: '五平餅', description: 'Grilled rice cakes brushed with a rich regional sauce.', whereToFind: 'Fukuya, and from the village confectioner Sugikko by order or at events' },
      { name: 'Tomatoes', japaneseName: 'トマト', description: 'Mountain-grown tomatoes shaped by clear water and the difference between warm days and cool nights.', whereToFind: 'Grown by Kobayashi Farm; sold at Sumiokaya, A-Coop Neba and Neverland' },
      { name: 'Sweet corn', japaneseName: 'とうもろこし', description: 'A summer crop sold seasonally in and around the village.', whereToFind: 'Direct sales at the Nebane rice centre (947-1 Neba) from mid-July to mid-August' },
      { name: 'Karasumi', japaneseName: 'からすみ', description: 'Here, karasumi is a traditional steamed rice-flour sweet—not the cured roe known by the same name elsewhere.', whereToFind: 'Made by Sugikko, along with kusa-daifuku, mame-mochi and kashiwa-mochi; stocked at Sumiokaya' },
      { name: 'River fish', japaneseName: '川魚', description: 'Mountain-stream fish appear in local shops and restaurant dishes when available.', whereToFind: 'Sumiokaya, Fukuya and local restaurants when available' },
    ],
    accessRoutes: [
      { origin: 'Ena IC', duration: 'About 1 hour', route: 'Chuo Expressway side' },
      { origin: 'Nagoya IC', duration: 'About 1 hr 30 min', route: 'Tomei Expressway side' },
      { origin: 'Toyokawa IC', duration: 'About 2 hours', route: 'Tomei Expressway side' },
      { origin: 'Western Tokyo', duration: 'About 4 hours', route: 'From Takaido / Chofu via the Chuo Expressway' },
    ],
    accessNote: 'The tourism association publishes approximate driving times. Route 153 is the main approach through the area. Check current road, weather and transport conditions before departure, especially in winter.',
    travelNotes: [
      { title: 'Find your bearings', body: 'Neba sits in southwestern Nagano, close to Aichi and Gifu. Use the village tourism association’s access information to plan your route.' },
      { title: 'Before you set off', body: 'Confirm transport, opening hours and local conditions directly with the places you plan to visit. This first field guide is an introduction, not a confirmed itinerary.' },
      { title: 'Be a thoughtful guest', body: 'Stay on public paths, respect private land, and take your litter with you. Enjoy rivers from established viewing areas and follow local notices.' },
    ],
    sources: [
      { label: 'Neba village · Nature & history (Japanese)', url: 'https://www.nebamura.jp/nebainfo/nature-history/' },
      { label: 'Neba village · Tsukize park & bridge (Japanese)', url: 'https://www.nebamura.jp/nebatopics/news/1139/' },
      { label: 'Neba Tourism Association · Visitor information (Japanese)', url: 'https://neba-nagano.com/' },
      { label: 'Neba Tourism Association · Sights and events (Japanese)', url: 'https://neba-nagano.com/?page_id=119' },
      { label: 'Neba Tourism Association · Activities (Japanese)', url: 'https://neba-nagano.com/?page_id=763' },
      { label: 'Neba Tourism Association · Food (Japanese)', url: 'https://neba-nagano.com/?page_id=772' },
      { label: 'Neba Tourism Association · Accommodation (Japanese)', url: 'https://neba-nagano.com/?page_id=540' },
      { label: 'Neba Tourism Association · Shopping (Japanese)', url: 'https://neba-nagano.com/?page_id=759' },
      { label: 'Neba Tourism Association · Local products (Japanese)', url: 'https://neba-nagano.com/?page_id=1535' },
      { label: 'Neba Tourism Association · Access (Japanese)', url: 'https://neba-nagano.com/?page_id=897' },
    ],
  },
];
