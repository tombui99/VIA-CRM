import { Component, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { hlmH2, hlmH3 } from '@spartan-ng/helm/typography';
import {
  createAngularTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from '@tanstack/angular-table';
import { LeadDto, LeadService } from '../../api/generated';
import { winject } from '@libs/utils/winject';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { Datatable, DatatableColumn } from '@libs/custom/datatable';

@Component({
  selector: 'spartan-data-table-preview',
  imports: [FormsModule, HlmButtonImports, Datatable],
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

  protected readonly columns = computed((): DatatableColumn<LeadDto>[] => [
    {
      accessorKey: 'first_name',
      id: 'first_name',
      header: 'First Name',
      enableSorting: false,
      cell: (info) => `<span class="capitalize">${info.getValue<string>()}</span>`,
    },
    {
      accessorKey: 'email',
      id: 'email',
      header: 'Email',
      enableSorting: false,
      cell: (info) => `<span>${info.getValue<string>()}</span>`,
    },
    {
      accessorKey: 'phone',
      id: 'phone',
      header: 'Phone',
      enableSorting: false,
      cell: (info) => `<span>${info.getValue<string>()}</span>`,
    },
    {
      accessorKey: 'source_name',
      id: 'source_name',
      header: 'Source',
      enableSorting: false,
      cell: (info) => `<span>${info.getValue<string>()}</span>`,
    },
    {
      accessorKey: 'center_name',
      id: 'center_name',
      header: 'Center Name',
      enableSorting: false,
      cell: (info) => `<span>${info.getValue<string>()}</span>`,
    },
    {
      accessorKey: 'assigned_user_name',
      id: 'assigned_user_name',
      header: 'Assigned User',
      enableSorting: false,
      cell: (info) => `<span>${info.getValue<string>()}</span>`,
    },
    {
      accessorKey: 'lead_activities_type',
      id: 'lead_activities_type',
      header: 'Acitivity Type',
      enableSorting: false,
      cell: (info) => `<span>${info.getValue<string>()}</span>`,
    },
    {
      accessorKey: 'lead_activities_outcome',
      id: 'lead_activities_outcome',
      header: 'Acitivity Outcome',
      enableSorting: false,
      size: 250,
      cell: (info) => `<span>${info.getValue<string>()}</span>`,
    },
  ]);

  protected readonly _table = createAngularTable<LeadDto>(() => ({
    data: [this.leadsQuery.data() ?? []].flat(),
    columns: this.columns(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  }));
}
