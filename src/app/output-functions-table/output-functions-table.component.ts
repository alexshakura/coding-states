import { Component, OnInit } from '@angular/core';
import { CodingAlgorithmsService } from '../services/coding-algorithms.service';

@Component({
  selector: 'app-output-functions-table',
  templateUrl: './output-functions-table.component.html',
  styleUrls: ['./output-functions-table.component.scss']
})
export class OutputFunctionsTableComponent implements OnInit {

  public constructor(
    private _codingAlgorithmsService: CodingAlgorithmsService
  ) { }

  public ngOnInit(): void {
    // this._codingAlgorithmsService.
  }

}
