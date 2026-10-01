import { useMemo } from 'react';

const STAGES = [
  { min:0,  items:[] },
  { min:1,  items:['🌴'] },
  { min:2,  items:['🌴','🌸'] },
  { min:3,  items:['🌴','🌸','🌺'] },
  { min:5,  items:['🌴','🌸','🌺','🏠'] },
  { min:7,  items:['🌴','🌸','🌺','🏠','🦋'] },
  { min:9,  items:['🌴','🌸','🌺','🏠','🦋','🐦'] },
  { min:12, items:['🌴','🌸','🌺','🏠','🦋','🐦','🪔'] },
  { min:15, items:['🌴','🌸','🌺','🏠','🦋','🐦','🪔','⛺','🌻'] },
  { min:20, items:['🌴','🌸','🌺','🏠','🦋','🐦','🪔','⛺','🌻','🎠','🐠'] },
];

const STAGES_ROMAN = [
  { min:0,  items:[] },
  { min:1,  items:['🌲'] },
  { min:2,  items:['🌲','🏕'] },
  { min:3,  items:['🌲','🏕','🔥'] },
  { min:5,  items:['🌲','🏕','🔥','🐺'] },
  { min:7,  items:['🌲','🏕','🔥','🐺','🦅'] },
  { min:9,  items:['🌲','🏕','🔥','🐺','🦅','🪵'] },
  { min:12, items:['🌲','🏕','🔥','🐺','🦅','🪵','⛵'] },
  { min:15, items:['🌲','🏕','🔥','🐺','🦅','🪵','⛵','🌙','⭐'] },
  { min:20, items:['🌲','🏕','🔥','🐺','🦅','🪵','⛵','🌙','⭐','🏔','🦁'] },
];

function getStage(count, stages) {
  let stage = stages[0];
  for (const s of stages) { if (count >= s.min) stage = s; }
  return stage;
}

// Мост — строится по записям, max 30
function Bridge({ progress }) {
  const pct = Math.min(1, progress / 30);
  const totalSegs = 12;
  const built = Math.round(pct * totalSegs);

  return (
    <div className="bridge-wrap">
      {Array.from({ length: totalSegs }, (_, i) => (
        <div
          key={i}
          className={`bridge-seg ${i < built ? 'built' : ''} ${i === built - 1 ? 'latest' : ''}`}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
      {pct >= 1 && <div className="bridge-complete">🎉</div>}
    </div>
  );
}

function Island({ name, items, side, entryCount }) {
  const positions = [
    { top:'18%', left:'50%', transform:'translate(-50%,-50%)', fontSize:28 },
    { top:'32%', left:'22%', fontSize:22 },
    { top:'28%', left:'72%', fontSize:20 },
    { top:'52%', left:'35%', fontSize:22 },
    { top:'48%', left:'68%', fontSize:20 },
    { top:'62%', left:'50%', transform:'translate(-50%,-50%)', fontSize:18 },
    { top:'38%', left:'48%', fontSize:18 },
    { top:'22%', left:'34%', fontSize:16 },
    { top:'24%', left:'64%', fontSize:16 },
    { top:'58%', left:'28%', fontSize:16 },
    { top:'56%', left:'72%', fontSize:14 },
  ];

  return (
    <div className={`island island-${side}`}>
      <div className="island-ground">
        {items.map((item, i) => (
          <span
            key={i}
            className="island-item"
            style={{ ...(positions[i] || { top:'50%', left:'50%', transform:'translate(-50%,-50%)' }), fontSize: positions[i]?.fontSize || 18 }}
          >
            {item}
          </span>
        ))}
        {items.length === 0 && (
          <span className="island-empty">🏝</span>
        )}
      </div>
      <div className="island-person">{side === 'left' ? '👩' : '👨'}</div>
      <div className="island-name">{name}</div>
      <div className="island-count">{entryCount} {entryCount === 1 ? 'запись' : entryCount < 5 ? 'записи' : 'записей'}</div>
    </div>
  );
}

export default function IslandScene({ entryCount, settings }) {
  const stageAizhan = useMemo(() => getStage(entryCount, STAGES), [entryCount]);
  const stageRoman = useMemo(() => getStage(entryCount, STAGES_ROMAN), [entryCount]);
  const bridgePct = Math.min(1, entryCount / 30);

  return (
    <div className="island-scene">
      <div className="island-scene-title">Наш остров</div>
      <p className="island-scene-sub">
        {entryCount === 0
          ? 'Напишите первую запись в дневник — и острова оживут'
          : entryCount < 30
          ? `Ещё ${30 - entryCount} ${30-entryCount===1?'запись':30-entryCount<5?'записи':'записей'} до того как мост соединит острова`
          : '🎉 Мост построен! Острова соединены — до встречи совсем чуть-чуть!'}
      </p>

      <div className="island-ocean">
        {/* волны */}
        <svg className="ocean-waves" viewBox="0 0 400 120" preserveAspectRatio="none">
          <path fill="#1e5a8a" opacity=".4">
            <animate attributeName="d" dur="4s" repeatCount="indefinite"
              values="M0,40 Q50,28 100,40 Q150,52 200,40 Q250,28 300,40 Q350,52 400,40 L400,120 L0,120 Z;M0,50 Q50,62 100,50 Q150,38 200,50 Q250,62 300,50 Q350,38 400,50 L400,120 L0,120 Z;M0,40 Q50,28 100,40 Q150,52 200,40 Q250,28 300,40 Q350,52 400,40 L400,120 L0,120 Z"/>
          </path>
          <path fill="#0e3454" opacity=".55">
            <animate attributeName="d" dur="6s" begin="1s" repeatCount="indefinite"
              values="M0,65 Q50,52 100,65 Q150,78 200,65 Q250,52 300,65 Q350,78 400,65 L400,120 L0,120 Z;M0,75 Q50,88 100,75 Q150,62 200,75 Q250,88 300,75 Q350,62 400,75 L400,120 L0,120 Z;M0,65 Q50,52 100,65 Q150,78 200,65 Q250,52 300,65 Q350,78 400,65 L400,120 L0,120 Z"/>
          </path>
          <path d="M0,88 Q200,78 400,88 L400,120 L0,120 Z" fill="#05101c" opacity=".72"/>
        </svg>

        {/* острова и мост */}
        <div className="islands-row">
          <Island name={settings.person2_name} items={stageAizhan.items} side="left" entryCount={entryCount}/>
          <div className="bridge-container">
            <Bridge progress={entryCount}/>
            {bridgePct >= 1 && (
              <div className="bridge-meet">
                <span>👩</span><span>💕</span><span>👨</span>
              </div>
            )}
          </div>
          <Island name={settings.person1_name} items={stageRoman.items} side="right" entryCount={entryCount}/>
        </div>
      </div>

      <div className="island-legend">
        <div className="legend-item"><span>🌱</span> Каждая запись в дневнике оживляет острова</div>
        <div className="legend-item"><span>🌉</span> После 30 записей мост соединит вас</div>
      </div>
    </div>
  );
}
