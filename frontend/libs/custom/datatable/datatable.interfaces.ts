import { ColumnDef } from '@tanstack/angular-table';

export type DatatableColumn<T = unknown> = ColumnDef<T, unknown> & {
  /**
   * Unique identifier for the column - required for sorting and resizing
   */
  id: string;

  /**
   * Whether this column can be sorted. If true, header will be clickable.
   */
  sortable?: boolean;

  /**
   * The API field name to use for sorting. If not provided, uses the column id.
   */
  sortField?: string;

  /**
   * Pin this column to the left or right side
   */
  pin?: 'left' | 'right' | false;
};

export interface DatatableOptions {
  /**
   * Whether to enable column resizing
   */
  enableResizing?: boolean;

  /**
   * Default minimum column size
   */
  minSize?: number;

  /**
   * Default maximum column size
   */
  maxSize?: number;

  /**
   * Unique identifier for this table instance (used for localStorage persistence)
   * If not provided, column sizes will not be persisted
   */
  tableId?: string;
}

export interface DatatableSortEvent {
  /**
   * The field to sort by (API field name)
   */
  field: string;

  /**
   * Sort direction
   */
  direction: 'asc' | 'desc';
}
