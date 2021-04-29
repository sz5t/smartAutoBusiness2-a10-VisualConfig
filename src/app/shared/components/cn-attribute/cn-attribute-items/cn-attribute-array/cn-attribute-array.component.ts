import { Component, OnInit, Inject, Input } from '@angular/core';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { CnComponentBase } from '../../../cn-component.base';
import { CnAttributeFormComponent } from '../cn-attribute-form/cn-attribute-form.component';

@Component({
  selector: 'app-cn-attribute-array',
  templateUrl: './cn-attribute-array.component.html',
  styleUrls: ['./cn-attribute-array.component.less'],
})
export class CnAttributeArrayComponent extends CnComponentBase implements OnInit {
  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) {
    super(componentService);
    this.tempValue = {};
  }
  @Input() public attributeConfig;
  @Input() public changeValue;
  @Input() public loadConfigValue;

  public arrayConfig = {
    objectJson: {},
  };

  ngOnInit() {
    this.setChangeValue(this.changeValue);
  }
  public setChangeValue(ChangeValues?) {
    console.log('changeValue', ChangeValues);
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

  createModal(): void {
    console.log('createModal弹出数组配置', this.loadConfigValue, this.attributeConfig, this.changeValue);
    this.componentService.modalService.create({
      nzWidth: '85%',
      nzMaskClosable: false,
      nzBodyStyle: { overflow: 'auto' },
      nzTitle: '组件数组属性',
      //  nzContent: '',
      nzContent: CnAttributeFormComponent,
      nzComponentParams: {
        config: this.attributeConfig,
        changeValue: this.changeValue,
        attributeType: 1,
        loadConfigValue: this.loadConfigValue,
        //  attributeType:1
      },
      nzClosable: false,
      nzOnOk: (componentInstance) => {
        console.log('OK');
      },
    });
  }
}
