// src/data.js

/**
 * Колонки канбана. Порядок в массиве = порядок отображения.
 * id используется в task.status
 */
export const STATUSES = [
  { id: 'pool',     title: 'Pool',        color: '#94a3b8' },
  { id: 'todo',     title: 'Todo',        color: '#60a5fa' },
  { id: 'progress', title: 'In Progress', color: '#fbbf24' },
  { id: 'done',     title: 'Done',        color: '#34d399' },
];

/**
 * Приоритеты. Порядок в массиве = порядок сортировки (low → crit).
 * weight используется для сортировки в таблице.
 */
export const PRIORITIES = [
  { id: 'low',  label: 'Low',      color: '#6ee7b7', weight: 0 },
  { id: 'med',  label: 'Medium',   color: '#fcd34d', weight: 1 },
  { id: 'high', label: 'High',     color: '#fb923c', weight: 2 },
  { id: 'crit', label: 'Critical', color: '#f87171', weight: 3 },
];

// Быстрый доступ по id — пригодится в компонентах
export const STATUS_BY_ID = Object.fromEntries(
  STATUSES.map((s) => [s.id, s])
);

export const PRIORITY_BY_ID = Object.fromEntries(
  PRIORITIES.map((p) => [p.id, p])
);

/**
 * Теги — пока просто справочник доступных значений.
 * Пригодится для автокомплита в форме и для фильтров.
 */
export const TAGS = [
  'research',
  'ux',
  'feedback',
  'design',
  'figma',
  'design-system',
  'prototype',
  'css',
  'logic',
  'planning',
];

/**
 * Модель задачи:
 * {
 *   id: string,
 *   title: string,
 *   description: string,
 *   status: 'pool' | 'todo' | 'progress' | 'done',
 *   priority: 'low' | 'med' | 'high' | 'crit',
 *   tags: string[],
 *   dueDate: string | null,   // ISO-строка 'YYYY-MM-DD' или null
 *   createdAt: string,        // ISO
 *   updatedAt: string,        // ISO
 * }
 */
export const initialTasks = [
  {
    id: 't1',
    title: 'Исследовать конкурентов по канбан-инструментам',
    description: '',
    status: 'pool',
    priority: 'low',
    tags: ['research', 'ux'],
    dueDate: null,
    createdAt: '2026-09-10T09:00:00.000Z',
    updatedAt: '2026-09-10T09:00:00.000Z',
  },
  {
    id: 't2',
    title: 'Собрать обратную связь от команды по прототипу',
    description: '',
    status: 'pool',
    priority: 'med',
    tags: ['feedback'],
    dueDate: null,
    createdAt: '2026-09-11T10:30:00.000Z',
    updatedAt: '2026-09-11T10:30:00.000Z',
  },
  {
    id: 't3',
    title: 'Спроектировать компонент карточки задачи',
    description: '',
    status: 'todo',
    priority: 'high',
    tags: ['design', 'figma'],
    dueDate: null,
    createdAt: '2026-09-12T08:15:00.000Z',
    updatedAt: '2026-09-12T08:15:00.000Z',
  },
  {
    id: 't4',
    title: 'Определить палитру и токены стеклянных поверхностей',
    description: '',
    status: 'todo',
    priority: 'med',
    tags: ['design-system'],
    dueDate: null,
    createdAt: '2026-09-12T08:20:00.000Z',
    updatedAt: '2026-09-12T08:20:00.000Z',
  },
  {
    id: 't5',
    title: 'Собрать HTML-прототип стеклянных элементов',
    description: '',
    status: 'progress',
    priority: 'crit',
    tags: ['prototype', 'css'],
    dueDate: '2026-09-20',
    createdAt: '2026-09-13T11:00:00.000Z',
    updatedAt: '2026-09-15T14:00:00.000Z',
  },
  {
    id: 't6',
    title: 'Логика drag & drop между колонками',
    description: '',
    status: 'progress',
    priority: 'high',
    tags: ['logic'],
    dueDate: null,
    createdAt: '2026-09-13T11:30:00.000Z',
    updatedAt: '2026-09-15T14:10:00.000Z',
  },
  {
    id: 't7',
    title: 'Согласовать модель данных Task',
    description: '',
    status: 'done',
    priority: 'low',
    tags: ['planning'],
    dueDate: null,
    createdAt: '2026-09-08T12:00:00.000Z',
    updatedAt: '2026-09-09T16:00:00.000Z',
  },
];

/**
 * Генерация id для новых задач.
 * Простой счётчик на основе timestamp — достаточно для прототипа.
 * При переходе на бэкенд заменим на серверный id.
 */
export const generateId = () =>
  `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

/**
 * Хелпер для создания новой задачи с дефолтами.
 * Удобно вызывать из формы добавления.
 */
export const createTask = ({ title, status = 'pool', priority = 'med', tags = [], dueDate = null, description = '' }) => {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    title: title.trim(),
    description,
    status,
    priority,
    tags,
    dueDate,
    createdAt: now,
    updatedAt: now,
  };
};

/**
 * Дополнительно: пустой набор фильтров.
 * Держим здесь, чтобы App и FiltersPanel использовали одну форму.
 */
export const EMPTY_FILTERS = {
  search: '',
  statuses: [],    // [] = все
  priorities: [],  // [] = все
  tags: [],        // [] = все
};

/**
 * Форматирование ISO-даты в короткий вид: '2026-09-20' → '20 Sep'.
 * Если передать null/undefined — вернёт '—'.
 */
const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export const formatDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
};

/**
 * Порядок статусов для сортировки в таблице.
 */
const STATUS_ORDER = { pool: 0, todo: 1, progress: 2, done: 3 };

/**
 * Универсальный сортировщик.
 * sortBy: 'title' | 'status' | 'priority' | 'createdAt' | 'dueDate' | null
 * sortDir: 'asc' | 'desc'
 */
export const sortTasks = (tasks, sortBy, sortDir) => {
  if (!sortBy) return tasks;

  const dir = sortDir === 'desc' ? -1 : 1;
  const copy = [...tasks];

  copy.sort((a, b) => {
    let va, vb;

    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title, 'ru') * dir;

      case 'status':
        va = STATUS_ORDER[a.status] ?? 99;
        vb = STATUS_ORDER[b.status] ?? 99;
        return (va - vb) * dir;

      case 'priority':
        va = PRIORITY_BY_ID[a.priority]?.weight ?? -1;
        vb = PRIORITY_BY_ID[b.priority]?.weight ?? -1;
        return (va - vb) * dir;

      case 'createdAt':
        va = new Date(a.createdAt).getTime();
        vb = new Date(b.createdAt).getTime();
        return (va - vb) * dir;

      case 'dueDate': {
        // Задачи без даты всегда в конце, независимо от направления
        const aHas = !!a.dueDate;
        const bHas = !!b.dueDate;
        if (!aHas && !bHas) return 0;
        if (!aHas) return 1;
        if (!bHas) return -1;
        va = new Date(a.dueDate).getTime();
        vb = new Date(b.dueDate).getTime();
        return (va - vb) * dir;
      }

      default:
        return 0;
    }
  });

  return copy;
};

/**
 * Собирает уникальный список всех тегов из массива задач.
 * Отсортирован по алфавиту.
 */
export const collectAllTags = (tasks) => {
  const set = new Set();
  tasks.forEach((t) => {
    (t.tags || []).forEach((tag) => set.add(tag));
  });
  return [...set].sort((a, b) => a.localeCompare(b, 'ru'));
};

/**
 * Применяет фильтры к массиву задач.
 * filters: { search, statuses, priorities, tags }
 * Пустые массивы = фильтр не активен.
 * Логика:
 *  - search — по title, регистронезависимо
 *  - statuses / priorities — задача подходит, если её значение в списке
 *  - tags — задача подходит, если у неё есть хотя бы один из выбранных тегов (OR)
 */
export const applyFilters = (tasks, filters) => {
  const { search, statuses, priorities, tags } = filters;
  const q = search.trim().toLowerCase();

  return tasks.filter((task) => {
    if (q && !task.title.toLowerCase().includes(q)) return false;
    if (statuses.length && !statuses.includes(task.status)) return false;
    if (priorities.length && !priorities.includes(task.priority)) return false;
    if (tags.length && !task.tags?.some((tag) => tags.includes(tag))) return false;
    return true;
  });
};