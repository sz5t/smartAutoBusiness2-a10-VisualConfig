import { Component, OnInit, Type, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CnStaticFormParameterStructComponent } from '../../cn-static-form-cmpt/cn-static-form-parameter-struct/cn-static-form-parameter-struct.component';
const components: { [type: string]: Type<any> } = {
  parameterStruct: CnStaticFormParameterStructComponent

};
@Component({
  selector: 'app-cn-static-form-pop-select-parameter',
  templateUrl: './cn-static-form-pop-select-parameter.component.html',
  styles: [
  ]
})
export class CnStaticFormPopSelectParameterComponent implements OnInit {

  @Input() validateForm: FormGroup;
  @Input() config;
  @Input() public fromDataService;
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
      customContent: 'parameterStruct',
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
        sourceData: staticData,
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

            if (dialogCfg['updateData']) {

              dialogCfg['updateData'].forEach(element => {
                this.validateForm.controls[element['name']].setValue(saveStaticData[element['name']]);
              });
            } else {

              this.validateForm.controls[this.config['name']].setValue(saveStaticData);
            }

            // this.loadShowValue();
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
