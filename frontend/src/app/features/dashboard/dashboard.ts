import { Component, computed, effect, ElementRef, viewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { winject } from '@libs/utils/winject';
import { DashboardService } from '../../api/generated';
import { hlmH2 } from '@spartan-ng/helm/typography';
import { DateTime } from 'luxon';

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
  userLeadsRef = viewChild<ElementRef<HTMLCanvasElement>>('userLeads');
  userSalesRef = viewChild<ElementRef<HTMLCanvasElement>>('userSales');
  contactedVsConvertedRef = viewChild<ElementRef<HTMLCanvasElement>>('contactedVsConverted');
  conversionRateRef = viewChild<ElementRef<HTMLCanvasElement>>('conversionRate');
  kpiByRoleRef = viewChild<ElementRef<HTMLCanvasElement>>('kpiByRole');

  dashboardService = winject(DashboardService);

  private leadsBySourceChart?: Chart;
  private leadsOverTimeChart?: Chart;
  private activitiesByTypeChart?: Chart;
  private activitiesByOutcomeChart?: Chart;
  private userLeadsChart?: Chart;
  private userSalesChart?: Chart;
  private contactedVsConvertedChart?: Chart;
  private conversionRateChart?: Chart;
  private kpiByRoleChart?: Chart;

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
        labels: data.leadsByDate?.map(
          (x: any) => DateTime.fromISO(x.date).setZone('Asia/Ho_Chi_Minh').toFormat('dd LLL yyyy') // e.g. 08 Jan 2026
        ),
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

    // User Leads (Bar)
    this.userLeadsChart?.destroy();

    this.userLeadsChart = new Chart(this.userLeadsRef()?.nativeElement!, {
      type: 'bar',
      data: {
        labels: data.userKpis.map((x: any) => x.userName),
        datasets: [
          {
            label: 'Leads Assigned',
            data: data.userKpis.map((x: any) => x.leadsAssigned),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    // User Sales (Horizontal Bar)
    this.userSalesChart?.destroy();

    this.userSalesChart = new Chart(this.userSalesRef()?.nativeElement!, {
      type: 'bar',
      data: {
        labels: data.userKpis.map((x: any) => x.userName),
        datasets: [
          {
            label: 'Sales Value',
            data: data.userKpis.map((x: any) => x.totalSalesValue),
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    // Contacted vs Converted (Bar)
    this.contactedVsConvertedChart?.destroy();

    this.contactedVsConvertedChart = new Chart(this.contactedVsConvertedRef()?.nativeElement!, {
      type: 'bar',
      data: {
        labels: data.userKpis.map((x: any) => x.userName),
        datasets: [
          {
            label: 'Leads Contacted',
            data: data.userKpis.map((x: any) => x.leadsContacted),
          },
          {
            label: 'Leads Converted',
            data: data.userKpis.map((x: any) => x.leadsConverted),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    // Conversion Rate (Horizontal Bar)
    this.conversionRateChart?.destroy();

    this.conversionRateChart = new Chart(this.conversionRateRef()?.nativeElement!, {
      type: 'bar',
      data: {
        labels: data.userKpis.map((x: any) => x.userName),
        datasets: [
          {
            label: 'Conversion Rate (%)',
            data: data.userKpis.map((x: any) => x.conversionRate),
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            max: 100,
            ticks: {
              callback: (value) => value + '%',
            },
          },
        },
      },
    });

    // KPI by Role (Horizontal Bar)
    this.kpiByRoleChart?.destroy();

    this.kpiByRoleChart = new Chart(this.kpiByRoleRef()?.nativeElement!, {
      type: 'bar',
      data: {
        labels: data.roleKpis.map((x: any) => x.role),
        datasets: [
          {
            label: 'Leads Assigned',
            data: data.roleKpis.map((x: any) => x.leadsAssigned),
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
}
