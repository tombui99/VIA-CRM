import { Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout';
import { Users } from './features/users/users';
import { Leads } from './features/leads/leads';
import { LeadActivities } from './features/lead-activities/lead-activities';
import { Dashboard } from './features/dashboard/dashboard';
import { Parents } from './features/parents/parents';
import { Appointments } from './features/appointments/appointments';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'users', component: Users },
      { path: 'leads', component: Leads },
      { path: 'activities', component: LeadActivities },
      { path: 'parents', component: Parents },
      { path: 'appointments', component: Appointments },
    ],
  },
];
