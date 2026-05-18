import { readDb, writeDb } from '../data/mockDb.js';
import { makeId } from '../utils/id.js';

const roleNames = { student: 'Arjun Sharma', coach: 'Coach Arvind', admin: 'Admin' };

export function login(req, res) {
  const role = req.body.role || 'student';
  const db = readDb();
  let user = db.auth.users.find((item) => item.role === role);
  if (!user) user = { id: makeId(role), name: roleNames[role] || 'Demo User', email: `${role}@panchatantra.test`, role, status: 'active' };
  db.auth.currentUser = user;
  writeDb(db);
  res.json({ token: `demo-token-${role}`, user });
}

export function register(req, res) {
  const db = readDb();
  const user = { id: makeId('user'), status: 'active', role: req.body.role || 'student', ...req.body };
  db.auth.users.push(user);
  db.auth.currentUser = user;
  writeDb(db);
  res.status(201).json({ token: `demo-token-${user.role}`, user });
}

export function logout(_req, res) {
  const db = readDb();
  db.auth.currentUser = null;
  writeDb(db);
  res.json({ ok: true });
}

export function forgotPassword(req, res) {
  res.json({ ok: true, message: `Reset link sent to ${req.body.email || 'your email'}` });
}

export function me(_req, res) {
  const db = readDb();
  res.json({ user: db.auth.currentUser });
}
