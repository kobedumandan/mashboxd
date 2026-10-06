// SAMPLE DATA. Stand-in for the Mashboxd API until the frontend is wired to it.
// Game IDs are real Steam app IDs so cover art resolves from the Steam CDN.

export type Status = "playing" | "completed" | "backlog" | "dropped";

export interface Game {
  appId: number;
  title: string;
  developer: string;
  year: number;
}

export interface LibraryEntry {
  game: Game;
  status: Status;
  hours: number;
  /** 0.5 to 5 in half steps, null when unrated */
  rating: number | null;
  lastPlayed: string;
}

export interface Review {
  id: string;
  user: string;
  game: Game;
  rating: number;
  body: string;
  likes: number;
  date: string;
}

export interface Activity {
  time: string;
  action: string;
  target: string;
}

const STEAM_CDN = "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps";

export const coverUrl = (appId: number) => `${STEAM_CDN}/${appId}/library_600x900.jpg`;
export const headerUrl = (appId: number) => `${STEAM_CDN}/${appId}/header.jpg`;
export const avatarUrl = (seed: string, size = 160) =>
  `https://picsum.photos/seed/mashboxd-${seed}/${size}/${size}?grayscale`;

export const games = {
  eldenRing: { appId: 1245620, title: "Elden Ring", developer: "FromSoftware", year: 2022 },
  balatro: { appId: 2379780, title: "Balatro", developer: "LocalThunk", year: 2024 },
  bg3: { appId: 1086940, title: "Baldur's Gate 3", developer: "Larian Studios", year: 2023 },
  rdr2: { appId: 1174180, title: "Red Dead Redemption 2", developer: "Rockstar Games", year: 2019 },
  hades: { appId: 1145360, title: "Hades", developer: "Supergiant Games", year: 2020 },
  hollowKnight: { appId: 367520, title: "Hollow Knight", developer: "Team Cherry", year: 2017 },
  celeste: { appId: 504230, title: "Celeste", developer: "Maddy Makes Games", year: 2018 },
  discoElysium: { appId: 632470, title: "Disco Elysium", developer: "ZA/UM", year: 2019 },
  outerWilds: { appId: 753640, title: "Outer Wilds", developer: "Mobius Digital", year: 2020 },
  portal2: { appId: 620, title: "Portal 2", developer: "Valve", year: 2011 },
  witcher3: { appId: 292030, title: "The Witcher 3", developer: "CD PROJEKT RED", year: 2015 },
  sekiro: { appId: 814380, title: "Sekiro", developer: "FromSoftware", year: 2019 },
  cyberpunk: { appId: 1091500, title: "Cyberpunk 2077", developer: "CD PROJEKT RED", year: 2020 },
  persona5: { appId: 1687950, title: "Persona 5 Royal", developer: "Atlus", year: 2022 },
  stardew: { appId: 413150, title: "Stardew Valley", developer: "ConcernedApe", year: 2016 },
  slayTheSpire: { appId: 646570, title: "Slay the Spire", developer: "Mega Crit", year: 2019 },
  factorio: { appId: 427520, title: "Factorio", developer: "Wube Software", year: 2020 },
  terraria: { appId: 105600, title: "Terraria", developer: "Re-Logic", year: 2011 },
} satisfies Record<string, Game>;

export const library: LibraryEntry[] = [
  { game: games.eldenRing, status: "playing", hours: 187.4, rating: 5, lastPlayed: "2h ago" },
  { game: games.balatro, status: "playing", hours: 96.2, rating: 4.5, lastPlayed: "Yesterday" },
  { game: games.bg3, status: "playing", hours: 141.8, rating: null, lastPlayed: "3 days ago" },
  { game: games.stardew, status: "completed", hours: 203.9, rating: 4, lastPlayed: "Aug 2026" },
  { game: games.witcher3, status: "completed", hours: 133.5, rating: 4.5, lastPlayed: "Jun 2026" },
  { game: games.rdr2, status: "completed", hours: 112.6, rating: 5, lastPlayed: "Sep 2026" },
  { game: games.slayTheSpire, status: "completed", hours: 87.6, rating: 4.5, lastPlayed: "Jul 2026" },
  { game: games.hades, status: "completed", hours: 74.3, rating: 4.5, lastPlayed: "May 2026" },
  { game: games.hollowKnight, status: "completed", hours: 58.9, rating: 5, lastPlayed: "Apr 2026" },
  { game: games.discoElysium, status: "completed", hours: 46.7, rating: 5, lastPlayed: "Mar 2026" },
  { game: games.celeste, status: "completed", hours: 31.2, rating: 4.5, lastPlayed: "Feb 2026" },
  { game: games.outerWilds, status: "completed", hours: 22.4, rating: 5, lastPlayed: "Jan 2026" },
  { game: games.portal2, status: "completed", hours: 14.8, rating: 4, lastPlayed: "Dec 2025" },
  { game: games.factorio, status: "dropped", hours: 41.3, rating: 3.5, lastPlayed: "Nov 2025" },
  { game: games.sekiro, status: "dropped", hours: 19.6, rating: 3, lastPlayed: "Oct 2025" },
  { game: games.cyberpunk, status: "backlog", hours: 6.1, rating: null, lastPlayed: "Sep 2025" },
  { game: games.terraria, status: "backlog", hours: 2.7, rating: null, lastPlayed: "Jul 2025" },
  { game: games.persona5, status: "backlog", hours: 0, rating: null, lastPlayed: "Never" },
];

export const communityReviews: Review[] = [
  {
    id: "r1",
    user: "save_scummer",
    game: games.discoElysium,
    rating: 5,
    body: "The best writing I have read in a game. I failed a roll to open a door and it was still the funniest scene of my year.",
    likes: 412,
    date: "Oct 4",
  },
  {
    id: "r2",
    user: "noclip_nadia",
    game: games.eldenRing,
    rating: 5,
    body: "Nine hours on Malenia. Beat her on the attempt where I stopped caring. Would do it again.",
    likes: 287,
    date: "Oct 3",
  },
  {
    id: "r3",
    user: "tomas.okoro",
    game: games.balatro,
    rating: 4.5,
    body: "Started one run before bed. It was 3am. The jokers are a problem and I am not fixing it.",
    likes: 163,
    date: "Oct 2",
  },
];

export const userReviews: Review[] = [
  {
    id: "u1",
    user: "you",
    game: games.rdr2,
    rating: 5,
    body: "Spent forty hours not doing the story. Fishing, hunting, getting lost. The epilogue hit harder than it had any right to.",
    likes: 58,
    date: "Sep 21",
  },
  {
    id: "u2",
    user: "you",
    game: games.outerWilds,
    rating: 5,
    body: "Every loop taught me something. I want to forget it all and play it again.",
    likes: 34,
    date: "Jan 12",
  },
  {
    id: "u3",
    user: "you",
    game: games.sekiro,
    rating: 3,
    body: "Genichiro won. I respect the game, I just do not respect myself enough to keep going.",
    likes: 21,
    date: "Oct 30",
  },
];

export const friendActivity = [
  { user: "noclip_nadia", verb: "completed", game: games.eldenRing, when: "12m" },
  { user: "tomas.okoro", verb: "rated", game: games.balatro, when: "1h" },
  { user: "mirei.k", verb: "added to backlog", game: games.hades, when: "3h" },
];

export const activityLog: Activity[] = [
  { time: "Oct 06 21:02", action: "Logged 2.4h", target: "Elden Ring" },
  { time: "Oct 05 23:47", action: "Logged 3.1h", target: "Balatro" },
  { time: "Oct 03 19:15", action: "Started", target: "Baldur's Gate 3" },
  { time: "Sep 21 22:30", action: "Reviewed", target: "Red Dead Redemption 2" },
  { time: "Sep 21 22:04", action: "Completed", target: "Red Dead Redemption 2" },
  { time: "Sep 18 08:11", action: "Synced", target: "Steam library" },
];

export const statusMeta: Record<Status, { label: string }> = {
  playing: { label: "Playing" },
  completed: { label: "Completed" },
  backlog: { label: "Backlog" },
  dropped: { label: "Dropped" },
};

export const formatHours = (h: number) =>
  h.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
