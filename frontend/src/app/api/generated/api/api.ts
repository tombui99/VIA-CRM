export * from './dashboard.service';
import { DashboardService } from './dashboard.service';
export * from './lead.service';
import { LeadService } from './lead.service';
export * from './leadActivities.service';
import { LeadActivitiesService } from './leadActivities.service';
export * from './user.service';
import { UserService } from './user.service';
export const APIS = [DashboardService, LeadService, LeadActivitiesService, UserService];
