import { Component, Input, OnInit, Output, EventEmitter, Type } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';
import { CnStaticFormAjaxComponent } from '../../cn-static-form-cmpt/cn-static-form-ajax/cn-static-form-ajax.component';
import { CnStaticFormGridItemComponent } from '../../cn-static-form-cmpt/cn-static-form-grid-item/cn-static-form-grid-item.component';
import { CnStaticFormStaticFormComponent } from '../../cn-static-form-cmpt/cn-static-form-static-form/cn-static-form-static-form.component';
import { CnStaticFormComponent } from '../../cn-static-form.component';
const components: { [type: string]: Type<any> } = {
  ajax: CnStaticFormAjaxComponent,
  gridItem: CnStaticFormGridItemComponent,
  staticForm: CnStaticFormStaticFormComponent

};
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
  showValue: any;

  itemConfig: any = {
    customPage: {
      title: '',
      width: '90%',
      style: null,
      maskClosable: true,
      cancelText: '取消',
      okText: '确定',
      footerButton: null,
      customAction: [],
      customContent: '',
      customPageConfig: {

      }
    },
    "showConfig": {
      "showString": [
        {
          "name": "size",
          "children": [
            {
              "name": "span"
            }
          ]
        }

      ]

    },
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
  ngOnInit(): void {

    if (this.config.componentConfig) {
      if (!this.config.componentConfig['customPage']) {
        this.config.componentConfig['customPage'] = this.itemConfig['customPage'];
      }
      if (!this.config.componentConfig['showConfig']) {
        this.config.componentConfig['showConfig'] = this.itemConfig['showConfig'];
      }
      if (!this.config.componentConfig['labelSize']) {
        this.config.componentConfig['labelSize'] = this.itemConfig['labelSize'];
      }
      if (!this.config.componentConfig['controlSize']) {
        this.config.componentConfig['controlSize'] = this.itemConfig['controlSize'];
      }


    }
    this.loadShowValue();

  }

  loadShowValue() {
    let d = this.validateForm.controls[this.config['name']].value;
    if (d) {
      let _valueStrConfig = this.config.componentConfig['showConfig']['showString'];

      this.showValue = this.getStringByshow(d, _valueStrConfig);

      // this.showValue = d['style']['span'];
    }
  }

  getStringByshow(_value, _config) {
    let str: any;
    _config.forEach(element => {
      if (_value && _value.hasOwnProperty(element['name'])) {
        str = _value[element['name']];
        if (element['children'] && element['children'].length > 0) {
          str = this.getStringByshow(str, element['children'])
        }
      }

    });

    return str;

  }


  windowDialog
  setting() {
    console.log('');
    let dialog;
    // 根据按钮类型初始化表单状态
    const dialogCfg = this.config.componentConfig['customPage'];
    if (!dialogCfg) {
      return;
    }

    let staticData;
    if (dialogCfg['sourceData']) {
      if (dialogCfg['sourceData']['type'] === 'root') {
        staticData = this.validateForm.value;
      } else {
        staticData = this.validateForm.controls[dialogCfg['sourceData']['name']].value;
      }
    } else {
      staticData = this.validateForm.controls[this.config['name']].value;
    }


    const dialogOptional = {
      nzTitle: dialogCfg.title ? dialogCfg.title : '',
      nzWidth: dialogCfg.width ? dialogCfg.width : '600px',
      nzStyle: dialogCfg.style ? dialogCfg.style : null, // style{top:'1px'},
      nzMaskClosable: dialogCfg.hasOwnProperty('maskClosable') ? dialogCfg.maskClosable : false,
      nzContent: components[dialogCfg['customContent']],
      nzComponentParams: {
        config: dialogCfg['customPageConfig'],
        sourceData: staticData
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
            // saveData

            let saveStaticData;
            if (dialogCfg['saveData']) {
              if (dialogCfg['saveData']['type'] === 'root') {
                saveStaticData = componentInstance['sourceData'];
              } else {
                saveStaticData = componentInstance['sourceData'][dialogCfg['saveData']['name']];
              }
            } else {
              saveStaticData = componentInstance['sourceData'];
            }

            this.validateForm.controls[this.config['name']].setValue(saveStaticData);
            this.loadShowValue();
            // console.log('当前弹出表单值：', componentInstance['staticForm']['validateForm']['value'])
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
