import { Calendar, Pencil, Trash2, Check } from 'lucide-react';
import { fmtDate, isOverdue, PRIORITY, STATUS } from '../utils';

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const done = task.status === 'completed';
  const late = isOverdue(task);
  return (
    <article className={`card ${done ? 'is-done' : ''}`}>
      <div className="card-top">
        <button
          className={`check ${done ? 'on' : ''}`}
          onClick={() => onToggle(task.id)}
          aria-label={done ? 'Mark as not done' : 'Mark as done'}
          aria-pressed={done}
        >
          {done && <Check size={13} strokeWidth={3} />}
        </button>
        <span className={`pill prio-${task.priority}`}>{PRIORITY[task.priority]}</span>
        <div className="card-actions">
          <button className="icon-btn" onClick={() => onEdit(task)} aria-label="Edit task"><Pencil size={15} /></button>
          <button className="icon-btn danger" onClick={() => onDelete(task)} aria-label="Delete task"><Trash2 size={15} /></button>
        </div>
      </div>
      <h3>{task.title}</h3>
      {task.description && <p className="desc">{task.description}</p>}
      <div className="card-foot">
        <span className={`date ${late ? 'late' : ''}`}><Calendar size={13} /> {fmtDate(task.dueDate)}</span>
        <span className={`pill st-${task.status}`}>{STATUS[task.status]}</span>
      </div>
    </article>
  );
}
