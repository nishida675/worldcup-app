export interface Country {
  id: string;
  name: string;
  englishName: string;
  flagEmoji: string;
  fifaRanking: number;
  primaryColor: string; // Theme color for selection effects (glowing)
  secondaryColor: string;
}

export interface Group {
  name: string; // e.g. "グループA"
  countries: Country[];
}

export const GROUPS: Group[] = [
  {
    name: "グループA",
    countries: [
      { id: "MX", name: "メキシコ", englishName: "MEXICO", flagEmoji: "🇲🇽", fifaRanking: 15, primaryColor: "#006847", secondaryColor: "#CE1126" },
      { id: "KR", name: "韓国", englishName: "SOUTH KOREA", flagEmoji: "🇰🇷", fifaRanking: 25, primaryColor: "#0A0B10", secondaryColor: "#CD1226" },
      { id: "CZ", name: "チェコ", englishName: "CZECH REPUBLIC", flagEmoji: "🇨🇿", fifaRanking: 41, primaryColor: "#11457E", secondaryColor: "#D7141A" },
      { id: "ZA", name: "南アフリカ", englishName: "SOUTH AFRICA", flagEmoji: "🇿🇦", fifaRanking: 60, primaryColor: "#007A4D", secondaryColor: "#FFB81C" },
    ],
  },
  {
    name: "グループB",
    countries: [
      { id: "CH", name: "スイス", englishName: "SWITZERLAND", flagEmoji: "🇨🇭", fifaRanking: 19, primaryColor: "#D52B1E", secondaryColor: "#FFFFFF" },
      { id: "CA", name: "カナダ", englishName: "CANADA", flagEmoji: "🇨🇦", fifaRanking: 30, primaryColor: "#FF0000", secondaryColor: "#FFFFFF" },
      { id: "BA", name: "ボスニア・ヘルツェゴビナ", englishName: "BOSNIA & HERZEGOVINA", flagEmoji: "🇧🇦", fifaRanking: 65, primaryColor: "#002F6C", secondaryColor: "#FECB00" },
      { id: "QA", name: "カタール", englishName: "QATAR", flagEmoji: "🇶🇦", fifaRanking: 55, primaryColor: "#8A1538", secondaryColor: "#FFFFFF" },
    ],
  },
  {
    name: "グループC",
    countries: [
      { id: "BR", name: "ブラジル", englishName: "BRAZIL", flagEmoji: "🇧🇷", fifaRanking: 6, primaryColor: "#009C3B", secondaryColor: "#FFDF00" },
      { id: "MA", name: "モロッコ", englishName: "MOROCCO", flagEmoji: "🇲🇦", fifaRanking: 8, primaryColor: "#C1272D", secondaryColor: "#006233" },
      { id: "SCO", name: "スコットランド", englishName: "SCOTLAND", flagEmoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", fifaRanking: 43, primaryColor: "#005EB8", secondaryColor: "#FFFFFF" },
      { id: "HT", name: "ハイチ", englishName: "HAITI", flagEmoji: "🇭🇹", fifaRanking: 83, primaryColor: "#00209F", secondaryColor: "#D21034" },
    ],
  },
  {
    name: "グループD",
    countries: [
      { id: "US", name: "アメリカ", englishName: "USA", flagEmoji: "🇺🇸", fifaRanking: 16, primaryColor: "#002868", secondaryColor: "#BF0A30" },
      { id: "TR", name: "トルコ", englishName: "TURKEY", flagEmoji: "🇹🇷", fifaRanking: 22, primaryColor: "#E30A17", secondaryColor: "#FFFFFF" },
      { id: "AU", name: "オーストラリア", englishName: "AUSTRALIA", flagEmoji: "🇦🇺", fifaRanking: 27, primaryColor: "#000031", secondaryColor: "#FF0000" },
      { id: "PY", name: "パラグアイ", englishName: "PARAGUAY", flagEmoji: "🇵🇾", fifaRanking: 40, primaryColor: "#D52B1E", secondaryColor: "#0038A8" },
    ],
  },
  {
    name: "グループE",
    countries: [
      { id: "EC", name: "エクアドル", englishName: "ECUADOR", flagEmoji: "🇪🇨", fifaRanking: 23, primaryColor: "#FFDD00", secondaryColor: "#001489" },
      { id: "DE", name: "ドイツ", englishName: "GERMANY", flagEmoji: "🇩🇪", fifaRanking: 10, primaryColor: "#000000", secondaryColor: "#DD0000" },
      { id: "CI", name: "コートジボワール", englishName: "IVORY COAST", flagEmoji: "🇨🇮", fifaRanking: 34, primaryColor: "#F77F00", secondaryColor: "#009E60" },
      { id: "CW", name: "キュラソー", englishName: "CURACAO", flagEmoji: "🇨🇼", fifaRanking: 82, primaryColor: "#002B7F", secondaryColor: "#F9E814" },
    ],
  },
  {
    name: "グループF",
    countries: [
      { id: "NL", name: "オランダ", englishName: "NETHERLANDS", flagEmoji: "🇳🇱", fifaRanking: 7, primaryColor: "#F36C21", secondaryColor: "#FFFFFF" },
      { id: "JP", name: "日本", englishName: "JAPAN", flagEmoji: "🇯🇵", fifaRanking: 18, primaryColor: "#BC002D", secondaryColor: "#FFFFFF" },
      { id: "SE", name: "スウェーデン", englishName: "SWEDEN", flagEmoji: "🇸🇪", fifaRanking: 38, primaryColor: "#006AA7", secondaryColor: "#FECC00" },
      { id: "TN", name: "チュニジア", englishName: "TUNISIA", flagEmoji: "🇹🇳", fifaRanking: 44, primaryColor: "#E70013", secondaryColor: "#FFFFFF" },
    ],
  },
  {
    name: "グループG",
    countries: [
      { id: "BE", name: "ベルギー", englishName: "BELGIUM", flagEmoji: "🇧🇪", fifaRanking: 9, primaryColor: "#FFE936", secondaryColor: "#EF3340" },
      { id: "IR", name: "イラン", englishName: "IRAN", flagEmoji: "🇮🇷", fifaRanking: 21, primaryColor: "#239E46", secondaryColor: "#DA251D" },
      { id: "EG", name: "エジプト", englishName: "EGYPT", flagEmoji: "🇪🇬", fifaRanking: 29, primaryColor: "#C1272D", secondaryColor: "#000000" },
      { id: "NZ", name: "ニュージーランド", englishName: "NEW ZEALAND", flagEmoji: "🇳🇿", fifaRanking: 85, primaryColor: "#000000", secondaryColor: "#FFFFFF" },
    ],
  },
  {
    name: "グループH",
    countries: [
      { id: "ES", name: "スペイン", englishName: "SPAIN", flagEmoji: "🇪🇸", fifaRanking: 2, primaryColor: "#C60B1E", secondaryColor: "#FFC400" },
      { id: "UY", name: "ウルグアイ", englishName: "URUGUAY", flagEmoji: "🇺🇾", fifaRanking: 17, primaryColor: "#0081C8", secondaryColor: "#FCD116" },
      { id: "SA", name: "サウジアラビア", englishName: "SAUDI ARABIA", flagEmoji: "🇸🇦", fifaRanking: 61, primaryColor: "#006C35", secondaryColor: "#FFFFFF" },
      { id: "CV", name: "カーボベルデ", englishName: "CAPE VERDE", flagEmoji: "🇨🇻", fifaRanking: 69, primaryColor: "#003893", secondaryColor: "#F70A24" },
    ],
  },
  {
    name: "グループI",
    countries: [
      { id: "FR", name: "フランス", englishName: "FRANCE", flagEmoji: "🇫🇷", fifaRanking: 1, primaryColor: "#002395", secondaryColor: "#ED2939" },
      { id: "SN", name: "セネガル", englishName: "SENEGAL", flagEmoji: "🇸🇳", fifaRanking: 14, primaryColor: "#118C4F", secondaryColor: "#FCD116" },
      { id: "NO", name: "ノルウェー", englishName: "NORWAY", flagEmoji: "🇳🇴", fifaRanking: 31, primaryColor: "#EF2B2D", secondaryColor: "#002868" },
      { id: "IQ", name: "イラク", englishName: "IRAQ", flagEmoji: "🇮🇶", fifaRanking: 57, primaryColor: "#007A3D", secondaryColor: "#DA291C" },
    ],
  },
  {
    name: "グループJ",
    countries: [
      { id: "AR", name: "アルゼンチン", englishName: "ARGENTINA", flagEmoji: "🇦🇷", fifaRanking: 3, primaryColor: "#75AADB", secondaryColor: "#FCBF49" },
      { id: "AT", name: "オーストリア", englishName: "AUSTRIA", flagEmoji: "🇦🇹", fifaRanking: 24, primaryColor: "#ED2939", secondaryColor: "#FFFFFF" },
      { id: "DZ", name: "アルジェリア", englishName: "ALGERIA", flagEmoji: "🇩🇿", fifaRanking: 28, primaryColor: "#006633", secondaryColor: "#D21034" },
      { id: "JO", name: "ヨルダン", englishName: "JORDAN", flagEmoji: "🇯🇴", fifaRanking: 63, primaryColor: "#C1272D", secondaryColor: "#FFFFFF" },
    ],
  },
  {
    name: "グループK",
    countries: [
      { id: "PT", name: "ポルトガル", englishName: "PORTUGAL", flagEmoji: "🇵🇹", fifaRanking: 5, primaryColor: "#FF0000", secondaryColor: "#006600" },
      { id: "CO", name: "コロンビア", englishName: "COLOMBIA", flagEmoji: "🇨🇴", fifaRanking: 13, primaryColor: "#FCD116", secondaryColor: "#003893" },
      { id: "CD", name: "コンゴ民主共和国", englishName: "DR CONGO", flagEmoji: "🇨🇩", fifaRanking: 46, primaryColor: "#007FFF", secondaryColor: "#CE1126" },
      { id: "UZ", name: "ウズベキスタン", englishName: "UZBEKISTAN", flagEmoji: "🇺🇿", fifaRanking: 50, primaryColor: "#0099B5", secondaryColor: "#3C9B27" },
    ],
  },
  {
    name: "グループL",
    countries: [
      { id: "EN", name: "イングランド", englishName: "ENGLAND", flagEmoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", fifaRanking: 4, primaryColor: "#CF081F", secondaryColor: "#FFFFFF" },
      { id: "HR", name: "クロアチア", englishName: "CROATIA", flagEmoji: "🇭🇷", fifaRanking: 11, primaryColor: "#FF0000", secondaryColor: "#0021C4" },
      { id: "PA", name: "パナマ", englishName: "PANAMA", flagEmoji: "🇵🇦", fifaRanking: 33, primaryColor: "#DA121A", secondaryColor: "#001689" },
      { id: "GH", name: "ガーナ", englishName: "GHANA", flagEmoji: "🇬🇭", fifaRanking: 74, primaryColor: "#FCD116", secondaryColor: "#006B3F" },
    ],
  },
];

export const getCountryById = (id: string): Country | undefined => {
  for (const group of GROUPS) {
    const country = group.countries.find((c) => c.id === id);
    if (country) return country;
  }
  return undefined;
};

export const getFlagUrl = (id: string): string => {
  const code = id.toLowerCase();
  if (code === "sco") return "https://flagcdn.com/gb-sct.svg";
  if (code === "en") return "https://flagcdn.com/gb-eng.svg";
  return `https://flagcdn.com/${code}.svg`;
};

