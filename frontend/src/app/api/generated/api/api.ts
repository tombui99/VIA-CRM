export * from './lead.service';
import { LeadService } from './lead.service';
export * from './user.service';
import { UserService } from './user.service';
export const APIS = [LeadService, UserService];
