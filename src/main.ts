import { enableProdMode, ViewEncapsulation } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { RootModule } from './app/root/root.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(RootModule, { defaultEncapsulation: ViewEncapsulation.None })
  .catch(err => console.error(err));
