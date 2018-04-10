import { Injectable } from '@angular/core';

@Injectable()
export class CodingAlgorithmsService {

  public static readonly UNITARY_D_ALGORITHM: string = 'unitary';
  public static readonly FREQUENCY_D_ALGORITHM: string = 'frequency';

  constructor() { }


  public unitaryD(tableData: App.TableRowData[]) {
    const codeStates: number[] = [];

    const tableCodingStates: number[] = [].concat(...tableData.map(
      (tableRowData: App.TableRowData) => [tableRowData.srcState, tableRowData.distState])
    );

    const capacity: number = Math.max(...tableCodingStates);

    for (let i: number = 0; i < capacity; i++) {
      codeStates.push(1 << i);
    }
  }
}
