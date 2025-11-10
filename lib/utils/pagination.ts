export interface PaginationResult<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export function paginate<T>(
  items: T[],
  page: number = 1,
  limit: number = 10
): PaginationResult<T> {
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 10;

  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / safeLimit));
  const clampedPage = Math.min(safePage, pages);

  const start = (clampedPage - 1) * safeLimit;
  const end = start + safeLimit;
  const data = items.slice(start, end);

  return {
    data,
    pagination: { page: clampedPage, limit: safeLimit, total, pages },
  };
}

export function sortBy<T extends Record<string, any>>(
  items: T[],
  field: string,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...items].sort((a, b) => {
    const aVal = a?.[field];
    const bVal = b?.[field];

    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return order === 'asc' ? 1 : -1;
    if (bVal == null) return order === 'asc' ? -1 : 1;

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}
