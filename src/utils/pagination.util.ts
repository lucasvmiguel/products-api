export type PaginationResult<T> = {
  items: T[];
  next_cursor: number | null;
};
