import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-smt-data-table-tag',
  templateUrl: './smt-data-table-tag.component.html',
  styles: [
  ]
})
export class SmtDataTableTagComponent implements OnInit {
  @Input() config;
  @Input() dataTableDataServe;
  @Input() valueConfig;
  @Input() state;
  @Output() public updateValue = new EventEmitter<any>(true);
  @Output() public cascadeValue = new EventEmitter<any>(true);
  public text: string;
  public color: string;

  constructor() { }

  ngOnInit(): void {
    if (this.valueConfig) {
      this.text = this.valueConfig.value[this.config.field];
      this._colorMappingResolve();
    }
  }

  private _colorMappingResolve() {
    if (this.config.dataMapping) {
      this.config.dataMapping.forEach(d => {
        let val = this.valueConfig.value;
        // if (d.type === 'tempValue') {
        //   val = this.tempData[d.field];
        // }
        // if (d.type  === 'initValue') {
        //   val = this.initData[d.field];
        // }
        // if (d.type  === 'rowValue') {
        //   val = this.rowData[d.field];
        // }    
        // if (d.type  === 'formValue') {
        //   val = this.rowData[d.field];
        // }
        if (d.type === 'currentValue') {
          val = this.valueConfig.rowData[d.field];
        }
        val = val.trim();
        if (val && (d.value === val)) {
          this.color = d.color;
          if (d.valueText) {
            this.text = d.valueText;
          }
          if (d.valueField) {
            this.text = this.valueConfig.rowData[d.valueField];
          }
          if (!d.valueText && !d.valueField) {
            this.text = this.valueConfig.value;
          }
        }
      });
    }
  }


  public getColorConfig() {

    let _viewId = {};
    // 循环 映射条件
    try {
      this.config.mapping.forEach(item => {
        let regularflag = true;
        if (item.caseValue && item.type === 'condition') {
          const reg1 = new RegExp(item.caseValue.regular);
          let regularData;
          // if (item.caseValue.type) {
          //   if (item.caseValue.type === 'tempValue') {
          //     regularData = this.tempData[item.caseValue.valueName];
          //   }
          //   if (item.caseValue.type === 'initValue') {
          //     regularData = this.initData[item.caseValue.valueName];
          //   }
          //   if (item.caseValue.type === 'rowValue') {
          //     regularData = this.rowData[item.caseValue.valueName];
          //   }

          // } else {
          //   regularData = '';
          // }
          regularflag = reg1.test(regularData);
          // 满足正则表达 
          if (regularflag) {
            // 返回 满足条件视图
            _viewId = item;
            throw new Error();
          }
        } else {
          _viewId = item;
          throw new Error();
          // 无条件，直接返回 视图
        }
      });
    } catch (e) {
      // console.log(e)
    }

    return _viewId;
  }

}
