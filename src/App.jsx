import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from './supabaseClient';
import IslandScene from './IslandScene.jsx';
import PlanesCanvas from './PlanesCanvas.jsx';

const QUESTIONS = [
  'Если бы у нас было 24 часа в одном городе — что бы ты предложил(а) сделать?',
  'Какой момент из нашего времени вместе ты вспоминаешь чаще всего?',
  'Что ты делаешь когда скучаешь по мне?',
  'Какая песня сейчас ассоциируется с нами?',
  'Опиши наш идеальный первый день после встречи.',
  'Как ты понял(а) что я особенный(ая) для тебя?',
  'Какое место в своём городе хочешь мне показать первым?',
  'Что ты сейчас видишь из окна?',
  'Назови три вещи за которые благодарен(а) сегодня.',
  'Каким был твой самый странный сон за последнее время?',
  'Что бы приготовил(а) для меня если бы я был(а) рядом?',
  'Какой фильм хочешь посмотреть со мной при встрече?',
  'Если бы мы могли прямо сейчас оказаться в любом месте — куда?',
  'Что хочешь успеть сделать до нашей встречи?',
  'Чем ты сейчас гордишься в себе?',
  'Какой твой любимый способ провести утро?',
  'Что тебя сегодня рассмешило?',
  'Расскажи о человеке которого встретил(а) сегодня.',
  'Какой твой любимый способ показать что любишь?',
  'Опиши меня тремя словами — первое что приходит.',
  'Что в расстоянии научило тебя чему-то новому?',
  'Каким видишь нас через пять лет?',
  'Что тебя сегодня тронуло?',
  'Какую традицию хочешь создать когда будем вместе?',
  'Что хотел(а) бы чтобы я знал(а) о тебе?',
  'Если бы написал(а) мне письмо которое я открою через год — о чём?',
  'Что тебя пугает и что вдохновляет в нашем будущем?',
  'Какое место в мире хочешь посетить вместе?',
  'Что бы сказал(а) мне если бы не боялся(ась)?',
  'Какое воспоминание о нас греет больше всего?',
  'Что хочешь мне сказать прямо сейчас?',
  'Назови момент когда был(а) особенно горд(а) нами.',
  'Самое смешное что происходило между нами?',
  'Что бы сделал(а) первым если бы я неожиданно появился(ась)?',
  'Какой запах ассоциируется со мной?',
  'Какую книгу хотел(а) бы прочитать вместе?',
  'Что делает тебя счастливым(ой) прямо сейчас?',
  'Чем ты сейчас живёшь — что занимает мысли?',
  'Если бы тебе дали один день со мной — как провёл(а) бы каждый час?',
  'Что хочешь запомнить из этого периода?',
];

function getTodayQuestion() {
  const start = new Date('2025-01-01');
  const diff = Math.floor((new Date() - start) / (1000*60*60*24));
  const idx = diff % QUESTIONS.length;
  return { question: QUESTIONS[idx], index: idx };
}

function useCountdown(target) {
  function calc() {
    if (!target) return { days:0, hours:0, mins:0, secs:0 };
    let diff = new Date(target) - new Date();
    if (diff < 0) diff = 0;
    return {
      days: Math.floor(diff / (1000*60*60*24)),
      hours: Math.floor((diff/(1000*60*60))%24),
      mins: Math.floor((diff/(1000*60))%60),
      secs: Math.floor((diff/1000)%60),
    };
  }
  const [time, setTime] = useState(calc());
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [target]);
  return time;
}

// ── ЭКРАН ПЕРВОНАЧАЛЬНОЙ НАСТРОЙКИ ──
function SetupScreen({ onSave }) {
  const [form, setForm] = useState({
    person1_name: 'Роман', person2_name: 'Айжан',
    person1_city: 'Нью-Йорк', person2_city: 'Астана',
    meeting_date: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.meeting_date) return;
    setSaving(true);
    await supabase.from('site_settings').upsert({ id:'main', ...form });
    setSaving(false);
    onSave(form);
  };

  return (
    <div className="setup-screen">
      <div className="setup-card">
        <div className="setup-ornament">✦</div>
        <h1 className="setup-title">Добро пожаловать</h1>
        <p className="setup-sub">Настройте свой личный сайт</p>

        <div className="setup-fields">
          <div className="field-row">
            <div className="field-group">
              <label>Имя (город 1)</label>
              <input value={form.person1_name} onChange={e=>setForm({...form,person1_name:e.target.value})} placeholder="Роман"/>
              <input value={form.person1_city} onChange={e=>setForm({...form,person1_city:e.target.value})} placeholder="Нью-Йорк"/>
            </div>
            <div className="field-sep">♡</div>
            <div className="field-group">
              <label>Имя (город 2)</label>
              <input value={form.person2_name} onChange={e=>setForm({...form,person2_name:e.target.value})} placeholder="Айжан"/>
              <input value={form.person2_city} onChange={e=>setForm({...form,person2_city:e.target.value})} placeholder="Астана"/>
            </div>
          </div>
          <div className="field-date">
            <label>Дата встречи</label>
            <input type="date" value={form.meeting_date} onChange={e=>setForm({...form,meeting_date:e.target.value})}/>
          </div>
        </div>

        <button className="setup-btn" onClick={handleSave} disabled={saving||!form.meeting_date}>
          {saving ? 'Сохраняю...' : 'Начать нашу историю'}
        </button>
      </div>
    </div>
  );
}

// ── ГЛАВНЫЙ ЭКРАН ──
function Hero({ settings, entryCount, onTabChange }) {
  const time = useCountdown(settings.meeting_date);

  return (
    <div className="hero">
      <div className="hero-overlay"/>
      <PlanesCanvas name1={settings.person1_name} name2={settings.person2_name}/>

      <div className="hero-bar">
        <div className="city-label city-1">
          <span className="city-name">{settings.person1_city}</span>
          <span className="city-line"/>
          <span className="city-sub">{settings.person1_name}</span>
        </div>
        <span className="city-dot">· · · ✦ · · ·</span>
        <div className="city-label city-2">
          <span className="city-name">{settings.person2_city}</span>
          <span className="city-line"/>
          <span className="city-sub">{settings.person2_name}</span>
        </div>
      </div>

      <div className="hero-center">
        <div className="hero-until">ДО ВСТРЕЧИ ОСТАЛОСЬ</div>
        <div className="hero-countdown">
          {[['days','дней'],['hours','часов'],['mins','минут'],['secs','секунд']].map(([k,l])=>(
            <div className="cblock" key={k}>
              <span className="cnum">{String(time[k]).padStart(k==='days'?1:2,'0')}</span>
              <span className="clbl">{l}</span>
            </div>
          ))}
        </div>
        <div className="hero-date">
          {settings.meeting_date
            ? new Date(settings.meeting_date).toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'}) + ' — день когда расстояние исчезнет'
            : ''}
        </div>
      </div>

      <div className="hero-bottom">
        <div className="hero-title">Roman & Aizhan</div>
        <div className="hero-ornament">· · · ✦ · · ·</div>
        <div className="hero-tabs">
          <button className="htab" onClick={()=>onTabChange('island')}>🏝 Наш остров</button>
          <button className="htab" onClick={()=>onTabChange('diary')}>💬 Наш дневник</button>
          <button className="htab" onClick={()=>onTabChange('question')}>✦ Вопрос дня</button>
        </div>
      </div>

      <div className="hero-waves">
        <svg viewBox="0 0 1000 200" preserveAspectRatio="none" style={{width:'100%',height:'100%',display:'block'}}>
          <path fill="#1a4a7a" opacity=".18"><animate attributeName="d" dur="5s" repeatCount="indefinite" values="M0,60 Q125,45 250,60 Q375,75 500,60 Q625,45 750,60 Q875,75 1000,60 L1000,200 L0,200 Z;M0,72 Q125,87 250,72 Q375,57 500,72 Q625,87 750,72 Q875,57 1000,72 L1000,200 L0,200 Z;M0,60 Q125,45 250,60 Q375,75 500,60 Q625,45 750,60 Q875,75 1000,60 L1000,200 L0,200 Z"/></path>
          <path fill="#0e2a50" opacity=".32"><animate attributeName="d" dur="7s" begin="1s" repeatCount="indefinite" values="M0,95 Q100,80 200,95 Q300,110 400,95 Q500,80 600,95 Q700,110 800,95 Q900,80 1000,95 L1000,200 L0,200 Z;M0,109 Q100,124 200,109 Q300,94 400,109 Q500,124 600,109 Q700,94 800,109 Q900,124 1000,109 L1000,200 L0,200 Z;M0,95 Q100,80 200,95 Q300,110 400,95 Q500,80 600,95 Q700,110 800,95 Q900,80 1000,95 L1000,200 L0,200 Z"/></path>
          <path fill="#08182c" opacity=".5"><animate attributeName="d" dur="9s" begin="2s" repeatCount="indefinite" values="M0,130 Q125,115 250,130 Q375,145 500,130 Q625,115 750,130 Q875,145 1000,130 L1000,200 L0,200 Z;M0,144 Q125,159 250,144 Q375,129 500,144 Q625,159 750,144 Q875,129 1000,144 L1000,200 L0,200 Z;M0,130 Q125,115 250,130 Q375,145 500,130 Q625,115 750,130 Q875,145 1000,130 L1000,200 L0,200 Z"/></path>
          <path d="M0,162 Q500,152 1000,162 L1000,200 L0,200 Z" fill="#04101e" opacity=".7"/>
          <path d="M0,182 Q500,175 1000,182 L1000,200 L0,200 Z" fill="#020810" opacity=".85"/>
        </svg>
      </div>
    </div>
  );
}

// ── ДНЕВНИК ──
function DiaryTab({ settings }) {
  const [entries, setEntries] = useState(null);
  const [draft, setDraft] = useState('');
  const [author, setAuthor] = useState('person1');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const { data } = await supabase.from('journal_entries').select('*').order('created_at',{ascending:false});
    setEntries(data || []);
  },[]);

  useEffect(() => {
    load();
    const ch = supabase.channel('journal')
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'journal_entries'},()=>load())
      .subscribe();
    return ()=>supabase.removeChannel(ch);
  },[load]);

  const send = async () => {
    if (!draft.trim()) return;
    setSaving(true); setError('');
    const { error: err } = await supabase.from('journal_entries').insert({ author, text: draft.trim() });
    if (err) setError('Не получилось сохранить.');
    else setDraft('');
    setSaving(false);
  };

  const fmt = iso => {
    const d = new Date(iso);
    return d.toLocaleDateString('ru-RU',{day:'numeric',month:'short'}) + ' · ' + d.toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'});
  };

  return (
    <div className="tab-content">
      <div className="tab-header">
        <span className="tab-icon">💬</span>
        <span className="tab-title">Наш дневник</span>
      </div>

      <div className="compose">
        <div className="who-toggle">
          <button className={`who-btn ${author==='person1'?'active':''}`} onClick={()=>setAuthor('person1')}>{settings.person1_name}</button>
          <button className={`who-btn ${author==='person2'?'active':''}`} onClick={()=>setAuthor('person2')}>{settings.person2_name}</button>
        </div>
        <textarea className="entry-input" placeholder="Что сегодня хочется сказать..." value={draft} onChange={e=>setDraft(e.target.value)}/>
        <div className="compose-footer">
          <button className="send-btn" onClick={send} disabled={saving||!draft.trim()}>{saving?'Сохраняю...':'Добавить запись'}</button>
        </div>
        {error && <div className="error-msg">{error}</div>}
      </div>

      {entries===null ? <div className="loading">Загружаю...</div>
       : entries.length===0 ? <div className="empty-state">Здесь пока тихо. Напишите первую запись 🌊</div>
       : <div className="entries">
          {entries.map(e=>(
            <div className="entry" key={e.id}>
              <div className="entry-head">
                <span className={`echip ${e.author==='person1'?'chip1':'chip2'}`}>{e.author==='person1'?settings.person1_name:settings.person2_name}</span>
                <span className="entry-date">{fmt(e.created_at)}</span>
              </div>
              <div className="entry-text">{e.text}</div>
            </div>
          ))}
        </div>}
    </div>
  );
}

// ── ВОПРОС ДНЯ ──
function QuestionTab({ settings }) {
  const { question, index } = getTodayQuestion();
  const [answers, setAnswers] = useState(null);
  const [draft, setDraft] = useState('');
  const [author, setAuthor] = useState('person1');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from('daily_answers').select('*').eq('question_index',index);
    setAnswers(data||[]);
  },[index]);

  useEffect(()=>{ load(); },[load]);

  const myAnswer = answers?.find(a=>a.author===author&&a.question_index===index);
  const partnerAuthor = author==='person1'?'person2':'person1';
  const partnerAnswer = answers?.find(a=>a.author===partnerAuthor&&a.question_index===index);
  const both = myAnswer && partnerAnswer;

  const send = async () => {
    if (!draft.trim()||myAnswer) return;
    setSaving(true);
    await supabase.from('daily_answers').insert({ question_index:index, author, answer:draft.trim() });
    setDraft(''); setSaving(false); load();
  };

  return (
    <div className="tab-content">
      <div className="tab-header">
        <span className="tab-icon">✦</span>
        <span className="tab-title">Вопрос дня</span>
      </div>

      <div className="question-card">
        <div className="question-date">{new Date().toLocaleDateString('ru-RU',{day:'numeric',month:'long'})}</div>
        <div className="question-text">{question}</div>
      </div>

      {answers===null ? <div className="loading">Загружаю...</div> : <>
        {!myAnswer && (
          <div className="compose">
            <div className="who-toggle">
              <button className={`who-btn ${author==='person1'?'active':''}`} onClick={()=>setAuthor('person1')}>{settings.person1_name}</button>
              <button className={`who-btn ${author==='person2'?'active':''}`} onClick={()=>setAuthor('person2')}>{settings.person2_name}</button>
            </div>
            <textarea className="entry-input" placeholder="Твой ответ..." value={draft} onChange={e=>setDraft(e.target.value)}/>
            <div className="compose-footer">
              <button className="send-btn" onClick={send} disabled={saving||!draft.trim()}>{saving?'Сохраняю...':'Ответить'}</button>
            </div>
          </div>
        )}

        {myAnswer && (
          <div className="answer-card my-answer">
            <div className="answer-label">{author==='person1'?settings.person1_name:settings.person2_name} — твой ответ</div>
            <div className="answer-text">{myAnswer.answer}</div>
          </div>
        )}

        {myAnswer && !partnerAnswer && (
          <div className="waiting-card">
            <div className="waiting-icon">🌊</div>
            <div className="waiting-text">Ждём ответ от {partnerAuthor==='person1'?settings.person1_name:settings.person2_name}...</div>
            <div className="waiting-sub">Ответ появится когда вторая половинка напишет</div>
          </div>
        )}

        {both && (
          <div className="answer-card partner-answer">
            <div className="answer-label">{partnerAuthor==='person1'?settings.person1_name:settings.person2_name} — ответ</div>
            <div className="answer-text">{partnerAnswer.answer}</div>
          </div>
        )}
      </>}
    </div>
  );
}

// ── ГЛАВНЫЙ APP ──
export default function App() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('hero');
  const [entryCount, setEntryCount] = useState(0);

  useEffect(()=>{
    const init = async () => {
      const { data } = await supabase.from('site_settings').select('*').eq('id','main').single();
      if (data) setSettings(data);
      setLoading(false);
    };
    init();
  },[]);

  useEffect(()=>{
    if (!settings) return;
    const getCount = async () => {
      const { count } = await supabase.from('journal_entries').select('*',{count:'exact',head:true});
      setEntryCount(count||0);
    };
    getCount();
  },[settings]);

  if (loading) return (
    <div style={{minHeight:'100vh',background:'#0a1a2e',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,0.5)',fontFamily:'Georgia,serif',fontSize:18,fontStyle:'italic'}}>
      ✦
    </div>
  );

  if (!settings) return <SetupScreen onSave={s=>setSettings({...s,id:'main'})}/>;

  if (tab === 'hero') return (
    <div style={{minHeight:'100vh',background:'#0a1a2e'}}>
      <Hero settings={settings} entryCount={entryCount} onTabChange={setTab}/>
    </div>
  );

  return (
    <div className="app-wrap">
      <div className="app-nav">
        <button className={`nav-btn ${tab==='hero'?'active':''}`} onClick={()=>setTab('hero')}>🏠</button>
        <button className={`nav-btn ${tab==='island'?'active':''}`} onClick={()=>setTab('island')}>🏝</button>
        <button className={`nav-btn ${tab==='diary'?'active':''}`} onClick={()=>setTab('diary')}>💬</button>
        <button className={`nav-btn ${tab==='question'?'active':''}`} onClick={()=>setTab('question')}>✦</button>
      </div>
      {tab==='island' && <IslandScene entryCount={entryCount} settings={settings}/>}
      {tab==='diary' && <DiaryTab settings={settings}/>}
      {tab==='question' && <QuestionTab settings={settings}/>}
    </div>
  );
}
