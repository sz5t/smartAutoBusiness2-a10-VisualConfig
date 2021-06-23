import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-smt-data-table-show-span-text',
  templateUrl: './smt-data-table-show-span-text.component.html',
  styles: [
  ]
})
export class SmtDataTableShowSpanTextComponent implements OnInit {
  @Input() config;
  @Input() dataTableDataServe;
  @Input() valueConfig;
  @Input() state;
  @Output() public updateValue = new EventEmitter<any>(true);
  @Output() public cascadeValue = new EventEmitter<any>(true);



  public isShow = true;
  public showAll = false;
  public showLabel;
  public showShortLabel;
  public showTitle;
  public text;

  constructor() { }

  ngOnInit(): void {
    if (this.valueConfig) {
      this.text = this.valueConfig.value;
      this.initText(this.text);
      // this._colorMappingResolve();
    }
  }

  public initText(v?) {
    if (this.config.formatConfig) {

      const formatConfig = this.config.formatConfig;
      let regularData = v;
      if (formatConfig.type) {
        if (formatConfig.type === 'row') {
          // if (this.rowData) {
          //   regularData = this.rowData[formatConfig.valueName];
          // }
        }
      }
      this.showTitle = regularData;
      this.showLabel = regularData;
      const regularflag = formatConfig.responseConfig.substrlength ? parseInt(formatConfig.responseConfig.substrlength) : 50;
      if (regularData) {
        if (regularData.length <= regularflag) {
          this.isShow = true;
          return true;
        } else {
          this.isShow = false;
          this.showShortLabel = regularData.substring(0, regularflag);
          return true;
        }
      }
    }
  }

  // 展开文本
  public openSapn() {
    this.showAll = !this.showAll;

  }

  // 收缩文本
  public closeSapn() {
    this.showAll = !this.showAll;

  }
  public cascadeAnalysis(c?) {

  }

}
