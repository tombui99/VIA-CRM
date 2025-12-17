import { Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout';
import { Users } from './features/users/users';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [{ path: 'users', component: Users }],
  },
];
