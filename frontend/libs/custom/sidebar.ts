import { Component } from '@angular/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { lucideHouse, lucideUsers, lucideUserStar } from '@ng-icons/lucide';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { RouterLink } from '@angular/router';
import { hlmH1 } from '@spartan-ng/helm/typography';

@Component({
  selector: 'app-sidebar',
  imports: [HlmSidebarImports, NgIcon, HlmIcon, RouterLink],
  template: `
    <div hlmSidebarWrapper>
      <hlm-sidebar>
        <div hlmSidebarHeader>
          <h1 class="${hlmH1}">VIA</h1>
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
      lucideHouse,
      lucideUsers,
      lucideUserStar,
    }),
  ],
})
export class AppSidebar {
  protected readonly _items = [
    {
      title: 'Dashboard',
      url: '',
      icon: 'lucideHouse',
    },
    {
      title: 'Leads',
      url: '/leads',
      icon: 'lucideUserStar',
    },
    {
      title: 'Users',
      url: '/users',
      icon: 'lucideUsers',
    },
  ];
}
