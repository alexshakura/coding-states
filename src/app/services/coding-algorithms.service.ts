import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';


@Injectable()
export class CodingAlgorithmsService {

  public static readonly UNITARY_D_ALGORITHM: string = 'unitary';
  public static readonly FREQUENCY_D_ALGORITHM: string = 'frequency';

  public static readonly D_TRIGGER_MODE: string = 'D';

  public get triggerMode$(): Observable<string> {
    return this._triggerMode$$.asObservable();
  }

  private _triggerMode$$: ReplaySubject<string> = new ReplaySubject<string>(1);

  public get vertexCodes$(): Observable<App.VertexCode[]> {
    return this._vertexCodes$$.asObservable();
  }

  private _vertexCodes$$: ReplaySubject<App.VertexCode[]> = new ReplaySubject<App.VertexCode[]>(1);

  // public get outputBooleanFunctions$(): Observable<> {
    // return;
  // }

  // private _outputBooleanFunctions$$: ReplaySubject<> = new ReplaySubject<>(1);

  constructor() { }

  public code(algorithm: string, tableData: App.TableRowData[]): void {
    switch (algorithm) {
      case CodingAlgorithmsService.UNITARY_D_ALGORITHM:
        this.unitaryD(tableData);
        break;
    }
  }

  public unitaryD(tableData: App.TableRowData[]) {
    const vertexCodes: App.VertexCode[] = [];

    const tableCodingStates: number[] = tableData.map((tableRowData: App.TableRowData) => tableRowData.distState);
    const capacity: number = Math.max(...tableCodingStates);

    for (let i: number = 0; i < capacity; i++) {
      vertexCodes.push({
        id: i + 1,
        code: 1 << i
      });
    }

    this._triggerMode$$.next(CodingAlgorithmsService.D_TRIGGER_MODE);
    this._vertexCodes$$.next(vertexCodes);
  }
}
