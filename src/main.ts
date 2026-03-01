// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { AppComponent } from './app/app.component';

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));

// import { provideRouter } from '@angular/router';
// import { routes } from './app/app.routes';
// import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from './app/app.component';

// bootstrapApplication(AppComponent, {
//   providers: [
//     provideRouter(routes)
//   ]
// });

import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(ReactiveFormsModule)
  ]
}).catch(err => console.error(err));
