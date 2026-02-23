import React, { useState } from 'react';
import {
  GRADES, GRADE_PTS, LEVEL_OFFSET,
  POWER_TABLE, SPEED_TABLE, RANGE_TABLE, PRECISION_TABLE, DEV_TABLE,
  DUR_VULN_CLOCK, DUR_REGULAR_ARMOR, DUR_SPECIAL_ARMOR,
} from '../data/data.js';

// ── ProgressClock ─────────────────────────────────────────────────────────────

const ProgressClock = ({ size = 80, segments, filled, onClick, label, sublabel, color = '#dc2626' }) => {
  if (segments === 0) return null;
  const r = size / 2 - 4, cx = size / 2, cy = size / 2;
  const sa = 360 / segments;
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' }}>
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
        {Array.from({ length: segments }, (_, i) => {
          const a1 = ((i * sa - 90) * Math.PI) / 180;
          const a2 = (((i + 1) * sa - 90) * Math.PI) / 180;
          const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
          const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
          return (
            <path key={i}
              d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${sa > 180 ? 1 : 0} 1 ${x2} ${y2} Z`}
              fill={i < filled ? color : 'transparent'} stroke="#4b5563" strokeWidth="1.5"
              style={{ cursor: onClick ? 'pointer' : 'default' }}
              onClick={onClick ? () => onClick(i < filled ? i : i + 1) : undefined}
            />
          );
        })}
        <circle cx={cx} cy={cy} r={r} fill="transparent" stroke="#6b7280" strokeWidth="2" />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: Math.max(8, size / 6), fill:'#fff', fontFamily:'monospace', fontWeight:'bold',
            transform:`rotate(90deg)`, transformOrigin:`${cx}px ${cy}px` }}>
          {filled}/{segments}
        </text>
      </svg>
      {label    && <div style={{ fontSize:'11px', fontWeight:'bold', color:'#d1d5db', textAlign:'center', maxWidth:`${size}px` }}>{label}</div>}
      {sublabel && <div style={{ fontSize:'10px', color:'#6b7280', textAlign:'center', maxWidth:`${size}px` }}>{sublabel}</div>}
    </div>
  );
};

// ── ArmorTracker ──────────────────────────────────────────────────────────────

const ArmorTracker = ({ label, max, used, onChange, color }) => {
  if (max === 0) return (
    <div style={{ textAlign:'center' }}>
      <div style={{ fontSize:'10px', color:'#4b5563', fontWeight:'bold' }}>{label}</div>
      <div style={{ fontSize:'10px', color:'#6b7280' }}>0 charges</div>
    </div>
  );
  return (
    <div style={{ textAlign:'center' }}>
      <div style={{ fontSize:'10px', color:'#9ca3af', fontWeight:'bold', marginBottom:'4px' }}>{label}</div>
      <div style={{ display:'flex', gap:'3px', justifyContent:'center', flexWrap:'wrap' }}>
        {Array.from({ length: max }, (_, i) => (
          <div key={i}
            onClick={() => onChange(i < used ? i : i + 1)}
            title={i < used ? 'Spent — click to restore' : 'Click to spend'}
            style={{ width:'18px', height:'18px', border:`1px solid ${color}`, cursor:'pointer',
              background: i < used ? color : 'transparent', borderRadius:'2px' }} />
        ))}
      </div>
      <div style={{ fontSize:'10px', color:'#6b7280', marginTop:'2px' }}>{max - used} left</div>
    </div>
  );
};

// ── GradeSelector ─────────────────────────────────────────────────────────────

const GradeSelector = ({ value, onChange, label, infoLine }) => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'8px' }}>
    <div style={{ minWidth:'90px' }}>
      <div style={{ fontSize:'11px', color:'#d1d5db', fontWeight:'bold', textTransform:'uppercase' }}>{label}</div>
      {infoLine && <div style={{ fontSize:'10px', color:'#6b7280', marginTop:'1px' }}>{infoLine}</div>}
    </div>
    <div style={{ display:'flex', gap:'3px' }}>
      {GRADES.map(g => (
        <button key={g} onClick={() => onChange(g)}
          style={{ width:'28px', height:'28px', border:'1px solid',
            borderColor: value === g ? '#a78bfa' : '#374151',
            background: value === g ? '#4c1d95' : '#1f2937',
            color: value === g ? '#e9d5ff' : '#6b7280',
            fontWeight: value === g ? 'bold' : 'normal',
            fontSize:'11px', cursor:'pointer', fontFamily:'monospace', borderRadius:'3px' }}>
          {g}
        </button>
      ))}
    </div>
  </div>
);

// ── NPCSheet ──────────────────────────────────────────────────────────────────

const NPCSheet = ({ npc, onSave, onClose, onCreateNew, allNPCs = [], onSwitchNPC }) => {
  const [name,      setName]      = useState(npc?.name      || '');
  const [standName, setStandName] = useState(npc?.standName || '');
  const [role,      setRole]      = useState(npc?.role      || '');
  const [notes,     setNotes]     = useState(npc?.notes     || '');

  const [stats, setStats] = useState(npc?.stats || {
    power: 'D', speed: 'D', range: 'D', durability: 'D', precision: 'D', development: 'D',
  });

  const [conflictClocks, setConflictClocks] = useState(npc?.conflictClocks || [
    { id: 1, name: 'Defeat', segments: 8, filled: 0 },
  ]);
  const [altClocks, setAltClocks]         = useState(npc?.altClocks || []);
  const [regularUsed, setRegularUsed]     = useState(npc?.regularUsed || 0);
  const [specialUsed, setSpecialUsed]     = useState(npc?.specialUsed || 0);
  const [abilities, setAbilities]         = useState(npc?.abilities || []);

  // ── Derived ───────────────────────────────────────────────────────────────────

  const totalPoints  = Object.values(stats).reduce((s, g) => s + GRADE_PTS[g], 0);
  const level        = Math.max(1, totalPoints - LEVEL_OFFSET);
  const totalSpentXP = totalPoints * 10;

  const durGrade    = stats.durability;
  const vulnSegs    = DUR_VULN_CLOCK[durGrade];
  const regArmorMax = DUR_REGULAR_ARMOR[durGrade];
  const specArmorMax= DUR_SPECIAL_ARMOR[durGrade];
  const isDurS      = durGrade === 'S';

  const powerInfo  = POWER_TABLE[stats.power];
  const speedInfo  = SPEED_TABLE[stats.speed];
  const rangeInfo  = RANGE_TABLE[stats.range];
  const precInfo   = PRECISION_TABLE[stats.precision];
  const devInfo    = DEV_TABLE[stats.development];

  // ── Clock helpers ─────────────────────────────────────────────────────────────

  const addConflictClock = () => {
    const n = prompt('Clock name (e.g. "Defeat Diavolo"):');
    if (!n) return;
    const segs = parseInt(prompt('Segments (4, 6, 8, 12):') || '8');
    if (![4, 6, 8, 12].includes(segs)) { alert('Must be 4, 6, 8, or 12.'); return; }
    setConflictClocks(p => [...p, { id: Date.now(), name: n, segments: segs, filled: 0 }]);
  };

  const addAltClock = () => {
    const n = prompt('Alternative win condition (e.g. "Expose User"):');
    if (!n) return;
    const segs = parseInt(prompt('Segments (4, 6, 8, 12):') || '8');
    if (![4, 6, 8, 12].includes(segs)) return;
    setAltClocks(p => [...p, { id: Date.now(), name: n, segments: segs, filled: 0 }]);
  };

  const updateConflictClock = (id, filled) => setConflictClocks(p => p.map(c => c.id === id ? { ...c, filled } : c));
  const deleteConflictClock = (id)         => setConflictClocks(p => p.filter(c => c.id !== id));
  const updateAltClock      = (id, filled) => setAltClocks(p => p.map(c => c.id === id ? { ...c, filled } : c));
  const deleteAltClock      = (id)         => setAltClocks(p => p.filter(c => c.id !== id));

  const handleSave = () => {
    if (onSave) onSave({
      id: npc?.id || Date.now(),
      name, standName, role, notes, stats,
      conflictClocks, altClocks, regularUsed, specialUsed, abilities,
    });
  };

  // ── Styles ────────────────────────────────────────────────────────────────────

  const S = {
    page: { fontFamily:'monospace', fontSize:'13px', background:'#000', color:'#fff', minHeight:'100vh' },
    hdr:  { background:'#1a0533', padding:'8px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'2px solid #7c3aed', position:'sticky', top:0, zIndex:10 },
    card: { background:'#0d0d1a', border:'1px solid #2d1f52', borderRadius:'4px', padding:'12px', marginBottom:'12px' },
    lbl:  { color:'#a78bfa', fontSize:'11px', fontWeight:'bold', marginBottom:'4px', display:'block', textTransform:'uppercase', letterSpacing:'0.05em' },
    inp:  { background:'transparent', color:'#fff', border:'none', borderBottom:'1px solid #4b2d8f', padding:'2px 4px', width:'100%', fontFamily:'monospace', fontSize:'13px', outline:'none', boxSizing:'border-box' },
    sel:  { background:'#1f1035', color:'#fff', border:'1px solid #4b2d8f', padding:'4px 8px', fontSize:'12px', fontFamily:'monospace' },
    btn:  { padding:'4px 12px', borderRadius:'4px', fontSize:'12px', cursor:'pointer', border:'none', fontFamily:'monospace' },
    g2:   { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' },
    ref:  { background:'#0a0a14', border:'1px solid #1f1f3a', borderRadius:'4px', padding:'8px', fontSize:'11px' },
    warn: { background:'#1a0000', border:'1px solid #7f1d1d', borderRadius:'4px', padding:'6px 10px', fontSize:'11px', color:'#fca5a5' },
    sdur: { background:'#0a1a0a', border:'2px solid #16a34a', borderRadius:'6px', padding:'10px', fontSize:'11px', color:'#86efac' },
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div style={S.page}>

      {/* Header */}
      <div style={S.hdr}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <span style={{ fontSize:'18px', fontWeight:'bold', color:'#c4b5fd' }}>1(800)BIZARRE</span>
          <span style={{ color:'#7c3aed', fontSize:'14px' }}>&#9670;</span>
          <span style={{ fontSize:'14px', color:'#9ca3af', fontWeight:'bold' }}>GM &#8212; NPC SHEET</span>
          {name && <span style={{ color:'#fff', fontWeight:'bold' }}>{name}</span>}
          {standName && <span style={{ color:'#a78bfa' }}>&#12300;{standName}&#12301;</span>}
        </div>
        <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
          {allNPCs.length > 1 && (
            <select style={S.sel} onChange={e => {
              const n = allNPCs.find(x => x.id === parseInt(e.target.value));
              if (n && onSwitchNPC) onSwitchNPC(n);
            }}>
              <option value="">Switch NPC&#8230;</option>
              {allNPCs.map(n => <option key={n.id} value={n.id}>{n.name || 'Unnamed'}</option>)}
            </select>
          )}
          {onCreateNew && (
            <button onClick={onCreateNew} style={{ ...S.btn, background:'#4c1d95', color:'#e9d5ff' }}>+ New NPC</button>
          )}
          <button onClick={handleSave} style={{ ...S.btn, background:'#16a34a', color:'#fff' }}>Save</button>
          {onClose && <button onClick={onClose} aria-label="Close NPC sheet" style={{ background:'none', border:'none', color:'#9ca3af', cursor:'pointer', fontSize:'18px' }}>&#10005;</button>}
        </div>
      </div>

      <div style={{ padding:'16px', maxWidth:'1400px', margin:'0 auto' }}>

        {/* Identity bar */}
        <div style={{ ...S.card, borderColor:'#4c1d95' }}>
          <div style={{ display:'grid', gridTemplateColumns:'2fr 2fr 1fr auto', gap:'16px', alignItems:'end' }}>
            <div><span style={S.lbl}>NPC Name / User Name</span><input style={S.inp} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Yoshikage Kira" /></div>
            <div><span style={S.lbl}>Stand Name</span><input style={S.inp} value={standName} onChange={e => setStandName(e.target.value)} placeholder="e.g. Killer Queen" /></div>
            <div><span style={S.lbl}>Role / Type</span><input style={S.inp} value={role} onChange={e => setRole(e.target.value)} placeholder="Boss / Ally / Minion" /></div>
            <div style={{ textAlign:'center', minWidth:'100px' }}>
              <span style={S.lbl}>NPC LEVEL</span>
              <div style={{ fontSize:'28px', fontWeight:'bold', lineHeight:1,
                color: level >= 7 ? '#f87171' : level >= 4 ? '#fbbf24' : '#34d399' }}>
                {level}
              </div>
              <div style={{ fontSize:'10px', color:'#6b7280', marginTop:'2px' }}>{totalPoints} pts &#215; 10</div>
              <div style={{ fontSize:'10px', color:'#4c1d95', marginTop:'1px' }}>= {totalSpentXP} XP spent</div>
            </div>
          </div>
        </div>

        <div style={S.g2}>

          {/* LEFT: Stats + Reference */}
          <div>
            {/* Stand Coin Stats */}
            <div style={S.card}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'10px' }}>
                <span style={S.lbl}>Stand Coin Stats</span>
                <span style={{ fontSize:'11px', color:'#6b7280' }}>{totalPoints} pts &#8594; Level {level}</span>
              </div>

              <GradeSelector value={stats.power} onChange={v => setStats(p => ({ ...p, power: v }))} label="Power"
                infoLine={`Lv${POWER_TABLE[stats.power].harm} harm &#183; ${POWER_TABLE[stats.power].pos}`} />
              <GradeSelector value={stats.speed} onChange={v => setStats(p => ({ ...p, speed: v }))} label="Speed"
                infoLine={`${SPEED_TABLE[stats.speed].base} base &#183; ${SPEED_TABLE[stats.speed].greater} greater${SPEED_TABLE[stats.speed].note ? ` &#183; ${SPEED_TABLE[stats.speed].note}` : ''}`} />
              <GradeSelector value={stats.range} onChange={v => setStats(p => ({ ...p, range: v }))} label="Range"
                infoLine={`${RANGE_TABLE[stats.range].base} &#183; ${RANGE_TABLE[stats.range].greater} greater &#183; ${RANGE_TABLE[stats.range].lesser} lesser`} />
              <GradeSelector value={stats.durability} onChange={v => {
                setStats(p => ({ ...p, durability: v })); setRegularUsed(0); setSpecialUsed(0);
              }} label="Durability"
                infoLine={isDurS
                  ? '&#9888; S-DUR: No vulnerability clock &#8212; alternative win conditions required'
                  : `${vulnSegs}-seg clock &#183; ${regArmorMax} regular &#183; ${specArmorMax} special`} />
              <GradeSelector value={stats.precision} onChange={v => setStats(p => ({ ...p, precision: v }))} label="Precision"
                infoLine={`Partial &#8594; ${PRECISION_TABLE[stats.precision].partial}`} />
              <GradeSelector value={stats.development} onChange={v => setStats(p => ({ ...p, development: v }))} label="Development"
                infoLine={DEV_TABLE[stats.development].split('&#8212;')[0].split('—')[0].trim()} />
            </div>

            {/* Combat Reference */}
            <div style={S.card}>
              <span style={S.lbl}>Combat Reference</span>
              <div style={{ ...S.ref, marginBottom:'8px' }}>
                <div style={{ color:'#f87171', fontWeight:'bold', marginBottom:'4px' }}>
                  POWER {stats.power} &#8212; Base Harm: Level {powerInfo.harm}
                </div>
                <div style={{ color:'#9ca3af' }}>Greater Effect &#8594; Harm +1 &#160;|&#160; Lesser Effect &#8594; Harm &#8722;1</div>
                {(stats.power === 'S' || stats.power === 'A') && (
                  <div style={{ color:'#fbbf24', marginTop:'3px' }}>&#9888; Can force PC position worse by 1 step</div>
                )}
              </div>
              <div style={{ ...S.ref, marginBottom:'8px' }}>
                <div style={{ color:'#60a5fa', fontWeight:'bold', marginBottom:'4px' }}>SPEED {stats.speed} &#8212; {speedInfo.base}</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4px', color:'#9ca3af' }}>
                  <div>Greater: {speedInfo.greater}</div><div>Lesser: {speedInfo.lesser}</div>
                </div>
                <div style={{ color:'#6b7280', marginTop:'2px' }}>Initiative: GM&#8217;s call &#8212; NPCs never roll</div>
              </div>
              <div style={{ ...S.ref, marginBottom:'8px' }}>
                <div style={{ color:'#34d399', fontWeight:'bold', marginBottom:'4px' }}>RANGE {stats.range} &#8212; {rangeInfo.base}</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4px', color:'#9ca3af' }}>
                  <div>Greater: {rangeInfo.greater}</div><div>Lesser: {rangeInfo.lesser}</div>
                </div>
              </div>
              <div style={{ ...S.ref, marginBottom:'8px' }}>
                <div style={{ color:'#e879f9', fontWeight:'bold', marginBottom:'4px' }}>PRECISION {stats.precision} &#8212; Counter-Effects</div>
                <div style={{ color:'#9ca3af' }}>
                  <div>PC partial (4&#8211;5): {precInfo.partial}</div>
                  <div style={{ marginTop:'2px' }}>PC failure (1&#8211;3): {precInfo.failure}</div>
                </div>
              </div>
              <div style={S.ref}>
                <div style={{ color:'#fb923c', fontWeight:'bold', marginBottom:'4px' }}>DEVELOPMENT {stats.development} &#8212; Adaptability</div>
                <div style={{ color:'#9ca3af', lineHeight:'1.5' }}>{devInfo}</div>
              </div>
            </div>

            {/* Abilities */}
            <div style={S.card}>
              <span style={S.lbl}>Stand Abilities</span>
              <div style={{ fontSize:'10px', color:'#6b7280', marginBottom:'8px' }}>Narrative descriptions only &#8212; no mechanical dots</div>
              {abilities.map(ab => (
                <div key={ab.id} style={{ background:'#1a1030', border:'1px solid #2d1f52', borderRadius:'4px', padding:'8px', marginBottom:'6px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', gap:'6px', alignItems:'center', marginBottom:'4px' }}>
                        <input value={ab.name}
                          onChange={e => setAbilities(p => p.map(a => a.id === ab.id ? { ...a, name: e.target.value } : a))}
                          style={{ ...S.inp, fontWeight:'bold', fontSize:'12px' }}
                          placeholder="Ability name" />
                        <select value={ab.type}
                          onChange={e => setAbilities(p => p.map(a => a.id === ab.id ? { ...a, type: e.target.value } : a))}
                          style={{ ...S.sel, fontSize:'10px', padding:'2px 4px' }}>
                          <option value="unique">Unique</option>
                          <option value="standard">Standard</option>
                          <option value="passive">Passive</option>
                        </select>
                      </div>
                      <textarea value={ab.description}
                        onChange={e => setAbilities(p => p.map(a => a.id === ab.id ? { ...a, description: e.target.value } : a))}
                        placeholder="What does this ability do narratively?"
                        style={{ width:'100%', background:'transparent', color:'#d1d5db', border:'none', fontFamily:'monospace', fontSize:'11px', resize:'vertical', outline:'none', minHeight:'40px', boxSizing:'border-box' }} />
                    </div>
                    <button onClick={() => setAbilities(p => p.filter(a => a.id !== ab.id))}
                      aria-label="Remove ability"
                      style={{ color:'#f87171', background:'none', border:'none', cursor:'pointer', fontSize:'15px', marginLeft:'6px', flexShrink:0 }}>&#215;</button>
                  </div>
                </div>
              ))}
              <button onClick={() => setAbilities(p => [...p, { id: Date.now(), name: '', description: '', type: 'unique' }])}
                style={{ ...S.btn, border:'2px dashed #2d1f52', background:'transparent', color:'#6b7280', width:'100%', padding:'6px' }}>
                + Add Ability
              </button>
            </div>
          </div>

          {/* RIGHT: Clocks + Armor */}
          <div>

            {isDurS ? (
              <div style={{ ...S.card, border:'2px solid #16a34a' }}>
                <div style={S.sdur}>
                  <div style={{ fontSize:'14px', fontWeight:'bold', color:'#22c55e', marginBottom:'6px' }}>
                    &#11035; DURABILITY S &#8212; INVINCIBLE TO DIRECT HARM
                  </div>
                  <div style={{ marginBottom:'8px' }}>No Vulnerability Clock. Direct harm cannot defeat this NPC. Create alternative win condition clocks below.</div>
                  <div style={{ color:'#6b7280', fontSize:'10px' }}>Examples: &#8220;Expose the User&#8221; &#183; &#8220;Break Stand Logic&#8221; &#183; &#8220;Destroy the Mechanism&#8221;</div>
                </div>
                <div style={{ marginTop:'12px' }}>
                  <span style={S.lbl}>Armor Charges (S-DUR)</span>
                  <div style={{ display:'flex', gap:'24px', justifyContent:'center', marginTop:'8px' }}>
                    <ArmorTracker label="REGULAR" max={regArmorMax} used={regularUsed} onChange={setRegularUsed} color="#f59e0b" />
                    <ArmorTracker label="SPECIAL" max={specArmorMax} used={specialUsed} onChange={setSpecialUsed} color="#7c3aed" />
                  </div>
                </div>
                <div style={{ marginTop:'16px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
                    <span style={S.lbl}>Alternative Win Conditions</span>
                    <button onClick={addAltClock} style={{ ...S.btn, background:'#166534', color:'#86efac', fontSize:'11px' }}>+ Add Clock</button>
                  </div>
                  {altClocks.length === 0 && (
                    <div style={{ ...S.warn, textAlign:'center' }}>S-DUR NPCs must have at least one alternative win condition clock!</div>
                  )}
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'16px', justifyContent:'center' }}>
                    {altClocks.map(clk => (
                      <div key={clk.id} style={{ textAlign:'center', position:'relative' }}>
                        <ProgressClock size={90} segments={clk.segments} filled={clk.filled}
                          onClick={f => updateAltClock(clk.id, f)} color="#16a34a"
                          label={clk.name} sublabel={`${clk.segments}-segment clock`} />
                        <button onClick={() => deleteAltClock(clk.id)}
                          style={{ position:'absolute', top:'-4px', right:'-4px', color:'#f87171', background:'#1a0000', border:'1px solid #7f1d1d', borderRadius:'50%', width:'16px', height:'16px', cursor:'pointer', fontSize:'10px', padding:0, lineHeight:1 }}>&#215;</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={S.card}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'10px' }}>
                  <span style={S.lbl}>Durability {stats.durability} &#8212; Vulnerability Clock</span>
                  <span style={{ fontSize:'10px', color:'#6b7280' }}>{vulnSegs} segments</span>
                </div>
                <div style={{ display:'flex', gap:'20px', alignItems:'flex-start', flexWrap:'wrap' }}>
                  <div style={{ flex:'0 0 auto' }}>
                    {(() => {
                      const totalTicks  = conflictClocks.reduce((s, c) => s + c.filled, 0);
                      const vulnFilled  = Math.min(totalTicks, vulnSegs);
                      const isDefeated  = vulnFilled >= vulnSegs;
                      return (
                        <div style={{ textAlign:'center' }}>
                          {isDefeated && <div style={{ ...S.warn, marginBottom:'6px', textAlign:'center', fontWeight:'bold' }}>&#9760; DEFEATED</div>}
                          <ProgressClock size={100} segments={vulnSegs} filled={vulnFilled}
                            color={isDefeated ? '#991b1b' : '#dc2626'}
                            label="Vulnerability" sublabel={`${vulnFilled}/${vulnSegs}`} />
                        </div>
                      );
                    })()}
                  </div>
                  <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'12px' }}>
                    <div style={{ fontSize:'10px', color:'#9ca3af' }}>Spend armor charges <strong>before</strong> filling clocks.</div>
                    <ArmorTracker label="REGULAR ARMOR" max={regArmorMax} used={regularUsed} onChange={setRegularUsed} color="#f59e0b" />
                    <ArmorTracker label="SPECIAL ARMOR" max={specArmorMax} used={specialUsed} onChange={setSpecialUsed} color="#7c3aed" />
                    <div style={{ fontSize:'10px', color:'#4b5563', lineHeight:'1.5' }}>
                      Regular: reduce harm by 1 level<br />
                      Special: completely negate harm
                    </div>
                    <button onClick={() => { setRegularUsed(0); setSpecialUsed(0); }}
                      style={{ ...S.btn, background:'#1f2937', color:'#9ca3af', fontSize:'10px', alignSelf:'flex-start' }}>
                      Reset Armor
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Conflict Clocks */}
            <div style={S.card}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
                <div>
                  <span style={S.lbl}>Conflict Clocks</span>
                  <div style={{ fontSize:'10px', color:'#6b7280', marginTop:'2px' }}>
                    PCs roll action ratings to fill these. Limited=1 tick, Standard=2, Greater=3.
                  </div>
                </div>
                <button onClick={addConflictClock} style={{ ...S.btn, background:'#4c1d95', color:'#e9d5ff', fontSize:'11px' }}>+ Clock</button>
              </div>
              {conflictClocks.length === 0 && (
                <div style={{ color:'#6b7280', fontSize:'11px', textAlign:'center', padding:'12px' }}>
                  No clocks yet &#8212; add one to start tracking the conflict.
                </div>
              )}
              <div style={{ display:'flex', flexWrap:'wrap', gap:'16px', justifyContent: conflictClocks.length <= 2 ? 'center' : 'flex-start' }}>
                {conflictClocks.map(clk => {
                  const isComplete = clk.filled >= clk.segments;
                  return (
                    <div key={clk.id} style={{ textAlign:'center', position:'relative',
                      background: isComplete ? '#0a1a0a' : 'transparent',
                      border: isComplete ? '1px solid #16a34a' : 'none',
                      borderRadius:'6px', padding: isComplete ? '6px' : '0' }}>
                      {isComplete && <div style={{ fontSize:'10px', color:'#22c55e', fontWeight:'bold', marginBottom:'4px' }}>&#10003; COMPLETE</div>}
                      <ProgressClock size={90} segments={clk.segments} filled={clk.filled}
                        onClick={f => updateConflictClock(clk.id, f)}
                        color={isComplete ? '#16a34a' : '#7c3aed'}
                        label={clk.name} sublabel={`${clk.segments}-seg`} />
                      <div style={{ marginTop:'4px', display:'flex', gap:'4px', justifyContent:'center' }}>
                        <button onClick={() => {
                          const newName = prompt('Rename clock:', clk.name);
                          if (newName) setConflictClocks(p => p.map(c => c.id === clk.id ? { ...c, name: newName } : c));
                        }} style={{ color:'#6b7280', background:'none', border:'none', cursor:'pointer', fontSize:'10px' }}>rename</button>
                        <button onClick={() => deleteConflictClock(clk.id)}
                          style={{ color:'#f87171', background:'none', border:'none', cursor:'pointer', fontSize:'10px' }}>delete</button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop:'12px', display:'flex', gap:'6px', justifyContent:'center' }}>
                {[['LIMITED','1 tick','#6b7280'],['STANDARD','2 ticks','#7c3aed'],['GREATER','3 ticks','#16a34a']].map(([label, ticks, color]) => (
                  <div key={label} style={{ background:'#0a0a14', border:`1px solid ${color}`, borderRadius:'4px', padding:'4px 8px', textAlign:'center' }}>
                    <div style={{ fontSize:'10px', color, fontWeight:'bold' }}>{label}</div>
                    <div style={{ fontSize:'11px', color:'#d1d5db' }}>{ticks}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Level Differential */}
            <div style={S.card}>
              <span style={S.lbl}>Level Differential</span>
              <div style={{ fontSize:'11px', lineHeight:'1.8', color:'#9ca3af' }}>
                <div><span style={{ color:'#34d399' }}>PC Level &gt; NPC Level:</span> +1 Position OR +1 Effect (GM chooses)</div>
                <div><span style={{ color:'#f87171' }}>NPC Level &gt; PC Level:</span> &#8722;1 Position OR &#8722;1 Effect (GM chooses)</div>
                <div><span style={{ color:'#dc2626' }}>NPC Level 3+ higher:</span> Both worsen position AND reduce effect</div>
              </div>
              <div style={{ marginTop:'8px', padding:'6px', background:'#0a0a14', borderRadius:'4px', fontSize:'11px', color:'#6b7280' }}>
                This NPC is Level <strong style={{ color: level >= 7 ? '#f87171' : level >= 4 ? '#fbbf24' : '#34d399' }}>{level}</strong> ({totalSpentXP} XP).
                Starting PCs are Level 1 (~95 XP).
              </div>
            </div>

            {/* GM Notes */}
            <div style={S.card}>
              <span style={S.lbl}>GM Notes</span>
              <textarea value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Tactics, motivations, encounter context, rematch notes&#8230;"
                style={{ width:'100%', height:'120px', background:'#0a0a14', color:'#d1d5db', border:'1px solid #2d1f52', padding:'8px', fontFamily:'monospace', fontSize:'12px', resize:'vertical', boxSizing:'border-box', outline:'none' }} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default NPCSheet;
