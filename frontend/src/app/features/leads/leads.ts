import { Component, computed, inject, signal, TemplateRef, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { hlmH2, hlmH3 } from '@spartan-ng/helm/typography';
import { CreateUpdateLeadDto, LeadDto, LeadService } from '../../api/generated';
import { winject } from '@libs/utils/winject';
import { injectMutation, injectQuery } from '@tanstack/angular-query-experimental';
import { Datatable, DatatableColumn } from '@libs/custom/datatable';
import { LeadSheetForm } from './lead-sheet-form/lead-sheet-form';
import { CellContext } from '@tanstack/angular-table';
import { HlmButton } from '@spartan-ng/helm/button';
import { CommonModule, DatePipe } from '@angular/common';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
  selector: 'spartan-data-table-preview',
  imports: [
    FormsModule,
    Datatable,
    LeadSheetForm,
    HlmButton,
    CommonModule,
    HlmInputImports,
    HlmTabsImports,
    HlmCardImports,
    HlmLabelImports,
  ],
  host: {
    class: 'w-full',
  },
  providers: [DatePipe],
  templateUrl: './leads.html',
})
export class Leads {
  hlmH2 = hlmH2;
  hlmH3 = hlmH3;

  // Injections
  private readonly leadsService = winject(LeadService);
  private readonly datePipe = inject(DatePipe);

  // Variables declaration
  firstNameCell =
    viewChild.required<TemplateRef<{ $implicit: CellContext<LeadDto, unknown> }>>('firstNameCell');
  leadSheetForm = viewChild<LeadSheetForm>('leadSheetForm');
  selectedLead = signal<LeadDto | null>(null);
  selectedFile?: File;

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
    this.createLeadMutation.mutate(payload);
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

  // Import Lead mutation
  readonly importLeadMutation = injectMutation(() => ({
    mutationFn: ({ payload }: { payload: Blob }) => this.leadsService.apiLeadsImportPost(payload),

    onSuccess: () => {
      this.leadsQuery.refetch();
      this.selectedFile = undefined;
    },
  }));

  importLead(payload: Blob) {
    this.importLeadMutation.mutate({ payload });
  }

  handleLeadSubmit(lead: CreateUpdateLeadDto) {
    if (this.selectedLead()?.id) {
      this.updateLead(this.selectedLead()?.id!, lead);
    } else {
      this.createLead(lead);
    }
  }

  openLeadFormSheet(lead?: LeadDto) {
    this.selectedLead.set(lead ?? null);
    this.leadSheetForm()?.viewchildSheetRef()?.open();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  importCsv() {
    if (!this.selectedFile) return;
    this.importLead(this.selectedFile);
  }

  protected readonly columns = computed((): DatatableColumn<LeadDto>[] => [
    {
      accessorKey: 'first_name',
      id: 'first_name',
      header: 'First Name',
      enableSorting: false,
      cell: () => {
        return this.firstNameCell();
      },
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
      accessorKey: 'created_at',
      id: 'created_at',
      header: 'Created at',
      enableSorting: false,
      cell: (info) => {
        const date = (info.getValue() as string) ?? '';
        return this.datePipe.transform(date, 'short');
      },
    },
    {
      accessorKey: 'assigned_user_name',
      id: 'assigned_user_name',
      header: 'Assigned User',
      enableSorting: false,
      cell: (info) => `<span>${info.getValue<string>()}</span>`,
    },
    {
      accessorKey: 'is_duplicate',
      id: 'is_duplicate',
      header: 'Is Duplicate',
      enableSorting: false,
      cell: (info) => `<span>${info.getValue<string>() ? 'yes' : 'no'}</span>`,
    },
  ]);
}
