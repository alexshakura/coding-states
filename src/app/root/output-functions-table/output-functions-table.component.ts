import { Component, OnInit } from '@angular/core';

import { CodingAlgorithmsService } from '../_services/coding-algorithms.service';
import { OutputSignalOperand } from '@app/models';
import { BaseComponent } from '@app/shared/_helpers/base-component';
import { IFunctions, IOutputFunctionsDataCell } from '@app/types';
import { takeUntil } from 'rxjs/operators';
import { DISPLAYED_COLUMNS } from './output-functions-table.constants';
import { SignalOperandGeneratorService } from '../_services/signal-operand-generator.service';

@Component({
  selector: 'app-output-functions-table',
  templateUrl: './output-functions-table.component.html',
  host: { class: 'component-wrapper' },
})
export class OutputFunctionsTableComponent extends BaseComponent implements OnInit {

  public readonly displayedColumns: string[] = DISPLAYED_COLUMNS;

  public dataSource: IOutputFunctionsDataCell[];

  public isBooleanBasisShown: boolean = true;

  private booleanFunctions: IOutputFunctionsDataCell[];
  private shefferFunctions: IOutputFunctionsDataCell[];

  public constructor(
    private readonly codingAlgorithmsService: CodingAlgorithmsService,
    private readonly signalOperandGeneratorService: SignalOperandGeneratorService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.codingAlgorithmsService.outputFunctions$
      .pipe(
        takeUntil(this.destroy$$)
      )
      .subscribe((outputFunctions: IFunctions) => {
        this.fillBasisFunctions(outputFunctions);
        this.toggleBasis(true);
      });
  }

  private fillBasisFunctions(outputFunctions: IFunctions): void {
    const outputSignals = this.signalOperandGeneratorService.getOutputSignals();

    this.booleanFunctions = [];
    this.shefferFunctions = [];

    outputFunctions.boolean.forEach((equation, id) => {
      this.booleanFunctions.push({
        outputSignal: outputSignals.get(id) as OutputSignalOperand,
        function: equation,
      });
    });

    outputFunctions.sheffer.forEach((equation, id) => {
      this.shefferFunctions.push({
        outputSignal: outputSignals.get(id) as OutputSignalOperand,
        function: equation,
      });
    });
  }

  public toggleBasis(isBooleanBasis: boolean): void {
    this.isBooleanBasisShown = isBooleanBasis;

    this.dataSource = this.isBooleanBasisShown
      ? this.booleanFunctions
      : this.shefferFunctions;
  }

}
