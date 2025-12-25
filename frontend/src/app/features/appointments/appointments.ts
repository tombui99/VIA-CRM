import { Component, computed, inject } from '@angular/core';
import { winject } from '@libs/utils/winject';
import { hlmH2 } from '@spartan-ng/helm/typography';
import { Appointment, AppointmentsService } from '../../api/generated';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { Datatable, DatatableColumn } from '@libs/custom/datatable';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-appointments',
  imports: [HlmButtonImports, Datatable],
  templateUrl: './appointments.html',
  providers: [DatePipe],
})
export class Appointments {
  hlmH2 = hlmH2;

  private readonly appointmentsService = winject(AppointmentsService);
  private readonly datePipe = inject(DatePipe);

  // Appointments query
  readonly appointmentsQuery = injectQuery(() => ({
    queryKey: ['appointments'],
    queryFn: () => this.appointmentsService.apiAppointmentsGet(),
  }));

  readonly hasResults = computed(() => (this.appointmentsQuery.data()?.length ?? 0) > 0);

  protected readonly columns = computed((): DatatableColumn<Appointment>[] => [
    {
      accessorKey: 'lead',
      id: 'lead',
      header: 'Lead Name',
      size: 250,
      cell: (info) =>
        `<span class="capitalize">${
          info.getValue<any>().first_name + ' ' + info.getValue<any>().last_name
        }</span>`,
    },
    {
      accessorKey: 'user',
      id: 'user',
      header: 'Created by',
      size: 250,
      cell: (info) =>
        `<span class="capitalize">${
          info.getValue<any>().first_name + ' ' + info.getValue<any>().last_name
        }</span>`,
    },
    {
      accessorKey: 'appointment_type',
      id: 'appointment_type',
      header: 'Appointment Type',
      size: 250,
      cell: (info) => `<span class="capitalize">${info.getValue<string>()}</span>`,
    },
    {
      accessorKey: 'appointment_time',
      id: 'appointment_time',
      header: 'Appointment Time',
      size: 250,
      cell: (info) => {
        const date = (info.getValue() as string) ?? '';
        return this.datePipe.transform(date, 'short');
      },
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
