import { Component } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import {
  lucideAudioWaveform,
  lucideBanknoteArrowUp,
  lucideBookHeart,
  lucideCalendar,
  lucideChartPie,
  lucideCircleUser,
  lucideMapPinHouse,
  lucideNotebookPen,
  lucideUsers,
  lucideUserStar,
} from '@ng-icons/lucide';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [HlmSidebarImports, NgIcon, HlmIcon, RouterLink, RouterLinkActive],
  template: `
    <div hlmSidebarWrapper>
      <hlm-sidebar>
        <div hlmSidebarHeader>
          <img src="/assets/via_logo.png" alt="Logo" class="h-16 mr-auto pl-2 object-contain" />
        </div>
        <div hlmSidebarContent>
          <div hlmSidebarGroup>
            <div hlmSidebarGroupLabel>Application</div>
            <div hlmSidebarGroupContent>
              <ul hlmSidebarMenu>
                @for(item of _items; track item.title){ @if(!item.isHidden) {
                <li hlmSidebarMenuItem>
                  <a
                    hlmSidebarMenuButton
                    [routerLink]="item.url"
                    routerLinkActive="text-blue-500 font-bold"
                  >
                    <ng-icon hlm [name]="item.icon" />
                    <span>{{ item.title }}</span>
                  </a>
                </li>
                } }
              </ul>
            </div>
          </div>
        </div>
        <div hlmSidebarFooter class="mb-4">
          <a hlmSidebarMenuButton size="lg" href="#">
            <div
              class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
            >
              <ng-icon name="lucideCircleUser" class="text-base" />
            </div>
            <!-- TODO: Dummy hardcoded data should be replaced -->
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">Tom Bui</span>
            </div>
          </a>
        </div>
      </hlm-sidebar>
      <ng-content />
    </div>
  `,
  providers: [
    provideIcons({
      lucideChartPie,
      lucideUsers,
      lucideUserStar,
      lucideCalendar,
      lucideMapPinHouse,
      lucideAudioWaveform,
      lucideNotebookPen,
      lucideBookHeart,
      lucideCircleUser,
      lucideBanknoteArrowUp,
    }),
  ],
})
export class AppSidebar {
  protected readonly _items = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: 'lucideChartPie',
    },
    {
      title: 'Leads',
      url: '/leads',
      icon: 'lucideUserStar',
    },
    {
      title: 'Parents',
      url: '/parents',
      icon: 'lucideBookHeart',
    },
    {
      title: 'Activities',
      url: '/activities',
      icon: 'lucideAudioWaveform',
    },
    {
      title: 'Notes',
      url: '/notes',
      icon: 'lucideNotebookPen',
    },
    {
      title: 'Users',
      url: '/users',
      icon: 'lucideUsers',
    },
    {
      title: 'Centers',
      url: '/centers',
      icon: 'lucideMapPinHouse',
    },
    {
      title: 'Appointments',
      url: '/appointments',
      icon: 'lucideCalendar',
      isHidden: false,
    },
    {
      title: 'Sales',
      url: '/sales',
      icon: 'lucideBanknoteArrowUp',
    },
  ];
}
