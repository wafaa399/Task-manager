import { LayoutDashboard, ListChecks, Sun, CalendarClock, CheckCircle2, AlertCircle, Leaf, X } from 'lucide-react';
import { VIEWS, USER_NAME } from '../utils';

const ICONS = {
  dashboard: LayoutDashboard, all: ListChecks, today: Sun,
  upcoming: CalendarClock, completed: CheckCircle2, overdue: AlertCircle,
};

export default function Sidebar({ view, setView, counts, open, onClose }) {
  return (
    <>
      <div className={`scrim ${open ? 'show' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <span className="brand-mark"><Leaf size={18} /></span>
          <span className="brand-name">Taskly</span>
          <button className="icon-btn close-nav" onClick={onClose} aria-label="Close menu"><X size={18} /></button>
        </div>

        <nav>
          <p className="nav-label">Workspace</p>
          {Object.entries(VIEWS).map(([key, label]) => {
            const Icon = ICONS[key];
            return (
              <button key={key} className={`nav-item ${view === key ? 'active' : ''}`} onClick={() => { setView(key); onClose(); }}>
                <Icon size={16} />
                <span>{label}</span>
                {key !== 'dashboard' && <span className="count">{counts[key]}</span>}
              </button>
            );
          })}
        </nav>

        <div className="nudge">
          <Leaf size={16} />
          <h4>A little progress, every day.</h4>
          <p>Make space for what matters. One task at a time.</p>
        </div>

        <div className="profile">
          <span className="avatar">{USER_NAME.slice(0, 2).toUpperCase()}</span>
          <div><strong>{USER_NAME}</strong><small>Personal workspace</small></div>
        </div>
      </aside>
    </>
  );
}
