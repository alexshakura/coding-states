declare namespace App {
  export interface TableData {
    length: number;
    numberOfStates: number;
    numberOfX: number;
    numberOfY: number;
  }

  export interface ConditionalSignal {
    id: number;
    inverted: boolean
  }
}
