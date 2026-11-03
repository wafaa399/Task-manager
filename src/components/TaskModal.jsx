import { useEffect, useRef, useState } from 'react';
import { X, Check } from 'lucide-react';
import { PRIORITY, STATUS, todayStr } from '../utils';

function Segmented({ options, value, onChange }) {
  return (
    <div className="seg">
      {Object.entries(options).map(([k, label]) => (
        <button type="button" key={k} className={value === k ? 'on' : ''} onClick={() => onChange(k)}>
          {value === k && <Check size={13} />} {label}
        </button>
      ))}
    </div>
  );
}

export default function TaskModal({ task, onSave, onClose }) {
  const editing = !!task;
  const [form, setForm] = useState(
    task || { title: '', description: '', dueDate: todayStr(), priority: 'medium', status: 'todo' }
  );
  const [error, setError] = useState('');
  const titleRef = useRef(null);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    titleRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError('Give your task a title.');
    onSave({ ...form, title: form.title.trim(), description: form.description.trim() });
  };

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit} role="dialog" aria-modal="true" aria-label={editing ? 'Edit task' : 'Add task'}>
        <div className="modal-head">
          <div>
            <h2>{editing ? 'Edit Task' : 'Add Task'}</h2>
            <p>{editing ? 'Update the details and keep moving forward.' : 'A little progress starts here. Give your day a little direction.'}</p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>

        <label>Task Title
          <input ref={titleRef} value={form.title} placeholder="What would you like to get done?"
            onChange={(e) => { set('title')(e.target.value); setError(''); }} />
        </label>
        {error && <p className="field-error">{error}</p>}

        <label>Description
          <textarea rows={3} value={form.description} placeholder="Add a few details to help you get started..."
            onChange={(e) => set('description')(e.target.value)} />
        </label>

        <label>Due Date
          <input type="date" value={form.dueDate} onChange={(e) => set('dueDate')(e.target.value)} />
        </label>

        <div className="field"><span>Priority</span><Segmented options={PRIORITY} value={form.priority} onChange={set('priority')} /></div>
        <div className="field"><span>Status</span><Segmented options={STATUS} value={form.status} onChange={set('status')} /></div>

        <div className="modal-foot">
          <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn primary"><Check size={15} /> Save Task</button>
        </div>
      </form>
    </div>
  );
}
