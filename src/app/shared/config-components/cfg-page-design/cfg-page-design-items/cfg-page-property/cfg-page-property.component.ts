import { HttpClient } from '@angular/common/http';
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
  constructor(private httpClient: HttpClient,) { }

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

  async load(node?) {

    if (this.selectedItem && this.selectedItem['active']) {
      if (this.selectedItem['active']) {
        this.activeNode = this.selectedItem['item'];
      }
      let d;
      if (this.selectedItem['active']) {
        d = await this.loadConfig(this.selectedItem['active']);
      }
      if (d) {
        this.attr_config = d;
      } else {
        this.attr_config = this.gloab_config[this.selectedItem['active']];
      }


      this.attr_typeConent = this.attr_config['typeConent'].filter(d => d !== '');
      this.attr_config_data = this.fromDataService.layoutSourceData[this.activeNode.id];





    }
    console.log('_sider', this.attr_config, this.attr_config_data);
  }






  gloab_config = {
    layout: {
      componentCode: 'layout',
      typeConent: [
        {
          code: 'attr',
          title: '属性',

          propertyTypeConent: [
            {
              code: 'base',
              title: '基本内容【测试】',
              type: 'property',
              active: true,
              sourceConfig: {

                type: 'staticForm',
                backName: 'title',
                backConfig: [
                  {
                    name: 'title'
                  },
                  {
                    name: 'showTitle'
                  }
                ],
                properties: [
                  {
                    name: 'id',
                    type: 'input',
                    componentConfig: {

                    },
                    formType: 'value',
                    formName: 'formControlName',
                    validations: [],
                    title: '主键'

                  },
                  {
                    name: 'title',
                    type: 'input',
                    componentConfig: {

                    },
                    formType: 'value',
                    formName: 'formControlName',
                    validations: [],
                    title: '标题'

                  },
                  {
                    name: 'showTitle',
                    type: 'switch',
                    componentConfig: {

                    },
                    formType: 'value',
                    formName: 'formControlName',
                    validations: [],
                    title: '是否显示标题'

                  }



                ]
              },
              sourceData: {
                type: 'root',
                name: 'title'
              }
            }
          ]
        }

      ]
    },
    row: {
      componentCode: 'form-row',
      typeConent: [
        {
          code: 'attr',
          title: '属性',

          propertyTypeConent: [
            {
              code: 'base',
              title: '基本内容【测试】',
              type: 'property',
              active: true,
              sourceConfig: {

                type: 'staticForm',
                backName: 'title',
                backConfig: [
                  {
                    name: 'title'
                  },
                  {
                    name: 'showTitle'
                  }
                ],
                properties: [
                  {
                    name: 'id',
                    type: 'input',
                    componentConfig: {

                    },
                    formType: 'value',
                    formName: 'formControlName',
                    validations: [],
                    title: '主键'

                  },
                  {
                    name: 'title',
                    type: 'input',
                    componentConfig: {

                    },
                    formType: 'value',
                    formName: 'formControlName',
                    validations: [],
                    title: '标题'

                  },
                  {
                    name: 'showTitle',
                    type: 'switch',
                    componentConfig: {

                    },
                    formType: 'value',
                    formName: 'formControlName',
                    validations: [],
                    title: '是否显示标题'

                  }



                ]
              },
              sourceData: {
                type: 'root',
                name: 'title'
              }
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

                        },
                        {
                          id: 'c_002',
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
                          "controlIndex": 1,

                        }
                      ]
                    }
                  ]

                }
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
              code: 'style',
              title: '基本内容【测试】',
              type: 'property',
              active: true,
              sourceConfig: {

                type: 'staticForm',
                backName: 'title',
                backConfig: [
                  {
                    name: 'title'
                  },
                  {
                    name: 'span'
                  }
                ],
                properties: [
                  {
                    name: 'title',
                    type: 'input',
                    componentConfig: {

                    },
                    formType: 'value',
                    formName: 'formControlName',
                    validations: [],
                    title: '标题'

                  },
                  {
                    name: 'span',
                    type: 'slider',
                    componentConfig: {

                    },
                    formType: 'value',
                    formName: 'formControlName',
                    validations: [],
                    title: '栅格宽度'

                  }
                ]
              },
              sourceData: {
                type: 'root',
                name: 'title'
              }
            }
          ]
        }

      ]
    },
    cnDataTable: {
      componentCode: 'form-input',
      typeConent: [
        {
          code: 'style',
          title: '样式',
          propertyTypeConent: [
            {
              code: 'style',
              title: '基本内容【测试】',
              type: 'property',
              active: true,
              sourceConfig: {

                type: 'staticForm',
                backName: 'title',
                backConfig: [
                  {
                    name: 'title'
                  }
                ],
                properties: [
                  {
                    name: 'title',
                    type: 'input',
                    componentConfig: {

                    },
                    formType: 'value',
                    formName: 'formControlName',
                    validations: [],
                    title: '标题'

                  }
                ]
              },
              sourceData: {
                type: 'root',
                name: 'title'
              }
            },
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

    },
    cnDataTable1: {
      componentCode: 'form-row',
      typeConent: [
        {
          code: 'attr',
          title: '属性',

          propertyTypeConent: [
            {
              code: 'base',
              title: '基本内容【测试】',
              type: 'property',
              active: true,
              sourceConfig: {

                type: 'staticForm',
                backName: 'title',
                backConfig: [
                  {
                    name: 'title'
                  }
                ],
                properties: [
                  {
                    name: 'id',
                    type: 'input',
                    componentConfig: {

                    },
                    formType: 'value',
                    formName: 'formControlName',
                    validations: [],
                    title: '主键'

                  },
                  {
                    name: 'title',
                    type: 'input',
                    componentConfig: {

                    },
                    formType: 'value',
                    formName: 'formControlName',
                    validations: [],
                    title: '标题'

                  }
                ]
              },
              sourceData: {
                type: 'root',
                name: 'title'
              }
            }
          ]
        }

      ]

    },
    tabs: {
      componentCode: 'form-row',
      typeConent: [
        {
          code: 'attr',
          title: '属性',

          propertyTypeConent: [
            {
              code: 'base',
              title: '基本内容【测试】',
              type: 'property',
              active: true,
              sourceConfig: {

                type: 'staticForm',
                backName: 'title',
                backConfig: [
                  {
                    name: 'title'
                  }
                ],
                properties: [
                  {
                    name: 'id',
                    type: 'input',
                    componentConfig: {

                    },
                    formType: 'value',
                    formName: 'formControlName',
                    validations: [],
                    title: '主键'

                  },
                  {
                    name: 'title',
                    type: 'input',
                    componentConfig: {

                    },
                    formType: 'value',
                    formName: 'formControlName',
                    validations: [],
                    title: '标题'

                  }
                ]
              },
              sourceData: {
                type: 'root',
                name: 'title'
              }
            }
          ]
        }

      ]

    },
    tab: {
      componentCode: 'form-row',
      typeConent: [
        {
          code: 'attr',
          title: '属性',

          propertyTypeConent: [
            {
              code: 'base',
              title: '基本内容【测试】',
              type: 'property',
              active: true,
              sourceConfig: {

                type: 'staticForm',
                backName: 'title',
                backConfig: [
                  {
                    name: 'title'
                  }
                ],
                properties: [
                  {
                    name: 'id',
                    type: 'input',
                    componentConfig: {

                    },
                    formType: 'value',
                    formName: 'formControlName',
                    validations: [],
                    title: '主键'

                  },
                  {
                    name: 'title',
                    type: 'input',
                    componentConfig: {

                    },
                    formType: 'value',
                    formName: 'formControlName',
                    validations: [],
                    title: '标题'

                  }
                ]
              },
              sourceData: {
                type: 'root',
                name: 'title'
              }
            }
          ]
        }

      ]

    }


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

    console.log('属性编辑器返回', v, this.selectedItem, this.activeNode);
    if (v['backConfig'] && v['backConfig'].length > 0) {

      v['backConfig'].forEach(element => {

        this.fromDataService.layoutSourceData[this.activeNode.id][element['name']] = v['data'][element['name']]
      });

    } else {
      this.fromDataService.layoutSourceData[this.activeNode.id][v['name']] = v['data'];
    }

    this.fromDataService.updateNode(this.activeNode);
    console.log('====最终====>>>', this.fromDataService.layoutSourceData[this.activeNode.id]);


  }


}
