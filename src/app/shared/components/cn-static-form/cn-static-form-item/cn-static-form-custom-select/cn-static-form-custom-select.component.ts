import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';
import { CnStaticFormAjaxComponent } from '../../cn-static-form-cmpt/cn-static-form-ajax/cn-static-form-ajax.component';

@Component({
  selector: 'app-cn-static-form-custom-select',
  templateUrl: './cn-static-form-custom-select.component.html',
  styles: [
  ]
})
export class CnStaticFormCustomSelectComponent implements OnInit {
  @Input() validateForm: FormGroup;
  @Input() config;
  @Input() public fromDataService: configFormDataServerService;
  @Output() public updateValue = new EventEmitter<any>(true);
  constructor(private modal: NzModalService,) { }

  ngOnInit(): void {
  }

  windowDialog
  setting() {
    console.log('');
    let dialog;
    // 根据按钮类型初始化表单状态
    const dialogCfg = {
      title: '',
      width: '90%',
      style: null,
      maskClosable: true,
      cancelText: '取消',
      okText: '确定',
      footerButton: null,
      customAction: []

    };



    const dialogOptional = {
      nzTitle: dialogCfg.title ? dialogCfg.title : '',
      nzWidth: dialogCfg.width ? dialogCfg.width : '600px',
      nzStyle: dialogCfg.style ? dialogCfg.style : null, // style{top:'1px'},
      nzMaskClosable: dialogCfg.hasOwnProperty('maskClosable') ? dialogCfg.maskClosable : false,
      nzContent: CnStaticFormAjaxComponent,
      nzComponentParams: {
        config: {},
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
            console.log('当前弹出表单值：', componentInstance['staticForm']['validateForm']['value'])
            dialog.close();
          },
        },
      ],
    };
    // 自定义 操作按钮
    if (dialogCfg.footerButton && dialogCfg.footerButton.length > 0) {
      dialogOptional.nzFooter = [];

      dialogCfg.footerButton.forEach((_button) => {
        dialogOptional.nzFooter.push({
          label: _button.text,
          onClick: (componentInstance) => {
            // dialog.close();
            // customAction
            let customAction;
            if (dialogCfg.customAction && dialogCfg.customAction.length > 0) {
              const customActionList = dialogCfg.customAction.filter((item) => item.id === _button.customActionId);
              if (customActionList && customActionList.length > 0) {
                customAction = customActionList[0];
              }
            }

            // 【执行】
            //  this.execCustomAction(customAction, dialog, componentInstance);
          },
        });
      });
    }

    dialog = this.modal.create(dialogOptional);
    this.windowDialog = dialog;
  }

}
