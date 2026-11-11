import test from 'node:test';
import assert from 'node:assert/strict';
import { createPet, gameReducer, completedToday, currentStreak, dateGap, loadGame, normalizeGame, saveGame } from '../src/game.js';
const day = new Date(2026, 10, 11, 12);
test('completion is rewarded exactly once, deletion preserves XP, and five wins evolve', () => {
  let game = createPet('Mochi', 'mochi', day);
  for (let i = 0; i < 5; i++) game = gameReducer(game, { type: 'add', task: { title: `Mission ${i}`, minutes: '', priority: 'medium' } }, day);
  const first = game.tasks[0].id;
  game = gameReducer(game, { type: 'complete', id: first }, day);
  assert.equal(game.pet.totalXP, 20);
  game = gameReducer(game, { type: 'complete', id: first }, day);
  assert.equal(game.pet.totalXP, 20);
  for (const task of game.tasks.slice(1)) game = gameReducer(game, { type: 'complete', id: task.id }, day);
  assert.equal(game.pet.totalXP, 100); assert.equal(game.pet.level, 2); assert.equal(game.inventory.pizza, 1); assert.equal(game.inventory.cookie, 2); assert.equal(completedToday(game, day), 5);
  game = gameReducer(game, { type: 'delete', id: first }, day); assert.equal(game.pet.totalXP, 100); assert.equal(completedToday(game, day), 5);
  assert.ok(game.pet.happiness <= 100); assert.ok(game.pet.energy <= 100);
});
test('calendar streak survives a rest day and resets after a missed day', () => {
  let game = createPet('Byte', 'byte', day);
  game = gameReducer(game, { type: 'add', task: { title: 'Start', minutes: '' } }, day);
  game = gameReducer(game, { type: 'complete', id: game.tasks[0].id }, day);
  assert.equal(currentStreak(game, new Date(2026, 10, 12, 23)), 1);
  assert.equal(currentStreak(game, new Date(2026, 10, 13, 0)), 0);
  assert.equal(dateGap('2026-12-31', '2027-01-01'), 1);
});
test('save roundtrip and malformed save recovery', () => {
  const map = new Map(); const storage = { getItem: key => map.get(key) ?? null, setItem: (key, value) => map.set(key, value), removeItem: key => map.delete(key) };
  const game = createPet('Mochi', 'mochi', new Date()); assert.equal(saveGame(game, storage), true); assert.equal(loadGame(storage).game.pet.name, 'Mochi');
  assert.equal(normalizeGame(game).pet.level, 1);
  map.set('adopt-a-procrastinator:v1', '{broken'); assert.equal(loadGame(storage).game, null); assert.match(loadGame(storage).warning, /recovery/);
});
