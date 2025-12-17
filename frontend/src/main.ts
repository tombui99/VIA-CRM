import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig as devConfig } from './app/config/app.config.dev';
import { App } from './app/app';

bootstrapApplication(App, devConfig).catch((err) => console.error(err));
