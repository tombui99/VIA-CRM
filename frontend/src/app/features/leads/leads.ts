import { Component, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { hlmH2, hlmH3 } from '@spartan-ng/helm/typography';
import {
  type ColumnDef,
  createAngularTable,
  FlexRenderDirective,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from '@tanstack/angular-table';
import { Lead, LeadService } from '../../api/generated';
import { winject } from '@libs/utils/winject';
import { injectQuery } from '@tanstack/angular-query-experimental';

@Component({
  selector: 'spartan-data-table-preview',
  imports: [FlexRenderDirective, FormsModule, HlmButtonImports, HlmTableImports],
  host: {
    class: 'w-full',
  },
  templateUrl: './leads.html',
})
export class Leads {
  hlmH2 = hlmH2;
  hlmH3 = hlmH3;

  private readonly leadsService = winject(LeadService);

  // Lead query
  readonly leadsQuery = injectQuery(() => ({
    queryKey: ['leads'],
    queryFn: () => this.leadsService.apiLeadsGet(),
  }));

  readonly hasResults = computed(() => (this.leadsQuery.data()?.length ?? 0) > 0);

  protected readonly _columns: ColumnDef<Lead>[] = [
    {
      accessorKey: 'first_name',
      id: 'first_name',
      header: 'First Name',
      enableSorting: false,
      size: 250,
      cell: (info) => `<span class="capitalize">${info.getValue<string>()}</span>`,
    },
    {
      accessorKey: 'last_name',
      id: 'last_name',
      header: 'Last Name',
      enableSorting: false,
      size: 250,
      cell: (info) => `<span>${info.getValue<string>()}</span>`,
    },
    {
      accessorKey: 'email',
      id: 'email',
      header: 'Email',
      enableSorting: false,
      size: 250,
      cell: (info) => `<span>${info.getValue<string>()}</span>`,
    },
    {
      accessorKey: 'phone',
      id: 'phone',
      header: 'Phone',
      enableSorting: false,
      size: 250,
      cell: (info) => `<span>${info.getValue<string>()}</span>`,
    },
  ];

  protected readonly _table = createAngularTable<Lead>(() => ({
    data: [this.leadsQuery.data() ?? []].flat(),
    columns: this._columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  }));
}
