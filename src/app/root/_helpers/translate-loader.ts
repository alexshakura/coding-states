import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import * as path from 'path';
import * as fs from 'fs';
import { getAssetsPath } from '@app/shared/_helpers/get-assets-path';

export class CustomTranslateLoader implements TranslateLoader {

  public getTranslation(lang: string): Observable<object> {
    const pathToTranslationFile = path.join(getAssetsPath(), 'i18n', `${lang}.json`);
    const file = fs.readFileSync(pathToTranslationFile, { encoding: 'utf8' });

    return of(JSON.parse(file));
  }
}
