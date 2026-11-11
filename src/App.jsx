import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Battery, Check, CheckCheck, ChevronDown, CircleHelp, Clock3, Cloud, Cookie, Crown, Flame, Heart, Leaf, Moon, PartyPopper, Pizza, Plus, Settings2, ShieldCheck, Sparkles, Sprout, Star, Trash2, Trophy, X, Zap } from 'lucide-react';
import PetCharacter from './components/PetCharacter.jsx';
import { CHARACTERS, DAILY_GOAL, MESSAGES, REWARDS, STAGES, STORAGE_KEY, calculatePetMood, completedToday, currentStreak, gameReducer, loadGame, localDate, saveGame, validateTask } from './game.js';

const getStorage = () => {
  try { return window.localStorage; }
  catch { return { getItem() { throw new Error('Unavailable'); }, setItem() { throw new Error('Unavailable'); }, removeItem() { throw new Error('Unavailable'); } }; }
};
const icons = { cookie: Cookie, pizza: Pizza, party: PartyPopper, potion: Zap, crown: Crown };
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

function Button({ children, className = '', variant = 'primary', ...props }) {
  return <button type="button" className={`button button-${variant} ${className}`} {...props}>{children}</button>;
}

function Logo({ onClick }) {
  return <button className="logo" onClick={onClick} aria-label="Adopt a Procrastinator home"><span className="logo-mark"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 23C2 12 10 5 16 5s15 7 11 18c-2 6-20 6-22 0" fill="currentColor" /><circle cx="12" cy="17" r="1.5" fill="white" /><circle cx="21" cy="17" r="1.5" fill="white" /><path d="M14 22q3 2 5-1" stroke="white" fill="none" strokeWidth="1.5" strokeLinecap="round" /></svg></span><span>adopt a<br /><strong>procrastinator<span className="logo-dot">.</span></strong></span></button>;
}

function Modal({ title, description, children, onClose, className = '', initialFocus = 'first' }) {
  const dialog = useRef(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement;
    element.showModal();
    const target = initialFocus === 'cancel' ? element.querySelector('[data-cancel]') : element.querySelector('input, button:not(.modal-close), select');
    target?.focus();
    const cancel = (event) => { event.preventDefault(); close.current(); };
    element.addEventListener('cancel', cancel);
    return () => { element.removeEventListener('cancel', cancel); element.close(); if (previous?.isConnected && !previous.disabled) previous.focus(); };
  }, [initialFocus]);
  return <dialog ref={dialog} className={`modal ${className}`} aria-labelledby="modal-title" aria-describedby={description ? 'modal-description' : undefined} onClick={(event) => { if (event.target === dialog.current) { const box = event.target.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onClose(); } }}>
    <button className="icon-button modal-close" onClick={onClose} aria-label="Close dialog"><X size={20} /></button>
    <h2 id="modal-title">{title}</h2>{description && <p id="modal-description" className="modal-description">{description}</p>}{children}
  </dialog>;
}

function Header({ game, onHome, onHelp, onSettings }) {
  return <header className="site-header"><div className="header-inner"><Logo onClick={onHome} />
    {game ? <div className="header-actions"><span className="header-date">{new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', weekday: 'short' }).format(new Date())}</span><span className="streak-pill"><Flame size={17} />{currentStreak(game)} <span>day streak</span></span><button className="icon-button" aria-label="How to play" title="How to play" onClick={onHelp}><CircleHelp size={21} /></button><button className="icon-button" aria-label="Settings" title="Settings" onClick={onSettings}><Settings2 size={21} /></button></div> : <div className="header-actions"><button className="text-button how-link" onClick={onHelp}>How it works <ArrowUpRight size={15} /></button><span className="header-note"><span className="little-dot" /> A softer way to get things done</span></div>}
  </div></header>;
}

function LandingPage({ onAdopt }) {
  return <main className="landing page-shell">
    <section className="hero"><div className="hero-copy"><div className="eyebrow"><span className="tiny-star">✳</span> SMALL STEPS. BIG GLOW-UPS.</div><h1>Stop<br />procrastinating.<br /><span>Your pet is<br />counting on you!</span></h1><p className="hero-description">Adopt a little procrastinator, complete your daily missions, and help your lazy companion become something legendary.</p><Button className="hero-cta" onClick={onAdopt}>Adopt Your Pet <ArrowRight size={20} /></Button><div className="hero-footnote"><Heart size={15} /> No pressure. Just a little progress.</div></div>
      <div className="hero-art"><span className="orbit-doodle doodle-one">✦</span><span className="orbit-doodle doodle-two">✳</span><div className="intro-bubble">“I was going to be productive.<br />Then I met this cloud.”<span>— Mochi, probably</span></div><div className="hero-habitat"><div className="habitat-orbit" /><div className="floating-leaf"><Leaf size={28} /></div><div className="habitat-cloud cloud-one" /><div className="habitat-cloud cloud-two" /><PetCharacter character="mochi" level={2} /><div className="little-flower flower-one">✿</div><div className="little-flower flower-two">✿</div></div><div className="pet-name-card"><span className="status-dot" /><div><strong>Meet your new reason to start.</strong><span>Very small. Very proud of you already.</span></div><Heart size={20} /></div><div className="floating-note"><Sparkles size={17} /> Potential: legendary</div></div>
    </section>
    <section className="how-strip" aria-label="How it works"><div className="how-intro"><span>A tiny companion.<br /><strong>A lovely little loop.</strong></span><span className="hand-arrow">⤳</span></div><div className="how-step"><span className="step-icon mint"><CheckCheck size={23} /></span><div><strong>Complete tasks</strong><p>Turn “later” into a little win.</p></div></div><div className="how-step"><span className="step-icon peach"><Cookie size={23} /></span><div><strong>Feed your pet with productivity</strong><p>Your progress is their happy place.</p></div></div><div className="how-step"><span className="step-icon lilac"><Sprout size={23} /></span><div><strong>Watch it evolve</strong><p>From sleepy egg to absolute legend.</p></div></div></section>
    <footer className="landing-footer"><span>Made for your perfectly imperfect days.</span><span><ShieldCheck size={14} /> Just you, your pet, and this browser.</span></footer>
  </main>;
}

function PetAdoption({ onAdopt, onBack }) {
  const [selected, setSelected] = useState('mochi');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const input = useRef(null);
  const character = CHARACTERS.find((pet) => pet.id === selected);
  return <main className="adoption page-shell"><button className="text-button" onClick={onBack}><ArrowLeft size={17} /> Back to the cozy side</button><div className="adoption-heading"><div className="eyebrow">THE BEGINNING OF A BEAUTIFUL DISTRACTION</div><h1>Find your little <span>kindred spirit.</span></h1><p>Different personalities. Equally questionable work ethic.</p></div><div className="adoption-grid"><div className="adoption-preview"><span className="preview-label"><Heart size={16} /> YOUR SOON-TO-BE BESTIE</span><PetCharacter character={selected} level={2} /><div className="adoption-quote">“{character.tagline}”</div><p>Every legend starts as a little egg.</p><div className="initial-stats"><span><Heart size={15} /> 70% happy</span><span><Zap size={15} /> 80% energy</span><span><Star size={15} /> Level 1</span></div></div><form className="adoption-form" noValidate onSubmit={(event) => { event.preventDefault(); if (!name.trim() || name.trim().length > 24) { setError('Give your pet a name between 1 and 24 characters.'); input.current.focus(); return; } onAdopt(name.trim(), selected); }}><h2>Pick your partner in progress</h2><fieldset className="character-options"><legend className="sr-only">Choose a character</legend>{CHARACTERS.map((pet) => <label className={`character-option ${selected === pet.id ? 'selected' : ''}`} key={pet.id}><input type="radio" name="character" value={pet.id} checked={selected === pet.id} onChange={() => setSelected(pet.id)} /><span className="character-mini"><PetCharacter character={pet.id} level={2} /></span><span className="character-details"><strong>{pet.name}</strong><span>{pet.personality}</span></span><span className="radio-indicator">{selected === pet.id && <Check size={13} />}</span></label>)}</fieldset><label className="field-label" htmlFor="pet-name">What should we call your pet?</label><input ref={input} id="pet-name" value={name} placeholder={`Something cute, like ${character.name}…`} maxLength={24} autoComplete="off" aria-invalid={!!error} aria-describedby="pet-name-help" onChange={(event) => { setName(event.target.value); setError(''); }} /><p id="pet-name-help" className={error ? 'field-error' : 'field-help'}>{error || 'Up to 24 characters. An excellent name is a great start.'}</p><Button type="submit" className="w-full">Adopt Now <Heart size={18} /></Button><p className="adoption-fine">A forever friend. A fresh start. Absolutely no paperwork.</p></form></div></main>;
}

function StatBar({ icon: Icon, label, value, max = 100, color, suffix = '%' }) {
  return <div className={`stat stat-${color}`}><div className="stat-label"><span><Icon size={16} />{label}</span><strong>{value}{suffix === '%' ? '%' : <small> / {max} {suffix}</small>}</strong></div><div className="stat-track" role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}><div style={{ width: `${Math.min(100, value / max * 100)}%` }} /></div></div>;
}

function PetArena({ game, reaction, onRest, onFeed, onHelp, messageIndex }) {
  const mood = reaction ? 'excited' : calculatePetMood(game);
  const moodLabels = { happy: 'Feeling pretty good', excited: 'On top of the world', motivated: 'Ready for a little win', sleepy: 'A little sleepy', hungry: 'Thinking about snacks', sad: 'Ready for a fresh start' };
  const speech = reaction?.message ?? MESSAGES[mood][messageIndex % MESSAGES[mood].length];
  const rested = game.activity[localDate()]?.rested;
  const canFeed = game.inventory.cookie > 0 && (game.pet.energy < 100 || game.pet.happiness < 100);
  return <section className="pet-card" aria-label="Your companion"><div className="arena-top"><span className="mini-label"><span className="status-dot" /> YOUR COMPANION</span><button className="icon-button" onClick={onHelp} aria-label="View evolution guide" title="Evolution guide"><Sparkles size={19} /></button></div><div className="pet-habitat"><div className="speech-bubble" aria-live="polite" key={speech}>{speech}</div><div className="arena-doodle arena-star">✦</div><div className="arena-doodle arena-spark">✧</div><div className="arena-cloud" /><div className="arena-floor" /><PetCharacter character={game.pet.character} level={game.pet.level} mood={mood} equipped={game.pet.equipped} celebrate={!!reaction} /><div className="little-flower arena-flower">✿</div>{reaction && <span className="xp-pop" key={reaction.id}>{reaction.label}</span>}</div><div className="pet-identity"><span className="level-tag">LVL {game.pet.level}</span><h2>{game.pet.name}</h2><p>{game.pet.stage} <span>·</span> {moodLabels[mood]}</p></div><div className="pet-stats"><StatBar icon={Heart} label="Happiness" value={game.pet.happiness} color="pink" /><StatBar icon={Zap} label="Energy" value={game.pet.energy} color="peach" /><StatBar icon={Sparkles} label="Experience" value={game.pet.totalXP % 100} max={100} suffix="XP" color="purple" /></div><div className="pet-actions"><Button variant="soft" onClick={onFeed} disabled={!canFeed} title={game.inventory.cookie ? 'Restore 20 energy and 5 happiness' : 'Complete 3 missions today to earn a cookie'}><Cookie size={18} /> Feed <span className="item-count">{game.inventory.cookie}</span></Button><Button variant="neutral" onClick={onRest} disabled={rested || game.pet.energy >= 100} title={rested ? "Today's rest is already enjoyed" : 'Restore 20 energy once a day'}><Moon size={17} />{rested ? 'Well rested' : 'Take a rest'}</Button></div><p className="care-note">{game.pet.energy >= 100 && game.pet.happiness >= 100 ? 'Happy, energized, and very lucky to have you.' : 'A little care goes a long way. So do snack breaks.'}</p></section>;
}

function TaskForm({ onSave, onClose }) {
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', minutes: '' });
  const [errors, setErrors] = useState({});
  const field = (key, value) => { setForm((prev) => ({ ...prev, [key]: value })); setErrors((prev) => ({ ...prev, [key]: '' })); };
  return <Modal title="One small mission." description="Something doable. Your pet is already cheering for you." onClose={onClose}><form noValidate onSubmit={(event) => { event.preventDefault(); const next = validateTask(form); setErrors(next); if (Object.keys(next).length) { document.getElementById(`task-${Object.keys(next)[0]}`)?.focus(); return; } onSave(form); }}>
    <label className="field-label" htmlFor="task-title">What would you like to do? <span className="required-note">Required</span></label><input id="task-title" value={form.title} onChange={(event) => field('title', event.target.value)} placeholder="e.g. Read five pages" maxLength={100} aria-invalid={!!errors.title} aria-describedby={errors.title ? 'task-title-error' : undefined} /><div className="error-slot">{errors.title && <p id="task-title-error" className="field-error">{errors.title}</p>}</div>
    <label className="field-label" htmlFor="task-description">A little detail <span className="optional">Optional</span></label><textarea id="task-description" className="resize-none" rows={3} style={{ resize: 'none' }} value={form.description} onChange={(event) => field('description', event.target.value)} placeholder="Make the first step feel a little smaller…" maxLength={280} aria-invalid={!!errors.description} aria-describedby={errors.description ? 'task-description-error' : undefined} />{errors.description && <p id="task-description-error" className="field-error">{errors.description}</p>}
    <div className="form-row"><div><label className="field-label" htmlFor="task-priority">Priority</label><div className="select-wrap"><select id="task-priority" value={form.priority} onChange={(event) => field('priority', event.target.value)}><option value="low">Low — no rush</option><option value="medium">Medium — let's do it</option><option value="high">High — first things first</option></select><ChevronDown size={16} aria-hidden="true" /></div></div><div><label className="field-label" htmlFor="task-minutes">Minutes <span className="optional">Optional</span></label><input id="task-minutes" type="number" min="1" max="1440" step="1" value={form.minutes} onChange={(event) => field('minutes', event.target.value)} placeholder="15" aria-invalid={!!errors.minutes} aria-describedby={errors.minutes ? 'task-minutes-error' : undefined} /></div></div><div className="error-slot">{errors.minutes && <p id="task-minutes-error" className="field-error">{errors.minutes}</p>}</div>
    <div className="mission-reward"><Sparkles size={17} /><span>Every small win earns <strong>20 XP</strong> and a happy wiggle.</span></div><div className="modal-actions"><Button variant="neutral" onClick={onClose}>Cancel</Button><Button type="submit">Add mission <Plus size={17} /></Button></div>
  </form></Modal>;
}

function TaskItem({ task, onComplete, onDelete }) {
  return <li className={`task-item ${task.completedAt ? 'is-complete' : ''}`}><button className="task-check" aria-label={task.completedAt ? `Completed: ${task.title}` : `Complete: ${task.title}`} aria-pressed={!!task.completedAt} disabled={!!task.completedAt} onClick={() => onComplete(task.id)}>{task.completedAt && <Check size={17} />}</button><div className="task-content"><strong>{task.title}</strong>{task.description && <p>{task.description}</p>}<div className="task-meta"><span className={`priority priority-${task.priority}`}><span />{capitalize(task.priority)}</span>{task.minutes && <span><Clock3 size={12} />{task.minutes} min</span>}{!task.completedAt && task.createdDay < localDate() && <span>Carried over</span>}{task.completedAt && <span className="done-label"><CheckCheck size={12} />Done</span>}</div></div><span className="task-xp">{task.completedAt ? <Check size={15} /> : '+20 XP'}</span><button className="icon-button task-delete" title={`Delete ${task.title}`} aria-label={`Delete: ${task.title}`} onClick={() => onDelete(task)}><Trash2 size={16} /></button></li>;
}

function TaskManager({ game, onAdd, onComplete, onDelete, onStarter }) {
  const [filter, setFilter] = useState('active');
  const [visible, setVisible] = useState(8);
  const active = game.tasks.filter((task) => !task.completedAt);
  const done = game.tasks.filter((task) => task.completedAt);
  const tasks = filter === 'active' ? active : done;
  return <section className="missions-card card"><div className="section-heading"><div><span className="eyebrow">YOUR NEXT LITTLE VICTORIES</span><h2>Daily missions <span className="heading-flower">✳</span></h2></div><Button className="add-mission" onClick={onAdd}><Plus size={17} /><span>Add mission</span></Button></div><p className="section-subtitle">One thing at a time is a perfectly good plan.</p><div className="mission-tabs" aria-label="Filter missions"><button aria-pressed={filter === 'active'} className={filter === 'active' ? 'active' : ''} onClick={() => { setFilter('active'); setVisible(8); }}>To do <span>{active.length}</span></button><button aria-pressed={filter === 'completed'} className={filter === 'completed' ? 'active' : ''} onClick={() => { setFilter('completed'); setVisible(8); }}>Completed <span>{done.length}</span></button><span className="mission-xp-note"><Sparkles size={13} /> Small effort, real growth</span></div>
    {tasks.length ? <ul className="task-list">{tasks.slice(0, visible).map((task) => <TaskItem key={task.id} task={task} onComplete={onComplete} onDelete={onDelete} />)}</ul> : <div className="empty-missions"><span className="empty-icon">{filter === 'completed' ? <Trophy size={26} /> : <Cloud size={29} />}</span><h3>{filter === 'completed' ? 'A little win is on the way.' : active.length === 0 && completedToday(game) ? 'Look at you. All caught up!' : 'Big things start very small.'}</h3><p>{filter === 'completed' ? 'Your finished missions will live right here.' : 'A glass of water? Five pages? Pick one tiny thing.'}</p>{filter === 'active' && <button className="text-button" onClick={onAdd}>Create your first mission <ArrowRight size={16} /></button>}</div>}
    {tasks.length > visible && <button className="show-more text-button" onClick={() => setVisible((count) => count + 8)}>Show more missions ({tasks.length - visible}) <ChevronDown size={16} /></button>}
    {filter === 'active' && !game.tasks.length && <div className="starter-missions"><span>Need a nudge? Try one:</span><div><button onClick={() => onStarter('Read five pages', 15)}>Read five pages <Plus size={13} /></button><button onClick={() => onStarter('Take a little walk', 10)}>Take a little walk <Plus size={13} /></button><button onClick={() => onStarter('Tidy my desk', 5)}>Tidy my desk <Plus size={13} /></button></div></div>}
    <div className="missions-footer"><Heart size={14} /><span>Showing up counts. Even if it's just for one little thing.</span></div>
  </section>;
}

function DailyGoal({ game }) {
  const completed = completedToday(game);
  const achieved = completed >= DAILY_GOAL;
  return <section className={`daily-goal ${achieved ? 'goal-achieved' : ''}`}><span className="goal-icon">{achieved ? <PartyPopper size={24} /> : <Cookie size={25} />}</span><div className="goal-copy"><h3>{achieved ? 'Cookie unlocked. You earned it!' : "Today's little goal"}</h3><p>{achieved ? 'A cloud cookie is waiting in your treats.' : 'Complete 3 missions. Unlock a cloud cookie.'}</p><div className="goal-dots" aria-label={`${completed} of ${DAILY_GOAL} daily missions complete`}>{Array.from({ length: DAILY_GOAL }, (_, index) => <span className={index < completed ? 'filled' : ''} key={index}>{index < completed && <Check size={10} />}</span>)}</div></div><strong className="goal-count">{completed}<small> / {DAILY_GOAL}</small></strong></section>;
}

function ProgressOverview({ game }) {
  const completed = completedToday(game);
  const percent = game.pet.totalXP % 100;
  return <section className="progress-overview card" aria-label="Your progress"><div className="section-heading"><h2>A little progress, every day.</h2><span className="progress-mini-star">✧</span></div><div className="progress-numbers"><div><span className="progress-icon mint"><CheckCheck size={18} /></span><strong>{completed}</strong><span>Done today</span></div><div><span className="progress-icon lilac"><Sparkles size={18} /></span><strong>{game.pet.totalXP}</strong><span>Total XP</span></div><div><span className="progress-icon peach"><Flame size={18} /></span><strong>{currentStreak(game)}</strong><span>Day streak</span></div><div><span className="progress-icon pale-yellow"><Sprout size={18} /></span><strong>{game.pet.level}</strong><span>Current level</span></div></div><div className="next-level"><span>Next stop: <strong>{STAGES[Math.min(game.pet.level, 4)]}</strong></span><span>{100 - percent} XP to level {game.pet.level + 1}</span></div><div className="next-level-track" role="progressbar" aria-label="Progress to next level" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><span style={{ width: `${percent}%` }} /></div></section>;
}

function RewardSection({ game, onReward }) {
  return <section className="rewards card"><div className="section-heading"><div><span className="eyebrow">LITTLE THINGS, WELL EARNED</span><h2>The treat shelf</h2></div><span className="reward-note">Good things take tiny steps.</span></div><div className="reward-grid">{REWARDS.map((reward) => {
    const Icon = icons[reward.icon]; const locked = game.pet.level < reward.level; const count = game.inventory[reward.id]; const equipped = game.pet.equipped === reward.id; const full = reward.type === 'food' && game.pet.energy === 100 && game.pet.happiness === 100;
    return <div className={`reward-item ${locked ? 'locked' : ''} ${equipped ? 'equipped' : ''}`} key={reward.id}><span className={`reward-art reward-${reward.id}`}><Icon size={31} strokeWidth={1.7} />{!locked && reward.type === 'food' && <span className="reward-quantity">{count}</span>}</span><strong>{reward.name}</strong><p>{locked ? `Unlocks at level ${reward.level}` : reward.description}</p><button disabled={locked || count === 0 || full} onClick={() => onReward(reward.id)}>{locked ? <><Star size={12} /> Level {reward.level}</> : reward.type === 'cosmetic' ? equipped ? 'Take off' : 'Put on' : full ? 'All topped up' : count > 0 ? 'Give treat' : 'All enjoyed'}</button></div>;
  })}</div></section>;
}

function Dashboard({ game, reaction, onAdd, onComplete, onDelete, onRest, onReward, onHelp, onStarter, messageIndex }) {
  return <main className="dashboard page-shell"><div className="dashboard-heading"><div><div className="eyebrow">YOUR LITTLE PRODUCTIVITY CLUB</div><h1>Small steps. <span>Big glow-ups.</span></h1><p>A little effort for you. A whole lot of happy for {game.pet.name}.</p></div><div className="kind-reminder"><span>✳</span> A good day starts<br />with one small thing.</div></div><div className="dashboard-grid"><div className="companion-column"><PetArena game={game} reaction={reaction} onRest={onRest} onFeed={() => onReward('cookie')} onHelp={onHelp} messageIndex={messageIndex} /><div className="support-note"><Leaf size={19} /><p>You're growing together.<br /><strong>At your own pace. Always.</strong></p></div></div><div className="missions-column"><DailyGoal game={game} /><TaskManager game={game} onAdd={onAdd} onComplete={onComplete} onDelete={onDelete} onStarter={onStarter} /><ProgressOverview game={game} /></div></div><RewardSection game={game} onReward={onReward} /><footer className="dashboard-footer"><span><Cloud size={15} /> Your pace is a good pace.</span><span>Made for progress, not perfection.</span></footer></main>;
}

function HowToPlay({ onClose, evolution = false }) {
  return <Modal title={evolution ? 'A tiny legend in the making.' : 'A lovely little productivity loop.'} description="Real-life progress. A very real happy wiggle." onClose={onClose}><div className="guide-steps"><div><span className="step-icon mint"><CheckCheck size={22} /></span><div><h3>Do one small thing</h3><p>Add a real-life mission. Complete it to earn 20 XP, +8 happiness, and +3 energy.</p></div></div><div><span className="step-icon peach"><Cookie size={22} /></span><div><h3>Care, with a side of cookies</h3><p>Three missions in one day earn a cookie. Treats and a daily rest restore energy. Breaks belong here, too.</p></div></div><div><span className="step-icon lilac"><Sprout size={22} /></span><div><h3>Grow at your own pace</h3><p>Every 100 XP brings a new level. Complete one task on consecutive calendar days to grow your streak.</p></div></div></div><div className="evolution-path">{STAGES.map((stage, index) => <div key={stage}><span>{index + 1}</span><p>{stage}</p></div>)}</div><div className="guide-note"><Heart size={18} /><p>Time away is okay. Your pet keeps its XP. A new day uses a little energy; an overdue mission costs just 3 happiness on return.</p></div><Button className="w-full" onClick={onClose}>Let's take a tiny step <ArrowRight size={17} /></Button></Modal>;
}

function Toast({ toast, onDismiss }) {
  useEffect(() => { if (!toast) return; const timer = setTimeout(onDismiss, toast.undo ? 8500 : 4500); return () => clearTimeout(timer); }, [toast, onDismiss]);
  return <div className="toast-region" role="status" aria-live="polite" aria-atomic="true">{toast && <div className="toast" key={toast.id}><span className="toast-icon"><Check size={17} /></span><span>{toast.message}</span>{toast.undo && <button onClick={toast.undo}>Undo</button>}<button className="toast-close" aria-label="Dismiss notification" onClick={onDismiss}><X size={16} /></button></div>}</div>;
}

export default function App() {
  const [initial] = useState(() => loadGame(getStorage()));
  const [game, setGame] = useState(initial.game);
  const gameRef = useRef(initial.game);
  const [screen, setScreen] = useState('landing');
  const [warning, setWarning] = useState(initial.warning);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [reaction, setReaction] = useState(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const toastId = useRef(0);
  const reactionTimer = useRef(null);
  const notify = (message, undo) => setToast({ id: ++toastId.current, message, undo });
  const commit = (action) => {
    let previous = gameRef.current;
    // Refresh committed state before every action so stale tabs do not double-award.
    try { const raw = getStorage().getItem(STORAGE_KEY); if (raw) { const latest = loadGame(getStorage()).game; if (latest) previous = latest; } else if (action.type !== 'adopt' && !warning) previous = null; } catch { /* Continue in memory with the visible save warning. */ }
    const next = gameReducer(previous, action);
    if (!saveGame(next, getStorage())) setWarning("Your progress isn't saved. Allow site storage and use Retry save before refreshing.");
    gameRef.current = next; setGame(next); return { previous, next };
  };
  const react = (message, label = 'A little happy wiggle!') => { clearTimeout(reactionTimer.current); setReaction({ message, label, id: Date.now() }); reactionTimer.current = setTimeout(() => setReaction(null), 4500); };
  useEffect(() => {
    if (initial.game) { saveGame(initial.game, getStorage()); }
    const sync = (event) => { if (event.key !== STORAGE_KEY) return; const loaded = loadGame(getStorage()); gameRef.current = loaded.game; setGame(loaded.game); setWarning(loaded.warning); setModal(null); };
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener('storage', sync); clearTimeout(reactionTimer.current); };
  }, [initial]);
  useEffect(() => {
    const tick = () => { setMessageIndex((index) => index + 1); const previous = gameRef.current; if (previous && previous.lastSeenDay !== localDate()) commit({ type: 'tick' }); };
    const interval = setInterval(tick, 30000);
    const visible = () => { if (document.visibilityState === 'visible') tick(); };
    document.addEventListener('visibilitychange', visible);
    return () => { clearInterval(interval); document.removeEventListener('visibilitychange', visible); };
  });
  const complete = (id) => {
    const { previous, next } = commit({ type: 'complete', id });
    if (!next || next.pet.totalXP === previous.pet.totalXP) return;
    if (next.pet.level > previous.pet.level) { setModal({ type: 'level', level: next.pet.level }); react("WAIT… I'M EVOLVING?!", `LEVEL ${next.pet.level}!`); }
    else react(next.tasks.every((task) => task.completedAt) ? "WE DID IT! A nap has never been more deserved." : "YESSS! Look at us, doing the things!", '+20 XP');
    notify(completedToday(next) === DAILY_GOAL ? '+20 XP! Daily goal reached — a cookie is yours.' : '+20 XP! One little mission, one big happy wiggle.');
  };
  const reward = (id) => {
    const { previous, next } = commit({ type: 'reward', id });
    if (!next || previous === next) return;
    const item = REWARDS.find((item) => item.id === id);
    react(item.type === 'food' ? 'This is what peak snack performance looks like.' : next.pet.equipped ? 'Do I look legendary? Be honest.' : 'Cozy, casual, and ready for anything.', item.type === 'food' ? 'Yum. Thank you!' : 'Looking good!');
    notify(item.type === 'food' ? `${item.name} enjoyed. A little care goes a long way.` : next.pet.equipped ? `${item.name} equipped!` : `${item.name} taken off.`);
  };
  return <><Header game={game} onHome={() => { if (!game) setScreen('landing'); else window.scrollTo({ top: 0, behavior: 'smooth' }); }} onHelp={() => setModal({ type: 'help' })} onSettings={() => setModal({ type: 'settings' })} />
    {warning && <div className="storage-warning" role="alert"><ShieldCheck size={19} /><span>{warning}</span><button onClick={() => { if (saveGame(gameRef.current, getStorage())) { setWarning(''); notify('Progress saved in this browser.'); } else setWarning("This browser still isn't allowing saves. Allow site storage, then retry."); }}>Retry save</button></div>}
    {game ? <Dashboard game={game} reaction={reaction} messageIndex={messageIndex} onHelp={() => setModal({ type: 'evolution' })} onAdd={() => setModal({ type: 'task' })} onComplete={complete} onDelete={(task) => { const index = game.tasks.findIndex((item) => item.id === task.id); commit({ type: 'delete', id: task.id }); notify('Mission removed. Your earned progress stays.', () => { commit({ type: 'restore', task, index }); notify('Mission restored.'); }); }} onRest={() => { const { previous, next } = commit({ type: 'rest' }); if (next && next !== previous) { react('Rest is productive too. Pet-approved.', '+20 energy'); notify('A well-earned rest. Energy restored.'); } }} onReward={reward} onStarter={(title, minutes) => { commit({ type: 'add', task: { title, minutes, priority: 'low', description: '' } }); notify('One small mission added. You’ve got this.'); }} /> : screen === 'adoption' ? <PetAdoption onBack={() => setScreen('landing')} onAdopt={(name, character) => { commit({ type: 'adopt', name, character }); setScreen('landing'); notify(`${name} is home. Your little adventure starts here.`); }} /> : <LandingPage onAdopt={() => { setScreen('adoption'); window.scrollTo({ top: 0 }); }} />}
    {modal?.type === 'task' && <TaskForm onClose={() => setModal(null)} onSave={(task) => { commit({ type: 'add', task }); setModal(null); notify('Mission added. Small steps start here.'); }} />}
    {(modal?.type === 'help' || modal?.type === 'evolution') && <HowToPlay evolution={modal.type === 'evolution'} onClose={() => setModal(null)} />}
    {modal?.type === 'level' && game && <Modal title={`Hello, level ${modal.level}!`} description="Turns out, little things really do add up." className="level-modal" onClose={() => setModal(null)}><div className="level-up-art"><span>✦</span><PetCharacter character={game.pet.character} level={game.pet.level} celebrate equipped={game.pet.equipped} /><span>✧</span></div><span className="evolution-badge"><Sparkles size={15} />{game.pet.stage}</span><p>{game.pet.name} is growing alongside you. {REWARDS.some((item) => item.level === modal.level) ? `${REWARDS.find((item) => item.level === modal.level).name} is waiting on the treat shelf!` : 'Another level, another reason to be proud.'}</p><Button className="w-full" onClick={() => setModal(null)}>Look at us go! <PartyPopper size={18} /></Button></Modal>}
    {modal?.type === 'settings' && <Modal title="Your cozy little corner." description="Your companion lives right here, in this browser." onClose={() => setModal(null)}><div className="settings-info"><ShieldCheck size={22} /><div><strong>{warning ? 'Save needs attention' : 'Progress saved locally'}</strong><p>No accounts, no cloud sync. Keep using this browser to keep your little adventure.</p></div></div><div className="settings-rule"><h3>Fancy a fresh start?</h3><p>Resetting removes your pet, missions, streak, and all progress in this browser.</p><Button variant="danger-outline" onClick={() => setModal({ type: 'reset' })}>Reset game <Trash2 size={16} /></Button></div><Button variant="neutral" className="w-full" onClick={() => setModal(null)}>Back to my companion</Button></Modal>}
    {modal?.type === 'reset' && <Modal title="Start a new little adventure?" description="This deletes your pet, all missions, treats, XP, and streak. This cannot be undone." onClose={() => setModal(null)} initialFocus="cancel"><div className="modal-actions"><Button variant="neutral" data-cancel onClick={() => setModal(null)}>Cancel</Button><Button variant="danger" onClick={() => { commit({ type: 'reset' }); setModal(null); setScreen('landing'); setReaction(null); notify('Fresh start. A new little friend is waiting.'); }}>Reset game</Button></div></Modal>}
    <Toast toast={toast} onDismiss={() => setToast(null)} />
  </>;
}
