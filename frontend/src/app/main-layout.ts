import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppSidebar } from '../../libs/custom/sidebar/sidebar';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppSidebar, HlmSidebarImports],
  template: `
    <div class="flex h-screen">
      <app-sidebar>
        <main hlmSidebarInset>
          <header class="flex mt-4">
            <button hlmSidebarTrigger><span class="sr-only"></span></button>
            <router-outlet />
          </header>
        </main>
      </app-sidebar>
    </div>
  `,
})
export class MainLayoutComponent {}
