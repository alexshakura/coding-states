import { Injectable } from '@angular/core';

@Injectable()
export class TableMockDataService {

  // public getMockDataForUnitaryD(): ITableRow[] {
  //   return [
  //     {
  //       id: 1,
  //       srcState: this.states[6],
  //       codeSrcState: null,
  //       distState: this.states[0],
  //       codeDistState: null,
  //       unconditionalX: true,
  //       x: new Set(),
  //       y: new Set(),
  //       f: null,
  //     },
  //     {
  //       id: 2,
  //       srcState: this.states[5],
  //       codeSrcState: null,
  //       distState: this.states[0],
  //       codeDistState: null,
  //       unconditionalX: false,
  //       x: new Set([this.conditionalSignals[5]]),
  //       y: new Set(),
  //       f: null,
  //     },
  //     {
  //       id: 3,
  //       srcState: this.states[4],
  //       codeSrcState: null,
  //       distState: this.states[0],
  //       codeDistState: null,
  //       unconditionalX: false,
  //       x: new Set([
  //         this.conditionalSignals[1],
  //         this.conditionalSignals[5],
  //       ]),
  //       y: new Set(),
  //       f: null,
  //     },
  //     {
  //       id: 4,
  //       srcState: this.states[3],
  //       codeSrcState: null,
  //       distState: this.states[0],
  //       codeDistState: null,
  //       unconditionalX: false,
  //       x: new Set([
  //         this.conditionalSignals[1],
  //         this.conditionalSignals[5],
  //       ]),
  //       y: new Set(),
  //       f: null,
  //     },

  //     {
  //       id: 5,
  //       srcState: this.states[0],
  //       codeSrcState: null,
  //       distState: this.states[1],
  //       codeDistState: null,
  //       unconditionalX: true,
  //       x: new Set(),
  //       y: new Set([1, 2]),
  //       f: null,
  //     },

  //     {
  //       id: 6,
  //       srcState: this.states[1],
  //       codeSrcState: null,
  //       distState: this.states[2],
  //       codeDistState: null,
  //       unconditionalX: false,
  //       x: new Set([this.conditionalSignals[0]]),
  //       y: new Set([3]),
  //       f: null,
  //     },

  //     {
  //       id: 7,
  //       srcState: this.states[1],
  //       codeSrcState: null,
  //       distState: this.states[3],
  //       codeDistState: null,
  //       unconditionalX: false,
  //       x: new Set([
  //         this.conditionalSignals[1],
  //         this.conditionalSignals[2],
  //       ]),
  //       y: new Set([4]),
  //       f: null,
  //     },

  //     {
  //       id: 8,
  //       srcState: this.states[2],
  //       codeSrcState: null,
  //       distState: this.states[3],
  //       codeDistState: null,
  //       unconditionalX: false,
  //       x: new Set([this.conditionalSignals[2]]),
  //       y: new Set([4]),
  //       f: null,
  //     },

  //     {
  //       id: 9,
  //       srcState: this.states[1],
  //       codeSrcState: null,
  //       distState: this.states[4],
  //       codeDistState: null,
  //       unconditionalX: false,
  //       x: new Set([
  //         this.conditionalSignals[1],
  //         this.conditionalSignals[3],
  //       ]),
  //       y: new Set([5]),
  //       f: null,
  //     },

  //     {
  //       id: 10,
  //       srcState: this.states[2],
  //       codeSrcState: null,
  //       distState: this.states[4],
  //       codeDistState: null,
  //       unconditionalX: false,
  //       x: new Set([this.conditionalSignals[3]]),
  //       y: new Set([5]),
  //       f: null,
  //     },

  //     {
  //       id: 11,
  //       srcState: this.states[3],
  //       codeSrcState: null,
  //       distState: this.states[5],
  //       codeDistState: null,
  //       unconditionalX: false,
  //       x: new Set([this.conditionalSignals[0]]),
  //       y: new Set([3]),
  //       f: null,
  //     },

  //     {
  //       id: 12,
  //       srcState: this.states[4],
  //       codeSrcState: null,
  //       distState: this.states[5],
  //       codeDistState: null,
  //       unconditionalX: false,
  //       x: new Set([this.conditionalSignals[0]]),
  //       y: new Set([3]),
  //       f: null,
  //     },

  //     {
  //       id: 13,
  //       srcState: this.states[5],
  //       codeSrcState: null,
  //       distState: this.states[6],
  //       codeDistState: null,
  //       unconditionalX: false,
  //       x: new Set([this.conditionalSignals[4]]),
  //       y: new Set([6]),
  //       f: null,
  //     },
  //     {
  //       id: 14,
  //       srcState: this.states[4],
  //       codeSrcState: null,
  //       distState: this.states[6],
  //       codeDistState: null,
  //       unconditionalX: false,
  //       x: new Set([
  //         this.conditionalSignals[1],
  //         this.conditionalSignals[4],
  //       ]),
  //       y: new Set([6]),
  //       f: null,
  //     },
  //     {
  //       id: 15,
  //       srcState: this.states[3],
  //       codeSrcState: null,
  //       distState: this.states[6],
  //       codeDistState: null,
  //       unconditionalX: false,
  //       x: new Set([
  //         this.conditionalSignals[1],
  //         this.conditionalSignals[4],
  //       ]),
  //       y: new Set([6]),
  //       f: null,
  //     },
  //   ];
  // }

  // public getMockDataForWrongGraph(): ITableRow[] {
  //   return [
  //     {
  //       id: 1,
  //       srcState: this.states[0],
  //       codeSrcState: null,
  //       distState: this.states[1],
  //       codeDistState: null,
  //       unconditionalX: false,
  //       x: new Set([this.conditionalSignals[0]]),
  //       y: new Set([1, 2]),
  //       f: null,
  //     },
  //     {
  //       id: 2,
  //       srcState: this.states[0],
  //       codeSrcState: null,
  //       distState: this.states[2],
  //       codeDistState: null,
  //       unconditionalX: false,
  //       x: new Set([this.conditionalSignals[1]]),
  //       y: new Set([2]),
  //       f: null,
  //     },
  //     {
  //       id: 3,
  //       srcState: this.states[1],
  //       codeSrcState: null,
  //       distState: this.states[1],
  //       codeDistState: null,
  //       unconditionalX: true,
  //       x: new Set(),
  //       y: new Set([3]),
  //       f: null,
  //     },
  //     {
  //       id: 4,
  //       srcState: this.states[2],
  //       codeSrcState: null,
  //       distState: this.states[1],
  //       codeDistState: null,
  //       unconditionalX: true,
  //       x: new Set(),
  //       y: new Set([2, 3]),
  //       f: null,
  //     },
  //   ];
  // }

}
