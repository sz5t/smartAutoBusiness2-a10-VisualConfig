import { Component, Input, OnInit, Output, Type, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CustomValidator } from '../../../data-form/form-validator/CustomValidator';
import { CnStaticFormCommandComponent } from '../../cn-static-form-cmpt/cn-static-form-command/cn-static-form-command.component';
const components: { [type: string]: Type<any> } = {
  command: CnStaticFormCommandComponent

};
@Component({
  selector: 'app-cn-static-form-pop-command',
  templateUrl: './cn-static-form-pop-command.component.html',
  styles: [
  ]
})
export class CnStaticFormPopCommandComponent implements OnInit {

  @Input() validateForm: FormGroup;
  @Input() config;
  @Input() public fromDataService;
  @Output() public updateValue = new EventEmitter<any>(true);
  constructor(private modal: NzModalService, private fb: FormBuilder) { }
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
      customContent: 'command',
      customPageConfig: {

      }
    },
    "showConfig": {
      "showString": [
        {
          "name": "sourceDataCmpt",
          "children": [
            {
              "name": "commandTitle"
            }
          ]
        },
        {
          "type": "value",
          "value": " ["
        },
        {
          "name": "sourceDataCmpt",
          "children": [
            {
              "name": "command"
            }
          ]
        },
        {
          "type": "value",
          "value": "]"
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
    let _valueStrConfig_base = this.config.componentConfig['showConfig']
    let d = this.validateForm.controls[this.config['name']].value;
    if (d) {
      if (_valueStrConfig_base['type'] && _valueStrConfig_base['type'] === 'exist') {
        if (Array.isArray(d)) {
          if (d.length > 0) {

            this.showValue = "已设置[" + d.length + "]项";
          } else {
            this.showValue = "";
          }

        } else {
          this.showValue = "已设置";
        }
      } else {
        let _valueStrConfig = _valueStrConfig_base['showString'];

        this.showValue = this.getStringByshow(d, _valueStrConfig);

      }
    } else {
      this.showValue = "";
    }
  }

  getStringByshow(_value, _config) {
    let backstr: any = "";
    let str: any;
    _config.forEach(element => {
      if (element['type']) {
        if (element['type'] === "value") {
          str = element['value'];
        }

      } else {
        if (_value && _value.hasOwnProperty(element['name'])) {
          str = _value[element['name']];
          if (element['children'] && element['children'].length > 0) {
            str = this.getStringByshow(str, element['children'])
          }
        }
      }

      if (str) {
        backstr = backstr + str;
      }


    });

    return backstr;

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

    let _initDataItem = {}
    let initData = {};
    initData['tag_BAxdPtAm5Gbzipe3DFRjhbtRcysySoIrlG5C'] = [_initDataItem];


    const dialogOptional = {
      nzTitle: dialogCfg.title ? dialogCfg.title : '',
      nzWidth: dialogCfg.width ? dialogCfg.width : '600px',
      nzStyle: dialogCfg.style ? dialogCfg.style : null, // style{top:'1px'},
      nzMaskClosable: dialogCfg.hasOwnProperty('maskClosable') ? dialogCfg.maskClosable : false,
      nzContent: components[dialogCfg['customContent']],
      nzComponentParams: {
        config: dialogCfg['customPageConfig'],
        sourceData: staticData,
        fromDataService: this.fromDataService,
        initData: initData
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
          onClick: async (componentInstance) => {
            console.log('当前弹出表单值：', componentInstance)
            // saveData
            let cmpt = componentInstance.sourceDataCmpt;
            let page = componentInstance.sourceDataPage;
            let saveData = {
              sourceDataCmpt: cmpt,
              sourceDataPage: page
            }
            /*
command: null
commandType: null
parameters: []
popCommand: null
preCondition: null
targetPageId: null
targetViewId: null
targetViewTitle: "2"
targetPageTitle
*/
            this.validateForm.controls['command'].setValue(cmpt['command']);
            this.validateForm.controls['commandType'].setValue(cmpt['commandType']);
            this.validateForm.controls['targetViewId'].setValue(cmpt['targetViewId']);
            this.validateForm.controls['targetViewTitle'].setValue(cmpt['targetViewTitle']);
            this.validateForm.controls['targetPageId'].setValue(page['targetPageCode']);
            this.validateForm.controls['targetPageTitle'].setValue(page['targetPageTitle']);

            // this.validateForm.controls['parameters'].setValue(cmpt['parameters']);
            this.removeparameters();
            cmpt['parameters'].forEach(element => {
              let obj = {};
              // obj['name'] = element['paramName']

              this.add(this.validateForm.controls['parameters'], element, this.q_config);
            });

            // 缓存选择结果
            this.validateForm.controls[this.config['name']].setValue(saveData);

            this.loadShowValue();

            dialog.close();
          },
        },
      ],
    };

    dialog = this.modal.create(dialogOptional);
    this.windowDialog = dialog;
  }



  q_config = {
    "properties": [
      {
        "name": "title",
        "type": "input",
        "componentConfig": {},
        "formType": "value",
        "formName": "formControlName",
        "validations": [],
        "title": "描述"
      },
      {
        "name": "name",
        "type": "input",
        "componentConfig": {},
        "formType": "value",
        "formName": "formControlName",
        "validations": [],
        "title": "参数名称"
      },
      {
        "name": "type",
        "type": "input",
        "componentConfig": {},
        "formType": "value",
        "formName": "formControlName",
        "validations": [],
        "title": "参数类型"
      },
      {
        "name": "valueName",
        "type": "input",
        "componentConfig": {},
        "formType": "value",
        "formName": "formControlName",
        "validations": [],
        "title": "参数取值名称"
      },
      {
        "name": "value",
        "type": "input",
        "componentConfig": {},
        "formType": "value",
        "formName": "formControlName",
        "validations": [],
        "title": "默认值"
      }
    ]
  }
  add(validateFormArray, _data, config?) {

    validateFormArray.push(this.set_formGroupControlName(_data, config));
    // this.validateFormArray.push(this.creatRow());
    validateFormArray.controls.forEach(item => {
      item.markAsPristine();
      // pristine
    })
    for (const key in this.validateForm.controls) {
      if (key === this.config.name) {
        this.validateForm.controls[key].markAsPristine();
      }
    }

    // console.log('', this.validateForm)


  }

  set_formGroupControlName(data, Control) {

    let obj: any = {};
    Control.properties.forEach(item => {
      let value = null;
      let obj_key = item['name'];
      if (data && data.hasOwnProperty(obj_key)) {
        value = data[obj_key];
      }
      if (item.formType === 'object') {
        obj[obj_key] = this.set_formGroupControlName(value, item);
      }
      if (item.formType === 'array') {
        obj[obj_key] = this.set_formArrayControlName(value, item);
      }
      if (item.formType === 'value') {
        obj[obj_key] = new FormControl(
          value,
          this.getValidations(item.validations),
          this.getValidations1(item.validations),
        );
      }

    });
    return this.fb.group(obj);
  }
  set_formArrayControlName(data, Control) {

    let _array: FormArray = this.fb.array([]);

    if (data && data.length > 0) {

      data.forEach(element => {
        let value = element;
        let _obj = this.set_formGroupControlName(value, Control);
        _array.push(_obj);
      });

    }


    return _array;

  }

  public getValidations(validations) {
    const validation = [];
    validations &&
      validations.forEach((valid) => {
        if (valid.type && valid.type === 'custom') {
          if (valid.type === 'custom') {
            if (valid.validator === 'remote') {
              // validation.push(CustomValidator[valid.validator](valid, this));
              // validation.push(this[valid.validator]);
            } else {
              validation.push(CustomValidator[valid.validator](valid));
            }
          } else {
            validation.push(Validators[valid.validator]);
          }
        } else {
          if (valid.validator === 'required' || valid.validator === 'email') {
            validation.push(Validators[valid.validator]);
          } else if (valid.validator === 'minLength' || valid.validator === 'maxLength') {
            validation.push(Validators[valid.validator](valid.length));
          } else if (valid.validator === 'pattern') {
            validation.push(Validators[valid.validator](valid.pattern));
          } else if (valid.validator === 'min' || valid.validator === 'max') {
            validation.push(Validators[valid.validator](valid.value));
          }
        }
      });
    return validation;
  }

  public getValidations1(validations) {
    const validation = [];
    validations &&
      validations.forEach((valid) => {
        if (valid.type && valid.type === 'custom') {
          if (valid.type === 'custom') {
            if (valid.validator === 'remote') {
              // validation.push(CustomValidator[valid.validator](valid, this));
              validation.push(CustomValidator[valid.validator](valid, this));
            }
          }
        }
      });
    return validation;
  }

  removeparameters() {
    // (this.validateForm.get('phone') as FormArray).removeAt(index);
    // this.phoneArray.removeAt(index);

    let a = this.validateForm.get('parameters') as FormArray;
    a.clear();
  }

}
