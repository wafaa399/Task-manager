import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, LayoutGrid, List, Menu, Bell, AlertCircle, ClipboardList } from 'lucide-react';
import Sidebar from './components/Sidebar';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';
import { USER_NAME, VIEWS, STATUS, loadTasks, inView, newId } from './utils';

const RANK = { high: 0, medium: 1, low: 2 };
const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
};

export default function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [view, setView] = useState('dashboard');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [sort, setSort] = useState('due');
  const [layout, setLayout] = useState('grid');
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState(null); // null | { task: obj|null }
  const [toDelete, setToDelete] = useState(null);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem('taskly.tasks', JSON.stringify(tasks)); } catch {}
  }, [tasks]);

  const counts = useMemo(
    () => Object.fromEntries(Object.keys(VIEWS).map((v) => [v, tasks.filter((t) => inView(t, v)).length])),
    [tasks]
  );
  const stat = (s) => tasks.filter((t) => t.status === s).length;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks
      .filter((t) => inView(t, view))
      .filter((t) => status === 'all' || t.status === status)
      .filter((t) => priority === 'all' || t.priority === priority)
      .filter((t) => !q || `${t.title} ${t.description}`.toLowerCase().includes(q))
      .sort((a, b) =>
        sort === 'priority' ? RANK[a.priority] - RANK[b.priority]
        : sort === 'newest' ? b.createdAt - a.createdAt
        : (a.dueDate || '9999').localeCompare(b.dueDate || '9999'));
  }, [tasks, view, status, priority, sort, query]);

  const saveTask = (data) => {
    setTasks((p) =>
      data.id ? p.map((t) => (t.id === data.id ? { ...t, ...data } : t))
              : [{ ...data, id: newId(), createdAt: Date.now() }, ...p]);
    setModal(null);
  };
  const toggle = (id) =>
    setTasks((p) => p.map((t) => (t.id === id ? { ...t, status: t.status === 'completed' ? 'todo' : 'completed' } : t)));
  const remove = () => { setTasks((p) => p.filter((t) => t.id !== toDelete.id)); setToDelete(null); };

  const title = view === 'dashboard' ? 'Your tasks' : `${VIEWS[view]} tasks`;

  return (
    <div className="app">
      <Sidebar view={view} setView={setView} counts={counts} open={navOpen} onClose={() => setNavOpen(false)} />

      <main className="main">
        <header className="topbar">
          <button className="icon-btn menu-btn" onClick={() => setNavOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
          <label className="search">
            <Search size={15} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search your tasks..." />
          </label>
          <span className="icon-btn bell"><Bell size={17} /></span>
        </header>

        <section className="hello">
          <h1>{greeting()}, {USER_NAME}!</h1>
          <p>Let&rsquo;s make today productive.</p>
        </section>

        <section className="stats">
          {[['Total Tasks', tasks.length, 'in your workspace'], ['To Do', stat('todo'), 'ready to begin'],
            ['In Progress', stat('inprogress'), 'keep going'], ['Completed', stat('completed'), 'a little win']].map(([l, n, s]) => (
            <div className="stat" key={l}><small>{l}</small><strong>{n}</strong><span>{s}</span></div>
          ))}
        </section>

        <section className="list-head">
          <div>
            <h2>{title}</h2>
            <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
          <button className="btn primary" onClick={() => setModal({ task: null })}><Plus size={16} /> Add New Task</button>
        </section>

        <section className="toolbar">
          <div className="tabs" role="tablist">
            {[['all', 'All'], ...Object.entries(STATUS)].map(([k, l]) => (
              <button key={k} role="tab" aria-selected={status === k} className={status === k ? 'on' : ''} onClick={() => setStatus(k)}>{l}</button>
            ))}
          </div>
          <div className="controls">
            <select value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Filter by priority">
              <option value="all">All priorities</option><option value="high">High</option>
              <option value="medium">Medium</option><option value="low">Low</option>
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort tasks">
              <option value="due">Sort: Due Date</option><option value="priority">Sort: Priority</option><option value="newest">Sort: Newest</option>
            </select>
            <div className="toggle">
              <button className={layout === 'grid' ? 'on' : ''} onClick={() => setLayout('grid')} aria-label="Grid view"><LayoutGrid size={15} /></button>
              <button className={layout === 'list' ? 'on' : ''} onClick={() => setLayout('list')} aria-label="List view"><List size={15} /></button>
            </div>
          </div>
        </section>

        {view === 'overdue' && counts.overdue > 0 && (
          <div className="banner"><AlertCircle size={15} /> {counts.overdue} {counts.overdue === 1 ? 'task is' : 'tasks are'} past due. Update the due date or take the next small step.</div>
        )}

        {visible.length === 0 ? (
          <div className="empty">
            <ClipboardList size={30} />
            <h3>{query ? 'No tasks match your search' : 'Nothing here yet'}</h3>
            <p>{query ? 'Try a different word or clear the filters.' : 'Add a task to give your day some direction.'}</p>
            <button className="btn primary" onClick={() => setModal({ task: null })}><Plus size={16} /> Add New Task</button>
          </div>
        ) : (
          <div className={`tasks ${layout}`}>
            {visible.map((t) => (
              <TaskCard key={t.id} task={t} onToggle={toggle} onEdit={(task) => setModal({ task })} onDelete={setToDelete} />
            ))}
          </div>
        )}

        <footer className="foot"><span>All changes saved</span><span>Small steps. Meaningful days.</span></footer>
      </main>

      {modal && <TaskModal task={modal.task} onSave={saveTask} onClose={() => setModal(null)} />}

      {toDelete && (
        <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && setToDelete(null)}>
          <div className="modal confirm" role="alertdialog">
            <h2>Delete this task?</h2>
            <p>&ldquo;{toDelete.title}&rdquo; will be removed permanently.</p>
            <div className="modal-foot">
              <button className="btn ghost" onClick={() => setToDelete(null)}>Cancel</button>
              <button className="btn danger" onClick={remove}>Delete task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
