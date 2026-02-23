// ── Shared grade tables (used by both PC and NPC sheets) ──────────────────────

// All grades including S (NPC-reachable)
export const GRADES = ['F', 'D', 'C', 'B', 'A', 'S'];
export const GRADE_PTS  = { F: 0, D: 1, C: 2, B: 3, A: 4, S: 5 };
export const GRADE_IDX  = { F: 0, D: 1, C: 2, B: 3, A: 4, S: 5 };

// ── NPC SRD reference tables (keyed by grade letter) ─────────────────────────
// SRD note: level = max(1, totalPoints − LEVEL_OFFSET).
// Some SRD drafts say 9, some 10 — change this constant if the SRD is updated.
export const LEVEL_OFFSET = 9;

export const POWER_TABLE = {
  S: { harm: 4, pos: 'Forces position worse by 1 step (always)' },
  A: { harm: 4, pos: 'Forces position worse by 1 step' },
  B: { harm: 3, pos: 'Standard scaling' },
  C: { harm: 2, pos: 'Standard scaling' },
  D: { harm: 1, pos: 'Standard scaling' },
  F: { harm: 0, pos: 'Minimal threat' },
};

export const SPEED_TABLE = {
  S: { base: '200 ft', greater: '—',      lesser: '—',     note: 'Acts before everyone' },
  A: { base: '60 ft',  greater: '120 ft', lesser: '30 ft', note: '' },
  B: { base: '40 ft',  greater: '80 ft',  lesser: '20 ft', note: '' },
  C: { base: '35 ft',  greater: '70 ft',  lesser: '15 ft', note: '' },
  D: { base: '30 ft',  greater: '60 ft',  lesser: '15 ft', note: '' },
  F: { base: '25 ft',  greater: '50 ft',  lesser: '10 ft', note: '' },
};

export const RANGE_TABLE = {
  S: { base: 'Unlimited', greater: 'No penalty', lesser: 'No penalty' },
  A: { base: '100 ft', greater: '200 ft', lesser: '50 ft' },
  B: { base: '50 ft',  greater: '100 ft', lesser: '25 ft' },
  C: { base: '40 ft',  greater: '80 ft',  lesser: '20 ft' },
  D: { base: '20 ft',  greater: '40 ft',  lesser: '10 ft' },
  F: { base: '10 ft',  greater: '20 ft',  lesser: '5 ft'  },
};

export const PRECISION_TABLE = {
  S: { partial: 'Greater Effect on next action',         failure: '🔴 NPC gets a Critical' },
  A: { partial: 'Greater Effect on next action',         failure: 'Greater Effect on next action' },
  B: { partial: 'Standard Effect on next action',        failure: 'Greater Effect on next action' },
  C: { partial: 'Standard Effect on next action',        failure: 'Standard Effect on next action' },
  D: { partial: 'Lesser Effect on next action',          failure: 'Standard Effect on next action' },
  F: { partial: '🟢 NPC critically fails next action',   failure: 'Lesser Effect on next action' },
};

export const DEV_TABLE = {
  S: 'Real-time evolution — can gain entirely new abilities mid-fight. Completely unpredictable.',
  A: 'Adaptive combat — once per combat, mutate one existing ability to do something different.',
  B: 'Learns from defeat — in rematches, returns with 1 new ability based on what defeated them.',
  C: 'Fixed script — predictable once understood. No surprises. Easy to counter.',
  D: 'Limited moveset — PCs get +1d against it after witnessing its abilities twice.',
  F: 'Unstable — loses abilities during prolonged combat. Reduce by 1 armor charge each scene.',
};

// NPC armor derived from Durability grade
export const DUR_VULN_CLOCK    = { F: 4,  D: 6,  C: 8,  B: 10, A: 12, S: 0 };
export const DUR_REGULAR_ARMOR = { F: 1,  D: 2,  C: 2,  B: 3,  A: 4,  S: 5 };
export const DUR_SPECIAL_ARMOR = { F: 0,  D: 1,  C: 1,  B: 2,  A: 3,  S: 3 };

// ── PC-only tables ─────────────────────────────────────────────────────────────
// PC stat values are integers 0–4 (index into GRADE_LETTERS). S=5 is GM-only.

// Player-accessible grades (no S)
export const GRADE_LETTERS = ['F', 'D', 'C', 'B', 'A'];

// Creation limits
export const MAX_CREATION_DOTS           = 7;
export const MAX_DOTS_PER_ACTION_CREATION = 2;

// PC Durability grade index → { stressBonus, armorCharges }
// stressBonus is added to the base stress track of 9.
export const DUR_TABLE = [
  { stressBonus: -1, armorCharges: 0 }, // F (0)
  { stressBonus:  0, armorCharges: 1 }, // D (1)
  { stressBonus: +1, armorCharges: 1 }, // C (2)
  { stressBonus: +2, armorCharges: 2 }, // B (3)
  { stressBonus: +3, armorCharges: 3 }, // A (4)
];

// PC Development grade index → session XP bonus (F→A = 0→4)
export const DEV_SESSION_XP = [0, 1, 2, 3, 4];

// Action name → attribute key
export const ACTION_ATTR = {
  HUNT: 'insight', STUDY: 'insight', SURVEY: 'insight', TINKER: 'insight',
  FINESSE: 'prowess', PROWL: 'prowess', SKIRMISH: 'prowess', WRECK: 'prowess',
  BIZARRE: 'resolve', COMMAND: 'resolve', CONSORT: 'resolve', SWAY: 'resolve',
};

// Per-grade descriptions shown inline on the PC stat rows (index 0–4 = F→A)
export const PC_STAT_DESC = {
  power: [
    'Human-level strength; baseline to above-average physical capability',
    'Can break through standard materials (wood, metal plating)',
    'Can shatter stone and heavy structural materials',
    'Can destroy reinforced structures and thick concrete barriers',
    'Can demolish large buildings and city blocks with ease',
  ],
  speed: [
    '25(50) ft · Push yourself to dash',
    '30(60) ft · Acts before F · Push yourself to dash',
    '35(70) ft · Acts before D, F · Push yourself to dash',
    '40(80) ft · Acts before C, D, F · Push yourself to dash',
    '60(120) ft · Acts before B, C, D, F · Push yourself to dash',
  ],
  range: [
    '10(20) ft · Extension −2 effect',
    '20(40) ft · Push to extend · Extension −1 effect',
    '40(80) ft · Push to extend · Extension −1 effect',
    '50(100) ft · Push to extend',
    '100(200) ft · Push to extend',
  ],
  durability: [
    '−1 stress max · 0 armor charges',
    '±0 stress max · 1 armor charge',
    '+1 stress max · 1 armor charge',
    '+2 stress max · 2 armor charges',
    '+3 stress max · 3 armor charges',
  ],
  precision: [
    '1s and double 1s count as critical fail',
    'Double 1s count as critical fail',
    'Cannot critical fail',
    '3 counts as partial success (inherits C)',
    '5 counts as success (inherits B + C)',
  ],
  development: [
    'Standard XP gain only',
    '+1 XP at end of each session',
    '+2 XP at end of each session',
    '+3 XP at end of each session',
    '+4 XP/session · Spend 2 stress to borrow an ability (GM discretion)',
  ],
};

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
