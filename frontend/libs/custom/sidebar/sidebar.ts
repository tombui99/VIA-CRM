import { Component } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import {
  lucideAudioWaveform,
  lucideCalendar,
  lucideChartPie,
  lucideMapPinHouse,
  lucideNotebookPen,
  lucideUsers,
  lucideUserStar,
} from '@ng-icons/lucide';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [HlmSidebarImports, NgIcon, HlmIcon, RouterLink],
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
                @for(item of _items; track item.title){
                <li hlmSidebarMenuItem>
                  <a hlmSidebarMenuButton [routerLink]="item.url">
                    <ng-icon hlm [name]="item.icon" />
                    <span>{{ item.title }}</span>
                  </a>
                </li>
                }
              </ul>
            </div>
          </div>
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
    }),
  ],
})
export class AppSidebar {
  protected readonly _items = [
    {
      title: 'Dashboard',
      url: '',
      icon: 'lucideChartPie',
    },
    {
      title: 'Leads',
      url: '/leads',
      icon: 'lucideUserStar',
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
    },
  ];
}
