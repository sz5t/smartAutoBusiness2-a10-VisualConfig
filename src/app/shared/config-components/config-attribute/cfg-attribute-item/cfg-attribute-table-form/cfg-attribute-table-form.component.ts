import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { CnComponentBase } from 'src/app/shared/components/cn-component.base';
import { CfgAttributeFormComponent } from '../cfg-attribute-form/cfg-attribute-form.component';
import { CfgAttributeTableComponent } from '../cfg-attribute-table/cfg-attribute-table.component';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';

@Component({
  selector: 'cfg-attribute-table-form,[cfg-attribute-table-form]',
  templateUrl: './cfg-attribute-table-form.component.html',
  styleUrls: ['./cfg-attribute-table-form.component.less']
})
export class CfgAttributeTableFormComponent extends CnComponentBase implements OnInit {
  @Input() public config;
  @Input() public attributeConfig;
  @Input() public changeValue;
  @Input() public initData;
  @ViewChild('AttributeForm', { static: false }) public AttributeForm: CfgAttributeFormComponent;
  @ViewChild('AttributeTable', { static: false }) public AttributeTable: CfgAttributeTableComponent;
  constructor(@Inject(BSN_COMPONENT_SERVICES)
  public componentService: ComponentServiceProvider) {
    super(componentService);
    this.tempValue = {};
  }

  ngOnInit() {
    this.setChangeValue(this.changeValue);
    console.log('table__form', this.config, this.initData, this.attributeConfig);
  }

  public setChangeValue(ChangeValues?) {
    console.log('changeValue', ChangeValues);
    // const ChangeValues = [{ name: "", value: "", valueTo: "" }];
    if (ChangeValues && ChangeValues.length > 0) {
      ChangeValues.forEach(p => {
        switch (p.valueTo) {
          case 'tempValue':
            this.tempValue[p.name] = p.value;
            break;
          case 'initValue':
            this.initValue[p.name] = p.value;
            break;
          case 'staticComponentValue':
            this.staticComponentValue[p.name] = p.value;
            break;

        }
      });
    }

  }

  changeData_formTotable(d?) {
    this.AttributeTable.changeData(d);
  }

  changeData(d) {
    // 表格选中行
    console.log('选中行', d);
    this.AttributeForm.changeData(d);
  }

}
