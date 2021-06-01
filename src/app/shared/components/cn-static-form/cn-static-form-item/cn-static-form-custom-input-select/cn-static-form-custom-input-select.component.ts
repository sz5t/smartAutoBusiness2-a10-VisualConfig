import { Component, Input, OnInit, Output, Type, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';
import { CnStaticFormGridItemComponent } from '../../cn-static-form-cmpt/cn-static-form-grid-item/cn-static-form-grid-item.component';
import { CnStaticFormParameterStructComponent } from '../../cn-static-form-cmpt/cn-static-form-parameter-struct/cn-static-form-parameter-struct.component';
const components: { [type: string]: Type<any> } = {
  // ajax: CnStaticFormAjaxComponent,
  gridItem: CnStaticFormGridItemComponent,
  parameterStruct: CnStaticFormParameterStructComponent

};
@Component({
  selector: 'app-cn-static-form-custom-input-select',
  templateUrl: './cn-static-form-custom-input-select.component.html',
  styles: [
  ]
})
export class CnStaticFormCustomInputSelectComponent implements OnInit {

  @Input() validateForm: FormGroup;
  @Input() config;
  @Input() public fromDataService;
  @Output() public updateValue = new EventEmitter<any>(true);
  constructor(private modal: NzModalService,) { }

  selectValue;
  ngOnInit(): void {

    this.selectValue = this.validateForm.controls[this.config['name']].value;
  }

  windowDialog
  setting() {
    console.log('');
    const dialogCfg = this.config.componentConfig['customPage'];
    if (!dialogCfg) {
      return;
    }
    let dialog;
    // 根据按钮类型初始化表单状态



    const dialogOptional = {
      nzTitle: dialogCfg.title ? dialogCfg.title : '',
      nzWidth: dialogCfg.width ? dialogCfg.width : '600px',
      nzStyle: dialogCfg.style ? dialogCfg.style : null, // style{top:'1px'},
      nzMaskClosable: dialogCfg.hasOwnProperty('maskClosable') ? dialogCfg.maskClosable : false,
      nzContent: components['gridItem'],
      nzComponentParams: {
        config: {},
        sourceData: this.validateForm.controls[this.config['name']].value,
        fromDataService: this.fromDataService
      },
      nzFooter: [
        {
          label: dialogCfg.cancelText ? dialogCfg.cancelText : 'cancel',
          onClick: (componentInstance) => {
            dialog.close();
          },
        },
        {
          label: dialogCfg.okText ? dialogCfg.okText : 'OK',
          onClick: (componentInstance) => {
            console.log('当前弹出表单值：', componentInstance)
            this.validateForm.controls[this.config['name']].setValue(componentInstance['sourceData']);

            // console.log('当前弹出表单值：', componentInstance['staticForm']['validateForm']['value'])
            dialog.close();
          },
        },
      ],
    };
    dialog = this.modal.create(dialogOptional);
    this.windowDialog = dialog;
  }

}
