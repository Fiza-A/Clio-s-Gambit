import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { adminDashboard, coachDashboard, studentDashboard } from './dashboardData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'db.json');

const seed = {
  dashboards: {
    admin: adminDashboard,
    coach: coachDashboard,
    student: studentDashboard,
  },
  collections: {
    users: [
      { id: 'stu-001', name: 'Arjun Sharma', role: 'Student', status: 'Active' },
      { id: 'stu-002', name: 'Vihaan Mehta', role: 'Student', status: 'Active' },
      { id: 'coach-001', name: 'Coach Arvind', role: 'Coach', status: 'Online' },
      { id: 'admin-001', name: 'Admin', role: 'Admin', status: 'Online' },
    ],
    stories: [
      { id: 'story-001', title: 'The Clever Jackal', module: "The Lion's Wisdom", chapter: 2 },
      { id: 'story-002', title: 'The Wise Elephant', module: "The Elephant's Patience", chapter: 4 },
      { id: 'story-003', title: 'The Tortoise and the Geese', module: "The Tortoise's Strategy", chapter: 2 },
    ],
    puzzles: [
      { id: 'puzzle-001', title: 'Fork in the Forest', difficulty: 'Medium', reward: 25 },
      { id: 'puzzle-002', title: 'Silent Skewer', difficulty: 'Hard', reward: 40 },
      { id: 'puzzle-003', title: 'Jackal’s Deflection', difficulty: 'Easy', reward: 15 },
    ],
    classes: [
      { id: 'class-001', title: 'Advanced Tactics - Batch A', time: '5:00 PM', students: 12 },
      { id: 'class-002', title: 'Intermediate Class - Batch B', time: '6:30 PM', students: 8 },
      { id: 'class-003', title: 'Endgame Mastery - Batch C', time: '8:00 PM', students: 10 },
    ],
    resources: [
      { id: 'res-001', title: 'Sacrifice Patterns PDF', type: 'Study Material' },
      { id: 'res-002', title: 'Endgame Drill Pack', type: 'Exercise Set' },
    ],
    actionLog: [],
  },
};

function ensureDatabase() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(seed, null, 2));
  }
}

export function readDb() {
  ensureDatabase();
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

export function writeDb(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  return db;
}

export function getDashboard(role) {
  return readDb().dashboards[role];
}

export function getCollection(name) {
  return readDb().collections[name] || [];
}

export function recordAction({ role, action, label, payload = {} }) {
  const db = readDb();
  const entry = {
    id: `action-${Date.now()}`,
    role,
    action,
    label,
    payload,
    createdAt: new Date().toISOString(),
  };

  db.collections.actionLog.unshift(entry);
  db.collections.actionLog = db.collections.actionLog.slice(0, 50);

  if (action === 'create-class') {
    const title = payload.title || 'New Strategy Class';
    db.collections.classes.unshift({
      id: `class-${Date.now()}`,
      title,
      time: payload.time || '7:00 PM',
      students: payload.students || 10,
    });
    db.dashboards.coach.recentActivity.unshift({ title: `${title} created`, time: 'Just now', icon: 'calendar' });
  }

  if (action === 'add-story') {
    const title = payload.title || 'The Patient King';
    db.collections.stories.unshift({ id: `story-${Date.now()}`, title, module: "The Lion's Wisdom", chapter: 5 });
    db.dashboards.admin.recentActivity.unshift({ title: 'New story drafted', detail: title, time: 'Just now', icon: 'book' });
  }

  if (action === 'add-puzzle' || action === 'solve-puzzle') {
    const title = payload.title || (action === 'solve-puzzle' ? 'Daily Puzzle Solved' : 'Royal Fork');
    if (action === 'add-puzzle') {
      db.collections.puzzles.unshift({ id: `puzzle-${Date.now()}`, title, difficulty: 'Medium', reward: 25 });
    }
    db.dashboards.student.stats[1].value = String(Number(db.dashboards.student.stats[1].value) + 1);
  }

  writeDb(db);
  return entry;
}

export function buildReport(role) {
  const db = readDb();
  return {
    role,
    generatedAt: new Date().toISOString(),
    dashboard: db.dashboards[role],
    recentActions: db.collections.actionLog.filter((entry) => entry.role === role).slice(0, 10),
    databaseCounts: Object.fromEntries(
      Object.entries(db.collections).map(([key, value]) => [key, Array.isArray(value) ? value.length : 0])
    ),
  };
}
