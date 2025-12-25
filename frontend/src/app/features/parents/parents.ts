import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { winject } from '@libs/utils/winject';
import { hlmH2 } from '@spartan-ng/helm/typography';
import { Parent, ParentsService } from '../../api/generated';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { Datatable, DatatableColumn } from '@libs/custom/datatable';

@Component({
  selector: 'app-parents',
  imports: [HlmButtonImports, Datatable],
  templateUrl: './parents.html',
})
export class Parents {
  hlmH2 = hlmH2;

  private readonly parentsService = winject(ParentsService);

  // Parents query
  readonly parentsQuery = injectQuery(() => ({
    queryKey: ['parents'],
    queryFn: () => this.parentsService.apiParentsGet(),
  }));

  readonly hasResults = computed(() => (this.parentsQuery.data()?.length ?? 0) > 0);

  protected readonly columns = computed((): DatatableColumn<Parent>[] => [
    {
      accessorKey: 'name',
      id: 'name',
      header: 'Name',
      size: 250,
      cell: (info) => `<span class="capitalize">${info.getValue<string>()}</span>`,
    },
    {
      accessorKey: 'phone',
      id: 'phone',
      header: 'Phone',
      size: 250,
      cell: (info) => `<span class="capitalize">${info.getValue<string>()}</span>`,
    },
    {
      accessorKey: 'lead',
      id: 'lead',
      header: 'Parent of lead',
      size: 250,
      cell: (info) => `<span class="capitalize">${info.getValue<any>().first_name}</span>`,
    },
    {
      accessorKey: 'parent_character',
      id: 'parent_character',
      header: 'Character',
      size: 250,
      cell: (info) => `<span class="capitalize">${info.getValue<string>()}</span>`,
    },
    {
      accessorKey: 'occupation',
      id: 'occupation',
      header: 'Occupation',
      size: 250,
      cell: (info) => `<span class="capitalize">${info.getValue<string>()}</span>`,
    },
    {
      accessorKey: 'dob',
      id: 'dob',
      header: 'DOB',
      size: 250,
      cell: (info) => `<span class="capitalize">${info.getValue<string>()}</span>`,
    },
  ]);
}
