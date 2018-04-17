import { Component, OnInit } from '@angular/core';
import { CodingAlgorithmsService } from '../services/coding-algorithms.service';
import { TableDataService } from '../services/table-data.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-coding-algorithm-dialog',
  templateUrl: './coding-algorithm-dialog.component.html',
  styleUrls: ['./coding-algorithm-dialog.component.scss']
})
export class CodingAlgorithmDialogComponent implements OnInit {

  public readonly UNITARY_D_ALGORITHM: string = CodingAlgorithmsService.UNITARY_D_ALGORITHM;
  public readonly FREQUENCY_D_ALGORITHM: string = CodingAlgorithmsService.FREQUENCY_D_ALGORITHM;

  public codingAlgorithm: string;

  public isLoading: boolean = false;

  public constructor(
    private _codingAlgorithmsService: CodingAlgorithmsService,
    private _dialogRef: MatDialogRef<CodingAlgorithmDialogComponent>,
    private _tableDataService: TableDataService
  ) { }

  ngOnInit() {
  }

  public performCoding(): void {
    this.isLoading = true;

    this._tableDataService.tableData$
      .subscribe((tableData: App.TableRow[]) => {
        this._codingAlgorithmsService.code(this.codingAlgorithm, tableData);

        this._dialogRef.close(true);
      });
  }
}
