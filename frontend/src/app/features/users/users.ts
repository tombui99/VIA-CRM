import { Component, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { hlmH2, hlmH3 } from '@spartan-ng/helm/typography';
import { UserDto, UserService } from '../../api/generated';
import { winject } from '@libs/utils/winject';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { Datatable, DatatableColumn } from '@libs/custom/datatable';

@Component({
  selector: 'spartan-data-table-preview',
  imports: [FormsModule, HlmButtonImports, Datatable],
  host: {
    class: 'w-full',
  },
  templateUrl: './users.html',
})
export class Users {
  hlmH2 = hlmH2;
  hlmH3 = hlmH3;

  private readonly usersService = winject(UserService);

  // User query
  readonly usersQuery = injectQuery(() => ({
    queryKey: ['users'],
    queryFn: () => this.usersService.apiUsersGet(),
  }));

  readonly hasResults = computed(() => (this.usersQuery.data()?.length ?? 0) > 0);

  protected readonly columns = computed((): DatatableColumn<UserDto>[] => [
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
    {
      accessorKey: 'role_name',
      id: 'role_name',
      header: 'Role Name',
      enableSorting: false,
      size: 250,
      cell: (info) => `<span>${info.getValue<string>()}</span>`,
    },
  ]);
}
