import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';

import { DatatableColumn, DatatableOptions, DatatableSortEvent } from './datatable.interfaces';
import { ResizableCell, ResizableHeader } from './resizable-cell.directive';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  Cell,
  ColumnPinningState,
  ColumnSizingState,
  createAngularTable,
  FlexRenderDirective,
  getCoreRowModel,
  Header,
  Row,
  RowSelectionState,
  Table,
} from '@tanstack/angular-table';
import { attemptSync } from '@libs/utils/attempt';
import { hlm } from '@spartan-ng/helm/utils';
import { lucideArrowDown, lucideArrowUp } from '@ng-icons/lucide';

@Component({
  selector: 'custom-datatable',
  standalone: true,
  imports: [CommonModule, FlexRenderDirective, ResizableCell, ResizableHeader, NgIcon],
  providers: [provideIcons({ lucideArrowUp, lucideArrowDown })],
  templateUrl: './datatable.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Datatable<T = unknown> {
  // Inputs
  readonly data = input<T[] | undefined>();
  readonly columns = input.required<DatatableColumn<T>[]>();
  readonly options = input<DatatableOptions>({});
  readonly currentSort = input<{ field: string; direction: 'asc' | 'desc' } | null>(null);
  readonly enableRowSelection = input<boolean>(false);
  readonly isLoading = input<boolean>(false);

  // Outputs
  readonly sortChange = output<DatatableSortEvent>();
  readonly rowSelectionChange = output<T[]>();

  // Computed state
  readonly columnSizingInfo = computed(() => this.table.getState().columnSizingInfo);
  readonly columnSizing = computed(() => this.table.getState().columnSizing);

  private readonly scrollLeft = signal(0);
  private readonly scrollRight = signal(false);
  private readonly hasScrolled = signal(false);
  readonly isScrolledLeft = computed(() => this.scrollLeft() > 0);
  readonly isScrolledRight = computed(() => {
    if (this.hasScrolled()) return this.scrollRight();
    return (this.data()?.length ?? 0) > 0;
  });

  // Internal state for sort field mapping
  private readonly sortFieldMap = computed(() => {
    const map: Record<string, string> = {};
    this.columns().forEach((col) => {
      if (col.id && col.sortable !== false) {
        map[col.id] = col.sortField || col.id;
      }
    });
    return map;
  });

  // Row selection state
  private readonly rowSelection = signal<RowSelectionState>({});

  // Compute column pinning state from column definitions
  private readonly columnPinning = computed((): ColumnPinningState => {
    const left: string[] = [];
    const right: string[] = [];

    this.columns().forEach((col) => {
      if (col.pin === 'left' && col.id) {
        left.push(col.id);
      } else if (col.pin === 'right' && col.id) {
        right.push(col.id);
      }
    });

    return { left, right };
  });

  // Load/save column sizes from localStorage
  private getStorageKey(): string | null {
    const tableId = this.options().tableId;
    return tableId ? `-datatable-${tableId}` : null;
  }

  private loadColumnSizes(): ColumnSizingState {
    const key = this.getStorageKey();
    if (!key) return {};

    const saved = localStorage.getItem(key);
    if (!saved) return {};

    const { result, error } = attemptSync<ColumnSizingState>(() => JSON.parse(saved));
    return error ? {} : result;
  }

  private saveColumnSizes(sizes: ColumnSizingState): void {
    const key = this.getStorageKey();
    if (key) {
      attemptSync(() => localStorage.setItem(key, JSON.stringify(sizes)));
    }
  }

  readonly table: Table<T> = createAngularTable(() => ({
    data: this.data() ?? [],
    columns: this.columns(),
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      minSize: this.options().minSize || 60,
      maxSize: this.options().maxSize || 800,
    },
    initialState: {
      columnVisibility: {
        select: this.enableRowSelection(),
      },
    },
    state: {
      rowSelection: this.rowSelection(),
      columnSizing: this.loadColumnSizes(),
      columnPinning: this.columnPinning(),
    },
    enableRowSelection: this.enableRowSelection(),
    onRowSelectionChange: (updaterOrValue) => {
      this.rowSelection.set(
        typeof updaterOrValue === 'function' ? updaterOrValue(this.rowSelection()) : updaterOrValue
      );
      this.rowSelectionChange.emit(
        this.table.getSelectedRowModel().flatRows.map((row) => row.original)
      );
    },
    onColumnSizingChange: (updater) => {
      const currentSizing = this.table.getState().columnSizing;
      const newSizing = typeof updater === 'function' ? updater(currentSizing) : updater;
      this.saveColumnSizes(newSizing);
    },
  }));

  readonly columnSizeVars = computed(() => {
    void this.columnSizing();
    void this.columnSizingInfo();
    const headers = untracked(() => this.table.getFlatHeaders());
    const colSizes: { [key: string]: number } = {};

    for (const header of headers) {
      if (header) {
        const size = header.getSize();
        colSizes[`--header-${header.id}-size`] = size;
        colSizes[`--col-${header.id}-size`] = size;
      }
    }
    return colSizes;
  });

  onScroll(event: Event): void {
    const { scrollLeft, scrollWidth, clientWidth } = event.target as HTMLElement;
    this.hasScrolled.set(true);
    this.scrollLeft.set(scrollLeft);
    this.scrollRight.set(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 5);
  }

  canSort(columnId: string | undefined): boolean {
    return (
      columnId !== undefined &&
      columnId in this.sortFieldMap() &&
      this.columns().find((col) => col.id === columnId)?.sortable !== false
    );
  }

  onColumnSort(columnId: string | undefined): void {
    if (!columnId || !this.canSort(columnId)) return;

    const apiSortField = this.sortFieldMap()[columnId];
    const currentSort = this.currentSort();
    const newDirection: 'asc' | 'desc' =
      currentSort?.field === apiSortField && currentSort.direction === 'asc' ? 'desc' : 'asc';

    this.sortChange.emit({ field: apiSortField, direction: newDirection });
  }

  isColumnSorted(columnId: string): boolean {
    return this.currentSort()?.field === this.sortFieldMap()[columnId];
  }

  getSortDirection(columnId: string): 'asc' | 'desc' | null {
    return this.isColumnSorted(columnId) ? this.currentSort()?.direction || null : null;
  }

  // Check if a column is pinned
  isPinned(columnId: string): 'left' | 'right' | false {
    const pinning = this.columnPinning();
    if (pinning.left?.includes(columnId)) return 'left';
    if (pinning.right?.includes(columnId)) return 'right';
    return false;
  }

  // Get the left/right offset for a pinned column
  getPinnedOffset(columnId: string, side: 'left' | 'right'): number {
    const pinnedColumns = this.columnPinning()[side];
    if (!pinnedColumns) return 0;

    const index = pinnedColumns.indexOf(columnId);
    if (index === -1) return 0;

    const headers = this.table.getFlatHeaders();
    const columnsToSum =
      side === 'left' ? pinnedColumns.slice(0, index) : pinnedColumns.slice(index + 1);

    return (
      columnsToSum.reduce((sum, colId) => {
        const header = headers.find((h) => h.id === colId);
        return sum + (header?.getSize() ?? 0);
      }, 0) - 1
    );
  }

  isLastLeftPinned(columnId: string): boolean {
    const left = this.columnPinning().left;
    return left ? left[left.length - 1] === columnId : false;
  }

  isFirstRightPinned(columnId: string): boolean {
    const right = this.columnPinning().right;
    return right ? right[0] === columnId : false;
  }

  isLastRightPinned(columnId: string): boolean {
    const right = this.columnPinning().right;
    return right ? right[right.length - 1] === columnId : false;
  }

  getShadowClasses(columnId: string, isHeader = false): string {
    const baseShadow =
      'after:absolute after:top-0 after:bottom-0 after:w-4 after:pointer-events-none after:transition-opacity after:duration-300';

    const gradientColor = isHeader ? 'after:from-muted' : 'after:from-background';

    return hlm(
      baseShadow,
      // Left pinned gradient
      this.isLastLeftPinned(columnId) && [
        'after:right-0 after:translate-x-full',
        `after:bg-gradient-to-r ${gradientColor} after:to-transparent`,
        this.isScrolledLeft() ? 'after:opacity-100' : 'after:opacity-0',
      ],
      // Right pinned gradient
      this.isFirstRightPinned(columnId) && [
        'after:left-0 after:-translate-x-full',
        `after:bg-gradient-to-l ${gradientColor} after:to-transparent`,
        this.isScrolledRight() ? 'after:opacity-100' : 'after:opacity-0',
      ]
    );
  }

  getThClass(header: Header<T, unknown>): string {
    return hlm(
      'relative border-r border-b bg-muted text-left text-sm font-medium text-muted-foreground',
      this.isColumnSorted(header.column.id) && 'bg-muted-foreground/20',
      this.isLastRightPinned(header.column.id) && 'border-r-0',
      this.isPinned(header.column.id) && 'sticky',
      this.getShadowClasses(header.column.id, true)
    );
  }

  getTdClass(cell: Cell<T, unknown>, row: Row<T>): string {
    const isSorted = this.isColumnSorted(cell.column.id);
    const isSelected = row.getIsSelected();
    const isPinned = this.isPinned(cell.column.id);

    return hlm(
      'max-w-0 border-r border-b px-4 py-3',
      isPinned && 'sticky z-10',
      isPinned && !isSorted && 'bg-background',
      isSorted && !isSelected && 'bg-tan-50/80',
      isSorted && isSelected && 'bg-tan-50',
      isSorted && 'dark:bg-muted',
      this.isLastRightPinned(cell.column.id) && 'border-r-0',
      this.getShadowClasses(cell.column.id)
    );
  }

  getResizeHandleClass(header: Header<T, unknown>): string {
    return hlm(
      'absolute top-0 right-0 h-full w-1 cursor-col-resize touch-none transition-colors select-none hover:bg-primary active:cursor-col-resize',
      header.column.getIsResizing() && 'bg-primary'
    );
  }

  getEmptyThClass(firstGroup: boolean): string {
    return hlm('w-full border-r-0 border-b bg-muted', firstGroup && 'rounded-tr-lg border-t-0');
  }

  getTrClass(row: Row<T>): string {
    return hlm('border-b transition-colors', row.getIsSelected() && 'bg-brand-50 dark:bg-muted');
  }
}
