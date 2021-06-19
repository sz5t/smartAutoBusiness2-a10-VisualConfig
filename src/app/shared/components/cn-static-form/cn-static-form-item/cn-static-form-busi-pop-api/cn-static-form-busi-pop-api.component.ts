import { Component, OnInit, Type, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CustomValidator } from '../../../data-form/form-validator/CustomValidator';
import { CnStaticFormBusiApiComponent } from '../../cn-static-form-cmpt/cn-static-form-busi-api/cn-static-form-busi-api.component';
const components: { [type: string]: Type<any> } = {
  api: CnStaticFormBusiApiComponent

};
@Component({
  selector: 'app-cn-static-form-busi-pop-api',
  templateUrl: './cn-static-form-busi-pop-api.component.html',
  styles: [
  ]
})
export class CnStaticFormBusiPopApiComponent implements OnInit {

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
      customContent: 'api',
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

    let _initDataItem = {}
    let _staticData = {}
    if (staticData) {
      _initDataItem = {
        apiId: staticData["apiId"],
        label: staticData["label"],
        resourceType: staticData["resourceType"],
        value: staticData["value"]
      }
      _staticData = {
        ajaxType: staticData["ajaxType"],
        isCreateParameter: false,
        executionType: staticData["executionType"]
      }
    }

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
        sourceData: _staticData,
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
            let saveStaticData = await componentInstance['getNode']();

            if (saveStaticData['parameterSet']) {

              let d = [];
              saveStaticData['parameterSet'].forEach(element => {
                let obj = {};
                obj['columnName'] = element['paramName']
                obj['dataType'] = element['datatype']
                d.push(obj);
                this.add(this.validateForm.parent.controls['parameterMapping'], obj, this.b_config);
              });
              saveStaticData['resultSet'].forEach(element => {
                let obj = {};
                obj['columnName'] = element['paramName']

                // this.add(this.validateForm.parent.controls['queryParams'], obj, this.b_config);
              });


              //this.validateForm.controls['queryParams'].setValue(d);
            }

            if (dialogCfg['updateData']) {

              dialogCfg['updateData'].forEach(element => {
                if (element.hasOwnProperty('target')) {
                  if (element.hasOwnProperty('type')) {
                    if (element['type'] === 'popData') {
                      this.validateForm.controls[element['target']].setValue(saveStaticData);
                    } else {
                      this.validateForm.controls[element['target']].setValue(saveStaticData[element['name']]);
                    }

                  } else {
                    this.validateForm.controls[element['target']].setValue(saveStaticData[element['name']]);
                  }
                } else {
                  this.validateForm.controls[element['name']].setValue(saveStaticData[element['name']]);
                }
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


  b_config = {
    "properties": [
      {
        "name": "columnName",
        "type": "input",
        "componentConfig": {
          "hiddenTitle": true
        },
        "formType": "value",
        "formName": "formControlName",
        "validations": [],
        "title": "列名"
      },
      {
        "name": "dataType",
        "type": "input",
        "hidden": true,
        "componentConfig": {
        },
        "formType": "value",
        "formName": "formControlName",
        "validations": [],
        "title": "数据类型"
      },
      {
        "name": "paramId",
        "type": "input",
        "componentConfig": {
          "hiddenTitle": true
        },
        "formType": "value",
        "formName": "formControlName",
        "validations": [],
        "title": "引用参数名"
      },
      {
        "name": "value",
        "type": "input",
        "componentConfig": {
          "hiddenTitle": true
        },
        "formType": "value",
        "formName": "formControlName",
        "validations": [],
        "title": "固定值"
      }
    ]

  }

  add(validateFormArray, _data, config?) {


    // let _data = {};
    // if (this.staticDefaultValueConfig) {
    //   _data = this.getStaticDefaultValue(this.staticDefaultValueConfig);
    // }

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
}

