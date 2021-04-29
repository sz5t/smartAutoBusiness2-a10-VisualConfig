import { Component, OnInit, Inject, Input, ViewChild } from '@angular/core';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { CnComponentBase } from '../../../cn-component.base';
import { CnAttributeFormComponent } from '../cn-attribute-form/cn-attribute-form.component';
import { CnAttributeTableComponent } from '../cn-attribute-table/cn-attribute-table.component';

@Component({
  selector: 'cn-attribute-table-form,[cn-attribute-table-form]',
  templateUrl: './cn-attribute-table-form.component.html',
  styleUrls: ['./cn-attribute-table-form.component.less'],
})
export class CnAttributeTableFormComponent extends CnComponentBase implements OnInit {
  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) {
    super(componentService);
    this.tempValue = {};
  }
  @Input() public config;
  @Input() public attributeConfig;
  @Input() public changeValue;
  @Input() public loadConfigValue;

  @ViewChild('AttributeForm', { static: false }) public AttributeForm: CnAttributeFormComponent;
  @ViewChild('AttributeTable', { static: false }) public AttributeTable: CnAttributeTableComponent;

  col = 8;
  id = -1;
  ngOnInit() {
    this.setChangeValue(this.cacheValue);
  }

  public setChangeValue(ChangeValues?) {
    // const ChangeValues = [{ name: "", value: "", valueTo: "" }];
    if (ChangeValues && ChangeValues.length > 0) {
      ChangeValues.forEach((p) => {
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

  onResize({ col }: { col: number }): void {
    cancelAnimationFrame(this.id);
    this.id = requestAnimationFrame(() => {
      this.col = col;
    });
  }

  /**
   * changeData
   */
  public changeData(d?) {
    this.AttributeForm.changData(d);
  }

  public changeData_formTotable(d?) {
    this.AttributeTable.changeData(d);
  }
}
