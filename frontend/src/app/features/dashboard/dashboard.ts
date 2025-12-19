import { Component, computed, effect, ElementRef, viewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { winject } from '@libs/utils/winject';
import { DashboardService } from '../../api/generated';
import { hlmH2, hlmH3 } from '@spartan-ng/helm/typography';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  hlmH2 = hlmH2;

  leadsBySourceRef = viewChild<ElementRef<HTMLCanvasElement>>('leadsBySource');
  leadsOverTimeRef = viewChild<ElementRef<HTMLCanvasElement>>('leadsOverTime');
  activitiesByTypeRef = viewChild<ElementRef<HTMLCanvasElement>>('activitiesByType');
  activitiesByOutcomeRef = viewChild<ElementRef<HTMLCanvasElement>>('activitiesByOutcome');

  dashboardService = winject(DashboardService);

  private leadsBySourceChart?: Chart;
  private leadsOverTimeChart?: Chart;
  private activitiesByTypeChart?: Chart;
  private activitiesByOutcomeChart?: Chart;

  // Dashboard stats query
  readonly dashboardQuery = injectQuery(() => ({
    queryKey: ['leads'],
    queryFn: () => this.dashboardService.apiDashboardStatsGet(),
  }));

  readonly hasResults = computed(() => this.dashboardQuery.data());

  constructor() {
    effect(() => {
      const data = this.dashboardQuery.data();

      if (!data) return;

      this.renderCharts(data);
    });
  }

  private renderCharts(data: any) {
    // Leads by Source (Pie)
    this.leadsBySourceChart?.destroy();

    this.leadsBySourceChart = new Chart(this.leadsBySourceRef()?.nativeElement!, {
      type: 'pie',
      data: {
        labels: data.leadsBySource?.map((x: any) => x.label),
        datasets: [
          {
            data: data.leadsBySource?.map((x: any) => x.count),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    // Leads Over Time (Line)
    this.leadsOverTimeChart?.destroy();

    this.leadsOverTimeChart = new Chart(this.leadsOverTimeRef()?.nativeElement!, {
      type: 'line',
      data: {
        labels: data.leadsByDate?.map((x: any) => x.date),
        datasets: [
          {
            label: 'Leads',
            data: data.leadsByDate?.map((x: any) => x.count),
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    // Activities by Type (Bar)
    this.activitiesByTypeChart?.destroy();

    this.activitiesByTypeChart = new Chart(this.activitiesByTypeRef()?.nativeElement!, {
      type: 'bar',
      data: {
        labels: data.activitiesByType?.map((x: any) => x.label),
        datasets: [
          {
            label: 'Activities',
            data: data.activitiesByType?.map((x: any) => x.count),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    // Activities by Outcome (Doughnut)
    this.activitiesByOutcomeChart?.destroy();

    this.activitiesByOutcomeChart = new Chart(this.activitiesByOutcomeRef()?.nativeElement!, {
      type: 'doughnut',
      data: {
        labels: data.activitiesByOutcome?.map((x: any) => x.label),
        datasets: [
          {
            data: data.activitiesByOutcome?.map((x: any) => x.count),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
}
