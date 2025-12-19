import { CommonModule } from '@angular/common';
import { Component, computed, signal, viewChild } from '@angular/core';
import { hlmH2 } from '@spartan-ng/helm/typography';
import { HlmAccordionImports } from '@spartan-ng/helm/accordion';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { winject } from '@libs/utils/winject';
import { LeadActivitiesService } from '../../api/generated';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { ActivitySheetForm } from './activity-sheet-form/activity-sheet-form';

@Component({
  selector: 'app-lead-activities',
  imports: [
    CommonModule,
    HlmAccordionImports,
    HlmButtonImports,
    HlmDropdownMenuImports,
    ActivitySheetForm,
  ],
  templateUrl: './lead-activities.html',
})
export class LeadActivities {
  hlmH2 = hlmH2;

  // TODO: This should come from backend
  readonly activityTypes = signal<string[]>(['Email', 'Call', 'SMS', 'Zalo']);

  private readonly leadActivitiesService = winject(LeadActivitiesService);

  readonly activitySheetForm = viewChild<ActivitySheetForm>('activitySheet');

  // Lead activities query
  readonly leadActivitiesQuery = injectQuery(() => ({
    queryKey: ['leads'],
    queryFn: () => this.leadActivitiesService.apiLeadActivitiesGet(),
  }));

  readonly hasResults = computed(() => (this.leadActivitiesQuery.data()?.length ?? 0) > 0);

  openActivitySheet(lead?: any, type?: string) {
    this.activitySheetForm()?.viewchildSheetRef()?.open();
  }
}
