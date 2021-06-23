import { Component, Inject, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { SmtComponentBase } from '../../../smt-component.base';

@Component({
  selector: 'app-smt-data-table-select',
  templateUrl: './smt-data-table-select.component.html',
  styles: [
  ]
})
export class SmtDataTableSelectComponent extends SmtComponentBase implements OnInit {
  public selectedValue;
  public selectOptions = [];
  public selectItems = [];
  public cascadeOptions: any;

  @Input() config;
  @Input() dataTableDataServe;
  @Input() valueConfig;
  @Input() state;
  @Output() public updateValue = new EventEmitter<any>(true);
  @Output() public cascadeValue = new EventEmitter<any>(true);

  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) {
    super(componentService);
  }

  ngOnInit(): void {
    if (this.config.options && this.config.options.length > 0) {
      this.selectOptions = this.config.options;
      this.selectItems = this.config.options;
    }

    let s_value;
    if (this.valueConfig) {
      s_value = this.valueConfig.value;
    }

    this.selectedValue = s_value;
    setTimeout(() => {
      this.valueChange(this.selectedValue);
    });
  }

  public async valueChange(v?) {
    const backValue: any = { id: this.valueConfig.id, name: this.config.field, value: v };
    if (this.selectItems.length < 1) {
      await this.load();
    }
    const index = this.selectItems.findIndex(item => item[this.config.valueName] === v);
    if (index > -1) {
      backValue.dataItem = this.selectItems[index];
    } else {
      //  if(v)
      // myControl.setValue(null, { emitEvent: true });
    }
    console.log('select 值变化', v, this.config.field, this.selectItems);

    this.updateValue.emit(backValue);
  }

  public async load() {
    // 【参数不全是否阻止加载！】
    // 对后续业务判断有影响
    //  console.log('===select 自加载====>load');
    let response: any;
    response = await this.executeHttp(this.config.mainSource, null, null);
    // console.log('--da---' + this.config.field, response);
    if (response.data && response.data.length > 0) {
      const data_form = response.data;
      this.selectItems = data_form;
      const newOptions = [];
      // 下拉选项赋值
      data_form.forEach(element => {
        newOptions.push({ label: element[this.config.labelName], value: element[this.config.valueName] });
      });
      setTimeout(() => {
        this.selectOptions = newOptions;
      });


    }
    else {
      this.selectItems = [];
      this.selectOptions = [];
    }
  }

  // 级联分析

}
