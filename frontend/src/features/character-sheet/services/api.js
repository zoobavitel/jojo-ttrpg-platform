// API service for character sheet backend integration

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Token ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Character API functions
export const characterAPI = {
  // Get all characters for current user
  getCharacters: () => apiRequest('/characters/'),
  
  // Get single character by ID
  getCharacter: (id) => apiRequest(`/characters/${id}/`),
  
  // Create new character
  createCharacter: (characterData) => apiRequest('/characters/', {
    method: 'POST',
    body: JSON.stringify(characterData),
  }),
  
  // Update character
  updateCharacter: (id, characterData) => apiRequest(`/characters/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(characterData),
  }),
  
  // Partial update character
  patchCharacter: (id, characterData) => apiRequest(`/characters/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(characterData),
  }),
  
  // Delete character
  deleteCharacter: (id) => apiRequest(`/characters/${id}/`, {
    method: 'DELETE',
  }),
  
  // Roll action dice
  rollAction: (id, actionData) => apiRequest(`/characters/${id}/roll-action/`, {
    method: 'POST',
    body: JSON.stringify(actionData),
  }),
  
  // Add XP to character
  addXP: (id, xpData) => apiRequest(`/characters/${id}/add-xp/`, {
    method: 'POST',
    body: JSON.stringify(xpData),
  }),
  
  // Take harm
  takeHarm: (id, harmData) => apiRequest(`/characters/${id}/take-harm/`, {
    method: 'POST',
    body: JSON.stringify(harmData),
  }),
  
  // Heal harm
  healHarm: (id, healData) => apiRequest(`/characters/${id}/heal-harm/`, {
    method: 'POST',
    body: JSON.stringify(healData),
  }),
  
  // Indulge vice
  indulgeVice: (id, viceData) => apiRequest(`/characters/${id}/indulge-vice/`, {
    method: 'POST',
    body: JSON.stringify(viceData),
  }),
  
  // Log armor expenditure
  logArmorExpenditure: (id, armorData) => apiRequest(`/characters/${id}/log-armor-expenditure/`, {
    method: 'POST',
    body: JSON.stringify(armorData),
  }),
  
  // Add progress clock
  addProgressClock: (id, clockData) => apiRequest(`/characters/${id}/add-progress-clock/`, {
    method: 'POST',
    body: JSON.stringify(clockData),
  }),
  
  // Spend 5 XP for +1 action dot (FIX 7: minor advance outside level-up)
  spendXpForActionDot: (id, action) => apiRequest(`/characters/${id}/spend-xp-action-dot/`, {
    method: 'POST',
    body: JSON.stringify({ action }),
  }),

  // Update progress clock
  updateProgressClock: (id, clockData) => apiRequest(`/characters/${id}/update-progress-clock/`, {
    method: 'POST',
    body: JSON.stringify(clockData),
  }),
};

// Reference data API functions
export const referenceAPI = {
  // Get all heritages
  getHeritages: () => apiRequest('/heritages/'),
  
  // Get all vices
  getVices: () => apiRequest('/vices/'),
  
  // Get all abilities
  getAbilities: () => apiRequest('/abilities/'),
  
  // Get all hamon abilities
  getHamonAbilities: () => apiRequest('/hamon-abilities/'),
  
  // Get all spin abilities
  getSpinAbilities: () => apiRequest('/spin-abilities/'),
  
  // Get all trauma conditions
  getTraumas: () => apiRequest('/traumas/'),
  
  // Get available playbook abilities
  getAvailablePlaybookAbilities: (playbook, coinStats) => apiRequest('/get-available-playbook-abilities/', {
    method: 'POST',
    body: JSON.stringify({ playbook, coin_stats: coinStats }),
  }),
};

// Campaign API functions
export const campaignAPI = {
  // Get all campaigns for current user
  getCampaigns: () => apiRequest('/campaigns/'),
  
  // Get single campaign
  getCampaign: (id) => apiRequest(`/campaigns/${id}/`),
  
  // Create campaign
  createCampaign: (campaignData) => apiRequest('/campaigns/', {
    method: 'POST',
    body: JSON.stringify(campaignData),
  }),
  
  // Update campaign
  updateCampaign: (id, campaignData) => apiRequest(`/campaigns/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(campaignData),
  }),
};

// Crew API functions
export const crewAPI = {
  // Get all crews
  getCrews: () => apiRequest('/crews/'),
  
  // Get single crew
  getCrew: (id) => apiRequest(`/crews/${id}/`),
  
  // Create crew
  createCrew: (crewData) => apiRequest('/crews/', {
    method: 'POST',
    body: JSON.stringify(crewData),
  }),
  
  // Update crew
  updateCrew: (id, crewData) => apiRequest(`/crews/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(crewData),
  }),
};

// Session API functions
export const sessionAPI = {
  // Get sessions for campaign
  getSessions: (campaignId) => apiRequest(`/sessions/?campaign=${campaignId}`),
  
  // Get single session
  getSession: (id) => apiRequest(`/sessions/${id}/`),
  
  // Create session
  createSession: (sessionData) => apiRequest('/sessions/', {
    method: 'POST',
    body: JSON.stringify(sessionData),
  }),
  
  // Update session
  updateSession: (id, sessionData) => apiRequest(`/sessions/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(sessionData),
  }),
};

// Global search
export const searchAPI = {
  globalSearch: (query) => apiRequest(`/global-search/?q=${encodeURIComponent(query)}`),
};

// Authentication API functions
export const authAPI = {
  // Login
  login: (credentials) => apiRequest('/login/', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  // Register
  register: (userData) => apiRequest('/register/', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  // Logout (clear token)
  logout: () => {
    localStorage.removeItem('authToken');
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
};

// ── Grade conversion helpers ───────────────────────────────────────────────────
// Backend stores stand stat values as grade letters (F/D/C/B/A/S).
// Frontend uses integers 0–4 as indices into NUM_TO_GRADE = ['F','D','C','B','A'].
// S-rank is GM-only and not selectable by players; if received from backend it is
// clamped to 4 (A) since PCs max out at A.
const GRADE_TO_NUM = { F: 0, D: 1, C: 2, B: 3, A: 4, S: 4 };
const NUM_TO_GRADE = ['F', 'D', 'C', 'B', 'A'];

// Data transformation helpers
export const transformBackendToFrontend = (backendCharacter) => {
  return {
    id: backendCharacter.id,
    name: backendCharacter.true_name || '',
    standName: backendCharacter.stand_name || '',
    heritage: backendCharacter.heritage?.name || 'Human',
    background: backendCharacter.background_note || '',
    look: backendCharacter.appearance || '',
    vice: backendCharacter.vice?.name || '',
    crew: backendCharacter.crew?.name || '',

    // Action ratings
    actionRatings: {
      HUNT:     backendCharacter.action_dots?.hunt     || 0,
      STUDY:    backendCharacter.action_dots?.study    || 0,
      SURVEY:   backendCharacter.action_dots?.survey   || 0,
      TINKER:   backendCharacter.action_dots?.tinker   || 0,
      FINESSE:  backendCharacter.action_dots?.finesse  || 0,
      PROWL:    backendCharacter.action_dots?.prowl    || 0,
      SKIRMISH: backendCharacter.action_dots?.skirmish || 0,
      WRECK:    backendCharacter.action_dots?.wreck    || 0,
      BIZARRE:  backendCharacter.action_dots?.attune   || 0, // backend uses 'attune'
      COMMAND:  backendCharacter.action_dots?.command  || 0,
      CONSORT:  backendCharacter.action_dots?.consort  || 0,
      SWAY:     backendCharacter.action_dots?.sway     || 0,
    },

    // Stand stats — backend sends grade letters, frontend uses numeric 0–4
    standStats: {
      power:       GRADE_TO_NUM[backendCharacter.stand?.power]       ?? 1,
      speed:       GRADE_TO_NUM[backendCharacter.stand?.speed]       ?? 1,
      range:       GRADE_TO_NUM[backendCharacter.stand?.range]       ?? 1,
      durability:  GRADE_TO_NUM[backendCharacter.stand?.durability]  ?? 1,
      precision:   GRADE_TO_NUM[backendCharacter.stand?.precision]   ?? 1,
      development: GRADE_TO_NUM[backendCharacter.stand?.development] ?? 1,
    },

    // Stress as filled count (FIX 4: max derived from DUR_TABLE on the component side)
    stressFilled: backendCharacter.stress || 0,
    trauma: backendCharacter.trauma || {
      COLD: false, HAUNTED: false, OBSESSED: false, PARANOID: false,
      RECKLESS: false, SOFT: false, UNSTABLE: false, VICIOUS: false,
    },

    // Armor charges (FIX 4: count of used charges, not boolean flags)
    regularArmorUsed: backendCharacter.regular_armor_used || 0,
    specialArmorUsed: backendCharacter.special_armor_used || false,

    // Harm entries
    harm: {
      level3: [backendCharacter.harm_level3_name || ''],
      level2: [backendCharacter.harm_level2_name || '', ''],
      level1: [backendCharacter.harm_level1_name || '', ''],
    },

    // Coin (pocket) and stash
    coinFilled: backendCharacter.coin || 0,
    stash: backendCharacter.stash || Array(40).fill(false),

    // Healing clock
    healingClock: backendCharacter.healing_clock_filled || 0,

    // XP tracks
    xp: backendCharacter.xp_clocks || { insight: 0, prowess: 0, resolve: 0, heritage: 0, playbook: 0 },

    // Abilities
    abilities: [
      ...(backendCharacter.standard_ability_details || []),
      ...(backendCharacter.hamon_ability_details    || []),
      ...(backendCharacter.spin_ability_details     || []),
    ],

    // Progress clocks
    clocks: backendCharacter.progress_clocks || [],

    // Passthrough fields
    playbook: backendCharacter.playbook || 'Stand',
    campaign: backendCharacter.campaign,
    level: backendCharacter.level,
    loadout: backendCharacter.loadout,
    inventory: backendCharacter.inventory || [],
    reputation_status: backendCharacter.reputation_status || {},
  };
};

export const transformFrontendToBackend = (frontendCharacter) => {
  const ratings = frontendCharacter.actionRatings || {};
  const stats   = frontendCharacter.standStats    || {};
  const harmData= frontendCharacter.harm          || { level3: [''], level2: ['', ''], level1: ['', ''] };
  return {
    true_name:       frontendCharacter.name       || '',
    stand_name:      frontendCharacter.standName  || '',
    heritage:        frontendCharacter.heritage   || 'Human',
    background_note: frontendCharacter.background || '',
    appearance:      frontendCharacter.look       || '',
    vice:            frontendCharacter.vice       || '',

    // Action dots
    action_dots: {
      hunt:     ratings.HUNT     || 0,
      study:    ratings.STUDY    || 0,
      survey:   ratings.SURVEY   || 0,
      tinker:   ratings.TINKER   || 0,
      finesse:  ratings.FINESSE  || 0,
      prowl:    ratings.PROWL    || 0,
      skirmish: ratings.SKIRMISH || 0,
      wreck:    ratings.WRECK    || 0,
      attune:   ratings.BIZARRE  || 0, // backend uses 'attune'
      command:  ratings.COMMAND  || 0,
      consort:  ratings.CONSORT  || 0,
      sway:     ratings.SWAY     || 0,
    },

    // Stand stats — convert numeric 0–4 back to grade letters for backend
    stand: {
      name:        frontendCharacter.standName || '',
      power:       NUM_TO_GRADE[stats.power]       || 'D',
      speed:       NUM_TO_GRADE[stats.speed]       || 'D',
      range:       NUM_TO_GRADE[stats.range]       || 'D',
      durability:  NUM_TO_GRADE[stats.durability]  || 'D',
      precision:   NUM_TO_GRADE[stats.precision]   || 'D',
      development: NUM_TO_GRADE[stats.development] || 'D',
    },

    // Stress as count
    stress: frontendCharacter.stressFilled || 0,
    trauma: frontendCharacter.trauma,

    // Armor
    regular_armor_used: frontendCharacter.regularArmorUsed || 0,
    special_armor_used: frontendCharacter.specialArmorUsed || false,

    // Harm
    harm_level3_name: harmData.level3[0] || '',
    harm_level3_used: !!(harmData.level3[0]),
    harm_level2_name: harmData.level2[0] || '',
    harm_level2_used: !!(harmData.level2[0]),
    harm_level1_name: harmData.level1[0] || '',
    harm_level1_used: !!(harmData.level1[0]),

    // Coin and stash
    coin:  frontendCharacter.coinFilled || 0,
    stash: frontendCharacter.stash || [],

    // Healing clock
    healing_clock_filled: frontendCharacter.healingClock || 0,

    // XP tracks
    xp_clocks: frontendCharacter.xp || { insight:0, prowess:0, resolve:0, heritage:0, playbook:0 },

    // Progress clocks and abilities
    progress_clocks: frontendCharacter.clocks || [],

    // Passthrough
    playbook: frontendCharacter.playbook || 'Stand',
    inventory: frontendCharacter.inventory || [],
    reputation_status: frontendCharacter.reputation_status || {},
  };
};

// NPC API functions
export const npcAPI = {
  getNPCs:     ()          => apiRequest('/npcs/'),
  getNPC:      (id)        => apiRequest(`/npcs/${id}/`),
  createNPC:   (data)      => apiRequest('/npcs/', { method: 'POST', body: JSON.stringify(data) }),
  updateNPC:   (id, data)  => apiRequest(`/npcs/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteNPC:   (id)        => apiRequest(`/npcs/${id}/`, { method: 'DELETE' }),
}; 