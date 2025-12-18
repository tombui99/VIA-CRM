import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { hlmH2 } from '@spartan-ng/helm/typography';
import { HlmAccordionImports } from '@spartan-ng/helm/accordion';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { winject } from '@libs/utils/winject';
import { LeadActivitiesService } from '../../api/generated';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
  selector: 'app-lead-activities',
  imports: [CommonModule, HlmAccordionImports, HlmButtonImports, HlmDropdownMenuImports],
  templateUrl: './lead-activities.html',
})
export class LeadActivities {
  hlmH2 = hlmH2;

  private readonly leadActivitiesService = winject(LeadActivitiesService);

  // Lead activities query
  readonly leadActivitiesQuery = injectQuery(() => ({
    queryKey: ['leads'],
    queryFn: () => this.leadActivitiesService.apiLeadActivitiesGet(),
  }));

  readonly hasResults = computed(() => (this.leadActivitiesQuery.data()?.length ?? 0) > 0);
}
