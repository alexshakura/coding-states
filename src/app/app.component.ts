import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';


  public constructor(
    private _dialog: MatDialog
  ) { }

  public ngOnInit(): void {
    this._dialog.open()
  }
}
