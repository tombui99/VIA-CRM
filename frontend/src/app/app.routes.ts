import { Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout';
import { Users } from './features/users/users';
import { Leads } from './features/leads/leads';
import { LeadActivities } from './features/lead-activities/lead-activities';
import { Dashboard } from './features/dashboard/dashboard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'users', component: Users },
      { path: 'leads', component: Leads },
      { path: 'activities', component: LeadActivities },
    ],
  },
];
