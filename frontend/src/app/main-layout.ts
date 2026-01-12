import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppSidebar } from '@libs/custom/sidebar/sidebar';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppSidebar, HlmSidebarImports, HlmToasterImports],
  template: `
    <div class="min-h-screen">
      <app-sidebar>
        <main hlmSidebarInset class="flex-1 overflow-y-auto">
          <header class="container mx-auto px-4">
            <button hlmSidebarTrigger><span class="sr-only"></span></button>
            <router-outlet />
          </header>
        </main>
      </app-sidebar>
    </div>
    <hlm-toaster />
  `,
})
export class MainLayoutComponent {}
