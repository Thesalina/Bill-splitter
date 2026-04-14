import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  addExpense,
  addMember,
  createGroup,
  deleteExpense,
  deleteGroup,
  deleteMember,
  getExpenses,
  getGroups,
  getMembers,
  getSplit,
} from './api';

/* ─── Icons ─────────────────────────────────────────────────────────────── */
const Icon = {
  X: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Plus: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Users: ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="12" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 26c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="22" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M22 18c2.8.4 5 2.9 5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Arrow: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Receipt: ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="6" y="4" width="20" height="24" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 10h10M11 15h10M11 20h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

/* ─── Helpers ───────────────────────────────────────────────────────────── */
const initials = (name = '') =>
  name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';

const currency = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

/* ─── Styles (injected once) ────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --font: 'DM Sans', sans-serif;
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --radius-xl: 20px;
    --sidebar-w: 288px;
    --header-h: 64px;

    /* Light */
    --bg-page: #f5f4f0;
    --bg-surface: #ffffff;
    --bg-sunken: #eeecea;
    --bg-hover: #f0efeb;
    --border: rgba(0,0,0,.10);
    --border-strong: rgba(0,0,0,.16);
    --text-primary: #1a1917;
    --text-secondary: #6b6860;
    --text-tertiary: #a09e99;
    --accent: #1d6f42;
    --accent-bg: #e6f4ec;
    --accent-text: #145530;
    --danger: #b91c1c;
    --danger-bg: #fef2f2;
    --danger-text: #991b1b;
    --amber: #92400e;
    --amber-bg: #fffbeb;
    --amber-text: #78350f;
    --info-bg: #eff6ff;
    --info-text: #1e40af;
    --tag-bg: #f0efeb;
    --tag-text: #4a4845;
    --shadow: 0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.05);
    --shadow-md: 0 4px 12px rgba(0,0,0,.08), 0 2px 4px rgba(0,0,0,.05);
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --bg-page: #141412;
      --bg-surface: #1e1d1b;
      --bg-sunken: #121210;
      --bg-hover: #272520;
      --border: rgba(255,255,255,.10);
      --border-strong: rgba(255,255,255,.18);
      --text-primary: #f0efe9;
      --text-secondary: #9a9890;
      --text-tertiary: #5e5c58;
      --accent: #34d399;
      --accent-bg: #0d2e1e;
      --accent-text: #6ee7b7;
      --danger: #ef4444;
      --danger-bg: #2a1212;
      --danger-text: #fca5a5;
      --amber: #fbbf24;
      --amber-bg: #2a1e00;
      --amber-text: #fde68a;
      --info-bg: #0f1e3a;
      --info-text: #93c5fd;
      --tag-bg: #2a2825;
      --tag-text: #b0aea8;
      --shadow: 0 1px 3px rgba(0,0,0,.40);
      --shadow-md: 0 4px 12px rgba(0,0,0,.40);
    }
  }

  body, #root {
    font-family: var(--font);
    background: var(--bg-page);
    color: var(--text-primary);
    min-height: 100vh;
    font-size: 15px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  /* ── App shell ── */
  .shell {
    display: flex;
    min-height: 100vh;
  }

  /* ── Sidebar ── */
  .sidebar {
    width: var(--sidebar-w);
    flex-shrink: 0;
    background: var(--bg-surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
  }
  .sidebar-brand {
    padding: 20px 20px 16px;
    border-bottom: 1px solid var(--border);
  }
  .sidebar-brand h1 {
    font-size: 17px;
    font-weight: 600;
    letter-spacing: -.01em;
    margin-bottom: 2px;
  }
  .sidebar-brand p {
    font-size: 12px;
    color: var(--text-tertiary);
  }
  .sidebar-section {
    padding: 12px 12px 6px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .07em;
    text-transform: uppercase;
    color: var(--text-tertiary);
  }
  .new-group-form {
    padding: 0 12px 10px;
    display: flex;
    gap: 6px;
  }
  .group-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 4px 8px 12px;
  }
  .group-scroll::-webkit-scrollbar { width: 4px; }
  .group-scroll::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

  .group-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 10px;
    border-radius: var(--radius-md);
    cursor: pointer;
    position: relative;
    margin-bottom: 2px;
    border: 1px solid transparent;
    transition: background .12s, border-color .12s;
    text-align: left;
    width: 100%;
    background: transparent;
    color: var(--text-primary);
    font-family: var(--font);
  }
  .group-item:hover { background: var(--bg-hover); }
  .group-item.active {
    background: var(--bg-sunken);
    border-color: var(--border);
  }
  .g-avatar {
    width: 34px; height: 34px;
    border-radius: var(--radius-sm);
    background: var(--accent-bg);
    color: var(--accent-text);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 600;
    flex-shrink: 0;
  }
  .g-info { flex: 1; min-width: 0; }
  .g-name { font-size: 14px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .g-meta { font-size: 11px; color: var(--text-tertiary); margin-top: 1px; }
  .g-del {
    display: none;
    border: none; background: none; cursor: pointer;
    padding: 4px; color: var(--text-tertiary);
    border-radius: 6px; line-height: 1;
    transition: color .1s, background .1s;
  }
  .g-del:hover { color: var(--danger); background: var(--danger-bg); }
  .group-item:hover .g-del { display: flex; align-items: center; }

  /* ── Main ── */
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 100vh;
  }

  /* ── Page header ── */
  .page-header {
    background: var(--bg-surface);
    border-bottom: 1px solid var(--border);
    padding: 20px 32px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }
  .page-header h2 { font-size: 22px; font-weight: 600; letter-spacing: -.02em; margin-bottom: 2px; }
  .page-header p { font-size: 13px; color: var(--text-secondary); }

  /* ── Stats bar ── */
  .stats-bar {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    padding: 20px 32px;
    border-bottom: 1px solid var(--border);
    background: var(--bg-surface);
  }
  .stat-card {
    background: var(--bg-sunken);
    border-radius: var(--radius-md);
    padding: 14px 16px;
  }
  .stat-label { font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--text-tertiary); margin-bottom: 6px; }
  .stat-value { font-size: 22px; font-weight: 600; letter-spacing: -.02em; line-height: 1; margin-bottom: 4px; }
  .stat-hint { font-size: 12px; color: var(--text-secondary); }

  /* ── Tabs ── */
  .tabs {
    background: var(--bg-surface);
    border-bottom: 1px solid var(--border);
    padding: 0 32px;
    display: flex;
    gap: 0;
  }
  .tab-btn {
    padding: 12px 0;
    margin-right: 24px;
    font-size: 14px;
    font-family: var(--font);
    cursor: pointer;
    color: var(--text-secondary);
    border-bottom: 2px solid transparent;
    font-weight: 400;
    background: none;
    border-top: none; border-left: none; border-right: none;
    transition: color .12s, border-color .12s;
    display: flex;
    align-items: center;
    gap: 7px;
    white-space: nowrap;
  }
  .tab-btn:hover { color: var(--text-primary); }
  .tab-btn.active { color: var(--text-primary); border-bottom-color: var(--text-primary); font-weight: 500; }
  .tab-badge {
    font-size: 11px; font-weight: 500;
    padding: 1px 7px;
    border-radius: 20px;
    background: var(--tag-bg);
    color: var(--tag-text);
  }

  /* ── Panel ── */
  .panel {
    flex: 1;
    padding: 24px 32px 40px;
    overflow-y: auto;
  }

  /* ── Add form ── */
  .add-form {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 14px 16px;
    margin-bottom: 20px;
    box-shadow: var(--shadow);
  }
  .add-form input, .add-form select {
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--bg-sunken);
    color: var(--text-primary);
    font-family: var(--font);
    font-size: 14px;
    outline: none;
    min-width: 0;
    transition: border-color .12s, box-shadow .12s;
  }
  .add-form input:focus, .add-form select:focus {
    border-color: var(--border-strong);
    box-shadow: 0 0 0 3px rgba(0,0,0,.05);
  }
  .add-form input::placeholder { color: var(--text-tertiary); }
  .f-grow { flex: 1; min-width: 130px; }
  .f-amt { width: 110px; }
  .f-who { min-width: 120px; }

  /* ── Inputs (standalone) ── */
  input.field, select.field {
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--bg-sunken);
    color: var(--text-primary);
    font-family: var(--font);
    font-size: 14px;
    outline: none;
    width: 100%;
    transition: border-color .12s, box-shadow .12s;
  }
  input.field:focus, select.field:focus {
    border-color: var(--border-strong);
    box-shadow: 0 0 0 3px rgba(0,0,0,.05);
  }
  input.field::placeholder { color: var(--text-tertiary); }

  /* ── Buttons ── */
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    padding: 8px 14px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    background: var(--bg-surface);
    color: var(--text-primary);
    font-family: var(--font);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: background .12s, border-color .12s, transform .1s;
    flex-shrink: 0;
    line-height: 1;
  }
  .btn:hover { background: var(--bg-hover); border-color: var(--border-strong); }
  .btn:active { transform: scale(.98); }
  .btn-accent {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
  }
  .btn-accent:hover { opacity: .88; background: var(--accent); }
  .btn-xs {
    padding: 5px 10px;
    font-size: 12px;
    border-radius: 6px;
  }

  /* ── Member cards ── */
  .members-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
  }
  .member-card {
    display: flex; align-items: center; gap: 12px;
    padding: 14px;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow);
    transition: border-color .12s;
    position: relative;
  }
  .member-card:hover { border-color: var(--border-strong); }
  .m-avatar {
    width: 38px; height: 38px;
    border-radius: 50%;
    background: var(--info-bg);
    color: var(--info-text);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 600;
    flex-shrink: 0;
  }
  .m-name { font-size: 14px; font-weight: 500; flex: 1; }
  .m-del {
    border: none; background: none; cursor: pointer;
    padding: 4px; color: var(--text-tertiary); border-radius: 6px;
    opacity: 0; transition: opacity .12s, color .1s, background .1s;
    line-height: 1; display: flex; align-items: center;
  }
  .member-card:hover .m-del { opacity: 1; }
  .m-del:hover { color: var(--danger); background: var(--danger-bg); }

  /* ── Expense rows ── */
  .expense-list { display: flex; flex-direction: column; gap: 8px; }
  .expense-row {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 16px;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow);
    transition: border-color .12s;
  }
  .expense-row:hover { border-color: var(--border-strong); }
  .exp-icon {
    width: 38px; height: 38px; flex-shrink: 0;
    border-radius: var(--radius-sm);
    background: var(--amber-bg);
    color: var(--amber);
    display: flex; align-items: center; justify-content: center;
  }
  .exp-body { flex: 1; min-width: 0; }
  .exp-desc { font-size: 14px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .exp-meta { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }
  .exp-amt { font-size: 16px; font-weight: 600; color: var(--accent); white-space: nowrap; }
  .exp-del {
    border: none; background: none; cursor: pointer;
    padding: 4px; color: var(--text-tertiary); border-radius: 6px;
    opacity: 0; transition: opacity .12s, color .1s, background .1s;
    line-height: 1; display: flex; align-items: center;
  }
  .expense-row:hover .exp-del { opacity: 1; }
  .exp-del:hover { color: var(--danger); background: var(--danger-bg); }

  /* ── Split ── */
  .split-section-title {
    font-size: 11px; font-weight: 600; letter-spacing: .07em;
    text-transform: uppercase; color: var(--text-tertiary);
    margin: 20px 0 10px;
  }
  .split-section-title:first-child { margin-top: 0; }
  .balances-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 8px; }
  .balance-card {
    display: flex; justify-content: space-between; align-items: center;
    padding: 12px 14px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    background: var(--bg-surface);
    box-shadow: var(--shadow);
  }
  .balance-name { font-size: 14px; font-weight: 500; }
  .badge {
    font-size: 12px; font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;
  }
  .badge-pos { background: var(--accent-bg); color: var(--accent-text); }
  .badge-neg { background: var(--danger-bg); color: var(--danger-text); }
  .badge-zero { background: var(--tag-bg); color: var(--tag-text); }

  .settle-list { display: flex; flex-direction: column; gap: 8px; }
  .settle-row {
    display: flex; align-items: center; gap: 10px;
    padding: 14px 16px;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow);
    font-size: 14px;
  }
  .settle-from { font-weight: 600; color: var(--danger); }
  .settle-to { font-weight: 600; color: var(--accent); }
  .settle-verb { color: var(--text-secondary); font-size: 13px; }
  .settle-amt { margin-left: auto; font-size: 16px; font-weight: 700; }

  /* ── Empty ── */
  .empty-state {
    border: 1px dashed var(--border);
    border-radius: var(--radius-lg);
    padding: 48px 32px;
    text-align: center;
    color: var(--text-tertiary);
  }
  .empty-icon { margin: 0 auto 16px; opacity: .35; display: flex; justify-content: center; }
  .empty-title { font-size: 15px; font-weight: 500; color: var(--text-secondary); margin-bottom: 6px; }
  .empty-sub { font-size: 13px; }

  /* ── Welcome screen ── */
  .welcome {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 48px 32px; text-align: center;
    color: var(--text-secondary);
  }
  .welcome-icon { margin-bottom: 20px; opacity: .25; }
  .welcome h2 { font-size: 20px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px; }
  .welcome p { font-size: 14px; max-width: 300px; }

  /* ── Loading ── */
  .loading-screen {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 16px; background: var(--bg-page);
  }
  .spinner {
    width: 36px; height: 36px;
    border: 2px solid var(--border);
    border-top-color: var(--text-secondary);
    border-radius: 50%;
    animation: spin .8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Responsive ── */
  @media (max-width: 700px) {
    .shell { flex-direction: column; }
    .sidebar { width: 100%; height: auto; position: static; border-right: none; border-bottom: 1px solid var(--border); }
    .stats-bar { grid-template-columns: repeat(2, 1fr); }
    .page-header { padding: 16px 20px; }
    .stats-bar { padding: 16px 20px; }
    .tabs { padding: 0 20px; }
    .panel { padding: 20px; }
    .add-form { padding: 12px; }
    .group-scroll { max-height: 220px; }
  }
`;

function injectStyles() {
  if (document.getElementById('bsplitter-styles')) return;
  const el = document.createElement('style');
  el.id = 'bsplitter-styles';
  el.textContent = CSS;
  document.head.appendChild(el);
}

/* ─── Sub-components ────────────────────────────────────────────────────── */
function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="spinner" />
      <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Loading your groups…</p>
    </div>
  );
}

function StatCard({ label, value, hint }) {
  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      {hint && <p className="stat-hint">{hint}</p>}
    </div>
  );
}

function EmptyState({ icon, title, sub }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <p className="empty-title">{title}</p>
      <p className="empty-sub">{sub}</p>
    </div>
  );
}

/* ─── Members Tab ───────────────────────────────────────────────────────── */
function MembersTab({ groupId, members, onMembersChange }) {
  const [name, setName] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await addMember(groupId, name.trim());
      const { data } = await getMembers(groupId);
      onMembersChange(data);
      setName('');
    } catch (err) {
      console.error('Failed to add member:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMember(id);
      const { data } = await getMembers(groupId);
      onMembersChange(data);
    } catch (err) {
      console.error('Failed to delete member:', err);
    }
  };

  return (
    <div>
      <form className="add-form" onSubmit={handleAdd}>
        <input
          className="f-grow"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter member name…"
        />
        <button type="submit" className="btn btn-accent">
          <Icon.Plus size={13} /> Add member
        </button>
      </form>

      {members.length === 0 ? (
        <EmptyState
          icon={<Icon.Users />}
          title="No members yet"
          sub="Add everyone who will share expenses in this group."
        />
      ) : (
        <div className="members-grid">
          {members.map((m) => (
            <div key={m._id} className="member-card">
              <div className="m-avatar">{initials(m.name)}</div>
              <span className="m-name">{m.name}</span>
              <button
                type="button"
                className="m-del"
                onClick={() => handleDelete(m._id)}
                aria-label={`Remove ${m.name}`}
              >
                <Icon.X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Expenses Tab ──────────────────────────────────────────────────────── */
function ExpensesTab({ groupId, members, expenses, onDataChange }) {
  const [form, setForm] = useState({ description: '', amount: '', paidBy: '' });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.description || !form.amount || !form.paidBy) return;
    try {
      await addExpense(groupId, {
        description: form.description.trim(),
        amount: parseFloat(form.amount),
        paidBy: form.paidBy,
      });
      const [expRes, splitRes] = await Promise.all([getExpenses(groupId), getSplit(groupId)]);
      onDataChange(expRes.data, splitRes.data);
      setForm({ description: '', amount: '', paidBy: '' });
    } catch (err) {
      console.error('Failed to add expense:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      const [expRes, splitRes] = await Promise.all([getExpenses(groupId), getSplit(groupId)]);
      onDataChange(expRes.data, splitRes.data);
    } catch (err) {
      console.error('Failed to delete expense:', err);
    }
  };

  return (
    <div>
      <form className="add-form" onSubmit={handleAdd}>
        <input
          className="f-grow"
          type="text"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="What was this for?"
        />
        <input
          className="f-amt"
          type="number"
          min="0"
          step="0.01"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          placeholder="Amount"
        />
        <select
          className="f-who"
          value={form.paidBy}
          onChange={(e) => setForm({ ...form, paidBy: e.target.value })}
        >
          <option value="">Paid by…</option>
          {members.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-accent">
          <Icon.Plus size={13} /> Add expense
        </button>
      </form>

      {expenses.length === 0 ? (
        <EmptyState
          icon={<Icon.Receipt />}
          title="No expenses yet"
          sub="Log the first receipt to start calculating the split."
        />
      ) : (
        <div className="expense-list">
          {expenses.map((exp) => (
            <div key={exp._id} className="expense-row">
              <div className="exp-icon">
                <Icon.Receipt size={18} />
              </div>
              <div className="exp-body">
                <p className="exp-desc">{exp.description}</p>
                <p className="exp-meta">Paid by {exp.paidBy?.name || 'Unknown'}</p>
              </div>
              <span className="exp-amt">{currency(exp.amount)}</span>
              <button
                type="button"
                className="exp-del"
                onClick={() => handleDelete(exp._id)}
                aria-label={`Delete ${exp.description}`}
              >
                <Icon.X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Split Tab ─────────────────────────────────────────────────────────── */
function SplitTab({ splitData, members, expenses }) {
  const totalExpenses = useMemo(
    () => expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0),
    [expenses]
  );

  if (!splitData || !members.length || !expenses.length) {
    return (
      <EmptyState
        icon={<Icon.Users />}
        title="Nothing to calculate"
        sub="Add members and at least one expense to see how the bill splits."
      />
    );
  }

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 12,
          marginBottom: 24,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 16,
          boxShadow: 'var(--shadow)',
        }}
      >
        <StatCard
          label="Total expenses"
          value={currency(splitData.totalExpenses)}
          hint={`${expenses.length} receipt${expenses.length !== 1 ? 's' : ''}`}
        />
        <StatCard
          label="Per person"
          value={currency(splitData.fairSharePerPerson)}
          hint="Fair share"
        />
        <StatCard
          label="Avg expense"
          value={currency(expenses.length ? totalExpenses / expenses.length : 0)}
          hint={`across ${members.length} member${members.length !== 1 ? 's' : ''}`}
        />
      </div>

      <p className="split-section-title">Individual balances</p>
      <div className="balances-grid" style={{ marginBottom: 4 }}>
        {splitData.balances.map((b, i) => {
          const isPos = b.balance > 0.009;
          const isNeg = b.balance < -0.009;
          return (
            <div key={i} className="balance-card">
              <span className="balance-name">{b.name}</span>
              <span className={`badge ${isPos ? 'badge-pos' : isNeg ? 'badge-neg' : 'badge-zero'}`}>
                {isPos ? '+' : ''}
                {currency(b.balance)}
              </span>
            </div>
          );
        })}
      </div>

      <p className="split-section-title" style={{ marginTop: 24 }}>
        {splitData.settlements.length ? 'Settlements needed' : 'Settlements'}
      </p>
      {splitData.settlements.length === 0 ? (
        <div
          style={{
            padding: '16px 18px',
            background: 'var(--accent-bg)',
            borderRadius: 'var(--radius-md)',
            fontSize: 14,
            color: 'var(--accent-text)',
            fontWeight: 500,
          }}
        >
          ✓ All settled up — no payments needed.
        </div>
      ) : (
        <div className="settle-list">
          {splitData.settlements.map((s, i) => (
            <div key={i} className="settle-row">
              <span className="settle-from">{s.from}</span>
              <span className="settle-verb">pays</span>
              <Icon.Arrow size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
              <span className="settle-to">{s.to}</span>
              <span className="settle-amt">{currency(s.amount)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Group Details ─────────────────────────────────────────────────────── */
function GroupDetails({ group }) {
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [splitData, setSplitData] = useState(null);
  const [activeTab, setActiveTab] = useState('members');

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0),
    [expenses]
  );

  useEffect(() => {
    (async () => {
      try {
        const [membersRes, expensesRes, splitRes] = await Promise.all([
          getMembers(group._id),
          getExpenses(group._id),
          getSplit(group._id),
        ]);
        setMembers(membersRes.data ?? []);
        setExpenses(expensesRes.data ?? []);
        setSplitData(splitRes.data?.totalExpenses !== undefined ? splitRes.data : null);
      } catch (err) {
        console.error('Failed to fetch group data:', err);
      }
    })();
  }, [group._id]);

  const handleDataChange = useCallback((newExpenses, newSplit) => {
    setExpenses(newExpenses ?? []);
    setSplitData(newSplit?.totalExpenses !== undefined ? newSplit : null);
  }, []);

  const tabs = [
    { id: 'members', label: 'Members', count: members.length },
    { id: 'expenses', label: 'Expenses', count: expenses.length },
    { id: 'split', label: 'Split summary' },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <h2>{group.name}</h2>
          <p>Track shared expenses and calculate who owes whom.</p>
        </div>
      </div>

      <div className="stats-bar">
        <StatCard
          label="Members"
          value={members.length}
          hint="in this group"
        />
        <StatCard
          label="Total spent"
          value={currency(totalExpenses)}
          hint={`${expenses.length} expense${expenses.length !== 1 ? 's' : ''}`}
        />
        <StatCard
          label="Per person"
          value={members.length ? currency(totalExpenses / members.length) : '—'}
          hint="fair share"
        />
      </div>

      <div className="tabs" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={activeTab === t.id}
            className={`tab-btn${activeTab === t.id ? ' active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
            {t.count !== undefined && (
              <span className="tab-badge">{t.count}</span>
            )}
          </button>
        ))}
      </div>

      <div className="panel" role="tabpanel">
        {activeTab === 'members' && (
          <MembersTab
            groupId={group._id}
            members={members}
            onMembersChange={setMembers}
          />
        )}
        {activeTab === 'expenses' && (
          <ExpensesTab
            groupId={group._id}
            members={members}
            expenses={expenses}
            onDataChange={handleDataChange}
          />
        )}
        {activeTab === 'split' && (
          <SplitTab
            splitData={splitData}
            members={members}
            expenses={expenses}
          />
        )}
      </div>
    </>
  );
}

/* ─── App (root) ────────────────────────────────────────────────────────── */
export default function App() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    injectStyles();
    (async () => {
      try {
        const { data } = await getGroups();
        setGroups(data);
        if (data.length > 0) setSelectedGroup(data[0]);
      } catch (err) {
        console.error('Failed to fetch groups:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    try {
      const { data } = await createGroup(newGroupName.trim());
      setGroups((prev) => [...prev, data]);
      setSelectedGroup(data);
      setNewGroupName('');
    } catch (err) {
      console.error('Failed to create group:', err);
    }
  };

  const handleDeleteGroup = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteGroup(id);
      setGroups((prev) => {
        const updated = prev.filter((g) => g._id !== id);
        setSelectedGroup((cur) => (cur?._id === id ? (updated[0] ?? null) : cur));
        return updated;
      });
    } catch (err) {
      console.error('Failed to delete group:', err);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="shell">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h1>Bill Splitter</h1>
          <p>Smart expense sharing</p>
        </div>

        <div className="sidebar-section">Groups</div>
        <div className="new-group-form">
          <input
            className="field"
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="New group name…"
            onKeyDown={(e) => e.key === 'Enter' && handleCreateGroup(e)}
          />
          <button
            type="button"
            className="btn btn-accent btn-xs"
            onClick={handleCreateGroup}
            style={{ flexShrink: 0 }}
          >
            + New
          </button>
        </div>

        <div className="group-scroll">
          {groups.length === 0 && (
            <p style={{ padding: '12px 8px', fontSize: 13, color: 'var(--text-tertiary)' }}>
              No groups yet — create one above.
            </p>
          )}
          {groups.map((g) => (
            <button
              key={g._id}
              type="button"
              className={`group-item${selectedGroup?._id === g._id ? ' active' : ''}`}
              onClick={() => setSelectedGroup(g)}
            >
              <div className="g-avatar">{g.name?.[0]?.toUpperCase() ?? '?'}</div>
              <div className="g-info">
                <p className="g-name">{g.name}</p>
              </div>
              <button
                type="button"
                className="g-del"
                onClick={(e) => handleDeleteGroup(g._id, e)}
                aria-label={`Delete ${g.name}`}
              >
                <Icon.X size={12} />
              </button>
            </button>
          ))}
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="main">
        {selectedGroup ? (
          <GroupDetails key={selectedGroup._id} group={selectedGroup} />
        ) : (
          <div className="welcome">
            <div className="welcome-icon">
              <Icon.Users size={48} />
            </div>
            <h2>Create your first group</h2>
            <p>Add a group in the sidebar to start collecting members and logging expenses.</p>
          </div>
        )}
      </main>
    </div>
  );
}