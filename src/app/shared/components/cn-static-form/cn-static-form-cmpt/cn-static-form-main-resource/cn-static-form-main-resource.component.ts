import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { DataServerService } from 'src/app/core/services/components/component.service';
import { CnPageComponent } from '../../../cn-page/cn-page.component';
import { CnTagComponent } from '../../../cn-tag/cn-tag.component';
@Component({
  selector: 'app-cn-static-form-main-resource',
  templateUrl: './cn-static-form-main-resource.component.html',
  styles: [
  ],
  providers: [DataServerService],
})
export class CnStaticFormMainResourceComponent implements OnInit, AfterViewInit {
  public sourceData: any;
  public config: any;
  @Input() public fromDataService;
  selectCmpt: any = 'notSet';
  staticData: any;
  attr_config;
  constructor(private httpClient: HttpClient, public componentDataService: DataServerService,) { }

  async ngOnInit(): Promise<void> {
    if (!this.sourceData) {
      this.sourceData = {}
    }
    console.log('弹出值', this.sourceData);
    if (!this.config) {
      this.config = {
        "asyncLoad": true,
        "loadingConfig": {
          "path": "vc/config/mainLoadingConfig.json"
        }
      }
    }

    if (this.config) {
      if (this.config.hasOwnProperty('asyncLoad') && this.config['asyncLoad']) {
        await this.load();

      } else {
        this.attr_config = this.config;
      }
    }
  }

  ngAfterViewInit() {


  }
  async load(node?) {

    if (this.config['loadingConfig']) {

      let d;
      if (this.config['loadingConfig']['path']) {
        d = await this.loadConfig(this.config['loadingConfig']['path']);
      }
      if (d) {
        this.attr_config = d;
      } else {
        this.attr_config = null;
      }

    }
    console.log('_sider', this.attr_config);
  }
  async loadConfig(cmpt) {
    // 加载出当前组件的详细配置，根据数据读取配置，构建页面

    // 例如 input——》 加载input 配置 
    let backData = null;
    const timestamp = new Date().getTime();
    const data = await this.httpClient.get(`assets/${cmpt}?${timestamp}`).toPromise();
    backData = data;
    console.log('加载配置', data);
    return backData;


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

    console.log('====static最终====>>>', this.sourceData);
  }
  staticFormValueChange1(v?) {
    console.log('属性编辑器返回', v);
    if (v['backConfig'] && v['backConfig'].length > 0) {

      v['backConfig'].forEach(element => {

        this.sourceData[element['name']] = v['data'][element['name']]
      });

    } else {
      this.sourceData[v['name']] = v['data'];
    }

    console.log('====static最终====>>>', this.sourceData);
  }


  c = {
    "id": "view_data_columns",
    "title": "",
    "titleIcon": "right-circle",
    "component": "cnDataTable",
    "keyId": "id",
    "size": "large",
    "isBordered": false,
    "isFrontPagination": false,
    "isPagination": true,
    "isShowSizeChanger": true,
    "showTotal": true,
    "pageSize": 10,
    "showCheckBox": true,
    "pageSizeOptions": [
      10,
      20,
      50,
      100
    ],
    "loadingOnInit": false,
    "loadingConfig": {
      "url": "resource/GET_DM_COLUMNS_LIST/query",
      "method": "get",
      "params": [
        {
          "name": "resourceId",
          "type": "tempValue",
          "valueName": "_tableId",
          "value": "-999"
        },
        {
          "name": "_mapToObject",
          "type": "value",
          "value": true
        },
        {
          "name": "_sort",
          "type": "value",
          "value": "orderCode asc"
        }
      ],
      "filter": []
    },
    "columns": [
      {
        "title": "id",
        "type": "field",
        "field": "id",
        "hidden": true,
        "showFilter": false,
        "showSort": false,
        "isShowExpand": false,
        "width": "50px",
        "style": {}
      },
      {
        "title": "tableId",
        "type": "field",
        "field": "resourceId",
        "hidden": true,
        "showFilter": false,
        "showSort": false,
        "isShowExpand": false,
        "width": "50px",
        "style": {}
      },
      {
        "title": "列名",
        "type": "field",
        "field": "paramName",
        "hidden": false,
        "showFilter": false,
        "showSort": false,
        "width": "12%",
        "style": {},
        "editor": {
          "type": "input",
          "field": "paramName"
        }
      },
      {
        "title": "描述",
        "type": "field",
        "field": "descName",
        "hidden": false,
        "showFilter": false,
        "showSort": false,
        "width": "13%",
        "style": {},
        "editor": {
          "type": "input",
          "field": "descName"
        }
      },
      {
        "title": "数据类型",
        "type": "field",
        "field": "datatype",
        "hidden": false,
        "showFilter": false,
        "showSort": false,
        "width": "10%",
        "style": {},
        "editor": {
          "type": "select",
          "field": "datatype",
          "placeholder": "请输入",
          "defaultValue": "string",
          "options": [
            {
              "label": "string",
              "value": "string"
            },
            {
              "label": "nstring",
              "value": "nstring"
            },
            {
              "label": "char",
              "value": "char"
            },
            {
              "label": "nchar",
              "value": "nchar"
            },
            {
              "label": "number",
              "value": "number"
            },
            {
              "label": "datetime",
              "value": "datetime"
            },
            {
              "label": "clob",
              "value": "clob"
            },
            {
              "label": "blob",
              "value": "blob"
            }
          ],
          "labelName": "label",
          "valueName": "value"
        }
      },
      {
        "title": "长度",
        "type": "field",
        "field": "length",
        "hidden": false,
        "showFilter": false,
        "showSort": false,
        "width": "8%",
        "style": {},
        "editor": {
          "type": "input",
          "field": "length"
        }
      },
      {
        "title": "默认值",
        "type": "field",
        "field": "defaultValue",
        "hidden": false,
        "showFilter": false,
        "showSort": false,
        "width": "8%",
        "style": {},
        "editor": {
          "type": "input",
          "field": "defautValue"
        }
      },
      {
        "title": "精度",
        "type": "field",
        "field": "precision",
        "hidden": false,
        "showFilter": false,
        "showSort": false,
        "width": "8%",
        "style": {},
        "editor": {
          "type": "input",
          "field": "precision"
        }
      },
      {
        "title": "是否为空",
        "type": "field",
        "field": "isNullableText",
        "hidden": false,
        "showFilter": false,
        "showSort": false,
        "width": "10%",
        "style": {},
        "editor": {
          "type": "select",
          "field": "isNullable",
          "defaultValue": 1,
          "options": [
            {
              "label": "不为空",
              "value": 0
            },
            {
              "label": "可为空",
              "value": 1
            }
          ],
          "labelName": "label",
          "valueName": "value"
        },
        "custom": {
          "type": "tag",
          "field": "isNullableText",
          "dataMapping": [
            {
              "color": "#87d068",
              "field": "isNullableText",
              "value": "不为空"
            },
            {
              "color": "orange",
              "field": "isNullableText",
              "value": "可为空"
            }
          ]
        }
      },
      {
        "title": "是否唯一",
        "type": "field",
        "field": "isUniqueText",
        "hidden": false,
        "showFilter": false,
        "showSort": false,
        "width": "10%",
        "style": {},
        "editor": {
          "type": "select",
          "field": "isUnique",
          "defaultValue": 0,
          "options": [
            {
              "label": "不唯一",
              "value": 0
            },
            {
              "label": "唯一",
              "value": 1
            }
          ],
          "labelName": "label",
          "valueName": "value"
        },
        "custom": {
          "type": "tag",
          "field": "isUniqueText",
          "dataMapping": [
            {
              "color": "#87d068",
              "field": "isUniqueText",
              "value": "不唯一"
            },
            {
              "color": "#2db7f5",
              "field": "isUniqueText",
              "value": "唯一"
            }
          ]
        }
      },
      {
        "title": "是否可用",
        "type": "field",
        "field": "isValidateText",
        "hidden": false,
        "showFilter": false,
        "showSort": false,
        "width": "10%",
        "style": {},
        "editor": {
          "type": "select",
          "field": "isValidate",
          "defaultValue": 1,
          "options": [
            {
              "label": "不可用",
              "value": 0
            },
            {
              "label": "可用",
              "value": 1
            }
          ],
          "labelName": "label",
          "valueName": "value"
        },
        "custom": {
          "type": "tag",
          "field": "isValidateText",
          "dataMapping": [
            {
              "color": "#87d768",
              "field": "isValidateText",
              "value": "可用"
            },
            {
              "color": "#2d27a5",
              "field": "isValidateText",
              "value": "不可用"
            }
          ]
        }
      },
      {
        "title": "排序号",
        "type": "field",
        "field": "orderCode",
        "hidden": false,
        "showFilter": false,
        "showSort": false,
        "width": "8%",
        "style": {},
        "editor": {
          "type": "input",
          "field": "orderCode"
        }
      }
    ]
  }

  sourceData1: any;
  attr_config1 = {
    "type": "staticForm",
    "backName": "title",
    "backConfig": [
      {
        "name": "title"
      },
      {
        "name": "showTitle"
      }
    ],
    "properties": [
      {
        "name": "bodyParams",
        "type": "arrayTable",
        "componentConfig": {
          "mode": "empty"
        },
        "formType": "array",
        "formName": "formControlName",
        "validations": [],
        "title": "字段信息",
        "properties": [
          {
            "name": "paramName",
            "type": "input",
            "componentConfig": {
              "hiddenTitle": true,
              "controlSize": {
                "span": 20,
                "nzXs": 20,
                "nzSm": 20,
                "nzMd": 20,
                "nzLg": 20,
                "ngXl": 20,
                "nzXXl": 20
              }
            },
            "formType": "value",
            "formName": "formControlName",
            "validations": [],
            "title": "列名"
          },
          {
            "name": "descName",
            "type": "input",
            "componentConfig": {
              "hiddenTitle": true,
              "controlSize": {
                "span": 20,
                "nzXs": 20,
                "nzSm": 20,
                "nzMd": 20,
                "nzLg": 20,
                "ngXl": 20,
                "nzXXl": 20
              }
            },
            "formType": "value",
            "formName": "formControlName",
            "validations": [],
            "title": "描述"
          },
          {
            "name": "datatype",
            "type": "select",
            "componentConfig": {
              "hiddenTitle": true,
              "labelSize": {
                "span": 0,
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
                "span": 20,
                "nzXs": 20,
                "nzSm": 20,
                "nzMd": 20,
                "nzLg": 20,
                "ngXl": 20,
                "nzXXl": 20
              },
              "options": [
                {
                  "label": "string",
                  "value": "string"
                },
                {
                  "label": "nstring",
                  "value": "nstring"
                },
                {
                  "label": "char",
                  "value": "char"
                },
                {
                  "label": "nchar",
                  "value": "nchar"
                },
                {
                  "label": "number",
                  "value": "number"
                },
                {
                  "label": "datetime",
                  "value": "datetime"
                },
                {
                  "label": "clob",
                  "value": "clob"
                },
                {
                  "label": "blob",
                  "value": "blob"
                }
              ],
              "labelName": "label",
              "valueName": "value"
            },
            "formType": "value",
            "formName": "formControlName",
            "validations": [],
            "title": "数据类型"
          }
        ]
      }

    ]
  }

  tempValue;
  initValue;
  cn_page_config = {
    id: '001',
    isAllJson: false,
    executionType: ""

  }
  page_config = {
    "layoutJson": {
      "id": "Module_layout",
      "type": "layout",
      "title": "布局",
      "container": "rows",
      "rows": [
        {
          "cols": [
            {
              "id": "Modu_clos_1",
              "col": "cc",
              "type": "col",
              "titlestate": 1,
              "title": "",
              "span": 24,
              "container": "component",
              "size": {
                "nzXs": 24,
                "nzSm": 24,
                "nzMd": 24,
                "nzLg": 24,
                "ngXl": 24,
                "nzXXl": 24
              },
              "component": {
                "id": "view_business_search",
                "type": "form",
                "title": "",
                "container": "form"
              }
            },
            {
              "id": "Modu_clos_2",
              "col": "cc",
              "type": "col",
              "title": "",
              "span": 24,
              "container": "component",
              "header": {
                "title": "表信息列表",
                "icon": "",
                "id": ""
              },
              "size": {
                "nzXs": 24,
                "nzSm": 24,
                "nzMd": 24,
                "nzLg": 24,
                "nzXl": 24,
                "nzXXl": 24
              },
              "component": {
                "id": "view_data_table",
                "type": "cnDataTable",
                "title": "",
                "container": "cnDataTable"
              }
            }
          ],
          "id": "Modu_rows",
          "type": "row",
          "title": "行",
          "container": "cols"
        }
      ],
      "cascade": {
        "messageSender": [],
        "messageReceiver": []
      }
    },
    "componentsJson": [
      {
        "id": "view_business_search",
        "type": "form",
        "component": "form",
        "state": "edit",
        "loadingConfig": {},
        "formLayout": {
          "id": "b86s2i",
          "type": "layout",
          "title": "表单布局b86s2i",
          "rows": [
            {
              "id": "MefhXa",
              "type": "row",
              "cols": [
                {
                  "id": "col_1",
                  "col": "cc",
                  "type": "col",
                  "title": "列1",
                  "span": 12,
                  "layoutContain": "select",
                  "size": {
                    "nzXs": 12,
                    "nzSm": 12,
                    "nzMd": 12,
                    "nzLg": 12,
                    "ngXl": 12,
                    "nzXXl": 12
                  },
                  "control": {
                    "id": "search_module"
                  }
                },
                {
                  "id": "col_2",
                  "col": "cc",
                  "type": "col",
                  "title": "列2",
                  "span": 12,
                  "layoutContain": "select",
                  "size": {
                    "nzXs": 12,
                    "nzSm": 12,
                    "nzMd": 12,
                    "nzLg": 12,
                    "ngXl": 12,
                    "nzXXl": 12
                  },
                  "control": {
                    "id": "search_name"
                  }
                }
              ]
            }
          ]
        },
        "formControls": [
          {
            "id": "search_module",
            "hidden": false,
            "title": "功能页面",
            "hiddenLabel": false,
            "titleConfig": {
              "required": false
            },
            "field": "PAGE_CODE",
            "noColon": true,
            "labelSize": {
              "span": 4,
              "nzXs": 4,
              "nzSm": 4,
              "nzMd": 4,
              "nzLg": 4,
              "ngXl": 4,
              "nzXXl": 4
            },
            "controlSize": {
              "span": 16,
              "nzXs": {
                "span": 16,
                "offset": 0
              },
              "nzSm": {
                "span": 16,
                "offset": 0
              },
              "nzMd": {
                "span": 16,
                "offset": 0
              },
              "nzLg": {
                "span": 16,
                "offset": 0
              },
              "ngXl": {
                "span": 16,
                "offset": 0
              },
              "nzXXl": {
                "span": 16,
                "offset": 0
              }
            },
            "state": "edit",
            "text": {
              "type": "label",
              "field": "PAGE_CODE"
            },
            "editor": {
              "type": "cascader",
              "field": "PAGE_CODE",
              "placeholder": "请选择",
              "asyncData": false,
              "loadingConfig": {
                "id": "loadformtree"
              },
              "expandConfig": {
                "id": "loadformtreeexpand"
              },
              "loadingItemConfig": {
                "id": "loadformtreeitem"
              },
              "columns": [
                {
                  "title": "ID",
                  "type": "value",
                  "field": "CODE"
                },
                {
                  "title": "PID",
                  "type": "parentId",
                  "field": "PID"
                },
                {
                  "title": "NAME",
                  "type": "label",
                  "field": "NAME"
                }
              ]
            }
          },
          {
            "id": "search_name",
            "hidden": false,
            "title": "表名称查询",
            "hiddenLabel": false,
            "titleConfig": {
              "required": false
            },
            "field": "resourceName",
            "noColon": true,
            "labelSize": {
              "span": 4,
              "nzXs": 4,
              "nzSm": 4,
              "nzMd": 4,
              "nzLg": 4,
              "ngXl": 4,
              "nzXXl": 4
            },
            "controlSize": {
              "span": 16,
              "nzXs": {
                "span": 16,
                "offset": 0
              },
              "nzSm": {
                "span": 16,
                "offset": 0
              },
              "nzMd": {
                "span": 16,
                "offset": 0
              },
              "nzLg": {
                "span": 16,
                "offset": 0
              },
              "ngXl": {
                "span": 16,
                "offset": 0
              },
              "nzXXl": {
                "span": 16,
                "offset": 0
              }
            },
            "state": "edit",
            "text": {
              "type": "label",
              "field": "resourceName"
            },
            "editor": {
              "type": "searchSelect",
              "field": "resourceName",
              "showSearch": true,
              "serverSearch": true,
              "loadingConfig": {
                "id": "loadBusinessNameValue"
              },
              "labelName": "resourceName",
              "valueName": "id",
              "placeholder": "请输入查找内容..."
            }
          }
        ],
        "formControlsPermissions": [
          {
            "formState": "new",
            "formStateContent": {
              "isLoad": false,
              "loadAjax": {},
              "isDefault": true
            },
            "Controls": [
              {
                "id": "module_name",
                "state": "edit",
                "hidden": false,
                "readOnly": false
              },
              {
                "id": "search_name",
                "state": "edit",
                "hidden": false,
                "readOnly": false
              }
            ]
          },
          {
            "formState": "edit",
            "Controls": [
              {
                "id": "module_name",
                "state": "edit",
                "hidden": false,
                "readOnly": false
              },
              {
                "id": "search_name",
                "state": "edit",
                "hidden": false,
                "readOnly": false
              }
            ]
          }
        ],
        "cascade": {
          "messageSender": [
            {
              "id": "afterSelectValueChange",
              "senderId": "view_business_search",
              "sendData": [
                {
                  "beforeSend": {},
                  "reveicerId": "",
                  "receiverTriggerType": "BEHAVIOR",
                  "receiverTrigger": "LOAD_BY_FILTER",
                  "params": [
                    {
                      "name": "PAGE_CODE",
                      "type": "returnValue",
                      "valueName": "PAGE_CODE",
                      "valueTo": "tempValue"
                    },
                    {
                      "name": "_TABLE_NAME",
                      "type": "returnValue",
                      "valueName": "_OPTION_NAME",
                      "valueTo": "tempValue"
                    }
                  ]
                }
              ]
            }
          ]
        },
        "cascadeValue": [
          {
            "type": "",
            "controlId": "search_name",
            "name": "resourceName",
            "CascadeObjects": [
              {
                "controlId": "search_name",
                "cascadeName": "resourceName",
                "cascadeItems": [
                  {
                    "type": "default",
                    "content": {
                      "type": "relation",
                      "sender": {
                        "name": "validation",
                        "message": "message.ajax.state.success",
                        "senderId": "afterSelectValueChange"
                      },
                      "data": {
                        "option": [
                          {
                            "name": "PAGE_CODE",
                            "type": "rowValue",
                            "valueName": "PAGE_CODE"
                          },
                          {
                            "name": "_OPTION_NAME",
                            "type": "selectObjectValue",
                            "valueName": "resourceName"
                          }
                        ]
                      }
                    }
                  }
                ]
              }
            ]
          },
          {
            "type": "",
            "controlId": "search_module",
            "name": "PAGE_CODE",
            "CascadeObjects": [
              {
                "controlId": "search_module",
                "cascadeName": "PAGE_CODE",
                "cascadeItems": [
                  {
                    "type": "default",
                    "content": {
                      "type": "relation",
                      "sender": {
                        "name": "validation",
                        "message": "message.ajax.state.success",
                        "senderId": "afterSelectValueChange"
                      },
                      "data": {
                        "option": [
                          {
                            "name": "PAGE_CODE",
                            "type": "selectValue",
                            "valueName": "value"
                          },
                          {
                            "name": "_OPTION_NAME",
                            "type": "rowValue",
                            "valueName": "resourceName"
                          }
                        ]
                      }
                    }
                  }
                ]
              }
            ]
          }
        ],
        "ajaxConfig": [
          {
            "id": "loadformtree",
            "url": "resource/GET_FUNC_PAGE_TREE/query",
            "urlType": "inner",
            "ajaxType": "get",
            "params": [
              {
                "name": "_recursive",
                "type": "value",
                "value": true
              },
              {
                "name": "_deep",
                "type": "value",
                "value": "2"
              },
              {
                "name": "_pcName",
                "type": "value",
                "value": "PID"
              }
            ],
            "outputParameters": [],
            "result": []
          },
          {
            "id": "loadBusinessNameValue",
            "url": "resource/GET_DATA_MODELING_TABLE/query",
            "urlType": "inner",
            "ajaxType": "get",
            "params": [
              {
                "name": "resourceName",
                "search": true,
                "conditionType": "ctn"
              },
              {
                "name": "_mapToObject",
                "type": "value",
                "value": true
              },
              {
                "name": "_sort",
                "type": "value",
                "value": "createDate desc"
              }
            ],
            "outputParameters": [],
            "result": []
          }
        ]
      },
      {
        "id": "view_data_table",
        "title": "",
        "titleIcon": "right-circle",
        "component": "cnDataTable",
        "keyId": "id",
        "size": "large",
        "changeValue": [
          {
            "id": "edit_form_data_table_changeValue",
            "params": [
              {
                "name": "_tableId",
                "type": "item",
                "valueName": "id",
                "valueTo": "tempValue"
              }
            ]
          }
        ],
        "isBordered": false,
        "isFrontPagination": false,
        "isPagination": true,
        "isShowSizeChanger": true,
        "showTotal": true,
        "pageSize": 5,
        "showCheckBox": true,
        "pageSizeOptions": [
          10,
          20,
          50,
          100
        ],
        "loadingOnInit": true,
        "loadingConfig": {
          "url": "resource/GET_DATA_MODELING_TABLE/query",
          "method": "get",
          "params": [
            {
              "name": "_mapToObject",
              "type": "value",
              "value": true
            },
            {
              "name": "_sort",
              "type": "value",
              "value": "createDate desc"
            }
          ],
          "filter": [
            {
              "name": "_mapToObject",
              "type": "value",
              "value": true
            },
            {
              "name": "resourceName",
              "type": "tempValue",
              "valueName": "_TABLE_NAME"
            },
            {
              "name": "funcCode",
              "type": "tempValue",
              "valueName": "PAGE_CODE"
            },
            {
              "name": "_sort",
              "type": "value",
              "value": "createDate desc"
            }
          ]
        },
        "columns": [
          {
            "title": "主键",
            "type": "field",
            "field": "id",
            "hidden": true,
            "showFilter": false,
            "showSort": false,
            "width": "50px",
            "style": {}
          },
          {
            "title": "表名称",
            "type": "field",
            "field": "resourceName",
            "width": "20%",
            "hidden": false,
            "showFilter": false,
            "showSort": false,
            "style": {}
          },
          {
            "title": "描述",
            "type": "field",
            "field": "descName",
            "width": "30%",
            "hidden": false,
            "showFilter": false,
            "showSort": false,
            "style": {}
          },
          {
            "title": "是否建模",
            "type": "field",
            "field": "buildModelText",
            "hidden": false,
            "showFilter": false,
            "showSort": false,
            "width": "15%",
            "style": {},
            "custom": {
              "type": "tag",
              "field": "buildModelText",
              "dataMapping": [
                {
                  "color": "#87d068",
                  "field": "buildModelText",
                  "value": "已建模"
                },
                {
                  "color": "#2db7f5",
                  "field": "buildModelText",
                  "value": "无"
                },
                {
                  "color": "#5db9f5",
                  "field": "buildModelText",
                  "value": "重新建模"
                }
              ]
            }
          },
          {
            "title": "进度",
            "type": "field",
            "field": "isBuildModel",
            "hidden": false,
            "showFilter": false,
            "width": "25%",
            "showSort": false,
            "style": {},
            "custom": {
              "type": "progress",
              "defaultType": "line",
              "inlineMode": true,
              "dataMapping": [
                {
                  "name": "percent",
                  "field": "pPercent"
                },
                {
                  "name": "status",
                  "field": "pStatus"
                },
                {
                  "name": "title",
                  "field": "pTitle"
                }
              ],
              "showInfo": true
            }
          },
          {
            "title": "发布",
            "type": "field",
            "field": "publishStatus",
            "width": "20%",
            "hidden": false,
            "showFilter": false,
            "showSort": false,
            "style": {}
          },
          {
            "title": "操作",
            "type": "action",
            "actionIds": [
              "M_editRowForm",
              "M_modeling",
              "M_cancel_modeling",
              "data_table_delete",
              "M_modeling_new",
              "M_modeling_data"
            ]
          }
        ],
        "cascade": {
          "messageSender": [
            {
              "id": "afterTableDeleteSuccess",
              "senderId": "view_data_table",
              "triggerMoment": "after",
              "sendData": [
                {
                  "beforeSend": {},
                  "reveicerId": "",
                  "receiverTriggerType": "ACTION",
                  "receiverTrigger": "MESSAGE",
                  "params": [
                    {
                      "name": "type",
                      "type": "value",
                      "value": "success"
                    },
                    {
                      "name": "code",
                      "type": "value",
                      "value": "删除成功"
                    }
                  ]
                },
                {
                  "beforeSend": {},
                  "reveicerId": "",
                  "receiverTriggerType": "BEHAVIOR",
                  "receiverTrigger": "REFRESH",
                  "params": []
                }
              ]
            },
            {
              "id": "afterTableModelingSaveSuccess",
              "senderId": "view_data_table",
              "triggerMoment": "after",
              "sendData": [
                {
                  "beforeSend": {},
                  "reveicerId": "",
                  "receiverTriggerType": "ACTION",
                  "receiverTrigger": "MESSAGE",
                  "params": [
                    {
                      "name": "type",
                      "type": "value",
                      "value": "success"
                    },
                    {
                      "name": "code",
                      "type": "value",
                      "value": "操作成功"
                    }
                  ]
                },
                {
                  "beforeSend": {},
                  "reveicerId": "",
                  "receiverTriggerType": "BEHAVIOR",
                  "receiverTrigger": "LOAD_REFRESH_DATA",
                  "params": [
                    {
                      "name": "id",
                      "type": "addedRows",
                      "valueName": "id"
                    }
                  ]
                }
              ]
            }
          ],
          "messageReceiver": [
            {
              "id": "s_201",
              "senderId": "view_business_search",
              "receiveData": [
                {
                  "beforeReceive": [],
                  "triggerType": "BEHAVIOR",
                  "trigger": "LOAD_BY_FILTER",
                  "params": [
                    {
                      "pname": "_TABLE_NAME",
                      "cname": "_TABLE_NAME",
                      "valueTo": "tempValue"
                    },
                    {
                      "pname": "PAGE_CODE",
                      "cname": "PAGE_CODE",
                      "valueTo": "tempValue"
                    }
                  ]
                }
              ]
            }

          ]
        },
        "rowActions": [],
        "dialog": [
        ],
        "condition": [],
        "ajaxConfig": [
          {
            "id": "form_edit_data_table",
            "url": "resource/update",
            "urlType": "inner",
            "ajaxType": "put",
            "params": [
              {
                "name": "resourceName",
                "type": "componentValue",
                "valueName": "resourceName"
              },
              {
                "name": "descName",
                "type": "componentValue",
                "valueName": "descName"
              },
              {
                "name": "resourceType",
                "type": "value",
                "value": 10
              },
              {
                "name": "id",
                "type": "tempValue",
                "valueName": "_tableId"
              }
            ],
            "outputParameters": [],
            "result": [
              {
                "name": "data",
                "showMessageWithNext": 0,
                "message": "message.ajax.state.success",
                "senderId": "afterTableModelingSaveSuccess"
              }
            ]
          },
          {
            "id": "create_modeling",
            "url": "resource/createModel",
            "urlType": "inner",
            "ajaxType": "post",
            "params": [
              {
                "name": "id",
                "type": "item",
                "valueName": "id"
              }
            ],
            "outputParameters": [],
            "result": [
              {
                "name": "data",
                "showMessageWithNext": 0,
                "message": "message.ajax.state.success",
                "senderId": "afterTableModelingSaveSuccess"
              }
            ]
          },
          {
            "id": "public_modeling",
            "url": "resource/publish",
            "urlType": "inner",
            "ajaxType": "get",
            "params": [
              {
                "name": "resourceId",
                "type": "item",
                "valueName": "id"
              }
            ],
            "outputParameters": [],
            "result": [
              {
                "name": "data",
                "showMessageWithNext": 0,
                "message": "message.ajax.state.success",
                "senderId": "afterTableModelingSaveSuccess"
              }
            ]
          },
          {
            "id": "public_modeling_data",
            "url": "fixed_data/publish",
            "urlType": "inner",
            "ajaxType": "get",
            "params": [
              {
                "name": "tablenames",
                "type": "item",
                "valueName": "resourceName"
              }
            ],
            "outputParameters": [],
            "result": [
              {
                "name": "data",
                "showMessageWithNext": 0,
                "message": "message.ajax.state.success",
                "senderId": "afterTableModelingSaveSuccess"
              }
            ]
          },



          {
            "id": "cancel_create_modeling",
            "url": "resource/cancelModel",
            "urlType": "inner",
            "ajaxType": "post",
            "params": [
              {
                "name": "id",
                "type": "item",
                "valueName": "id"
              }
            ],
            "outputParameters": [],
            "result": [
              {
                "name": "data",
                "showMessageWithNext": 0,
                "message": "message.ajax.state.success",
                "senderId": "afterTableModelingSaveSuccess"
              }
            ]
          },
          {
            "id": "delete_data_table",
            "url": "resource/delete",
            "urlType": "inner",
            "ajaxType": "delete",
            "params": [
              {
                "name": "ids",
                "type": "item",
                "valueName": "id"
              }
            ],
            "outputParameters": [],
            "result": [
              {
                "name": "data",
                "showMessageWithNext": 0,
                "message": "message.ajax.state.success",
                "senderId": "afterTableDeleteSuccess"
              }
            ]
          }
        ],
        "beforeTrigger": [],
        "afterTrigger": []
      }
    ]
  }

  @ViewChild('page', { static: true }) public page: CnPageComponent;



  public after(target, method, advice) {
    const original = target[method];
    target[method] = (...args) => {
      original.apply(target, args) && advice(this, args);
    };
    return target;
  }

  writeLogInfo(that?, arguments1?) {

    let add_data = {
      label: arguments1[0]['descName'],
      value: arguments1[0]['resourceName']
    }

    console.log('xxxxxxxxxxxxxx', that, arguments1, that.tag.addSingleNode(add_data));
  }

  zhuceEvent() {
    // componentDataService
    let dd = this.page.componentDataService.componentInstance['pop_view_data_table']['instance'];
    //   this.after(dd, 'setSelectRow', this.writeLogInfo);
    let tag = this.page.componentDataService.componentInstance['BAxdPtAm5Gbzipe3DFRjhbtRcysySoIrlG5C']['instance'];

    console.log('选中资源信息：', tag['nodeList']);
    //nodeList
  }



}
