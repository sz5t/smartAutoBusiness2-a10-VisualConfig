import { Component, Input, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { itemIntersectByLine } from '@antv/g6/lib/util/math';
import { SFSchema } from '@delon/form';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';
import { VcComponentBase } from '../../vc-components/vc-component';
import { CustomValidator } from '../data-form/form-validator/CustomValidator';

@Component({
  selector: 'app-cn-static-form',
  templateUrl: './cn-static-form.component.html',
  styles: [
  ]
})
export class CnStaticFormComponent extends VcComponentBase implements OnInit {


  @Input() public config;
  @Input() public staticData;
  @Input() public fromDataService;
  @Output() public updateValue = new EventEmitter<any>(true);
  validateForm: FormGroup;
  validateForm1: FormGroup;
  formCascade;
  formValue;

  constructor(private fb: FormBuilder, @Inject(BSN_COMPONENT_SERVICES)
  public componentService: ComponentServiceProvider,) {
    super(componentService);
  }

  ngOnInit(): void {
    if (!this.config) {
      this.config = this._form_config;
    }
    if (!this.staticData) {
      this.staticData = this._data;
    }

    // 初始化
    // 1.取出数据
    // 2.创建Controls
    this.validateForm = this.fb.group({});
    this.createControls(this.validateForm, this.staticData);
    console.log('生成结构', this.validateForm, this.config);
    /*     this.validateForm1 = this.fb.group({});
        this.createControls(this.validateForm1, this._data);
        console.log('生成结构1111', this.validateForm1); */
    this.validateForm.valueChanges.subscribe(data => {


      const backData = { name: this.config['backName'], backConfig: this.config['backConfig'] ? this.config['backConfig'] : null, data: data }
      this.updateValue.emit(backData);
      console.log('form', data)
    });
    //  this.validateForm.get('email').valueChanges.subscribe(data => console.log('name-变化', data));

  }

  load_data() {
    // 加载数据
    // 第一次加载 【先构建表单数据，创建Controls】
    // 默认值，表单值构建时合并
  }

  /**
   * 生成 校验规则
   */
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


  _data = {
    email: '001',
    isemail: true,
    selectemail: "A",
    lengths: 10,
    placeholder: '请输入',
    email1: {
      name1: '1',
      name2: '12',
      name3: {
        text: '44',
        listlast: [
          {
            namet11: 't1',
            namet21: 't01'
          }
        ]
      }

    },
    list: [
      { name01: '01', name02: '1' },
      { name01: '02', name02: '2' },
      { name01: '03', name02: '3' }
    ],
    list1: [
      { namet1: '01', namet2: '1' },
      { namet1: '02', namet2: '2' }
    ]
  }


  // formArrayName 数组  formGroupName 对象  formControlName 字段

  public test_form() {
    this.validateForm = this.fb.group({
      pageId: [null, [Validators.required]],
      cmptId: [null, [Validators.required]],
      interfaceName: [null, [Validators.required]],
      interfaceExec: [null, [Validators.required]],
      // connection: this.fb.group({
      //   url: [null, [Validators.email, Validators.required]],
      //   expressionList: [[{ "name": "ff" }], [Validators.email, Validators.required]]
      // }),
      parameterContent: this.fb.array([
        this.fb.group({
          parameterName: new FormControl(null, Validators.required),
          parameterType: new FormControl(null, Validators.required),
          parameterValueName: new FormControl(null, Validators.required),
          parameterValue: new FormControl(null, Validators.required)
        })
      ])
    });


  }



  private createControls(f, data) {

    this.config.properties.forEach(Control => {
      let value = null;
      let key = Control['name'];
      if (data && data.hasOwnProperty(key)) {
        value = data[key];
      }
      if (Control.formType === 'value') {

        f.addControl(
          `${key}`,
          new FormControl(value, this.getValidations(Control.validations), this.getValidations1(Control.validations)),
        );
      }
      if (Control.formType === 'object') {

        f.addControl(`${key}`, this.set_formGroupControlName(value, Control));


      }
      if (Control.formType === 'array') {

        // 需要知道数组行数

        f.addControl(`${key}`, this.set_formArrayControlName(value, Control));
      }

    });

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


  ArrFormArray(controlName) {
    return this.validateForm1.controls[controlName] as FormArray;
  }

  creatRow() {
    return this.fb.group({
      etcName: [null, [Validators.required]],
      date: [null, [Validators.required]]
    });
  }
  //新增组合
  addItem(controlName) {
    this.ArrFormArray(controlName).push(this.creatRow());
  }

  add(n, c?) {

    // this.validateFormArray.controls.push(this.set_formGroupControlName({}, this.config));
    this.ArrFormArray(n).push(this.set_formGroupControlName(null, c));


    console.log('', this.validateForm)


  }



  // 新表单构成
  _config = {

    id: '001',
    properties: {
      email: {
        formType: 'value',
        formName: 'formControlName',
        validations: []
      },
      isemail: {
        formType: 'value',
        formName: 'formControlName',
        validations: []
      },
      selectemail: {
        formType: 'value',
        formName: 'formControlName',
        validations: []
      },
      email1: {
        formType: 'object',
        formName: 'formGroupName',
        validations: [],
        object: {
          name1: {
            formType: 'value',
            formName: 'formControlName',
            validations: []
          },
          name2: {
            formType: 'value',
            formName: 'formControlName',
            validations: []
          },
          name3: {
            formType: 'object',
            formName: 'formGroupName',
            validations: [],
            object: {
              text: {
                formType: 'value',
                formName: 'formControlName',
                validations: []
              }
            }
          }
        }

      },
      list: {
        formType: 'array',
        formName: 'formArrayName',
        validations: [],
        properties: {
          name01: {
            formType: 'value',
            formName: 'formControlName',
            validations: []
          },
          name02: {
            formType: 'value',
            formName: 'formControlName',
            validations: []
          }
        }
      },
      list1: {
        formType: 'array',
        formName: 'formArrayName',
        validations: [],
        object: {
          namet1: {
            formType: 'value',
            formName: 'formControlName',
            validations: []
          },
          namet2: {
            formType: 'value',
            formName: 'formControlName',
            validations: []
          }
        }
      }

    },
    layout: {  //允许递归
      rows: [
        {
          formType: 'row',
          cols: [
            {
              id: '',
              formType: 'col'
            }
          ]
        }
      ]

    }


  }

  _form_config = {

    id: '001',
    backName: 'ddd',
    properties: [
      {
        name: 'email',
        type: 'input',
        componentConfig: {

        },
        formType: 'value',
        formName: 'formControlName',
        validations: [],
        title: '邮箱'

      },
      {
        name: 'isemail',
        type: 'switch',
        componentConfig: {

        },
        formType: 'value',
        formName: 'formControlName',
        validations: [],
        title: '是否启用'

      },
      {
        name: 'selectemail',
        type: 'select',
        componentConfig: {
          "options": [
            {
              "label": "字符串",
              "value": "A"
            },
            {
              "label": "整数",
              "value": "B"
            }
          ],
          "labelName": "label",
          "valueName": "value",

        },
        formType: 'value',
        formName: 'formControlName',
        validations: [],
        title: '选择'

      },
      {
        name: 'email1',
        formType: 'object',
        type: 'objectCard',
        componentConfig: {

        },
        formName: 'formControlName',
        validations: [],
        title: '邮箱1',
        properties: [
          {
            title: '名称1',
            name: 'name1',
            formType: 'value',
            type: 'input',
            componentConfig: {

            },
            formName: 'formControlName',
            validations: []
          },
          {
            title: '名称2',
            name: 'name2',
            formType: 'value',
            type: 'input',
            componentConfig: {

            },
            formName: 'formControlName',
            validations: []
          },
          {
            title: '名称3',
            name: 'name3',
            formType: 'object',
            type: 'objectCard',
            componentConfig: {

            },
            formName: 'formControlName',
            validations: [],
            properties: [
              {
                title: '测试末级',
                name: 'text',
                formType: 'value',
                type: 'input',
                componentConfig: {

                },
                formName: 'formControlName',
                validations: []
              },
              {
                name: 'listlast',
                formType: 'array',
                type: 'arrayTable',
                componentConfig: {

                },
                formName: 'formControlName',
                validations: [],
                title: '列集合',
                properties: [
                  {
                    title: '列名称',
                    name: 'namet11',
                    formType: 'value',
                    type: 'input',
                    componentConfig: {

                    },
                    formName: 'formControlName',
                    validations: [],
                  },
                  {
                    title: '列字段',
                    name: 'namet21',
                    formType: 'value',
                    type: 'input',
                    componentConfig: {

                    },
                    formName: 'formControlName',
                    validations: [],
                  }
                ]

              }
            ]
          }
        ]

      },
      {
        name: 'list',
        formType: 'array',
        type: 'arrayCard',
        componentConfig: {

        },
        formName: 'formControlName',
        validations: [],
        title: '列集合',
        properties: [
          {
            title: '列名称',
            name: 'name01',
            formType: 'value',
            type: 'input',
            componentConfig: {

            },
            formName: 'formControlName',
            validations: [],
          },
          {
            title: '列字段',
            name: 'name02',
            formType: 'value',
            type: 'input',
            componentConfig: {

            },
            formName: 'formControlName',
            validations: [],
          }
        ]

      },
      {
        name: 'list1',
        formType: 'array',
        type: 'arrayTable',
        componentConfig: {

        },
        formName: 'formControlName',
        validations: [],
        title: '列集合',
        properties: [
          {
            title: '列名称',
            name: 'namet1',
            formType: 'value',
            type: 'input',
            componentConfig: {

            },
            formName: 'formControlName',
            validations: [],
          },
          {
            title: '列字段',
            name: 'namet2',
            formType: 'value',
            type: 'input',
            componentConfig: {

            },
            formName: 'formControlName',
            validations: [],
          }
        ]

      }

    ],
    enableLayout: true, // 启用布局
    layout: {  //允许递归
      "id": '001',
      "type": "layout",
      "container": "rows",
      "rows": [
        {
          "id": 'r_001',
          "type": "row",
          "container": "cols",
          "cols": [
            {
              id: 'c_001',
              "type": "col",
              "size": {
                "span": 24,
                "nzXs": 24,
                "nzSm": 24,
                "nzMd": 24,
                "nzLg": 24,
                "ngXl": 24,
                "nzXXl": 24
              },
              "container": "control",
              "controlName": 'email',
              "controlIndex": 0,

            }
          ]
        }
      ]

    }


  }



  schema: SFSchema = {
    properties: {
      email: {
        formType: 'string',
        title: '邮箱',
        format: 'email',
        maxLength: 20
      },
      name: {
        formType: 'string',
        title: '姓名',
        minLength: 3
      }
    }
  };

  submit(value: any) {
    console.log('表单值：', value);
  }

  demo() {
    console.log('测试：', this.validateForm);
  }

  save() {
    console.log('测试1：', this.validateForm1);
  }


  // 值级联
  cascadeValueEmit(back?) {

    let v1 = [
      {
        "cascadeName": "displayType",
        "cascadeItems": [
          {
            "type": "display",
            "data": {
              "option": [
                {
                  "value": true
                }
              ]
            }
          }

        ]
      }
    ]
    let cascadeValueObj;
    let currentValue;
    if (back['cascadeValueObj']) {
      cascadeValueObj = back['cascadeValueObj'];
    }
    currentValue = back['data'];

    cascadeValueObj && cascadeValueObj.forEach(cascade => {
      let index = this.config.properties.findIndex(item => item.name === cascade['cascadeName']);
      if (cascade.cascadeItems) {
        cascade.cascadeItems.forEach(_cascadeItem => {
          let isPass = true;
          if (_cascadeItem['type'] === 'condition') {
            isPass = this.analysisResult(_cascadeItem['condition']);
          }

          if (isPass) {
            let cascadeItem = _cascadeItem['content']
            if (cascadeItem['type'] === 'display') {

              if (cascadeItem['data']['option']) {
                let displayValueOption = cascadeItem['data']['option'];
                displayValueOption.forEach(element => {
                  if (element['type'] === 'currentValue') {
                    element['value'] = currentValue;
                  }

                });
                let displayValue = displayValueOption[0]['value'];
                if (index > -1) {
                  this.config.properties[index]['hidden'] = displayValue;
                }
              }

            }
            if (cascadeItem['type'] === 'setValue') {


              if (cascadeItem['data']['option']) {
                let displayValueOption = cascadeItem['data']['option'];
                displayValueOption.forEach(element => {
                  if (element['type'] === 'currentValue') {
                    element['value'] = currentValue;
                  }
                  if (element['type'] === 'dataItem') {
                    element['value'] = back['dataItem'][element['valueName']];
                  }


                });
                let displayValue = displayValueOption[0]['value'];
                this.validateForm.controls[cascade['cascadeName']].setValue(displayValue);
              }
            }
          }


        });
      }

    });
    /* 
        let index = this.config.properties.findIndex(item => item.name === 'displayType');
        if (index > -1) {
          // this.config.properties.splice(index, 1);
          this.config.properties[index]['hidden'] = v;
        } */

    console.log('$$$$$$cascadeValue');
    this.compute();
    // this.validateForm.removeControl('displayType');


  }


  compute() {
    let condition = [
      {
        "conditionType": 'and',
        "type": 'expression',  // expression  brackets
        "brackets": [],
        "expression": {
          "comput": 'regular', // 正则、数学计算、非空、bool值
          "leftExpression": {
            "type": 'value',
            "value": '0',
            "valueName": ''
          },
          "righitExpression": {
            "type": 'value',
            "value": '^0$'
          }
        }

      },
      {
        "conditionType": 'and',
        "type": 'expression',  // expression  brackets
        "brackets": [],
        "expression": {
          "comput": 'regular', // 正则、数学计算、非空、bool值
          "leftExpression": {
            "type": 'value',
            "value": '0',
            "valueName": ''
          },
          "righitExpression": {
            "type": 'value',
            "value": '^0$'
          }
        }

      },
      {
        "conditionType": 'and',
        "type": 'brackets',  // expression  brackets
        "brackets": [
          {
            "conditionType": 'and',
            "type": 'expression',  // expression  brackets
            "brackets": [],
            "expression": {
              "comput": 'regular', // 正则、数学计算、非空、bool值
              "leftExpression": {
                "type": 'value',
                "value": '0',
                "valueName": ''
              },
              "righitExpression": {
                "type": 'value',
                "value": '^0$'
              }
            }

          }
        ]

      }
    ]

    // 计算当前条件

    let r = this.analysisResult(condition);
    // 生成新的条件详细  value 里 是表达式的值结果

    console.log('===解析结果如下===', r);


  }

  // 结果分析
  analysisResult(option) {

    // 数组 第一个 【and true  】【 or  false】  合并进去。

    // 返回 结果是否通过

    let Result = false;
    option.forEach((element, index) => {

      if (element['type'] === 'expression') {
        element['value'] = this.getExpressionResult(element['expression']);
      }
      if (element['type'] === 'brackets') {
        element['value'] = this.analysisResult(element['brackets']);
      }

      // 计算出当前条件最终值
      if (element['conditionType'] === 'and') {
        if (index === 0) {
          Result = true;
        }
        Result = Result && element['value'];
      }
      if (element['conditionType'] === 'or') {
        if (index === 0) {
          Result = false;
        }
        Result = Result || element['value'];
      }
    });



    return Result;

  }

  // 计算表达式
  computeExpression(expression) {
    let Expression;
    let result = false;
    switch (expression.comput) {
      case 'empty':
        break;
      case 'notempty':
        break;
      case 'null':
        result = this.expression_null(expression);
        break;
      case 'notnull':
        result = this.expression_notnull(expression);
        break;
      case 'true':
        result = this.expression_true(expression);
        break;
      case 'false':
        result = this.expression_false(expression);
        break;
      case 'regular':
        result = this.expression_regular(expression);
        break;
      case 'equal':
        result = this.expression_equal(expression);
        break;
      case 'notequal':
        break;
    }

    return result;
  }





  // 表达式取值
  getExpressionResult(expression) {
    let back = {
      left: null,
      comput: null,
      righit: null
    }
    if (expression) {
      let expression1 = {
        "comput": 'regular', // 正则、数学计算、非空、bool值
        "leftExpression": {
          "type": 'value',
          "value": 'ddd',
          "valueName": ''
        },
        "righitExpression": {
          "type": 'value',
          "value": '^0$'
        }
      }

      if (expression['comput']) {
        back['comput'] = expression['comput'];
      }
      if (expression['leftExpression']) {
        back['left'] = this.getExpressionValue(expression['leftExpression']);
      }
      if (expression['righitExpression']) {
        back['righit'] = this.getExpressionValue(expression['righitExpression']);
      }

    } else {

    }

    return this.computeExpression(back);

  }

  getExpressionValue(option) {
    let value = null;
    switch (option['type']) {
      case 'value':
        value = option['value'];
        break;
      case 'componentValue':
        value = this.validateForm.value[option['valueName']];
        break;


      // ......多种取值方式
      default:
        value = option['value'];
        break;
    }

    return value;

  }


  // 计算表达式
  expression_regular(option) {
    let regularflag = false;
    const reg1 = new RegExp(option.righit);
    regularflag = reg1.test(option.left);
    return regularflag;
  }
  expression_true(option) {
    let regularflag = false;
    regularflag = option.left === true ? true : false;
    return regularflag;
  }
  expression_false(option) {
    let regularflag = false;
    regularflag = option.left === false ? true : false;
    return regularflag;
  }
  expression_equal(option) {
    let regularflag = false;
    regularflag = option.left === option.righit ? true : false;
    return regularflag;
  }
  expression_null(option) {
    let regularflag = false;
    regularflag = option.left === null ? true : false;
    return regularflag;
  }
  expression_notnull(option) {
    let regularflag = false;
    regularflag = option.left !== null ? true : false;
    return regularflag;
  }



  // 执行异步请求
  async execAjaxCommand(ajaxConfig?) {
    // 
    this.componentValue = this.staticData;
    let response: any;
    if (ajaxConfig['enableAjaxMore']) {
      response = await this.executeHttpMore(ajaxConfig, {}, 'buildParameters', null);
    } else {
      const url = ajaxConfig.url;
      const method = ajaxConfig.ajaxType;
      const params = {
        ...this.buildParameters(ajaxConfig.params)
      };
      // 考虑满足 get 对象，集合，存储过程【指定dataset 来接收数据】，加载错误的信息提示
      response = await this.componentService.apiService.getRequest(url, method, { params }).toPromise();
    }
    return response;

  }


}


