import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { itemIntersectByLine } from '@antv/g6/lib/util/math';
import { SFSchema } from '@delon/form';
import { CustomValidator } from '../data-form/form-validator/CustomValidator';

@Component({
  selector: 'app-cn-static-form',
  templateUrl: './cn-static-form.component.html',
  styles: [
  ]
})
export class CnStaticFormComponent implements OnInit {


  @Input() public config;

  validateForm: FormGroup;
  validateForm1: FormGroup;
  formCascade;
  formValue;

  constructor(private fb: FormBuilder) {


  }

  ngOnInit(): void {

    // 初始化
    // 1.取出数据
    // 2.创建Controls
    this.validateForm = this.fb.group({});
    this.createControls(this.validateForm, this._data);
    console.log('生成结构', this.validateForm);
    this.validateForm1 = this.fb.group({});
    this.createControls(this.validateForm1, this._data);
    console.log('生成结构1111', this.validateForm1);
    this.validateForm.valueChanges.subscribe(data => console.log('form', data));
    this.validateForm.get('email').valueChanges.subscribe(data => console.log('name-变化', data));

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

    this._form_config.properties.forEach(Control => {
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
    Control.object.forEach(item => {
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
        object: {
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
        object: [
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
            object: [
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
                object: [
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
        object: [
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
        object: [
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



}
