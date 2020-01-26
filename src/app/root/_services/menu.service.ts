import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { BrowserWindow, Menu, MenuItemConstructorOptions } from 'electron';
import { getAssetsPath } from '@app/shared/_helpers/get-assets-path';
import * as path from 'path';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class MenuService {

  public constructor(
    private readonly electronService: ElectronService,
    private readonly translateService: TranslateService
  ) { }

  public getMenuItems(): Menu {
    const template: MenuItemConstructorOptions[] = [
      this.getAppMenu(),
      {
        label: this.translateService.instant('ROOT.MENU.EDIT'),
        submenu: [
          {
            label: this.translateService.instant('ROOT.MENU.UNDO'),
            role: 'undo',
          },
          {
            label: this.translateService.instant('ROOT.MENU.REDO'),
            role: 'redo',
          },
          { type: 'separator' },
          {
            label: this.translateService.instant('ROOT.MENU.CUT'),
            role: 'cut',
          },
          {
            label: this.translateService.instant('ROOT.MENU.COPY'),
            role: 'copy',
          },
          {
            label: this.translateService.instant('ROOT.MENU.PASTE'),
            role: 'paste',
          },
        ],
      },
      {
        label: this.translateService.instant('ROOT.MENU.FILE'),
        submenu: [
          {
            label: this.translateService.instant('ROOT.MENU.CLOSE_WINDOW'),
            role: 'close',
          },
        ],
      },
      {
        label: this.translateService.instant('ROOT.MENU.VIEW'),
        submenu: [
          {
            label: this.translateService.instant('ROOT.MENU.RESET_ZOOM'),
            role: 'resetZoom',
          },
          {
            label: this.translateService.instant('ROOT.MENU.ZOOM_IN'),
            role: 'zoomIn',
          },
          {
            label: this.translateService.instant('ROOT.MENU.ZOOM_OUT'),
            role: 'zoomOut',
          },
          { type: 'separator' },
          {
            label: this.translateService.instant('ROOT.MENU.FULLSCREEN_MODE'),
            role: 'togglefullscreen',
          },
        ],
      },
      {
        label: this.translateService.instant('ROOT.MENU.WINDOW'),
        submenu: [
          {
            label: this.translateService.instant('ROOT.MENU.MINIMIZE_WINDOW'),
            role: 'minimize',
          },
        ],
      },
      {
        label: this.translateService.instant('ROOT.MENU.HELP'),
        submenu: [
          {
            label: this.translateService.instant('ROOT.MENU.USER_MANUAL'),
            click: (_, mainWindow): void => {
              let win: BrowserWindow | null = new this.electronService.remote.BrowserWindow({
                title: this.translateService.instant('ROOT.MENU.USER_MANUAL'),
                minimizable: false,
                maximizable: false,
                fullscreenable: false,
                fullscreen: false,
                parent: mainWindow,
                width: 750,
                height: 750,
              });

              win.loadFile(path.join(getAssetsPath(), 'user-manual.html'))
                .then(() => (win as BrowserWindow).show());

              win.on('closed', () => {
                win = null;
              });
            },
          },
        ],
      },
    ];

    return this.electronService.menu.buildFromTemplate(template);
  }

  private getAppMenu(): MenuItemConstructorOptions {
    let platformSpecificMenu: MenuItemConstructorOptions[] = [];

    if (this.electronService.isMacPlatform) {
      platformSpecificMenu = [
        { type: 'separator' },
        {
          label: this.translateService.instant('ROOT.MENU.HIDE_APP'),
          role: 'hide',
        },
        {
          label: this.translateService.instant('ROOT.MENU.HIDE_OTHERS'),
          role: 'hideOthers',
        },
      ];
    }

    return {
      label: this.electronService.remote.app.getName(),
      submenu: [
        {
          label: this.translateService.instant('ROOT.MENU.ABOUT'),
          click: (_, mainWindow): void => {
            let win: BrowserWindow | null = new this.electronService.remote.BrowserWindow({
              title: this.translateService.instant('ROOT.MENU.ABOUT'),
              minimizable: false,
              maximizable: false,
              fullscreenable: false,
              fullscreen: false,
              resizable: false,
              parent: mainWindow,
              width: 450,
              height: 450,
            });

            win.loadFile(path.join(getAssetsPath(), 'about.html'))
              .then(() => (win as BrowserWindow).show());

            win.on('closed', () => {
              win = null;
            });
          },
        },
        ...platformSpecificMenu,
        { type: 'separator' },
        {
          label: this.translateService.instant('ROOT.MENU.QUIT'),
          role: 'quit',
        },
      ],
    };
  }

}
