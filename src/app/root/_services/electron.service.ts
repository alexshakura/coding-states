import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { dialog, ipcRenderer, Menu, remote, webFrame } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ElectronService {

  public readonly ipcRenderer: typeof ipcRenderer;
  public readonly webFrame: typeof webFrame;
  public readonly remote: typeof remote;
  public readonly childProcess: typeof childProcess;
  public readonly fs: typeof fs;
  public readonly dialog: typeof dialog;
  public readonly path: typeof path;
  public readonly menu: typeof Menu;

  public isMacPlatform: boolean = process.platform === 'darwin';

  public constructor() {
    const electron = window.require('electron');

    this.ipcRenderer = electron.ipcRenderer;
    this.webFrame = electron.webFrame;
    this.remote = electron.remote;
    this.dialog = this.remote.dialog;
    this.menu = this.remote.Menu;

    this.childProcess = window.require('child_process');
    this.fs = window.require('fs');
    this.path = window.require('path');
  }

}
