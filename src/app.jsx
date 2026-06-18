const { useState, useEffect, useRef, useReducer, useCallback } = React;

/* =====================================================================
   ICONS  (Lucide-style, inlined — see design system › Iconography)
   ===================================================================== */
const ICONS = {
  leaf:'<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/>',
  camera:'<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"/><circle cx="12" cy="13" r="3"/>',
  scan:'<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/>',
  search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  droplet:'<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7Z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  home:'<path d="M3 9.5 12 3l9 6.5"/><path d="M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9"/><path d="M9 20v-6h6v6"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  settings:'<path d="M12.2 2h-.4a2 2 0 0 0-2 2 1.7 1.7 0 0 1-2.6 1.1 2 2 0 0 0-2.7.7l-.2.4a2 2 0 0 0 .7 2.7A1.7 1.7 0 0 1 5 12a1.7 1.7 0 0 1-1 1.6 2 2 0 0 0-.7 2.7l.2.4a2 2 0 0 0 2.7.7A1.7 1.7 0 0 1 9 18.9a2 2 0 0 0 2 2h.4a2 2 0 0 0 2-2 1.7 1.7 0 0 1 2.6-1.1 2 2 0 0 0 2.7-.7l.2-.4a2 2 0 0 0-.7-2.7A1.7 1.7 0 0 1 19 12a1.7 1.7 0 0 1 1-1.6 2 2 0 0 0 .7-2.7l-.2-.4a2 2 0 0 0-2.7-.7A1.7 1.7 0 0 1 15 4a2 2 0 0 0-2-2Z"/><circle cx="12" cy="12" r="3"/>',
  sparkles:'<path d="M12 3l1.9 4.6L18.5 9l-4.6 1.4L12 15l-1.9-4.6L5.5 9l4.6-1.4Z"/><path d="M19 14l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8Z"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  alert:'<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  thermometer:'<path d="M14 14.76V5a2 2 0 0 0-4 0v9.76a4 4 0 1 0 4 0Z"/>',
  scissors:'<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12"/>',
  arrowLeft:'<path d="m12 19-7-7 7-7M19 12H5"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.6-3.6a2 2 0 0 0-2.8 0L6 20"/>',
  heart:'<path d="M19 14c1.5-1.5 3-3.4 3-5.5A5.5 5.5 0 0 0 12 5 5.5 5.5 0 0 0 2 8.5c0 2.1 1.5 4 3 5.5l7 7Z"/>',
  trendUp:'<path d="M22 7 13.5 15.5l-5-5L2 17"/><path d="M16 7h6v6"/>',
  trash:'<path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  refresh:'<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/>',
  pencil:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  wind:'<path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/>',
};
function Icon({ name, size = 22, stroke = 'currentColor', strokeWidth = 1.75, style = {} }) {
  return React.createElement('svg', {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round',
    style: { flex: 'none', ...style },
    dangerouslySetInnerHTML: { __html: ICONS[name] || '' },
  });
}

/* =====================================================================
   DESIGN-SYSTEM PRIMITIVES  (Button, Badge, Card, Avatar, Input, Switch)
   ===================================================================== */
const BTN_SIZES = { sm:{padding:'8px 14px',fontSize:13,gap:6,radius:10}, md:{padding:'11px 20px',fontSize:15,gap:8,radius:12}, lg:{padding:'15px 28px',fontSize:17,gap:10,radius:14} };
const BTN_VARIANTS = {
  primary:{background:'var(--primary)',color:'var(--on-primary)',border:'1px solid transparent',boxShadow:'var(--shadow-sm)',hoverBg:'var(--primary-strong)'},
  bloom:{background:'var(--accent)',color:'var(--on-accent)',border:'1px solid transparent',boxShadow:'var(--shadow-bloom)',hoverBg:'var(--accent-strong)'},
  secondary:{background:'var(--surface-card)',color:'var(--text-primary)',border:'1px solid var(--border-default)',boxShadow:'var(--shadow-xs)',hoverBg:'var(--surface-sunken)'},
  ghost:{background:'transparent',color:'var(--text-accent)',border:'1px solid transparent',boxShadow:'none',hoverBg:'var(--surface-accent-soft)'},
  danger:{background:'transparent',color:'var(--status-critical)',border:'1px solid color-mix(in srgb,var(--status-critical) 35%,transparent)',boxShadow:'none',hoverBg:'#F6E0DB'},
};
function Button({ children, variant='primary', size='md', icon=null, iconRight=false, fullWidth=false, disabled=false, onClick, type='button', style={}, ...rest }) {
  const s = BTN_SIZES[size]||BTN_SIZES.md, v = BTN_VARIANTS[variant]||BTN_VARIANTS.primary;
  const [hover,setHover] = useState(false);
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{ display:'inline-flex',alignItems:'center',justifyContent:'center',flexDirection:iconRight?'row-reverse':'row',
        gap:s.gap,width:fullWidth?'100%':'auto',padding:s.padding,fontSize:s.fontSize,fontFamily:'var(--font-sans)',fontWeight:600,
        lineHeight:1,letterSpacing:'-0.01em',borderRadius:s.radius,cursor:disabled?'not-allowed':'pointer',
        background:hover&&!disabled?v.hoverBg:v.background,color:v.color,border:v.border,boxShadow:v.boxShadow,opacity:disabled?0.45:1,
        transform:hover&&!disabled?'translateY(-1px)':'none',transition:'all var(--dur-fast) var(--ease-soft)',...style }}
      {...rest}>
      {icon && <span style={{display:'inline-flex',width:'1.1em',height:'1.1em'}}>{icon}</span>}
      {children}
    </button>
  );
}
const BADGE_TONES = {
  healthy:{bg:'var(--green-100)',fg:'var(--green-700)',dot:'var(--status-healthy)'},
  attention:{bg:'var(--bloom-100)',fg:'var(--bloom-700)',dot:'var(--status-attention)'},
  critical:{bg:'#F6E0DB',fg:'#8E3320',dot:'var(--status-critical)'},
  info:{bg:'#E1ECF2',fg:'#2F5269',dot:'var(--status-info)'},
  neutral:{bg:'var(--surface-sunken)',fg:'var(--text-secondary)',dot:'var(--ink-400)'},
};
function Badge({ children, tone='neutral', dot=false, style={}, ...rest }) {
  const t = BADGE_TONES[tone]||BADGE_TONES.neutral;
  return (
    <span style={{display:'inline-flex',alignItems:'center',gap:6,padding:dot?'4px 11px 4px 9px':'4px 11px',
      fontFamily:'var(--font-sans)',fontSize:12,fontWeight:600,letterSpacing:'0.01em',lineHeight:1.3,
      background:t.bg,color:t.fg,borderRadius:'var(--radius-pill)',...style}} {...rest}>
      {dot && <span style={{width:6,height:6,borderRadius:'50%',background:t.dot,flex:'none'}} />}
      {children}
    </span>
  );
}
function Card({ children, elevation='sm', padding=24, interactive=false, inverse=false, style={}, onClick, ...rest }) {
  const [hover,setHover] = useState(false);
  const map = {none:'none',xs:'var(--shadow-xs)',sm:'var(--shadow-sm)',md:'var(--shadow-md)',lg:'var(--shadow-lg)'};
  const base = map[elevation]||map.sm;
  return (
    <div onClick={onClick} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{ background:inverse?'var(--surface-inverse)':'var(--surface-card)',color:inverse?'var(--text-on-dark)':'var(--text-primary)',
        border:inverse?'1px solid transparent':'1px solid var(--border-subtle)',borderRadius:'var(--radius-lg)',padding,
        boxShadow:interactive&&hover?'var(--shadow-md)':base,transform:interactive&&hover?'translateY(-2px)':'none',
        transition:'all var(--dur-base) var(--ease-organic)',cursor:interactive?'pointer':'default',...style }} {...rest}>
      {children}
    </div>
  );
}
const AV_SIZES = { sm:28, md:40, lg:56, xl:72 };
function Avatar({ src, name='', size='md', ring=false, style={}, ...rest }) {
  const dim = typeof size==='number'?size:(AV_SIZES[size]||AV_SIZES.md);
  const initials = name.trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase();
  return (
    <div style={{width:dim,height:dim,borderRadius:'50%',flex:'none',display:'inline-flex',alignItems:'center',justifyContent:'center',
      overflow:'hidden',background:'var(--green-100)',color:'var(--green-700)',fontFamily:'var(--font-sans)',fontWeight:600,fontSize:dim*0.38,
      border:ring?'2px solid var(--surface-card)':'none',boxShadow:ring?'0 0 0 2px var(--green-300)':'none',...style}} {...rest}>
      {src ? <img src={src} alt={name} style={{width:'100%',height:'100%',objectFit:'cover'}} /> : (initials||'·')}
    </div>
  );
}
function Input({ label, icon=null, hint, error, type='text', value, onChange, placeholder, disabled=false, style={}, ...rest }) {
  const [focus,setFocus] = useState(false);
  const borderColor = error ? 'var(--status-critical)' : focus ? 'var(--border-focus)' : 'var(--border-default)';
  return (
    <label style={{display:'flex',flexDirection:'column',gap:6,fontFamily:'var(--font-sans)'}}>
      {label && <span style={{fontSize:13,fontWeight:600,color:'var(--text-primary)'}}>{label}</span>}
      <span style={{display:'flex',alignItems:'center',gap:9,padding:'11px 14px',background:disabled?'var(--surface-sunken)':'var(--surface-card)',
        border:`1.5px solid ${borderColor}`,borderRadius:'var(--radius-md)',boxShadow:focus?'0 0 0 3px var(--ring-focus)':'var(--shadow-inset)',
        transition:'all var(--dur-fast) var(--ease-soft)',opacity:disabled?0.6:1,...style}}>
        {icon && <span style={{display:'inline-flex',color:'var(--text-muted)',width:18,height:18}}>{icon}</span>}
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
          onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
          style={{flex:1,border:'none',outline:'none',background:'transparent',fontFamily:'var(--font-sans)',fontSize:15,color:'var(--text-primary)',minWidth:0}} {...rest} />
      </span>
      {(hint||error) && <span style={{fontSize:12,color:error?'var(--status-critical)':'var(--text-secondary)'}}>{error||hint}</span>}
    </label>
  );
}
function Switch({ checked=false, onChange, disabled=false, label, style={}, ...rest }) {
  const toggle = () => { if(!disabled && onChange) onChange(!checked); };
  const track = (
    <span role="switch" aria-checked={checked} tabIndex={disabled?-1:0} onClick={toggle}
      onKeyDown={(e)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}}}
      style={{width:44,height:26,flex:'none',borderRadius:'var(--radius-pill)',background:checked?'var(--primary)':'var(--bone-300)',
        boxShadow:'var(--shadow-inset)',cursor:disabled?'not-allowed':'pointer',opacity:disabled?0.5:1,position:'relative',
        transition:'background var(--dur-base) var(--ease-soft)',...style}} {...rest}>
      <span style={{position:'absolute',top:3,left:checked?21:3,width:20,height:20,borderRadius:'50%',background:'var(--warm-white)',
        boxShadow:'var(--shadow-sm)',transition:'left var(--dur-base) var(--ease-bounce)'}} />
    </span>
  );
  if(!label) return track;
  return (
    <label style={{display:'inline-flex',alignItems:'center',gap:10,fontFamily:'var(--font-sans)',fontSize:15,color:'var(--text-primary)',cursor:disabled?'not-allowed':'pointer'}}>
      {track}{label}
    </label>
  );
}

/* =====================================================================
   DOMAIN HELPERS
   ===================================================================== */
const STATUS_COLOR = { healthy:'var(--status-healthy)', attention:'var(--status-attention)', critical:'var(--status-critical)', info:'var(--status-info)' };
const U = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=720&q=80`;
const DAY = 86400000;
const now = () => Date.now();
const days = (n) => now() + n*DAY;
const todayKey = () => new Date().toISOString().slice(0,10);
const uid = () => 'p' + Math.random().toString(36).slice(2,9);

function waterLabel(ts){ const d = Math.round((ts-now())/DAY); if(d<0) return 'overdue'; if(d===0) return 'today'; if(d===1) return 'in 1 day'; return 'in '+d+' days'; }
function isDue(ts){ return ts - now() <= 12*3600*1000; }
function statusFromHealth(h, pest){ if(pest) return 'critical'; if(h>=85) return 'healthy'; if(h>=65) return 'attention'; return 'critical'; }
function labelFromHealth(h, pest){ if(pest) return 'Pest detected'; if(h>=85) return 'Thriving'; if(h>=65) return 'Needs care'; return 'Needs help'; }
// derive a fresh status snapshot for rendering
function view(p){ return { ...p, status: statusFromHealth(p.health, p.pest), statusLabel: p.statusLabel || labelFromHealth(p.health, p.pest), water: waterLabel(p.nextWaterAt) }; }

/* Species the "AI" can recognise (mock identification catalog). */
const SPECIES = [
  { key:'monstera', name:'Monstera Deliciosa', common:'Swiss Cheese Plant', photo:U('photo-1614594975525-e45190c55d0b'), light:'Bright indirect', interval:7,
    plan:[ {icon:'droplet',title:'Let the soil dry out',detail:'Hold off watering for 7–10 days, until the top 2 inches are dry.'},
           {icon:'sun',title:'Move 3 ft from an east window',detail:'Bright, indirect morning light will boost fenestration.'},
           {icon:'scissors',title:'Trim any yellow leaves',detail:'Cut at the base to redirect energy to new growth.'},
           {icon:'thermometer',title:'Keep it 65–85°F',detail:'Avoid cold drafts and heating vents this season.'} ] },
  { key:'fiddle', name:'Fiddle Leaf Fig', common:'Ficus lyrata', photo:U('photo-1545241047-6083a3684587'), light:'Bright indirect', interval:6,
    plan:[ {icon:'droplet',title:'Water when top inch is dry',detail:'Roughly weekly — fiddles hate soggy roots.'},
           {icon:'sun',title:'Give it steady bright light',detail:'A south or east window, rotated weekly for even growth.'},
           {icon:'wind',title:'Avoid drafts',detail:'Sudden temperature swings cause leaf drop.'},
           {icon:'leaf',title:'Dust the leaves',detail:'Wipe monthly so it can photosynthesise.'} ] },
  { key:'snake', name:'Snake Plant', common:'Dracaena trifasciata', photo:U('photo-1593482892290-f54927ae1bb6'), light:'Low to bright', interval:14,
    plan:[ {icon:'droplet',title:'Water sparingly',detail:'Every 2–3 weeks; let the soil dry fully between.'},
           {icon:'sun',title:'Tolerates low light',detail:'Brighter light speeds growth but it is forgiving.'},
           {icon:'thermometer',title:'Keep it above 50°F',detail:'Sensitive to cold, otherwise nearly indestructible.'} ] },
  { key:'pothos', name:'Golden Pothos', common:'Epipremnum aureum', photo:U('photo-1602923668104-8f9e03e77e62'), light:'Medium indirect', interval:6,
    plan:[ {icon:'droplet',title:'Water when leaves soften',detail:'About weekly; very drought tolerant.'},
           {icon:'alert',title:'Check for pests',detail:'Wipe leaves and inspect undersides for mealybugs.'},
           {icon:'scissors',title:'Pinch to keep it full',detail:'Trim leggy vines to encourage bushy growth.'} ] },
  { key:'zz', name:'ZZ Plant', common:'Zamioculcas zamiifolia', photo:U('photo-1632207171349-9d6c8d5fae0f'), light:'Low to medium', interval:12,
    plan:[ {icon:'droplet',title:'Water every 2–3 weeks',detail:'Its rhizomes store water — when in doubt, wait.'},
           {icon:'sun',title:'Happy in low light',detail:'Avoid direct sun, which scorches the glossy leaves.'} ] },
  { key:'calathea', name:'Calathea Orbifolia', common:'Prayer Plant', photo:U('photo-1620127252536-03bdfcf6d5ea'), light:'Medium indirect', interval:4,
    plan:[ {icon:'droplet',title:'Keep soil lightly moist',detail:'Use filtered or rain water — sensitive to tap minerals.'},
           {icon:'wind',title:'Raise the humidity',detail:'Mist often or group with other tropicals.'},
           {icon:'sun',title:'Medium indirect light',detail:'Too much sun fades the silvery patterning.'} ] },
];

const TIPS = [
  'Group your tropicals together — they’ll raise the humidity for each other.',
  'Rotate each plant a quarter turn weekly so it grows evenly toward the light.',
  'Most houseplants die from love, not neglect — when unsure, wait a day to water.',
  'Dust the leaves monthly; clean leaves photosynthesise far more efficiently.',
  'Bottom-water thirsty plants for 20 minutes to encourage deeper roots.',
];

/* =====================================================================
   STORE  (localStorage-backed, observable)
   ===================================================================== */
const KEY = 'plantbloom_state_v1';
function seed(){
  return {
    user:{ name:'Ava Reed' },
    settings:{ waterReminders:true, monthlyReport:true, proInsights:false },
    completed:{ date: todayKey(), ids: [] },
    plants:[
      { id:'monstera', name:'Monstera Deliciosa', nickname:'Monty', room:'Living room', photo:U('photo-1614594975525-e45190c55d0b'), health:91, statusLabel:'Thriving', nextWaterAt:days(3), intervalDays:7, light:'Bright indirect', common:'Swiss Cheese Plant', addedAt:now()-40*DAY },
      { id:'fiddle', name:'Fiddle Leaf Fig', nickname:'Figaro', room:'Living room', photo:U('photo-1545241047-6083a3684587'), health:68, statusLabel:'Needs water', nextWaterAt:days(0), intervalDays:6, light:'Bright indirect', common:'Ficus lyrata', addedAt:now()-30*DAY },
      { id:'snake', name:'Snake Plant', nickname:'Sansa', room:'Bedroom', photo:U('photo-1593482892290-f54927ae1bb6'), health:95, statusLabel:'Thriving', nextWaterAt:days(9), intervalDays:14, light:'Low to bright', common:'Dracaena trifasciata', addedAt:now()-90*DAY },
      { id:'pothos', name:'Golden Pothos', nickname:'Goldie', room:'Kitchen', photo:U('photo-1602923668104-8f9e03e77e62'), health:54, statusLabel:'Pest detected', pest:true, nextWaterAt:days(2), intervalDays:6, light:'Medium indirect', common:'Epipremnum aureum', addedAt:now()-20*DAY },
      { id:'zz', name:'ZZ Plant', nickname:'Zizi', room:'Office', photo:U('photo-1632207171349-9d6c8d5fae0f'), health:88, statusLabel:'Thriving', nextWaterAt:days(6), intervalDays:12, light:'Low to medium', common:'Zamioculcas zamiifolia', addedAt:now()-60*DAY },
      { id:'calathea', name:'Calathea Orbifolia', nickname:'Cala', room:'Bedroom', photo:U('photo-1620127252536-03bdfcf6d5ea'), health:73, statusLabel:'Repot soon', nextWaterAt:days(1), intervalDays:4, light:'Medium indirect', common:'Prayer Plant', addedAt:now()-15*DAY },
    ],
    pendingDiagnosis: null,
  };
}
const Store = (function(){
  let state;
  try { const raw = JSON.parse(localStorage.getItem(KEY)); state = (raw && Array.isArray(raw.plants)) ? raw : seed(); }
  catch(e){ state = seed(); }
  const listeners = new Set();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch(e){} };
  return {
    get: () => state,
    set: (updater) => { state = typeof updater==='function' ? updater(state) : updater; save(); listeners.forEach(l=>l()); },
    subscribe: (l) => { listeners.add(l); return () => listeners.delete(l); },
    reset: () => { state = seed(); save(); listeners.forEach(l=>l()); },
  };
})();
function useStore(){ const [,force] = useReducer(x=>x+1, 0); useEffect(()=>Store.subscribe(force), []); return Store.get(); }

/* store actions */
function waterPlant(id){
  Store.set(s=>({ ...s, plants: s.plants.map(p => p.id===id
    ? { ...p, nextWaterAt: days(p.intervalDays||7), health: Math.min(100, p.health + (p.health<85?7:1)),
        statusLabel: (/water|thirst/i.test(p.statusLabel)) ? 'Thriving' : p.statusLabel } : p) }));
}
function treatPlant(id){
  Store.set(s=>({ ...s, plants: s.plants.map(p => p.id===id
    ? { ...p, pest:false, health: Math.max(p.health, 72), statusLabel:'Recovering' } : p) }));
}
function removePlant(id){ Store.set(s=>({ ...s, plants: s.plants.filter(p=>p.id!==id) })); }
function renamePlant(id, nickname){ Store.set(s=>({ ...s, plants: s.plants.map(p=>p.id===id?{...p,nickname}:p) })); }
function addPlant(plant){ Store.set(s=>({ ...s, plants:[plant, ...s.plants] })); }
function setSetting(key, val){ Store.set(s=>({ ...s, settings:{...s.settings,[key]:val} })); }
function setUserName(name){ Store.set(s=>({ ...s, user:{...s.user, name} })); }
function setPendingDiagnosis(d){ Store.set(s=>({ ...s, pendingDiagnosis:d })); }

function completeTask(task){
  Store.set(s=>{
    const t = todayKey();
    const comp = s.completed.date===t ? {...s.completed} : { date:t, ids:[] };
    if(!comp.ids.includes(task.id)) comp.ids = [...comp.ids, task.id];
    return { ...s, completed: comp };
  });
  if(task.kind==='water') waterPlant(task.plantId);
  if(task.kind==='pest') treatPlant(task.plantId);
}
function uncompleteTask(task){
  Store.set(s=>{
    const t = todayKey();
    if(s.completed.date!==t) return s;
    return { ...s, completed:{ ...s.completed, ids: s.completed.ids.filter(x=>x!==task.id) } };
  });
}
function computeTasks(s){
  const t = todayKey();
  const done = s.completed.date===t ? s.completed.ids : [];
  const map = {};
  s.plants.forEach(p=>{
    const nm = p.nickname || p.name;
    if(isDue(p.nextWaterAt)){ const id=p.id+':water'; map[id]={ id, plantId:p.id, kind:'water', action:'Water '+nm, plant:p.name, icon:'droplet', tone: (p.nextWaterAt-now()<0)?'critical':'attention', done: done.includes(id) }; }
    if(p.pest){ const id=p.id+':pest'; map[id]={ id, plantId:p.id, kind:'pest', action:'Treat '+nm+' for pests', plant:p.name, icon:'alert', tone:'critical', done: done.includes(id) }; }
  });
  done.forEach(id=>{ if(!map[id]){ const p=s.plants.find(x=>id.startsWith(x.id+':')); if(p){ const nm=p.nickname||p.name; const kind=id.endsWith(':pest')?'pest':'water'; map[id]={ id, plantId:p.id, kind, action:(kind==='pest'?'Treat '+nm+' for pests':'Water '+nm), plant:p.name, icon:kind==='pest'?'alert':'droplet', tone:'healthy', done:true }; } } });
  return Object.values(map);
}

/* =====================================================================
   ROUTER  (hash based)
   ===================================================================== */
function useRoute(){
  const parse = () => { const h = (location.hash||'#/garden').replace(/^#/,''); return h || '/garden'; };
  const [path,setPath] = useState(parse());
  useEffect(()=>{ const on=()=>setPath(parse()); window.addEventListener('hashchange',on); return ()=>window.removeEventListener('hashchange',on); },[]);
  return path;
}
function navigate(to){ location.hash = '#'+to; }

/* =====================================================================
   SHARED PIECES
   ===================================================================== */
function HealthRing({ value=80, size=56, stroke=5, status='healthy', showLabel=true }) {
  const r=(size-stroke)/2, c=2*Math.PI*r, off=c*(1-value/100);
  const color = STATUS_COLOR[status]||STATUS_COLOR.healthy;
  return (
    <div style={{position:'relative',width:size,height:size,flex:'none'}}>
      <svg width={size} height={size} style={{transform:'rotate(-90deg)'}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bone-200)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" style={{transition:'stroke-dashoffset 900ms var(--ease-organic)'}} />
      </svg>
      {showLabel && <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',lineHeight:1}}>
        <span style={{fontFamily:'var(--font-mono)',fontSize:size*0.26,fontWeight:500,color:'var(--text-primary)'}}>{value}</span>
      </div>}
    </div>
  );
}
function PlantCard({ plant, onClick }) {
  const p = view(plant);
  return (
    <Card interactive padding={0} onClick={onClick} style={{overflow:'hidden'}}>
      <div style={{position:'relative',height:168,background:'var(--green-100)'}}>
        <img src={p.photo} alt={p.name} loading="lazy" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} />
        <div style={{position:'absolute',top:12,left:12}}><Badge tone={p.status} dot>{p.statusLabel}</Badge></div>
      </div>
      <div style={{padding:'16px 18px',display:'flex',alignItems:'center',gap:12}}>
        <div style={{minWidth:0,flex:1}}>
          <div style={{fontFamily:'var(--font-display)',fontSize:18,fontWeight:500,color:'var(--text-primary)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{p.nickname || p.name}</div>
          <div style={{fontSize:13,color:'var(--text-secondary)',display:'flex',alignItems:'center',gap:8,marginTop:3}}>
            <span>{p.room}</span><span style={{color:'var(--border-default)'}}>·</span>
            <span style={{display:'inline-flex',alignItems:'center',gap:4}}><Icon name="droplet" size={13} stroke="var(--status-info)" /> {p.water}</span>
          </div>
        </div>
        <HealthRing value={p.health} status={p.status} size={46} stroke={4} />
      </div>
    </Card>
  );
}
function SectionHeading({ children, action }) {
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
      <h2 style={{fontSize:13,fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'var(--text-secondary)',fontFamily:'var(--font-sans)'}}>{children}</h2>
      {action}
    </div>
  );
}
function EmptyState({ icon='leaf', title, body, cta }) {
  return (
    <Card padding={48} style={{textAlign:'center'}}>
      <div style={{width:72,height:72,borderRadius:'50%',background:'var(--surface-accent-soft)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 18px'}}>
        <Icon name={icon} size={32} stroke="var(--green-600)" />
      </div>
      <h3 style={{fontSize:22,marginBottom:6}}>{title}</h3>
      <p style={{color:'var(--text-secondary)',maxWidth:360,margin:'0 auto 18px'}}>{body}</p>
      {cta}
    </Card>
  );
}

/* =====================================================================
   SIDEBAR
   ===================================================================== */
function Sidebar({ path }) {
  const s = useStore();
  const plantsCount = s.plants.length;
  const items = [
    { key:'/garden', icon:'home', label:'My Garden' },
    { key:'/scan', icon:'scan', label:'Identify' },
    { key:'/library', icon:'grid', label:'Library' },
  ];
  const isActive = (k) => path===k || (k==='/garden' && path==='/');
  return (
    <aside className="pb-sidebar" style={{width:248,flex:'none',height:'100%',boxSizing:'border-box',background:'var(--surface-card)',borderRight:'1px solid var(--border-subtle)',display:'flex',flexDirection:'column',padding:'26px 18px'}}>
      <div className="pb-logo" style={{display:'flex',alignItems:'center',padding:'0 8px 4px',cursor:'pointer'}} onClick={()=>navigate('/garden')}>
        <img src="assets/logo-full.svg" width="160" alt="Plant Bloom" />
      </div>
      <button className="pb-scanbtn" onClick={()=>navigate('/scan')} style={{display:'flex',alignItems:'center',gap:10,width:'100%',marginTop:26,padding:'12px 16px',borderRadius:'var(--radius-md)',border:'none',cursor:'pointer',background:'var(--accent)',color:'var(--on-accent)',boxShadow:'var(--shadow-bloom)',fontFamily:'var(--font-sans)',fontSize:15,fontWeight:600}}>
        <Icon name="camera" size={20} /> Scan a plant
      </button>
      <nav className="pb-navwrap" style={{display:'flex',flexDirection:'column',gap:4,marginTop:26}}>
        {items.map(it=>{ const active=isActive(it.key); return (
          <button key={it.key} onClick={()=>navigate(it.key)} style={{display:'flex',alignItems:'center',gap:12,width:'100%',padding:'11px 14px',borderRadius:'var(--radius-md)',border:'none',cursor:'pointer',background:active?'var(--surface-accent-soft)':'transparent',color:active?'var(--text-accent)':'var(--text-secondary)',fontFamily:'var(--font-sans)',fontSize:15,fontWeight:active?600:500,textAlign:'left',transition:'all 140ms ease'}}>
            <Icon name={it.icon} size={20} /> <span className="pb-navlabel">{it.label}</span>
          </button>
        ); })}
      </nav>
      <div className="pb-foot" style={{marginTop:'auto',display:'flex',flexDirection:'column',gap:4}}>
        <button className="pb-settings" onClick={()=>navigate('/settings')} style={{display:'flex',alignItems:'center',gap:12,width:'100%',padding:'11px 14px',borderRadius:'var(--radius-md)',border:'none',cursor:'pointer',background:path==='/settings'?'var(--surface-accent-soft)':'transparent',color:path==='/settings'?'var(--text-accent)':'var(--text-secondary)',fontFamily:'var(--font-sans)',fontSize:15,fontWeight:path==='/settings'?600:500,textAlign:'left'}}>
          <Icon name="settings" size={20} /> <span className="pb-navlabel">Settings</span>
        </button>
        <div className="pb-userrow" style={{display:'flex',alignItems:'center',gap:11,padding:'10px 8px',marginTop:6,borderTop:'1px solid var(--border-subtle)'}}>
          <Avatar name={s.user.name} size="md" />
          <div className="pb-usermeta" style={{minWidth:0}}>
            <div style={{fontSize:14,fontWeight:600,color:'var(--text-primary)'}}>{s.user.name}</div>
            <div style={{fontSize:12,color:'var(--text-muted)'}}>{plantsCount} plant{plantsCount===1?'':'s'} · {s.settings.proInsights?'Pro':'Free'}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* =====================================================================
   GARDEN (dashboard)
   ===================================================================== */
function GardenView() {
  const s = useStore();
  const tasks = computeTasks(s);
  const done = tasks.filter(t=>t.done).length;
  const plants = s.plants;
  const avgHealth = plants.length ? Math.round(plants.reduce((a,p)=>a+p.health,0)/plants.length) : 0;
  const needAttention = plants.filter(p=>statusFromHealth(p.health,p.pest)!=='healthy').length;
  const healthWord = avgHealth>=85?'Excellent':avgHealth>=70?'Good':avgHealth>=55?'Fair':'Needs care';
  const tip = TIPS[ new Date().getDate() % TIPS.length ];
  const dateStr = new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});

  return (
    <div className="pb-page" style={{maxWidth:1080,margin:'0 auto',padding:'40px 48px 64px'}}>
      <div className="pb-header" style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:24,flexWrap:'wrap'}}>
        <div>
          <div className="pb-overline" style={{marginBottom:8}}>{dateStr}</div>
          <h1 style={{fontSize:38}}>Good {greeting()}, {s.user.name.split(' ')[0]}</h1>
          <p style={{color:'var(--text-secondary)',fontSize:16,marginTop:8}}>
            {plants.length===0 ? 'Your garden is empty — scan a plant to begin.' : needAttention===0
              ? <>Your garden is <span style={{color:'var(--text-accent)',fontWeight:600}}>thriving</span> — nothing needs attention today.</>
              : <>Your garden is <span style={{color:'var(--text-accent)',fontWeight:600}}>mostly thriving</span> — {needAttention} plant{needAttention===1?'':'s'} need{needAttention===1?'s':''} attention today.</>}
          </p>
        </div>
        <Button className="pb-cta" variant="bloom" icon={<Icon name="camera" size={18} />} onClick={()=>navigate('/scan')}>Scan a plant</Button>
      </div>

      <div className="pb-grid-3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginTop:28}}>
        <Card padding={20} style={{display:'flex',alignItems:'center',gap:16}}>
          <HealthRing value={avgHealth} status={avgHealth>=85?'healthy':avgHealth>=65?'attention':'critical'} size={58} />
          <div><div style={{fontSize:13,color:'var(--text-secondary)'}}>Garden health</div>
            <div style={{fontFamily:'var(--font-display)',fontSize:26,fontWeight:500}}>{healthWord}</div></div>
        </Card>
        <Card padding={20} style={{display:'flex',alignItems:'center',gap:16}}>
          <div style={{width:58,height:58,borderRadius:'50%',background:'var(--surface-bloom-soft)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name="droplet" size={26} stroke="var(--status-info)" /></div>
          <div><div style={{fontSize:13,color:'var(--text-secondary)'}}>Tasks today</div>
            <div style={{fontFamily:'var(--font-display)',fontSize:26,fontWeight:500}}>{done}/{tasks.length} done</div></div>
        </Card>
        <Card padding={20} style={{display:'flex',alignItems:'center',gap:16}}>
          <div style={{width:58,height:58,borderRadius:'50%',background:'var(--green-100)',display:'flex',alignItems:'center',justifyContent:'center',flex:'none'}}><Icon name="leaf" size={26} stroke="var(--green-600)" /></div>
          <div><div style={{fontSize:13,color:'var(--text-secondary)'}}>Plants tracked</div>
            <div style={{fontFamily:'var(--font-display)',fontSize:26,fontWeight:500}}>{plants.length} growing</div></div>
        </Card>
      </div>

      <div className="pb-split" style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:28,marginTop:40,alignItems:'start'}}>
        <div>
          <SectionHeading action={plants.length>4 && <a style={{fontSize:13,fontWeight:600,cursor:'pointer'}} onClick={()=>navigate('/library')}>See all</a>}>My plants</SectionHeading>
          {plants.length===0
            ? <EmptyState title="No plants yet" body="Scan or upload a photo and we'll identify it, score its health, and build a care plan." cta={<Button variant="bloom" icon={<Icon name="camera" size={18}/>} onClick={()=>navigate('/scan')}>Scan your first plant</Button>} />
            : <div className="pb-grid-2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
                {plants.slice(0,4).map(p=> <PlantCard key={p.id} plant={p} onClick={()=>navigate('/plant/'+p.id)} />)}
              </div>}
        </div>
        <div>
          <SectionHeading>Today’s care</SectionHeading>
          <Card padding={8}>
            {tasks.length===0
              ? <div style={{padding:'26px 16px',textAlign:'center',color:'var(--text-secondary)'}}>
                  <Icon name="check" size={26} stroke="var(--status-healthy)" style={{margin:'0 auto 8px'}} />
                  <div style={{fontSize:14}}>All caught up. Nicely done.</div>
                </div>
              : tasks.map((t,i)=>(
                <div key={t.id} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 12px',borderBottom:i<tasks.length-1?'1px solid var(--border-subtle)':'none'}}>
                  <button onClick={()=> t.done ? uncompleteTask(t) : completeTask(t)} aria-label={t.done?'Mark not done':'Mark done'} style={{width:24,height:24,flex:'none',borderRadius:'50%',cursor:'pointer',border:t.done?'none':'2px solid var(--border-default)',background:t.done?'var(--primary)':'transparent',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    {t.done && <Icon name="check" size={14} stroke="var(--on-primary)" strokeWidth={3} />}
                  </button>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:600,color:'var(--text-primary)',textDecoration:t.done?'line-through':'none',opacity:t.done?0.5:1}}>{t.kind==='pest'?'Treat for pests':'Water'}</div>
                    <div style={{fontSize:12.5,color:'var(--text-secondary)'}}>{t.plant}</div>
                  </div>
                  <Icon name={t.icon} size={18} stroke={STATUS_COLOR[t.tone]} />
                </div>
              ))}
          </Card>
          <Card inverse padding={22} style={{marginTop:18}}>
            <div style={{display:'flex',alignItems:'center',gap:8,color:'var(--bloom-300)',marginBottom:8}}>
              <Icon name="sparkles" size={18} /> <span style={{fontSize:12,fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase'}}>AI tip</span>
            </div>
            <p style={{fontFamily:'var(--font-display)',fontSize:19,lineHeight:1.35,color:'var(--text-on-dark)'}}>“{tip}”</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
function greeting(){ const h=new Date().getHours(); return h<12?'morning':h<18?'afternoon':'evening'; }

/* =====================================================================
   SCAN (identify) — real upload / camera / sample, then diagnosis
   ===================================================================== */
function ScanView() {
  const [phase,setPhase] = useState('idle'); // idle | camera | scanning
  const [step,setStep] = useState(0);
  const [photo,setPhoto] = useState(null);
  const [err,setErr] = useState(null);
  const fileRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const steps = ['Detecting plant…','Matching 17,000 species…','Analyzing leaf health…','Building your care plan…'];

  const stopCamera = () => { if(streamRef.current){ streamRef.current.getTracks().forEach(t=>t.stop()); streamRef.current=null; } };
  useEffect(()=>()=>stopCamera(), []);

  const beginScan = (dataUrl) => { setPhoto(dataUrl); setPhase('scanning'); };

  useEffect(()=>{
    if(phase!=='scanning') return;
    setStep(0);
    const iv = setInterval(()=>setStep(s=>Math.min(s+1, steps.length-1)), 850);
    const done = setTimeout(()=>{ setPendingDiagnosis(diagnose(photo)); navigate('/result'); }, 3700);
    return ()=>{ clearInterval(iv); clearTimeout(done); };
  }, [phase]);

  const onFile = (e) => {
    const f = e.target.files && e.target.files[0]; if(!f) return;
    const reader = new FileReader();
    reader.onload = () => beginScan(reader.result);
    reader.readAsDataURL(f);
  };
  const openCamera = async () => {
    setErr(null);
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){ setErr('Camera not available in this browser — upload a photo instead.'); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video:{ facingMode:'environment' } });
      streamRef.current = stream; setPhase('camera');
      requestAnimationFrame(()=>{ if(videoRef.current){ videoRef.current.srcObject = stream; videoRef.current.play(); } });
    } catch(e){ setErr('Couldn’t access the camera — check permissions, or upload a photo.'); }
  };
  const capture = () => {
    const v = videoRef.current; if(!v) return;
    const c = document.createElement('canvas'); c.width = v.videoWidth||720; c.height = v.videoHeight||540;
    c.getContext('2d').drawImage(v,0,0,c.width,c.height);
    const url = c.toDataURL('image/jpeg', 0.85);
    stopCamera(); beginScan(url);
  };
  const useSample = () => beginScan(SPECIES[Math.floor(Math.random()*SPECIES.length)].photo);

  const previewSrc = photo || SPECIES[0].photo;

  return (
    <div className="pb-scan-page" style={{minHeight:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'48px'}}>
      <div style={{textAlign:'center',maxWidth:540,marginBottom:30}}>
        <div className="pb-overline" style={{marginBottom:12,justifyContent:'center'}}>AI plant identifier</div>
        <h1 style={{fontSize:40,lineHeight:1.06}}>Point, scan, and we’ll do the rest</h1>
        <p style={{color:'var(--text-secondary)',fontSize:16,marginTop:12}}>Snap or upload a photo of any plant. In seconds you’ll know its name, its health, and exactly how to help it thrive.</p>
      </div>

      <div style={{position:'relative',width:'min(440px, 90vw)',height:360,borderRadius:'var(--radius-2xl)',overflow:'hidden',boxShadow:'var(--shadow-xl)',background:phase==='idle'?'var(--surface-card)':'#0E1C14',border:phase==='idle'?'2px dashed var(--border-default)':'none'}}>
        {phase==='idle' && (
          <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:18,padding:32}}>
            <div style={{width:88,height:88,borderRadius:'50%',background:'var(--surface-accent-soft)',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="camera" size={40} stroke="var(--green-600)" /></div>
            <div style={{textAlign:'center'}}>
              <div style={{fontFamily:'var(--font-display)',fontSize:21,fontWeight:500}}>Add a photo to identify</div>
              <div style={{fontSize:14,color:'var(--text-secondary)',marginTop:4}}>JPG or PNG · or use your camera</div>
            </div>
            <div style={{display:'flex',gap:10,marginTop:4,flexWrap:'wrap',justifyContent:'center'}}>
              <Button variant="bloom" icon={<Icon name="camera" size={18}/>} onClick={openCamera}>Take a photo</Button>
              <Button variant="secondary" icon={<Icon name="image" size={18}/>} onClick={()=>fileRef.current && fileRef.current.click()}>Upload</Button>
            </div>
            <button onClick={useSample} style={{background:'none',border:'none',color:'var(--text-secondary)',fontFamily:'var(--font-sans)',fontSize:13,cursor:'pointer',textDecoration:'underline'}}>or try a sample plant</button>
            <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{display:'none'}} />
          </div>
        )}
        {phase==='camera' && (
          <React.Fragment>
            <video ref={videoRef} playsInline muted style={{width:'100%',height:'100%',objectFit:'cover'}} />
            <div style={{position:'absolute',left:0,right:0,bottom:0,padding:'18px',display:'flex',justifyContent:'center',gap:10,background:'linear-gradient(0deg, rgba(14,28,20,0.6), transparent)'}}>
              <Button variant="bloom" icon={<Icon name="camera" size={18}/>} onClick={capture}>Capture</Button>
              <Button variant="secondary" onClick={()=>{ stopCamera(); setPhase('idle'); }}>Cancel</Button>
            </div>
          </React.Fragment>
        )}
        {phase==='scanning' && (
          <React.Fragment>
            <img src={previewSrc} alt="" style={{width:'100%',height:'100%',objectFit:'cover',opacity:0.78}} />
            <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg, rgba(14,28,20,0.1), rgba(14,28,20,0.65))'}} />
            <div style={{position:'absolute',left:0,right:0,height:3,background:'linear-gradient(90deg, transparent, var(--bloom-400), transparent)',boxShadow:'0 0 22px 6px rgba(214,136,94,0.55)',animation:'pbScan 1.9s var(--ease-soft) infinite'}} />
            {[[true,true],[false,true],[true,false],[false,false]].map((c,i)=>(
              <div key={i} style={{position:'absolute',top:c[1]?20:'auto',bottom:c[1]?'auto':20,left:c[0]?20:'auto',right:c[0]?'auto':20,width:26,height:26,
                borderTop:c[1]?'3px solid var(--bloom-300)':'none',borderBottom:!c[1]?'3px solid var(--bloom-300)':'none',
                borderLeft:c[0]?'3px solid var(--bloom-300)':'none',borderRight:!c[0]?'3px solid var(--bloom-300)':'none',
                borderTopLeftRadius:c[0]&&c[1]?8:0,borderTopRightRadius:!c[0]&&c[1]?8:0,borderBottomLeftRadius:c[0]&&!c[1]?8:0,borderBottomRightRadius:!c[0]&&!c[1]?8:0}} />
            ))}
            <div style={{position:'absolute',left:0,right:0,bottom:0,padding:'22px 26px'}}>
              <div style={{display:'flex',alignItems:'center',gap:9,color:'var(--bloom-200)'}}>
                <Icon name="sparkles" size={18} /><span style={{fontFamily:'var(--font-mono)',fontSize:14}}>{steps[step]}</span>
              </div>
              <div style={{height:4,borderRadius:99,background:'rgba(255,255,255,0.18)',marginTop:12,overflow:'hidden'}}>
                <div style={{height:'100%',width:`${(step+1)/steps.length*100}%`,background:'var(--bloom-400)',borderRadius:99,transition:'width 700ms var(--ease-organic)'}} />
              </div>
            </div>
          </React.Fragment>
        )}
      </div>

      {err && <p style={{color:'var(--status-critical)',fontSize:13,marginTop:16,maxWidth:420,textAlign:'center'}}>{err}</p>}

      <div style={{display:'flex',gap:24,marginTop:28,color:'var(--text-muted)',fontSize:13,flexWrap:'wrap',justifyContent:'center'}}>
        <span style={{display:'inline-flex',alignItems:'center',gap:7}}><Icon name="leaf" size={16} stroke="var(--green-500)" /> 17,000+ species</span>
        <span style={{display:'inline-flex',alignItems:'center',gap:7}}><Icon name="sparkles" size={16} stroke="var(--bloom-500)" /> 97% accuracy</span>
        <span style={{display:'inline-flex',alignItems:'center',gap:7}}><Icon name="heart" size={16} stroke="var(--status-critical)" /> Personalized care</span>
      </div>
    </div>
  );
}

/* Build a believable diagnosis. (Mock model — picks from the known species
   catalog and synthesises health findings. Swap for a real vision API in prod.) */
function diagnose(photo){
  const sp = SPECIES[Math.floor(Math.random()*SPECIES.length)];
  const health = 60 + Math.floor(Math.random()*36); // 60-95
  const status = statusFromHealth(health, false);
  const confidence = 90 + Math.floor(Math.random()*10);
  const findings = [];
  if(health < 78){
    findings.push({ tone:'critical', icon:'droplet', title:'Watering needs adjusting', detail:'Soil moisture looks off and a couple of lower leaves show stress at the base.' });
    findings.push({ tone:'attention', icon:'sun', title:'Light could be brighter', detail:'Newer growth is small for the plant’s age — a sign of insufficient light.' });
  } else {
    findings.push({ tone:'attention', icon:'sun', title:'Light could be brighter', detail:'A little more bright, indirect light would encourage fuller growth.' });
  }
  findings.push({ tone:'healthy', icon:'leaf', title:'New growth is vigorous', detail:'Fresh growth at the crown and strong stems — a good sign of overall health.' });
  return {
    name: sp.name, common: sp.common, confidence, health, status, light: sp.light, intervalDays: sp.interval,
    photo: photo || sp.photo,
    summary: `A ${health>=85?'healthy':'mostly healthy'} ${sp.name} with ${health>=85?'no major issues':'a few things to watch'}. ${health>=85?'Keep doing what you’re doing.':'Small adjustments will get it thriving.'}`,
    findings, plan: sp.plan, speciesKey: sp.key,
  };
}

/* =====================================================================
   RESULT (diagnosis)
   ===================================================================== */
function ResultView() {
  const s = useStore();
  const d = s.pendingDiagnosis;
  if(!d) return (
    <div className="pb-page" style={{maxWidth:700,margin:'0 auto',padding:'80px 48px'}}>
      <EmptyState icon="scan" title="No scan yet" body="Identify a plant to see its diagnosis and care plan here." cta={<Button variant="bloom" icon={<Icon name="camera" size={18}/>} onClick={()=>navigate('/scan')}>Scan a plant</Button>} />
    </div>
  );
  const toneColor = STATUS_COLOR;
  const statusLabel = d.status==='healthy'?'Looking healthy':d.status==='attention'?'Needs attention':'Needs help';

  const add = () => {
    const id = uid();
    addPlant({ id, name:d.name, nickname:d.name.split(' ')[0], room:'Living room', photo:d.photo, health:d.health,
      statusLabel: labelFromHealth(d.health,false), nextWaterAt: days(Math.max(0,(d.intervalDays||7)-2)), intervalDays:d.intervalDays||7, light:d.light, common:d.common, addedAt:now() });
    setPendingDiagnosis(null);
    navigate('/plant/'+id);
  };

  return (
    <div className="pb-page" style={{maxWidth:1020,margin:'0 auto',padding:'28px 48px 64px'}}>
      <button onClick={()=>navigate('/scan')} style={{display:'inline-flex',alignItems:'center',gap:7,background:'none',border:'none',cursor:'pointer',color:'var(--text-secondary)',fontFamily:'var(--font-sans)',fontSize:14,fontWeight:500,padding:'6px 0',marginBottom:14}}>
        <Icon name="arrowLeft" size={18} /> Scan another
      </button>

      <Card padding={0} elevation="lg" style={{overflow:'hidden'}}>
        <div className="pb-hero" style={{display:'grid',gridTemplateColumns:'380px 1fr'}}>
          <div className="pb-hero-img" style={{position:'relative',background:'var(--green-100)',minHeight:280}}>
            <img src={d.photo} alt={d.name} style={{width:'100%',height:'100%',objectFit:'cover',display:'block',position:'absolute',inset:0}} />
            <div style={{position:'absolute',top:16,left:16}}>
              <span style={{display:'inline-flex',alignItems:'center',gap:7,padding:'7px 13px',borderRadius:999,background:'rgba(14,28,20,0.6)',backdropFilter:'blur(8px)',color:'#fff',fontFamily:'var(--font-mono)',fontSize:12}}>
                <Icon name="sparkles" size={14} stroke="var(--bloom-300)" /> {d.confidence}% match
              </span>
            </div>
          </div>
          <div className="pb-hero-body" style={{padding:'30px 34px',display:'flex',flexDirection:'column'}}>
            <div className="pb-overline" style={{marginBottom:10}}>Identified</div>
            <h1 style={{fontSize:33,lineHeight:1.05}}>{d.name}</h1>
            <div style={{fontFamily:'var(--font-display)',fontStyle:'italic',fontSize:17,color:'var(--text-secondary)',marginTop:4}}>{d.common}</div>
            <p style={{fontSize:15,color:'var(--text-secondary)',lineHeight:1.55,marginTop:16}}>{d.summary}</p>
            <div style={{display:'flex',alignItems:'center',gap:18,marginTop:'auto',paddingTop:22,flexWrap:'wrap'}}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <HealthRing value={d.health} status={d.status} size={62} stroke={6} />
                <div><div style={{fontSize:12.5,color:'var(--text-secondary)'}}>Health score</div><Badge tone={d.status} dot>{statusLabel}</Badge></div>
              </div>
              <Button onClick={add} icon={<Icon name="plus" size={18}/>} style={{marginLeft:'auto'}}>Add to my garden</Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="pb-split" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:28,marginTop:34,alignItems:'start'}}>
        <div>
          <SectionHeading>What we found</SectionHeading>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {d.findings.map((f,i)=>(
              <Card key={i} padding={18} style={{display:'flex',gap:14,alignItems:'flex-start'}}>
                <div style={{width:40,height:40,borderRadius:12,flex:'none',display:'flex',alignItems:'center',justifyContent:'center',background:'color-mix(in srgb, '+toneColor[f.tone]+' 14%, transparent)'}}>
                  <Icon name={f.icon} size={20} stroke={toneColor[f.tone]} />
                </div>
                <div>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{fontSize:15,fontWeight:600}}>{f.title}</span>
                    <Badge tone={f.tone} dot>{f.tone==='healthy'?'Good':f.tone==='attention'?'Watch':'Fix now'}</Badge>
                  </div>
                  <p style={{fontSize:13.5,color:'var(--text-secondary)',lineHeight:1.5,marginTop:5}}>{f.detail}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <SectionHeading>Your care plan</SectionHeading>
          <Card padding={8}>
            {d.plan.map((p,i)=>(
              <div key={i} style={{display:'flex',gap:14,alignItems:'flex-start',padding:'15px 14px',borderBottom:i<d.plan.length-1?'1px solid var(--border-subtle)':'none'}}>
                <div style={{width:30,height:30,flex:'none',borderRadius:'50%',background:'var(--surface-accent-soft)',color:'var(--text-accent)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-mono)',fontSize:13,fontWeight:500}}>{i+1}</div>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}><Icon name={p.icon} size={17} stroke="var(--green-600)" /><span style={{fontSize:14.5,fontWeight:600}}>{p.title}</span></div>
                  <p style={{fontSize:13,color:'var(--text-secondary)',lineHeight:1.5,marginTop:4}}>{p.detail}</p>
                </div>
              </div>
            ))}
          </Card>
          <Button variant="bloom" fullWidth icon={<Icon name="plus" size={18}/>} style={{marginTop:16}} onClick={add}>Add to my garden</Button>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   LIBRARY
   ===================================================================== */
function LibraryView() {
  const s = useStore();
  const [q,setQ] = useState('');
  const list = s.plants.filter(p => (p.name+' '+(p.nickname||'')+' '+(p.room||'')).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="pb-page" style={{maxWidth:1080,margin:'0 auto',padding:'40px 48px 64px'}}>
      <div className="pb-header" style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:24,marginBottom:26,flexWrap:'wrap'}}>
        <div>
          <div className="pb-overline" style={{marginBottom:8}}>{s.plants.length} plant{s.plants.length===1?'':'s'}</div>
          <h1 style={{fontSize:36}}>Library</h1>
        </div>
        <div className="pb-toolbar" style={{display:'flex',gap:12,alignItems:'center'}}>
          <div style={{width:260}}>
            <Input icon={<Icon name="search" size={18} />} placeholder="Search your garden" value={q} onChange={(e)=>setQ(e.target.value)} />
          </div>
          <Button variant="bloom" icon={<Icon name="plus" size={18}/>} onClick={()=>navigate('/scan')}>Add plant</Button>
        </div>
      </div>
      {s.plants.length===0
        ? <EmptyState title="Your library is empty" body="Scan a plant to start building your collection." cta={<Button variant="bloom" icon={<Icon name="camera" size={18}/>} onClick={()=>navigate('/scan')}>Scan a plant</Button>} />
        : list.length===0
          ? <p style={{color:'var(--text-secondary)',padding:'40px 0',textAlign:'center'}}>No plants match “{q}”.</p>
          : <div className="pb-grid-3" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
              {list.map(p=> <PlantCard key={p.id} plant={p} onClick={()=>navigate('/plant/'+p.id)} />)}
            </div>}
    </div>
  );
}

/* =====================================================================
   PLANT DETAIL
   ===================================================================== */
function PlantView({ id }) {
  const s = useStore();
  const raw = s.plants.find(p=>p.id===id);
  const [editing,setEditing] = useState(false);
  const [nick,setNick] = useState(raw?raw.nickname||'':'');
  if(!raw) return (
    <div className="pb-page" style={{maxWidth:700,margin:'0 auto',padding:'80px 48px'}}>
      <EmptyState icon="leaf" title="Plant not found" body="It may have been removed from your garden." cta={<Button onClick={()=>navigate('/library')}>Back to library</Button>} />
    </div>
  );
  const p = view(raw);
  const sp = SPECIES.find(x=>x.name===raw.name);
  const plan = (sp && sp.plan) || [];
  const dueLabel = p.water;

  const saveNick = () => { renamePlant(id, nick.trim()||raw.name.split(' ')[0]); setEditing(false); };
  const confirmRemove = () => { if(window.confirm('Remove '+(raw.nickname||raw.name)+' from your garden?')){ removePlant(id); navigate('/library'); } };

  return (
    <div className="pb-page" style={{maxWidth:1020,margin:'0 auto',padding:'28px 48px 64px'}}>
      <button onClick={()=>navigate('/library')} style={{display:'inline-flex',alignItems:'center',gap:7,background:'none',border:'none',cursor:'pointer',color:'var(--text-secondary)',fontFamily:'var(--font-sans)',fontSize:14,fontWeight:500,padding:'6px 0',marginBottom:14}}>
        <Icon name="arrowLeft" size={18} /> Back to library
      </button>

      <Card padding={0} elevation="lg" style={{overflow:'hidden'}}>
        <div className="pb-hero" style={{display:'grid',gridTemplateColumns:'380px 1fr'}}>
          <div className="pb-hero-img" style={{position:'relative',background:'var(--green-100)',minHeight:300}}>
            <img src={p.photo} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover',display:'block',position:'absolute',inset:0}} />
            <div style={{position:'absolute',top:16,left:16}}><Badge tone={p.status} dot>{p.statusLabel}</Badge></div>
          </div>
          <div className="pb-hero-body" style={{padding:'30px 34px',display:'flex',flexDirection:'column'}}>
            <div className="pb-overline" style={{marginBottom:10}}>In your garden · {p.room}</div>
            {editing ? (
              <div style={{display:'flex',gap:8,alignItems:'flex-end',maxWidth:320}}>
                <div style={{flex:1}}><Input label="Nickname" value={nick} onChange={(e)=>setNick(e.target.value)} placeholder="Nickname" /></div>
                <Button size="sm" onClick={saveNick}>Save</Button>
              </div>
            ) : (
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <h1 style={{fontSize:33,lineHeight:1.05}}>{p.nickname || p.name}</h1>
                <button onClick={()=>{setNick(p.nickname||'');setEditing(true);}} aria-label="Rename" style={{background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',display:'inline-flex'}}><Icon name="pencil" size={17} /></button>
              </div>
            )}
            <div style={{fontFamily:'var(--font-display)',fontStyle:'italic',fontSize:17,color:'var(--text-secondary)',marginTop:4}}>{p.name}{p.common?` · ${p.common}`:''}</div>

            <div style={{display:'flex',gap:24,marginTop:22,flexWrap:'wrap'}}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <HealthRing value={p.health} status={p.status} size={62} stroke={6} />
                <div><div style={{fontSize:12.5,color:'var(--text-secondary)'}}>Health score</div><div style={{fontFamily:'var(--font-display)',fontSize:20,fontWeight:500}}>{p.statusLabel}</div></div>
              </div>
              <div style={{display:'flex',gap:24}}>
                <Fact icon="droplet" color="var(--status-info)" label="Next water" value={dueLabel} />
                <Fact icon="sun" color="var(--bloom-500)" label="Light" value={p.light} />
              </div>
            </div>

            <div className="pb-actions" style={{display:'flex',gap:10,marginTop:'auto',paddingTop:24,flexWrap:'wrap'}}>
              <Button icon={<Icon name="droplet" size={18}/>} onClick={()=>waterPlant(id)}>Water now</Button>
              {p.pest && <Button variant="secondary" icon={<Icon name="check" size={18}/>} onClick={()=>treatPlant(id)}>Mark treated</Button>}
              <Button className="pb-spacer" variant="danger" icon={<Icon name="trash" size={18}/>} onClick={confirmRemove} style={{marginLeft:'auto'}}>Remove</Button>
            </div>
          </div>
        </div>
      </Card>

      {plan.length>0 && (
        <div style={{marginTop:34}}>
          <SectionHeading>Care plan</SectionHeading>
          <div className="pb-grid-2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            {plan.map((c,i)=>(
              <Card key={i} padding={18} style={{display:'flex',gap:14,alignItems:'flex-start'}}>
                <div style={{width:40,height:40,borderRadius:12,flex:'none',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--surface-accent-soft)'}}><Icon name={c.icon} size={20} stroke="var(--green-600)" /></div>
                <div><div style={{fontSize:15,fontWeight:600}}>{c.title}</div><p style={{fontSize:13.5,color:'var(--text-secondary)',lineHeight:1.5,marginTop:4}}>{c.detail}</p></div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
function Fact({ icon, color, label, value }) {
  return (
    <div>
      <div style={{fontSize:12.5,color:'var(--text-secondary)',display:'flex',alignItems:'center',gap:6}}><Icon name={icon} size={15} stroke={color} /> {label}</div>
      <div style={{fontSize:16,fontWeight:600,marginTop:4}}>{value}</div>
    </div>
  );
}

/* =====================================================================
   SETTINGS
   ===================================================================== */
function SettingsView() {
  const s = useStore();
  const [name,setName] = useState(s.user.name);
  const rows = [
    ['waterReminders','Watering reminders','Push alerts when a plant is thirsty'],
    ['monthlyReport','Monthly health report','A summary of your garden every month'],
    ['proInsights','Pro AI insights','Deeper diagnosis and seasonal forecasts'],
  ];
  return (
    <div className="pb-page pb-page-narrow" style={{maxWidth:680,margin:'0 auto',padding:'40px 48px'}}>
      <h1 style={{fontSize:36,marginBottom:26}}>Settings</h1>

      <SectionHeading>Profile</SectionHeading>
      <Card padding={20} style={{marginBottom:28}}>
        <div className="pb-profilerow" style={{display:'flex',gap:14,alignItems:'flex-end'}}>
          <Avatar name={name||'?'} size="lg" />
          <div className="pb-profilefield" style={{flex:1}}><Input label="Your name" value={name} onChange={(e)=>setName(e.target.value)} /></div>
          <Button onClick={()=>setUserName(name.trim()||'Friend')} disabled={!name.trim() || name===s.user.name}>Save</Button>
        </div>
      </Card>

      <SectionHeading>Notifications</SectionHeading>
      <Card padding={4} style={{marginBottom:28}}>
        {rows.map((r,i)=>(
          <div key={r[0]} style={{display:'flex',alignItems:'center',gap:16,padding:'18px 20px',borderBottom:i<rows.length-1?'1px solid var(--border-subtle)':'none'}}>
            <div style={{flex:1}}>
              <div style={{fontSize:15,fontWeight:600}}>{r[1]}</div>
              <div style={{fontSize:13,color:'var(--text-secondary)',marginTop:2}}>{r[2]}</div>
            </div>
            <Switch checked={!!s.settings[r[0]]} onChange={(v)=>setSetting(r[0], v)} />
          </div>
        ))}
      </Card>

      <SectionHeading>Data</SectionHeading>
      <Card padding={20}>
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <div style={{flex:1}}>
            <div style={{fontSize:15,fontWeight:600}}>Reset demo garden</div>
            <div style={{fontSize:13,color:'var(--text-secondary)',marginTop:2}}>Restore the sample plants and clear your changes.</div>
          </div>
          <Button variant="secondary" icon={<Icon name="refresh" size={18}/>} onClick={()=>{ if(window.confirm('Reset to the demo garden? This clears your plants and changes.')){ Store.reset(); navigate('/garden'); } }}>Reset</Button>
        </div>
      </Card>
      <p style={{fontSize:12,color:'var(--text-muted)',marginTop:18,textAlign:'center'}}>Plant Bloom · everything is saved locally in your browser.</p>
    </div>
  );
}

/* =====================================================================
   APP / ROUTER
   ===================================================================== */
function App() {
  const path = useRoute();
  let body, key = path;
  if(path==='/' || path==='/garden') body = <GardenView />;
  else if(path==='/scan') body = <ScanView />;
  else if(path==='/result') body = <ResultView />;
  else if(path==='/library') body = <LibraryView />;
  else if(path==='/settings') body = <SettingsView />;
  else if(path.startsWith('/plant/')){ key='/plant'; body = <PlantView id={path.slice('/plant/'.length)} />; }
  else body = <GardenView />;
  // scroll to top on route change
  useEffect(()=>{ const m=document.querySelector('.pb-main'); if(m) m.scrollTop=0; }, [path]);
  return (
    <React.Fragment>
      <Sidebar path={path} />
      <main className="pb-main">
        <div className="pb-view" key={path}>{body}</div>
      </main>
    </React.Fragment>
  );
}
ReactDOM.createRoot(document.getElementById('app')).render(<App />);
