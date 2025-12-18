import { Component, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { hlmH2, hlmH3 } from '@spartan-ng/helm/typography';
import {
  createAngularTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from '@tanstack/angular-table';
import { CreateUpdateLeadDto, LeadDto, LeadService } from '../../api/generated';
import { winject } from '@libs/utils/winject';
import { injectMutation, injectQuery } from '@tanstack/angular-query-experimental';
import { Datatable, DatatableColumn } from '@libs/custom/datatable';
import { LeadSheetForm } from './lead-sheet-form/lead-sheet-form';

@Component({
  selector: 'spartan-data-table-preview',
  imports: [FormsModule, Datatable, LeadSheetForm],
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

  // Create Lead mutation
  readonly createLeadMutation = injectMutation(() => ({
    mutationFn: (payload: CreateUpdateLeadDto) => this.leadsService.apiLeadsPost(payload),

    onSuccess: () => {
      this.leadsQuery.refetch();
    },
  }));

  createLead(payload: CreateUpdateLeadDto) {
    const postPayload = {
      ...payload,
      // TODO: This should be the current authenticated user/team
      assigned_user_id: payload.assigned_user_id ? payload.assigned_user_id : 1,
      assigned_team_id: payload.assigned_team_id ? payload.assigned_team_id : 1,
    } satisfies CreateUpdateLeadDto;
    this.createLeadMutation.mutate(postPayload);
  }

  // Update Lead mutation
  readonly updateLeadMutation = injectMutation(() => ({
    mutationFn: ({ id, payload }: { id: number; payload: CreateUpdateLeadDto }) =>
      this.leadsService.apiLeadsIdPatch(id, payload),

    onSuccess: () => {
      this.leadsQuery.refetch();
    },
  }));

  updateLead(id: number, payload: CreateUpdateLeadDto) {
    this.updateLeadMutation.mutate({ id, payload });
  }

  protected readonly columns = computed((): DatatableColumn<LeadDto>[] => [
    {
      accessorKey: 'first_name',
      id: 'first_name',
      header: 'First Name',
      enableSorting: false,
      cell: (info) => `<span class="capitalize">${info.getValue<string>()}</span>`,
    },
    {
      accessorKey: 'last_name',
      id: 'last_name',
      header: 'Last Name',
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
  ]);

  protected readonly _table = createAngularTable<LeadDto>(() => ({
    data: [this.leadsQuery.data() ?? []].flat(),
    columns: this.columns(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  }));
}
