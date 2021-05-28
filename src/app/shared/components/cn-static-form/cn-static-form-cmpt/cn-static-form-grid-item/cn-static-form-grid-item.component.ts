import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';

@Component({
  selector: 'app-cn-static-form-grid-item',
  templateUrl: './cn-static-form-grid-item.component.html',
  styles: [
  ]
})
export class CnStaticFormGridItemComponent implements OnInit {

  public sourceData: any;
  public config: any;
  @Input() public fromDataService: configFormDataServerService;
  selectCmpt: any = 'notSet';
  staticData: any;
  constructor(private httpClient: HttpClient,) { }

  ngOnInit(): void {

    // 【当前组件是设置 表格项 展示，或者编辑的内容】
    // 1.计算出当前组件类型
    // 2.加载当前组件类型的配置
    // 3.值的收集,点击保存的时候，将值回写
    if (!this.sourceData) {
      this.sourceData = {}
    }
    console.log('弹出值', this.sourceData);

    if (this.sourceData['type'] && this.sourceData['type'] !== this.selectCmpt) {
      this.selectCmpt = this.sourceData['type'];
      this.load();
    }
  }


  attr_typeConent;
  attr_config_data;
  attr_config;
  async load(node?) {

    if (this.selectCmpt) {

      let d;
      if (this.selectCmpt) {
        d = await this.loadConfig(this.selectCmpt);
      }
      if (d) {
        this.attr_config = d;
      } else {
        this.attr_config = this.gloab_config[this.selectCmpt];
      }


      this.attr_typeConent = this.attr_config['typeConent'].filter(d => d !== '');
      this.attr_config_data = this.sourceData;





    }
    console.log('_sider', this.attr_config, this.attr_config_data);
  }


  config1 = {

  }

  gloab_config = {
    cnGridInput: {
      type: 'attr',
      backName: 'text',
      typeConent: [
        {
          code: 'style',
          title: '样式',
          propertyTypeConent: [
            {
              code: 'style',
              title: '样式',
              type: 'property',
              active: true,
              sourceConfig: {

                type: 'staticForm',
                backName: 'style',
                properties: [
                  {
                    name: 'span',
                    type: 'input',
                    componentConfig: {

                    },
                    formType: 'value',
                    formName: 'formControlName',
                    validations: [],
                    title: '栅格'

                  },
                  {
                    name: 'nzXs',
                    type: 'objectCard',
                    componentConfig: {

                    },
                    formType: 'object',
                    formName: 'formControlName',
                    validations: [],
                    title: 'nzXs 576px',
                    properties: [
                      {
                        name: 'offset',
                        type: 'input',
                        componentConfig: {

                        },
                        formType: 'value',
                        formName: 'formControlName',
                        validations: [],
                        title: '缩进'

                      },
                      {
                        name: 'span',
                        type: 'input',
                        componentConfig: {

                        },
                        formType: 'value',
                        formName: 'formControlName',
                        validations: [],
                        title: '栅格'

                      }
                    ]

                  }
                ]
              },
              sourceData: {
                name: 'style'
              }
            }
          ]
        },
        {
          code: 'ajaxData',
          title: '资源',
          propertyTypeConent: [
            {
              code: 'ajaxData',
              title: '数据资源',
              type: 'property',
              active: true,
              sourceConfig: {

                type: 'staticForm',
                backName: 'ajaxConfig',
                properties: [
                  {
                    name: 'urlType',
                    type: 'select',
                    componentConfig: {
                      "options": [
                        {
                          "label": "内部资源",
                          "value": "inner"
                        },
                        {
                          "label": "外部资源",
                          "value": "out"
                        }
                      ],
                      "labelName": "label",
                      "valueName": "value",

                    },
                    formType: 'value',
                    formName: 'formControlName',
                    validations: [],
                    title: '请求资源类型'

                  },
                  {
                    name: 'ajaxType',
                    type: 'select',
                    componentConfig: {
                      "options": [
                        {
                          "label": "psot",
                          "value": "post"
                        },
                        {
                          "label": "get",
                          "value": "get"
                        },
                        {
                          "label": "put",
                          "value": "put"
                        },
                        {
                          "label": "delete",
                          "value": "delete"
                        }
                      ],
                      "labelName": "label",
                      "valueName": "value",

                    },
                    formType: 'value',
                    formName: 'formControlName',
                    validations: [],
                    title: '请求资源方式'

                  },
                  {
                    name: 'url',
                    type: 'input',
                    componentConfig: {

                    },
                    formType: 'value',
                    formName: 'formControlName',
                    validations: [],
                    title: '请求资源地址'
                  },
                  {
                    name: 'pathParams',
                    type: 'arrayCard',
                    componentConfig: {

                    },
                    formType: 'array',
                    formName: 'formControlName',
                    validations: [],
                    title: '地址参数',
                    properties: [
                      {
                        name: 'name',
                        type: 'input',
                        componentConfig: {

                        },
                        formType: 'value',
                        formName: 'formControlName',
                        validations: [],
                        title: '参数名称'

                      },
                      {
                        name: 'type',
                        type: 'input',
                        componentConfig: {

                        },
                        formType: 'value',
                        formName: 'formControlName',
                        validations: [],
                        title: '参数类型'

                      },
                      {
                        name: 'valueName',
                        type: 'input',
                        componentConfig: {

                        },
                        formType: 'value',
                        formName: 'formControlName',
                        validations: [],
                        title: '参数取值名称'

                      }
                    ]

                  }
                ]
              },
              sourceData: {
                name: 'ajaxConfig'
              }
            }
          ]
        },
        {
          code: 'sourceData',
          title: '数据源',
          propertyTypeConent: [
            {
              code: 'sourceData',
              title: '数据资源',
              type: 'property',
              active: true,
              sourceConfig: {

                type: 'staticForm',
                backName: 'sourceData',
                properties: [
                  {
                    name: 'sourceDataType',
                    type: 'select',
                    componentConfig: {
                      "options": [
                        {
                          "label": "静态数据",
                          "value": "inner"
                        },
                        {
                          "label": "动态数据源",
                          "value": "out"
                        }
                      ],
                      "labelName": "label",
                      "valueName": "value",
                      casadeValue: [
                        {

                          "cascadeName": "loadingConfig",
                          "cascadeItems": [
                            {

                              "type": "condition",
                              "condition": [
                                {
                                  "conditionType": 'and',
                                  "type": 'expression',
                                  "centent": [],
                                  "expression": {
                                    "comput": 'regular', // 正则、数学计算、非空、bool值
                                    "leftExpression": {
                                      "type": 'componentValue',
                                      "value": '0',
                                      "valueName": 'sourceDataType'
                                    },
                                    "righitExpression": {
                                      "type": 'value',
                                      "value": '^inner$'
                                    }
                                  }

                                }
                              ],
                              "content": {
                                "type": "display",
                                "data": {
                                  "option": [
                                    {
                                      "name": "display",
                                      "type": "value",
                                      "value": true,
                                      "valueName": ""
                                    }
                                  ]
                                }
                              }
                            },
                            {

                              "type": "condition",
                              "condition": [
                                {
                                  "conditionType": 'and',
                                  "type": 'expression',
                                  "centent": [],
                                  "expression": {
                                    "comput": 'regular', // 正则、数学计算、非空、bool值
                                    "leftExpression": {
                                      "type": 'componentValue',
                                      "value": '0',
                                      "valueName": 'sourceDataType'
                                    },
                                    "righitExpression": {
                                      "type": 'value',
                                      "value": '^out$'
                                    }
                                  }

                                }
                              ],
                              "content": {
                                "type": "display",
                                "data": {
                                  "option": [
                                    {
                                      "name": "display",
                                      "type": "value",
                                      "value": false,
                                      "valueName": ""
                                    }
                                  ]
                                }
                              }
                            }
                          ]
                        },
                        {

                          "cascadeName": "options",
                          "cascadeItems": [
                            {

                              "type": "condition",
                              "condition": [
                                {
                                  "conditionType": 'and',
                                  "type": 'expression',
                                  "centent": [],
                                  "expression": {
                                    "comput": 'regular', // 正则、数学计算、非空、bool值
                                    "leftExpression": {
                                      "type": 'componentValue',
                                      "value": '0',
                                      "valueName": 'sourceDataType'
                                    },
                                    "righitExpression": {
                                      "type": 'value',
                                      "value": '^inner$'
                                    }
                                  }

                                }
                              ],
                              "content": {
                                "type": "display",
                                "data": {
                                  "option": [
                                    {
                                      "name": "display",
                                      "type": "value",
                                      "value": false,
                                      "valueName": ""
                                    }
                                  ]
                                }
                              }
                            },
                            {

                              "type": "condition",
                              "condition": [
                                {
                                  "conditionType": 'and',
                                  "type": 'expression',
                                  "centent": [],
                                  "expression": {
                                    "comput": 'regular', // 正则、数学计算、非空、bool值
                                    "leftExpression": {
                                      "type": 'componentValue',
                                      "value": '0',
                                      "valueName": 'sourceDataType'
                                    },
                                    "righitExpression": {
                                      "type": 'value',
                                      "value": '^out$'
                                    }
                                  }

                                }
                              ],
                              "content": {
                                "type": "display",
                                "data": {
                                  "option": [
                                    {
                                      "name": "display",
                                      "type": "value",
                                      "value": true,
                                      "valueName": ""
                                    }
                                  ]
                                }
                              }
                            }
                          ]
                        }
                      ]

                    },
                    formType: 'value',
                    formName: 'formControlName',
                    validations: [],
                    title: '数据源类型'

                  },
                  {
                    name: 'loadingConfig',
                    type: 'objectCard',
                    componentConfig: {

                    },
                    formType: 'object',
                    formName: 'formControlName',
                    validations: [],
                    title: '异步主资源',
                    properties: [
                      {
                        name: 'id',
                        type: 'input',
                        componentConfig: {

                        },
                        formType: 'value',
                        formName: 'formControlName',
                        validations: [],
                        title: '资源标识'

                      },
                      {
                        name: 'urlName',
                        type: 'customSelect',
                        componentConfig: {

                        },
                        formType: 'value',
                        formName: 'formControlName',
                        validations: [],
                        title: '资源名称'

                      }
                    ]

                  },
                  {
                    name: 'options',
                    type: 'arrayCard',
                    componentConfig: {

                    },
                    formType: 'array',
                    formName: 'formControlName',
                    validations: [],
                    title: '静态主资源',
                    properties: [
                      {
                        name: 'lable',
                        type: 'input',
                        componentConfig: {

                        },
                        formType: 'value',
                        formName: 'formControlName',
                        validations: [],
                        title: '文本'

                      },
                      {
                        name: 'vlaue',
                        type: 'input',
                        componentConfig: {

                        },
                        formType: 'value',
                        formName: 'formControlName',
                        validations: [],
                        title: '值'

                      }
                    ]

                  }
                ]
              },
              sourceData: {
                name: 'sourceData'
              }
            }
          ]
        }


      ]
    },
    cnGridSwitch: {
      type: 'attr',
      backName: 'text',
      typeConent: [
        {
          code: 'style',
          title: '样式',
          propertyTypeConent: [
            {
              code: 'style',
              title: '样式',
              type: 'property',
              active: true,
              sourceConfig: {

                type: 'staticForm',
                backName: 'style',
                properties: [
                  {
                    name: 'span',
                    type: 'input',
                    componentConfig: {

                    },
                    formType: 'value',
                    formName: 'formControlName',
                    validations: [],
                    title: '栅格'

                  },
                  {
                    name: 'nzXs',
                    type: 'objectCard',
                    componentConfig: {

                    },
                    formType: 'object',
                    formName: 'formControlName',
                    validations: [],
                    title: 'nzXs 576px',
                    properties: [
                      {
                        name: 'offset',
                        type: 'input',
                        componentConfig: {

                        },
                        formType: 'value',
                        formName: 'formControlName',
                        validations: [],
                        title: '缩进'

                      },
                      {
                        name: 'span',
                        type: 'input',
                        componentConfig: {

                        },
                        formType: 'value',
                        formName: 'formControlName',
                        validations: [],
                        title: '栅格'

                      }
                    ]

                  }
                ]
              },
              sourceData: {
                name: 'style'
              }
            }
          ]
        }
      ]
    },
    notSet: {}

  }
  _form_config = {

    type: 'staticForm',
    backName: 'ajaxConfig',
    backConfig: [      // 返回指定字段
      {
        name: 'type'
      }
    ],
    properties: [
      {
        name: 'type',
        type: 'select',
        componentConfig: {
          "options": [
            {
              "label": "输入",
              "value": "cnGridInput"
            },
            {
              "label": "开关",
              "value": "cnGridSwitch"
            },
            {
              "label": "下拉选择",
              "value": "cnGridSelect"
            }

          ],
          "labelName": "label",
          "valueName": "value",
          "labelTooltipTitle": "小组件",
          "labelTooltipIcon": 'question-circle'

        },
        formType: 'value',
        formName: 'formControlName',
        validations: [],
        title: '小组件'

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
                "span": 12,
                "nzXs": 12,
                "nzSm": 12,
                "nzMd": 12,
                "nzLg": 12,
                "ngXl": 12,
                "nzXXl": 12
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
  staticFormValueChange(v?) {
    console.log('属性编辑器返回', v);
    if (v['backConfig'] && v['backConfig'].length > 0) {

      v['backConfig'].forEach(element => {

        this.sourceData[element['name']] = v['data'][element['name']]
      });

    } else {
      this.sourceData[v['name']] = v['data'];
    }

    if (this.sourceData['type'] !== this.selectCmpt) {
      this.selectCmpt = this.sourceData['type'];
      this.load();
    }


    console.log('====static最终====>>>', this.sourceData);
  }

  async loadConfig(cmpt) {
    // 加载出当前组件的详细配置，根据数据读取配置，构建页面

    // 例如 input——》 加载input 配置 
    let backData = null;
    const timestamp = new Date().getTime();
    const data = await this.httpClient.get(`assets/vc/page/${cmpt}.json?${timestamp}`).toPromise();
    if (data && data.hasOwnProperty('propertyconfig')) {
      backData = data['propertyconfig'];
    }
    console.log('加载配置', data);
    return backData;


  }


  valueChange(v) {

    console.log('属性编辑器返回', v);
    if (v['backConfig'] && v['backConfig'].length > 0) {

      v['backConfig'].forEach(element => {

        this.sourceData[element['name']] = v['data'][element['name']]
      });

    } else {
      this.sourceData[v['name']] = v['data'];
    }


    console.log('====最终====>>>', this.sourceData);


  }



}
