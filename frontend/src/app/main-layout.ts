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
      <footer class="border-t bg-white mt-6">
        <div class="mx-auto max-w-7xl px-6 py-6">
          <div class="flex flex-col items-center justify-between gap-4 md:flex-row">
            <!-- Left -->
            <p class="text-sm text-gray-500">© 2026 VIA. All rights reserved.</p>

            <!-- Center -->
            <div class="flex items-center gap-6 text-sm">
              <a href="#" class="text-gray-500 hover:text-gray-900 transition"> Privacy </a>
              <a href="#" class="text-gray-500 hover:text-gray-900 transition"> Terms </a>
              <a href="#" class="text-gray-500 hover:text-gray-900 transition"> Support </a>
            </div>

            <!-- Right -->
            <div class="flex items-center gap-4">
              <a href="#" class="text-gray-400 hover:text-gray-600 transition" aria-label="Twitter">
                <i class="fab fa-twitter"></i>
              </a>
              <a href="#" class="text-gray-400 hover:text-gray-600 transition" aria-label="GitHub">
                <i class="fab fa-github"></i>
              </a>
              <a
                href="#"
                class="text-gray-400 hover:text-gray-600 transition"
                aria-label="LinkedIn"
              >
                <i class="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
    <hlm-toaster />
  `,
})
export class MainLayoutComponent {}
