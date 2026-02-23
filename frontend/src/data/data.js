// ── Stand stat grade descriptions (shown inline per-row on the character sheet) ──
// Key: stat name → grade letter → { text, note?, noteColor? }
// 'note' renders as a coloured callout below the main description line.
export const PC_STAT_DESC = {
  power: {
    F: { text: 'Barely any physical force.' },
    D: { text: 'Can break through standard materials (wood, metal plating).' },
    C: { text: 'Capable of serious structural damage.' },
    B: { text: 'Can destroy vehicles and small buildings.' },
    A: { text: 'Devastating force — can level reinforced structures.' },
  },
  speed: {
    F: { text: 'Stationary or extremely slow.' },
    D: { text: 'Roughly human speed.' },
    C: { text: 'Faster than human; difficult to track.' },
    B: { text: 'Blinding speed; near-impossible to dodge.' },
    A: { text: 'Appears instantaneous; crosses rooms in a tick.' },
  },
  range: {
    F: { text: 'Touch only.' },
    D: { text: 'A few metres.' },
    C: { text: 'Across the room.' },
    B: { text: 'Down the street.' },
    A: { text: 'Full line of sight.' },
  },
  durability: {
    F: { text: '1 armor charge. Fragile; resistance reduces harm by 1 level.' },
    D: { text: '2 armor charges. Takes some punishment.' },
    C: { text: '3 armor charges. Resilient against most attacks.' },
    B: { text: '4 armor charges. Extremely difficult to damage.' },
    A: { text: '4 armor charges.', note: 'Resistance reduces harm 2 levels.', noteColor: 'amber' },
  },
  precision: {
    F: { text: 'Clumsy; cannot attempt fine manipulation.' },
    D: { text: 'Capable of basic fine work.' },
    C: { text: 'Cannot critical fail on any action.' },
    B: { text: 'Surgical precision; ignore −1D penalty from harm.' },
    A: { text: 'Perfect control.', note: '5s count as a full success.', noteColor: 'violet' },
  },
  development: {
    F: { text: '+0 XP at end of each session.' },
    D: { text: '+1 XP at end of each session.' },
    C: { text: '+2 XP at end of each session.' },
    B: { text: '+3 XP at end of each session.' },
    A: { text: '+4 XP at end of each session.' },
  },
};

// Grade letter → session XP bonus (mirrors backend DEV_SESSION_XP)
export const DEV_SESSION_XP = { S: 5, A: 4, B: 3, C: 2, D: 1, F: 0 };

// Durability grade → armor charges and stress track max (mirrors backend DUR_TABLE)
export const DUR_TABLE = {
  S: { charges: 5, stressMax: 13 },
  A: { charges: 4, stressMax: 12 },
  B: { charges: 4, stressMax: 11 },
  C: { charges: 3, stressMax: 10 },
  D: { charges: 2, stressMax: 9 },
  F: { charges: 1, stressMax: 8 },
};

// Numeric grade value (0–4) → letter  (player max is A=4; S is GM-only)
export const GRADE_LETTERS = ['F', 'D', 'C', 'B', 'A'];

export const factionData = {
  isGM: true, // Toggle for GM vs Player view
  campaignName: 'Diamond is Unbreakable',
  factions: [
    {
      id: 1,
      name: 'Speedwagon Foundation',
      type: 'MERCHANT',
      hold: 'strong',
      reputation: 3,
      notes: 'International organization funding bizarre research'
    },
    {
      id: 2,
      name: 'Morioh Police',
      type: 'POLITICAL',
      hold: 'weak',
      reputation: 1,
      notes: 'Local law enforcement, unaware of Stand users'
    },
    {
      id: 3,
      name: 'Angelo Gang',
      type: 'CRIMINAL',
      hold: 'weak',
      reputation: -2,
      notes: 'Small-time criminals with supernatural connections'
    },
    {
      id: 4,
      name: 'Higashikata Family',
      type: 'NOBLE',
      hold: 'strong',
      reputation: 2,
      notes: 'Wealthy family with hidden Stand heritage'
    }
  ],
  relationships: [
    { sourceId: 1, targetId: 2, value: 1, notes: 'Cooperative relationship' },
    { sourceId: 1, targetId: 3, value: -3, notes: 'Actively opposing' },
    { sourceId: 2, targetId: 3, value: -2, notes: 'Criminal investigation' },
    { sourceId: 4, targetId: 1, value: 2, notes: 'Financial support' }
  ],
  crewRelationships: [
    { factionId: 1, value: 2, notes: 'Aided in investigation' },
    { factionId: 2, value: 0, notes: 'Neutral standing' },
    { factionId: 3, value: -1, notes: 'Disrupted operations' },
    { factionId: 4, value: 1, notes: 'Family connections' }
  ]
};

export const standardAbilities = [
  'Shadow', 'Iron Will', 'Functioning Vice', 'Foresight', 'Calculating',
  'Like Looking into a Mirror', 'Trust in Me', 'Subterfuge', 'Cloak & Dagger',
  'Artificer', 'Analyst', 'Fortitude', 'Venomous', 'Bizarre Ward',
  'Physicker', 'Saboteur', 'Leader', 'Vigorous', 'Bodyguard', 'Savage',
  'Tough as Nails', 'Sharpshooter', 'Steady Barrage', 'Reflexes',
  'Bizarre Improvisation', 'Stand Evolution', 'Stand Fusion', 'Stand Recall'
];

export const viceOptions = [
  'Gambling', 'Obsession', 'Violence', 'Pleasure', 'Stupor', 'Weird', 
  'Obligation', 'Faith', 'Luxury', 'Art', 'Competition', 'Power', 
  'Adventure', 'Solitude', 'Justice'
];
