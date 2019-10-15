import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { dialog, ipcRenderer, remote, webFrame } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ElectronService {

  public ipcRenderer: typeof ipcRenderer;
  public webFrame: typeof webFrame;
  public remote: typeof remote;
  public childProcess: typeof childProcess;
  public fs: typeof fs;
  public dialog: typeof dialog;
  public path: typeof path;

  public constructor() {
    // Conditional imports
    if (this.isElectron()) {
      const electron = window.require('electron');

      this.ipcRenderer = electron.ipcRenderer;
      this.webFrame = electron.webFrame;
      this.remote = electron.remote;
      this.dialog = this.remote.dialog;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
      this.path = window.require('path');
    }
  }

  public isElectron = (): boolean => {
    return window && window.process && window.process.type;
  }

}
