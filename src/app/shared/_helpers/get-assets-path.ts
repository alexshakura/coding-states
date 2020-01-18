import { environment } from '@app/env';
import * as path from 'path';

export function getAssetsPath(): string {
  const basePath = 'assets';

  return environment.production
    ? path.join(__dirname, basePath)
    : `./src/${basePath}`;
}
