import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { winject } from '@libs/utils/winject';
import { hlmH2 } from '@spartan-ng/helm/typography';
import { Sale, SalesService } from '../../api/generated';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { Datatable, DatatableColumn } from '@libs/custom/datatable';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
  selector: 'app-parents',
  imports: [HlmButtonImports, Datatable, NgIcon, HlmInputImports, CommonModule],
  providers: [
    CurrencyPipe,
    provideIcons({
      lucideSearch,
    }),
  ],
  templateUrl: './sales.html',
})
export class Sales {
  hlmH2 = hlmH2;

  private readonly currencyPipe = inject(CurrencyPipe);

  private readonly salesService = winject(SalesService);

  // Sales query
  readonly salesQuery = injectQuery(() => ({
    queryKey: ['sales'],
    queryFn: () => this.salesService.apiSalesGet(),
  }));

  readonly hasResults = computed(() => (this.salesQuery.data()?.length ?? 0) > 0);

  protected readonly columns = computed((): DatatableColumn<Sale>[] => [
    {
      accessorKey: 'lead',
      id: 'lead',
      header: 'Lead name',
      size: 250,
      cell: (info) =>
        `<span class="capitalize">${info.getValue<any>().first_name} ${
          info.getValue<any>().last_name
        }</span>`,
    },
    {
      accessorKey: 'parent',
      id: 'parent',
      header: 'Parent name',
      size: 250,
      cell: (info) => `<span class="capitalize">${info.getValue<any>().name} </span>`,
    },
    {
      accessorKey: 'assigned_user',
      id: 'assigned_user',
      header: 'Assigned User',
      size: 250,
      cell: (info) =>
        `<span class="capitalize">${info.getValue<any>().first_name} ${
          info.getValue<any>().last_name
        }</span>`,
    },
    {
      accessorKey: 'sale_value',
      id: 'sale_value',
      header: 'Sale Value',
      size: 250,
      cell: (info) =>
        `<span class="capitalize">${this.currencyPipe.transform(
          info.getValue<string>(),
          'VND'
        )}</span>`,
    },
    {
      accessorKey: 'sale_value',
      id: 'sale_value',
      header: 'Contract',
      size: 250,
      cell: (info) => `<span class="underline text-blue-600">contract.pdf</span>`,
    },
    {
      accessorKey: 'status',
      id: 'status',
      header: 'Status',
      size: 250,
      cell: (info) => `<span class="capitalize">${info.getValue<string>()}</span>`,
    },
  ]);
}
