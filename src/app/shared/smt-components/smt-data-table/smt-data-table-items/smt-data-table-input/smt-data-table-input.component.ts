import { Component, Input, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-smt-data-table-input',
  templateUrl: './smt-data-table-input.component.html',
  styles: [
  ]
})
export class SmtDataTableInputComponent implements OnInit {
  @Input() config;
  @Input() public dataTableDataService;
  @Input() valueConfig;
  @Input() state;
  @Output() public updateValue = new EventEmitter<any>(true);
  @Output() public cascadeValue = new EventEmitter<any>(true);
  itemConfig: any = {
    hiddenTitle: false,
    "labelSize": {
      "span": 8,
      "nzXs": {
        "span": 8,
        "offset": 0
      },
      "nzSm": {
        "span": 8,
        "offset": 0
      },
      "nzMd": {
        "span": 8,
        "offset": 0
      },
      "nzLg": {
        "span": 8,
        "offset": 0
      },
      "ngXl": {
        "span": 8,
        "offset": 0
      },
      "nzXXl": {
        "span": 8,
        "offset": 0
      }
    },
    "controlSize": {
      "span": 16,
      "nzXs": 16,
      "nzSm": 16,
      "nzMd": 16,
      "nzLg": 16,
      "ngXl": 16,
      "nzXXl": 16
    }
  };
  constructor() { }


  ngOnInit(): void {
    if (this.config) {
      if (!this.config['labelSize']) {
        this.config['labelSize'] = this.itemConfig['labelSize'];
      }
      if (!this.config['controlSize']) {
        this.config['controlSize'] = this.itemConfig['controlSize'];
      }

    }
  }

}
