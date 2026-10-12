export const scheduleData = {
  "For You": [
    { day: "Tonight · 7:30 PM", meta: "NBA · TNT", a: ["BOS", "Celtics"], b: ["NYK", "Knicks"], edge: "8.4" },
    { day: "Tonight · 8:15 PM", meta: "NFL · Prime", a: ["BUF", "Bills"], b: ["BAL", "Ravens"], edge: "7.8" },
    { day: "Sat · 3:30 PM", meta: "NCAAF · ESPN", a: ["ALA", "Alabama"], b: ["UGA", "Georgia"], edge: "9.1" },
    { day: "Sun · 4:25 PM", meta: "NFL · FOX", a: ["SF", "49ers"], b: ["GB", "Packers"], edge: "8.7" },
  ],
  NFL: [
    { day: "Thu · 8:15 PM", meta: "NFL · Prime", a: ["BUF", "Bills"], b: ["BAL", "Ravens"], edge: "7.8" },
    { day: "Sun · 1:00 PM", meta: "NFL · CBS", a: ["KC", "Chiefs"], b: ["CIN", "Bengals"], edge: "9.3" },
    { day: "Sun · 4:25 PM", meta: "NFL · FOX", a: ["SF", "49ers"], b: ["GB", "Packers"], edge: "8.7" },
    { day: "Mon · 8:15 PM", meta: "NFL · ESPN", a: ["PHI", "Eagles"], b: ["DAL", "Cowboys"], edge: "9.0" },
  ],
  NBA: [
    { day: "Tonight · 7:30 PM", meta: "NBA · TNT", a: ["BOS", "Celtics"], b: ["NYK", "Knicks"], edge: "8.4" },
    { day: "Tonight · 10:00 PM", meta: "NBA · ESPN", a: ["LAL", "Lakers"], b: ["GSW", "Warriors"], edge: "9.2" },
    { day: "Fri · 8:00 PM", meta: "NBA · LP", a: ["DEN", "Nuggets"], b: ["OKC", "Thunder"], edge: "8.8" },
    { day: "Sun · 6:00 PM", meta: "NBA · ESPN", a: ["MIL", "Bucks"], b: ["MIA", "Heat"], edge: "7.6" },
  ],
  NCAAF: [
    { day: "Sat · 12:00 PM", meta: "NCAAF · ABC", a: ["TEX", "Texas"], b: ["OU", "Oklahoma"], edge: "8.9" },
    { day: "Sat · 3:30 PM", meta: "NCAAF · ESPN", a: ["ALA", "Alabama"], b: ["UGA", "Georgia"], edge: "9.1" },
    { day: "Sat · 7:30 PM", meta: "NCAAF · NBC", a: ["OSU", "Ohio State"], b: ["MICH", "Michigan"], edge: "9.5" },
    { day: "Sat · 8:00 PM", meta: "NCAAF · FOX", a: ["ORE", "Oregon"], b: ["PSU", "Penn State"], edge: "8.3" },
  ],
  MLB: [
    { day: "Tonight · 7:05 PM", meta: "MLB · YES", a: ["BOS", "Red Sox"], b: ["NYY", "Yankees"], edge: "8.6" },
    { day: "Tonight · 8:10 PM", meta: "MLB · TV+", a: ["CHC", "Cubs"], b: ["STL", "Cardinals"], edge: "7.7" },
    { day: "Sat · 4:10 PM", meta: "MLB · FOX", a: ["LAD", "Dodgers"], b: ["SD", "Padres"], edge: "9.0" },
    { day: "Sun · 1:35 PM", meta: "MLB · ESPN+", a: ["ATL", "Braves"], b: ["PHI", "Phillies"], edge: "8.2" },
  ],
  Soccer: [
    { day: "Sat · 7:30 AM", meta: "EPL · Peacock", a: ["MCI", "Man City"], b: ["ARS", "Arsenal"], edge: "9.4" },
    { day: "Sat · 12:30 PM", meta: "EPL · NBC", a: ["LIV", "Liverpool"], b: ["CHE", "Chelsea"], edge: "8.8" },
    { day: "Sun · 11:30 AM", meta: "EPL · Peacock", a: ["TOT", "Tottenham"], b: ["NEW", "Newcastle"], edge: "7.9" },
    { day: "Wed · 3:00 PM", meta: "UCL · Para+", a: ["RMA", "Real Madrid"], b: ["BAY", "Bayern"], edge: "9.6" },
  ],
};

export const marketData = [
  {
    meta: "NFL · Player comparison",
    xp: 120,
    question: "Who finishes with more passing yards?",
    choices: ["J. Hurts", "D. Prescott"],
    source: "COMMUNITY",
    confidence: 62,
  },
  {
    meta: "Live read · Next drive",
    xp: 90,
    question: "Will the next possession end in points?",
    choices: ["Yes", "No"],
    source: "MODEL",
    confidence: 54,
  },
  {
    meta: "Defense · Game event",
    xp: 150,
    question: "Which defense forces the next turnover?",
    choices: ["Philadelphia", "Dallas"],
    source: "COMMUNITY",
    confidence: 48,
  },
];

export const openRooms = [
  { code: "NFL402", sport: "NFL", starts: "02:14", name: "Sunday Film Room", detail: "8 / 12 players · Classic" },
  { code: "NBA247", sport: "NBA", starts: "04:32", name: "Hoops After Dark", detail: "5 / 10 players · Rapid fire" },
  { code: "MIX910", sport: "MIX", starts: "06:05", name: "All-Sports Gauntlet", detail: "14 / 20 players · Classic" },
];
