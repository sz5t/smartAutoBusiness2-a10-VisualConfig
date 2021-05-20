import { Component, Input, OnInit } from '@angular/core';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';

@Component({
  selector: 'app-cfg-page-property',
  templateUrl: './cfg-page-property.component.html',
  styles: [
  ]
})
export class CfgPagePropertyComponent implements OnInit {

  @Input() public selectedItem: any;
  @Input() public fromDataService: configFormDataServerService;
  constructor() { }

  ngOnInit(): void {
    this.fromDataService.propertySiderInstance = this;

    this.load();
  }




  public service() {
    // 数据服务
    // 1.当前实例标识
    // 2.当前实例的主体
    // 3.当前实例的属性

  }


  attr_config;
  attr_typeConent: any[];
  attr_config_data;

  activeNode: any;

  load(node?) {

    if (this.selectedItem && this.selectedItem['active']) {
      if (this.selectedItem['active']) {
        this.activeNode = this.selectedItem['item'];
      }


      this.attr_config = this.gloab_config[this.selectedItem['active']];
      this.attr_typeConent = this.attr_config['typeConent'].filter(d => d !== '');
      this.attr_config_data = this.fromDataService.layoutSourceData[this.activeNode.id];



    }
    console.log('_sider', this.attr_config, this.attr_config_data);
  }






  gloab_config = {
    row: {
      componentCode: 'form-row',
      typeConent: [
        {
          code: 'style',
          title: '样式row',
          propertyTypeConent: [
            {
              code: 'style',
              title: '样式',
              type: 'size',
              active: true
            }
          ]
        },
        {
          code: 'attr',
          title: '属性',

          propertyTypeConent: [
            {
              code: 'privateProperty',
              title: '私有属性',
              type: 'size',
              active: true
            }
          ]
        }

      ]

    },
    col: {
      componentCode: 'form-row',
      typeConent: [
        {
          code: 'style',
          title: '样式col',
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
          code: 'attr',
          title: '属性col',
          propertyTypeConent: [
            {
              code: 'privateProperty',
              title: '私有属性',
              type: 'size',
              active: true
            }
          ]
        }

      ]
    },
    cmpt: {
      componentCode: 'form-input',
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
          code: 'attr',
          title: '属性',
          propertyTypeConent: [
            {
              code: 'lable',
              title: '文本',
              type: 'title',
              active: true,
              sourceConfig: {
                // 描述具体配置


              },
              sourceData: {
                name: 'title'
              }
            },
            {
              code: 'privateProperty',
              title: '私有属性',
              type: 'property',
              active: true,
              sourceConfig: {
                //
                type: 'staticForm',
                backName: 'privateProperty',
                properties: [
                  {
                    name: 'placeholder',
                    type: 'input',
                    componentConfig: {

                    },
                    formType: 'value',
                    formName: 'formControlName',
                    validations: [],
                    title: '提示占位符'

                  },
                  {
                    name: 'lengths',
                    type: 'slider',
                    componentConfig: {

                    },
                    formType: 'value',
                    formName: 'formControlName',
                    validations: [],
                    title: '长度'

                  },

                  {
                    name: 'isemail',
                    type: 'switch',
                    componentConfig: {

                      casadeValue: [
                        {

                          "cascadeName": "displayType",
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
                              ],
                              "content": {
                                "type": "display",
                                "data": {
                                  "option": [
                                    {
                                      "name": "display",
                                      "type": "currentValue",
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
                    title: '是否启用'

                  },
                  {
                    name: 'displayType',
                    type: 'select',
                    componentConfig: {
                      "options": [
                        {
                          "label": "文本",
                          "value": "text"
                        },
                        {
                          "label": "密码",
                          "value": "password"
                        }
                      ],
                      "labelName": "label",
                      "valueName": "value",

                    },
                    formType: 'value',
                    formName: 'formControlName',
                    validations: [],
                    title: '类型'

                  }
                ]

              },
              sourceData: {
                name: 'privateProperty'
              }
            },
            {
              code: 'text',
              title: '文本状态',
              type: 'subComponent',
              active: true,
              sourceConfig: {
                //
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
              sourceData: {
                name: 'text'
              }
            },
            {
              code: 'validations',
              title: '校验',
              type: 'size',
              active: true
            }
          ]
        },
        {
          code: 'event',
          title: '事件',
          propertyTypeConent: [
            {
              code: 'privateProperty',
              title: '私有属性',
              active: true,
              sourceConfig: {
                // 描述具体配置


              },
            }
          ]
        }
      ]
    },
    input: {

    },
    select: {

    }


  }






  valueChange(v) {

    console.log('属性编辑器返回', v, this.selectedItem, this.activeNode);
    this.fromDataService.layoutSourceData[this.activeNode.id][v['name']] = v['data'];
    console.log('====最终====>>>', this.fromDataService.layoutSourceData[this.activeNode.id]);


  }


}
