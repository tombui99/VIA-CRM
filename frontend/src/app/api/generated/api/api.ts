export * from './leads.service';
import { LeadsService } from './leads.service';
export * from './users.service';
import { UsersService } from './users.service';
export const APIS = [LeadsService, UsersService];
