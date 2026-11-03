export const USER_NAME = 'Wafaa'; // change to the client's name

export const todayStr = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};
const addDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

export const fmtDate = (s) =>
  s ? new Date(s + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date';

export const STATUS = { todo: 'To Do', inprogress: 'In Progress', completed: 'Completed' };
export const PRIORITY = { high: 'High', medium: 'Medium', low: 'Low' };

export const VIEWS = {
  dashboard: 'Dashboard',
  all: 'All Tasks',
  today: 'Today',
  upcoming: 'Upcoming',
  completed: 'Completed',
  overdue: 'Overdue',
};

export const isOverdue = (t) => t.status !== 'completed' && !!t.dueDate && t.dueDate < todayStr();

export const inView = (t, v) => {
  const td = todayStr();
  switch (v) {
    case 'today': return t.dueDate === td;
    case 'upcoming': return !!t.dueDate && t.dueDate > td && t.status !== 'completed';
    case 'completed': return t.status === 'completed';
    case 'overdue': return isOverdue(t);
    default: return true;
  }
};

const seed = () => [
  { id: 's1', title: 'Finish React project', description: 'Build the dashboard components and polish responsive layouts.', dueDate: todayStr(), priority: 'high', status: 'inprogress', createdAt: 6 },
  { id: 's2', title: 'Review university lectures', description: 'Revisit this week\u2019s algorithms lectures and summarize key ideas.', dueDate: addDays(1), priority: 'medium', status: 'todo', createdAt: 5 },
  { id: 's3', title: 'Practice JavaScript', description: 'Work through array methods and three async coding exercises.', dueDate: todayStr(), priority: 'low', status: 'todo', createdAt: 4 },
  { id: 's4', title: 'Complete database assignment', description: 'Finish the ER diagram and validate the SQL queries.', dueDate: addDays(-2), priority: 'high', status: 'inprogress', createdAt: 3 },
  { id: 's5', title: 'Submit project documentation', description: 'Export the final project report and upload it to the portal.', dueDate: addDays(4), priority: 'medium', status: 'todo', createdAt: 2 },
  { id: 's6', title: 'Read software testing notes', description: 'Review unit testing principles and annotate the study guide.', dueDate: todayStr(), priority: 'low', status: 'completed', createdAt: 1 },
];

export const loadTasks = () => {
  try {
    const raw = localStorage.getItem('taskly.tasks');
    if (raw) return JSON.parse(raw);
  } catch {}
  return seed();
};

export const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
