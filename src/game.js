export const STORAGE_KEY = "adopt-a-procrastinator:v1";
export const XP_PER_TASK = 20;
export const XP_PER_LEVEL = 100;
export const DAILY_GOAL = 3;
export const CHARACTERS = [
  {
    id: "mochi",
    name: "Mochi",
    tagline: "Head empty. Heart full.",
    personality: "A cloud with a black belt in napping.",
    color: "#DED1F3",
  },
  {
    id: "byte",
    name: "Byte",
    tagline: "Just one more snack.",
    personality: "Small monster. Big snack-related ambitions.",
    color: "#B8DFC0",
  },
  {
    id: "procrastino",
    name: "Procrastino",
    tagline: "Tomorrow is a mindset.",
    personality: "An expert in the art of almost starting.",
    color: "#B7A1E3",
  },
];
export const STAGES = [
  "Procrastinator Egg",
  "Lazy Baby",
  "Motivated Creature",
  "Growing Monster",
  "Productivity Beast",
];
export const REWARDS = [
  {
    id: "cookie",
    name: "Cloud cookie",
    icon: "cookie",
    level: 1,
    description: "+20 energy · +5 happiness",
    type: "food",
  },
  {
    id: "pizza",
    name: "Victory pizza",
    icon: "pizza",
    level: 2,
    description: "+35 energy · +5 happiness",
    type: "food",
  },
  {
    id: "hat",
    name: "Party hat",
    icon: "party",
    level: 3,
    description: "A tiny hat for big wins",
    type: "cosmetic",
  },
  {
    id: "potion",
    name: "Zoom juice",
    icon: "potion",
    level: 4,
    description: "+50 energy · +5 happiness",
    type: "food",
  },
  {
    id: "crown",
    name: "Tiny crown",
    icon: "crown",
    level: 5,
    description: "Certified productivity royalty",
    type: "cosmetic",
  },
];
const clamp = (n, min = 0, max = 100) => Math.min(max, Math.max(min, n));
export const localDate = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
export const dateGap = (first, second) => {
  const ordinal = (key) => {
    const [year, month, day] = key.split("-").map(Number);
    return Date.UTC(year, month - 1, day) / 86400000;
  };
  return ordinal(second) - ordinal(first);
};
export const levelForXP = (xp) => Math.floor(xp / XP_PER_LEVEL) + 1;
export const stageForLevel = (level) => STAGES[Math.min(level, 5) - 1];
export const completedToday = (game, date = new Date()) =>
  game?.activity[localDate(date)]?.completed.length ?? 0;
export const currentStreak = (game, date = new Date()) =>
  game?.lastCompletionDay &&
  dateGap(game.lastCompletionDay, localDate(date)) <= 1
    ? game.streak
    : 0;
const emptyDay = () => ({
  completed: [],
  xp: 0,
  goalClaimed: false,
  allClearClaimed: false,
  rested: false,
});
const id = () => globalThis.crypto.randomUUID();

export function createPet(name, character, date = new Date()) {
  if (!name.trim() || name.trim().length > 24)
    throw new Error("Choose a pet name between 1 and 24 characters.");
  if (!CHARACTERS.some((pet) => pet.id === character))
    throw new Error("Choose an available character.");
  return {
    version: 1,
    pet: {
      name: name.trim(),
      character,
      happiness: 70,
      energy: 80,
      totalXP: 0,
      level: 1,
      stage: STAGES[0],
      equipped: null,
    },
    tasks: [],
    activity: {},
    inventory: { cookie: 1, pizza: 0, hat: 0, potion: 0, crown: 0 },
    streak: 0,
    lastCompletionDay: null,
    lastSeenDay: localDate(date),
    createdAt: date.toISOString(),
    updatedAt: date.toISOString(),
  };
}

export function validateTask(input) {
  const errors = {};
  if (!input.title?.trim()) errors.title = "Give your mission a short title.";
  else if (input.title.trim().length > 100)
    errors.title = "Keep the title to 100 characters or fewer.";
  if ((input.description?.length ?? 0) > 280)
    errors.description = "Keep your note to 280 characters or fewer.";
  if (
    input.minutes !== "" &&
    input.minutes != null &&
    (!Number.isInteger(Number(input.minutes)) ||
      Number(input.minutes) < 1 ||
      Number(input.minutes) > 1440)
  )
    errors.minutes = "Use a whole number from 1 to 1,440 minutes.";
  return errors;
}

export function settleDay(game, date = new Date()) {
  if (!game || game.lastSeenDay === localDate(date)) return game;
  const daysAway = Math.max(0, dateGap(game.lastSeenDay, localDate(date)));
  const overdue =
    daysAway > 0 &&
    game.tasks.some(
      (task) => !task.completedAt && task.createdDay < localDate(date),
    );
  return {
    ...game,
    pet: {
      ...game.pet,
      energy: clamp(game.pet.energy - Math.min(daysAway * 5, 15)),
      happiness: clamp(game.pet.happiness - (overdue ? 3 : 0)),
    },
    lastSeenDay: localDate(date),
    updatedAt: date.toISOString(),
  };
}

export function gameReducer(previous, action, date = new Date()) {
  if (action.type === "adopt")
    return createPet(action.name, action.character, date);
  if (action.type === "reset") return null;
  if (!previous) return previous;
  const game = settleDay(previous, date);
  const today = localDate(date);
  const stamp = date.toISOString();
  const commit = (next) => ({ ...next, updatedAt: stamp });
  switch (action.type) {
    case "tick":
      return game;
    case "add": {
      const errors = validateTask(action.task);
      if (Object.keys(errors).length) throw new Error(Object.values(errors)[0]);
      return commit({
        ...game,
        tasks: [
          ...game.tasks,
          {
            id: id(),
            title: action.task.title.trim(),
            description: action.task.description?.trim() || "",
            priority: ["low", "medium", "high"].includes(action.task.priority)
              ? action.task.priority
              : "medium",
            minutes: action.task.minutes ? Number(action.task.minutes) : null,
            createdDay: today,
            completedAt: null,
          },
        ],
      });
    }
    case "complete": {
      const task = game.tasks.find((item) => item.id === action.id);
      if (
        !task ||
        task.completedAt ||
        Object.values(game.activity).some((day) =>
          day.completed.includes(task.id),
        )
      )
        return game;
      const tasks = game.tasks.map((item) =>
        item.id === task.id ? { ...item, completedAt: stamp } : item,
      );
      const day = {
        ...(game.activity[today] ?? emptyDay()),
        completed: [...(game.activity[today]?.completed ?? []), task.id],
      };
      day.xp += XP_PER_TASK;
      const inventory = { ...game.inventory };
      if (day.completed.length >= DAILY_GOAL && !day.goalClaimed) {
        inventory.cookie += 1;
        day.goalClaimed = true;
      }
      const allClear =
        !day.allClearClaimed && tasks.every((item) => item.completedAt);
      if (allClear) day.allClearClaimed = true;
      const totalXP = game.pet.totalXP + XP_PER_TASK;
      const level = levelForXP(totalXP);
      REWARDS.filter(
        (reward) => reward.level > game.pet.level && reward.level <= level,
      ).forEach((reward) => {
        inventory[reward.id] += 1;
      });
      const streak =
        game.lastCompletionDay === today
          ? game.streak
          : game.lastCompletionDay &&
              dateGap(game.lastCompletionDay, today) === 1
            ? game.streak + 1
            : 1;
      return commit({
        ...game,
        tasks,
        pet: {
          ...game.pet,
          totalXP,
          level,
          stage: stageForLevel(level),
          happiness: clamp(game.pet.happiness + 8 + (allClear ? 8 : 0)),
          energy: clamp(game.pet.energy + 3),
        },
        activity: { ...game.activity, [today]: day },
        streak,
        lastCompletionDay: today,
        inventory,
      });
    }
    case "delete":
      return commit({
        ...game,
        tasks: game.tasks.filter((task) => task.id !== action.id),
      });
    case "restore": {
      if (!action.task || game.tasks.some((task) => task.id === action.task.id))
        return game;
      const tasks = [...game.tasks];
      tasks.splice(
        Math.min(action.index ?? tasks.length, tasks.length),
        0,
        action.task,
      );
      return commit({ ...game, tasks });
    }
    case "rest": {
      const day = { ...(game.activity[today] ?? emptyDay()) };
      if (day.rested || game.pet.energy >= 100) return game;
      day.rested = true;
      return commit({
        ...game,
        pet: {
          ...game.pet,
          energy: clamp(game.pet.energy + 20),
          happiness: clamp(game.pet.happiness + 3),
        },
        activity: { ...game.activity, [today]: day },
      });
    }
    case "reward": {
      const reward = REWARDS.find((item) => item.id === action.id);
      if (
        !reward ||
        game.pet.level < reward.level ||
        game.inventory[reward.id] < 1
      )
        return game;
      if (reward.type === "cosmetic")
        return commit({
          ...game,
          pet: {
            ...game.pet,
            equipped: game.pet.equipped === reward.id ? null : reward.id,
          },
        });
      if (game.pet.energy === 100 && game.pet.happiness === 100) return game;
      const energy = { cookie: 20, pizza: 35, potion: 50 }[reward.id];
      return commit({
        ...game,
        inventory: {
          ...game.inventory,
          [reward.id]: game.inventory[reward.id] - 1,
        },
        pet: {
          ...game.pet,
          energy: clamp(game.pet.energy + energy),
          happiness: clamp(game.pet.happiness + 5),
        },
      });
    }
    default:
      return game;
  }
}

export function calculatePetMood(game, date = new Date()) {
  if (game.pet.energy < 30) return "sleepy";
  if (game.pet.energy < 50) return "hungry";
  if (game.pet.happiness < 40) return "sad";
  if (
    completedToday(game, date) > 0 &&
    game.tasks.every((task) => task.completedAt)
  )
    return "excited";
  if (completedToday(game, date) > 0) return "happy";
  return "motivated";
}

export const MESSAGES = {
  motivated: [
    "I believe in you. And in snack breaks.",
    "One tiny task? We can absolutely do that.",
    "My to-do list says: believe in you. Check!",
  ],
  happy: [
    "Look at us, doing the things!",
    "That deserves a little happy wiggle.",
    "Productivity looks pretty cute on us.",
  ],
  excited: [
    "All done! Shall we do absolutely nothing?",
    "WE ARE UNSTOPPABLE. And a little sleepy.",
    "A legendary effort. A well-earned rest.",
  ],
  sleepy: [
    "Five more minutes… then a tiny step?",
    "Even legends need a little nap.",
  ],
  hungry: [
    "Could we turn a cookie into motivation?",
    "I'm running on dreams. And zero snacks.",
  ],
  sad: [
    "A fresh start can be a very small step.",
    "No rush. I'm happy we're here together.",
  ],
};

const validDay = (value) =>
  typeof value === "string" &&
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(Date.parse(`${value}T12:00:00Z`)) &&
  new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value;
const finite = (value) => typeof value === "number" && Number.isFinite(value);
export function normalizeGame(raw) {
  if (
    !raw ||
    raw.version !== 1 ||
    !raw.pet ||
    typeof raw.pet.name !== "string" ||
    !raw.pet.name.trim() ||
    raw.pet.name.length > 24 ||
    !CHARACTERS.some((pet) => pet.id === raw.pet.character)
  )
    throw new Error("Invalid pet");
  if (
    ![raw.pet.happiness, raw.pet.energy, raw.pet.totalXP].every(finite) ||
    raw.pet.totalXP < 0 ||
    !Number.isSafeInteger(raw.pet.totalXP)
  )
    throw new Error("Invalid stats");
  if (
    !Array.isArray(raw.tasks) ||
    !raw.activity ||
    typeof raw.activity !== "object" ||
    Array.isArray(raw.activity) ||
    !validDay(raw.lastSeenDay) ||
    !Number.isSafeInteger(raw.streak) ||
    raw.streak < 0 ||
    (raw.lastCompletionDay !== null && !validDay(raw.lastCompletionDay))
  )
    throw new Error("Invalid progress");
  const ids = new Set();
  const tasks = raw.tasks.map((task) => {
    if (
      !task ||
      typeof task.id !== "string" ||
      !task.id ||
      ids.has(task.id) ||
      typeof task.title !== "string" ||
      typeof task.description !== "string" ||
      Object.keys(validateTask(task)).length ||
      !["low", "medium", "high"].includes(task.priority) ||
      !validDay(task.createdDay) ||
      (task.completedAt !== null &&
        (typeof task.completedAt !== "string" ||
          Number.isNaN(Date.parse(task.completedAt))))
    )
      throw new Error("Invalid mission");
    ids.add(task.id);
    return {
      ...task,
      title: task.title.trim(),
      description: task.description.slice(0, 280),
    };
  });
  const activity = {};
  const rewardedIds = new Set();
  Object.entries(raw.activity).forEach(([key, day]) => {
    if (
      !validDay(key) ||
      !day ||
      !Array.isArray(day.completed) ||
      day.completed.some(
        (value) => typeof value !== "string" || rewardedIds.has(value),
      ) ||
      new Set(day.completed).size !== day.completed.length ||
      !["goalClaimed", "allClearClaimed", "rested"].every(
        (key) => typeof day[key] === "boolean",
      )
    )
      throw new Error("Invalid activity");
    day.completed.forEach((value) => rewardedIds.add(value));
    activity[key] = { ...day, xp: day.completed.length * XP_PER_TASK };
  });
  if (
    !raw.inventory ||
    !REWARDS.every(
      (reward) =>
        Number.isSafeInteger(raw.inventory[reward.id]) &&
        raw.inventory[reward.id] >= 0,
    )
  )
    throw new Error("Invalid inventory");
  const level = levelForXP(raw.pet.totalXP);
  return {
    ...raw,
    tasks,
    activity,
    pet: {
      ...raw.pet,
      name: raw.pet.name.trim(),
      happiness: clamp(raw.pet.happiness),
      energy: clamp(raw.pet.energy),
      level,
      stage: stageForLevel(level),
      equipped:
        ["hat", "crown"].includes(raw.pet.equipped) &&
        raw.inventory[raw.pet.equipped] > 0
          ? raw.pet.equipped
          : null,
    },
  };
}

export function loadGame(storage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) return { game: null, warning: "" };
    try {
      return { game: settleDay(normalizeGame(JSON.parse(raw))), warning: "" };
    } catch {
      let backup = false;
      try {
        storage.setItem(`${STORAGE_KEY}:recovery`, raw);
        backup = true;
      } catch {
        /* Storage may be unavailable. */
      }
      return {
        game: null,
        warning: backup
          ? "Your old save couldn't be read. A recovery copy is kept in this browser; you can start fresh."
          : "Your old save couldn't be read. Starting a new adoption will replace it.",
      };
    }
  } catch {
    return {
      game: null,
      warning:
        "This browser isn't allowing saves. You can play, but progress will be lost on refresh. Allow site storage and retry.",
    };
  }
}

export function saveGame(game, storage) {
  try {
    if (game) storage.setItem(STORAGE_KEY, JSON.stringify(game));
    else storage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
