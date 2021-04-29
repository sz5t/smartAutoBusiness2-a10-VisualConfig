import { Component, Inject, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { CnComponentBase } from '../../../cn-component.base';
import { CnDataFormComponent } from '../../../data-form/cn-data-form.component';

@Component({
  selector: 'app-cn-flow-attr-setting',
  templateUrl: './cn-flow-attr-setting.component.html',
  styles: [
    `.toolbarGroup {
      margin-right:8px;
      float:right;
    }
    .table-operations {
      padding-top: 3px;
      padding-bottom: 3px;
   }

   .table-operations .ant-btn-group {
       margin-right: 4px;
       margin-bottom: 2px;
       font-weight: 600;
   }
    `
  ]
})
export class CnFlowAttrSettingComponent extends CnComponentBase implements OnInit {
  @Input() public config;
  @Input() public changeValue;
  @Input() public tempData;
  @Input() public initData;
  @Input() public dialog;
  @Input() public enableCustomFooter;

  // @ViewChild('settingform', { static: true }) public settingform: CnDataFormComponent;
  @ViewChildren(CnDataFormComponent) sons: QueryList<CnDataFormComponent>;
  constructor(@Inject(BSN_COMPONENT_SERVICES)
  public componentService: ComponentServiceProvider,) {
    super(componentService);
  }

  ngOnInit(): void {

    if (this.initData) {
      this.initValue = this.initData;
    } else {
      this.initValue = {};
    }
    if (this.tempData) {
      this.tempValue = this.tempData;
    } else {
      this.tempValue = {};
    }
    this.setChangeValue(this.changeValue);

    console.log('==========>>>>>', this.tempValue);
    // nodeType: "开始节点"

    this.config.panels.forEach(item => {
      if (this.switchPanel(item.component)) {
        item['hidden'] = false;
      } else {
        item['hidden'] = true;
      }
    })

  }
  public setChangeValue(ChangeValues?) {
    console.log('changeValue', ChangeValues);
    // const ChangeValues = [{ name: "", value: "", valueTo: "" }];
    if (ChangeValues && ChangeValues.length > 0) {
      ChangeValues.forEach((p) => {
        switch (p.valueTo) {
          case 'tempValue':
            this.tempValue[p.name] = p.value;
            break;
          case 'initValue':
            this.initValue[p.name] = p.value;
            break;
          case 'staticComponentValue':
            this.staticComponentValue[p.name] = p.value;
            break;
        }
      });
    }
  }



  config_liu = {
    "id": "001",
    "panels": [    // 定义出当前容器内的页面
      {
        "id": "panel_bese",
        active: true,
        disabled: false,
        hidden: false,
        name: '基本属性',
        component: {
          "id": "form_bese",
          "type": "default"
        }
      },
      {
        "id": "panel_task",
        active: true,
        hidden: false,
        disabled: true,
        name: '任务节点设置',
        component: {
          id: "form_task",
          "type": "condition",
          "caseValue": {
            "type": "tempValue",
            "valueName": "nodeType",
            "regular": "^任务节点$",
            "value": ""
          }
        }
      },
      {
        "id": "panel_begin",
        active: true,
        hidden: false,
        disabled: false,
        name: '开始节点设置',
        component: {
          id: "form_begin",
          "type": "condition",
          "caseValue": {
            "type": "tempValue",
            "valueName": "nodeType",
            "regular": "^开始节点$",
            "value": ""
          }
        }
      },
      {
        "id": "panel_edge",
        active: true,
        hidden: false,
        disabled: false,
        name: '连线设置',
        component: {
          id: "form_edge",
          "type": "condition",
          "caseValue": {
            "type": "tempValue",
            "valueName": "nodeType",
            "regular": "^连线$",
            "value": ""
          }
        }
      }
    ]
  }

  componentJson = {
    "form_bese": {
      "id": "form_bese",
      "type": "form",
      "component": "form",
      "state": "text",
      "enableLoadStaticData": true,
      "staticDataConfig": {
        "name": "data",
        "type": "tempValue",
        "valueName": "base_attr_data"
      },
      "loadingConfig": {
        "id": "loadform"
      },
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
                "id": "ioj0m3",
                "col": "cc",
                "type": "col",
                "title": "列ioj0m3",
                "span": 24,
                "layoutContain": "input",
                "size": {
                  "nzXs": 24,
                  "nzSm": 24,
                  "nzMd": 24,
                  "nzLg": 24,
                  "ngXl": 24,
                  "nzXXl": 24
                },
                "control": {
                  "id": "001"
                }
              },
              {
                "id": "ioj0mV",
                "col": "cc",
                "type": "col",
                "title": "列ioj0mV",
                "span": 24,
                "layoutContain": "input",
                "size": {
                  "nzXs": 24,
                  "nzSm": 24,
                  "nzMd": 24,
                  "nzLg": 24,
                  "ngXl": 24,
                  "nzXXl": 24
                },
                "control": {
                  "id": "004"
                }
              },
              {
                "id": "foj0dV",
                "col": "cc",
                "type": "col",
                "title": "列ioj0mV",
                "span": 24,
                "layoutContain": "input",
                "size": {
                  "nzXs": 24,
                  "nzSm": 24,
                  "nzMd": 24,
                  "nzLg": 24,
                  "ngXl": 24,
                  "nzXXl": 24
                },
                "control": {
                  "id": "003"
                }
              }
            ]
          }
        ]
      },
      "formControls": [
        {
          "id": "001",
          "hidden": true,
          "title": "id",
          "titleConfig": {
            "required": false
          },
          "field": "id",
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
            "span": 14,
            "nzXs": 14,
            "nzSm": 14,
            "nzMd": 14,
            "nzLg": 14,
            "ngXl": 14,
            "nzXXl": 14
          },
          "state": "text",
          "text": {
            "type": "label",
            "field": "id"
          },
          "editor": {
            "type": "label",
            "field": "id"
          }
        },
        {
          "id": "003",
          "hidden": true,
          "title": "名称",
          "titleConfig": {
            "required": false
          },
          "field": "text",
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
            "span": 14,
            "nzXs": 14,
            "nzSm": 14,
            "nzMd": 14,
            "nzLg": 14,
            "ngXl": 14,
            "nzXXl": 14
          },
          "state": "text",
          "text": {
            "type": "label",
            "field": "text"
          },
          "editor": {
            "field": "text",
            "type": "input",
            "placeholder": "节点名称",
          }
        },
        {
          "id": "004",
          "hidden": true,
          "title": "类型",
          "titleConfig": {
            "required": false
          },
          "field": "nodeType",
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
            "span": 14,
            "nzXs": 14,
            "nzSm": 14,
            "nzMd": 14,
            "nzLg": 14,
            "ngXl": 14,
            "nzXXl": 14
          },
          "state": "text",
          "text": {
            "type": "label",
            "field": "nodeType"
          },
          "editor": {
            "field": "nodeType",
            "type": "label",
            "placeholder": "节点名称",
          }
        }
      ],
      "formControlsPermissions": [
        {
          "formState": "text",
          "isLoad": true,
          "Controls": [
            {
              "id": "001",
              "state": "text",
              "hidden": false,
              "readOnly": false
            },
            {
              "id": "003",
              "state": "edit",
              "hidden": false,
              "readOnly": false
            },
            {
              "id": "004",
              "state": "edit",
              "hidden": false,
              "readOnly": false
            }

          ]
        }
      ],
      "ajaxConfig": [
        {
          "id": "loadform",
          "url": "resource/GET_DEPARTMENT_DTL/query",
          "urlType": "inner",
          "ajaxType": "get",
          "params": [
            {
              "name": "ID",
              "type": "tempValue",
              "valueName": "PID",
              "value": "-999"
            }
          ],
          "outputParameters": [],
          "result": []
        }
      ],
      "cascade": {
        "messageSender": [],
        "messageReceiver": [
        ]
      },
      "cascadeValue": []

    },
    "form_task": {
      "id": "form_task",
      "type": "form",
      "component": "form",
      "state": "text",
      "loadingConfig": {
        "id": "loadform"
      },
      "enableLoadStaticData": true,
      "staticDataConfig": {
        "name": "data",
        "type": "tempValue",
        "valueName": "base_setting_data"
      },
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
                "id": "ioj0mV",
                "col": "cc",
                "type": "col",
                "title": "列ioj0mV",
                "span": 24,
                "layoutContain": "input",
                "size": {
                  "nzXs": 24,
                  "nzSm": 24,
                  "nzMd": 24,
                  "nzLg": 24,
                  "ngXl": 24,
                  "nzXXl": 24
                },
                "control": {
                  "id": "003"
                }
              },
              {
                "id": "ioj0mV",
                "col": "cc",
                "type": "col",
                "title": "列ioj0mV",
                "span": 24,
                "layoutContain": "input",
                "size": {
                  "nzXs": 24,
                  "nzSm": 24,
                  "nzMd": 24,
                  "nzLg": 24,
                  "ngXl": 24,
                  "nzXXl": 24
                },
                "control": {
                  "id": "004"
                }
              },
              {
                "id": "ioj0mV",
                "col": "cc",
                "type": "col",
                "title": "列ioj0mV",
                "span": 24,
                "layoutContain": "input",
                "size": {
                  "nzXs": 24,
                  "nzSm": 24,
                  "nzMd": 24,
                  "nzLg": 24,
                  "ngXl": 24,
                  "nzXXl": 24
                },
                "control": {
                  "id": "005"
                }
              },
              {
                "id": "ioj0mV",
                "col": "cc",
                "type": "col",
                "title": "列ioj0mV",
                "span": 24,
                "layoutContain": "input",
                "size": {
                  "nzXs": 24,
                  "nzSm": 24,
                  "nzMd": 24,
                  "nzLg": 24,
                  "ngXl": 24,
                  "nzXXl": 24
                },
                "control": {
                  "id": "006"
                }
              },
              {
                "id": "iod0mV",
                "col": "cc",
                "type": "col",
                "title": "列ioj0mV",
                "span": 24,
                "layoutContain": "input",
                "size": {
                  "nzXs": 24,
                  "nzSm": 24,
                  "nzMd": 24,
                  "nzLg": 24,
                  "ngXl": 24,
                  "nzXXl": 24
                },
                "control": {
                  "id": "007"
                }
              },
              {
                "id": "ioj0dV",
                "col": "cc",
                "type": "col",
                "title": "列ioj0mV",
                "span": 24,
                "layoutContain": "input",
                "size": {
                  "nzXs": 24,
                  "nzSm": 24,
                  "nzMd": 24,
                  "nzLg": 24,
                  "ngXl": 24,
                  "nzXXl": 24
                },
                "control": {
                  "id": "008"
                }
              },
              {
                "id": "i3j0dV",
                "col": "cc",
                "type": "col",
                "title": "列ioj0mV",
                "span": 24,
                "layoutContain": "input",
                "size": {
                  "nzXs": 24,
                  "nzSm": 24,
                  "nzMd": 24,
                  "nzLg": 24,
                  "ngXl": 24,
                  "nzXXl": 24
                },
                "control": {
                  "id": "009"
                }
              }
            ]
          }
        ]
      },
      "formControls": [
        {
          "id": "001",
          "hidden": true,
          "title": "ID",
          "titleConfig": {
            "required": false
          },
          "field": "ID",
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
            "span": 14,
            "nzXs": 14,
            "nzSm": 14,
            "nzMd": 14,
            "nzLg": 14,
            "ngXl": 14,
            "nzXXl": 14
          },
          "state": "text",
          "text": {
            "type": "label",
            "field": "ID"
          },
          "editor": {
            "type": "label",
            "field": "ID"
          }
        },
        {
          "id": "003",
          "hidden": true,
          "title": "审批用户类型",
          "titleConfig": {
            "required": false
          },
          "field": "CKTYPE",
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
            "span": 14,
            "nzXs": 14,
            "nzSm": 14,
            "nzMd": 14,
            "nzLg": 14,
            "ngXl": 14,
            "nzXXl": 14
          },
          "state": "text",
          "text": {
            "type": "label",
            "field": "CKTYPE"
          },
          "editor": {
            "type": "select",
            "field": "CKTYPE",
            "options": [
              {
                "label": "人员",
                "value": 0,
                "disabled": false
              },
              {
                "label": "角色",
                "value": 1,
                "disabled": false
              },
              {
                "label": "部门",
                "value": 2,
                "disabled": false
              }
            ],
            "showSearch": false,
            "serverSearch": false
          }
        },
        {
          "id": "004",
          "hidden": true,
          "title": "审批人",
          "titleConfig": {
            "required": false
          },
          "field": "APPROVERS",
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
            "span": 14,
            "nzXs": 14,
            "nzSm": 14,
            "nzMd": 14,
            "nzLg": 14,
            "ngXl": 14,
            "nzXXl": 14
          },
          "state": "text",
          "text": {
            "type": "label",
            "field": "APPROVERS"
          },
          "editor": {
            "type": "input",
            "field": "APPROVERS",
            "placeholder": "审批人员",
          }
        },
        {
          "id": "005",
          "hidden": true,
          "title": "审批角色",
          "titleConfig": {
            "required": false
          },
          "field": "CKTYPEI",
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
            "span": 14,
            "nzXs": 14,
            "nzSm": 14,
            "nzMd": 14,
            "nzLg": 14,
            "ngXl": 14,
            "nzXXl": 14
          },
          "state": "text",
          "text": {
            "type": "label",
            "field": "CKTYPEI"
          },
          "editor": {
            "type": "select",
            "field": "CKTYPEI",
            "placeholder": "审批角色",
            "labelName": "SIR_NAME",
            "valueName": "SIR_CODE",
            "showSearch": false,
            "serverSearch": false,
            "loadingConfig": {
              "id": "loadformselectRole"
            }

          }
        },
        {
          "id": "006",
          "hidden": true,
          "title": "审批部门",
          "titleConfig": {
            "required": false
          },
          "field": "APPROVALORG",
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
            "span": 14,
            "nzXs": 14,
            "nzSm": 14,
            "nzMd": 14,
            "nzLg": 14,
            "ngXl": 14,
            "nzXXl": 14
          },
          "state": "text",
          "text": {
            "type": "label",
            "field": "APPROVALORG"
          },
          "editor": {
            "type": "treeSelect",
            "field": "APPROVALORG",
            "placeholder": "审批部门",
            "asyncData": false,  // 是否异步 默认是false
            "keyId": "ID",
            "loadingConfig": {
              "id": "loadformselectDept"
            },
            "columns": [
              {
                "title": "ID",
                "type": "key",
                "field": "ID"
              },
              {
                "title": "PARENT_ID",
                "type": "parentId",
                "field": "PARENT_ID"
              },
              {
                "title": "NAME",
                "type": "title",
                "field": "NAME"
              }
            ]
          }
        },
        {
          "id": "007",
          "hidden": true,
          "title": "会签策略",
          "titleConfig": {
            "required": false
          },
          "field": "SIGNTACTICS",
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
            "span": 14,
            "nzXs": 14,
            "nzSm": 14,
            "nzMd": 14,
            "nzLg": 14,
            "ngXl": 14,
            "nzXXl": 14
          },
          "state": "text",
          "text": {
            "type": "label",
            "field": "SIGNTACTICS"
          },
          "editor": {
            "type": "select",
            "field": "SIGNTACTICS",
            "options": [
              {
                "label": "不会签",
                "value": 1,
                "disabled": false
              },
              {
                "label": "会签",
                "value": 2,
                "disabled": false
              }
            ],
            "showSearch": false,
            "serverSearch": false
          }
        },
        {
          "id": "008",
          "hidden": true,
          "title": "审批策略",
          "titleConfig": {
            "required": false
          },
          "field": "APPROVALTACTICS",
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
            "span": 14,
            "nzXs": 14,
            "nzSm": 14,
            "nzMd": 14,
            "nzLg": 14,
            "ngXl": 14,
            "nzXXl": 14
          },
          "state": "text",
          "text": {
            "type": "label",
            "field": "APPROVALTACTICS"
          },
          "editor": {
            "type": "select",
            "field": "APPROVALTACTICS",

            "options": [
              {
                "label": "单人通过",
                "value": 1,
                "disabled": false
              },
              {
                "label": "全员通过",
                "value": 2,
                "disabled": false
              },
              {
                "label": "按照比例通过",
                "value": 3,
                "disabled": false
              }
            ],
            "showSearch": false,
            "serverSearch": false
          }
        },
        {
          "id": "009",
          "hidden": true,
          "title": "策略百分比",
          "titleConfig": {
            "required": false
          },
          "field": "APPROVALNUM",
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
            "span": 14,
            "nzXs": 14,
            "nzSm": 14,
            "nzMd": 14,
            "nzLg": 14,
            "ngXl": 14,
            "nzXXl": 14
          },
          "state": "text",
          "text": {
            "type": "label",
            "field": "APPROVALNUM"
          },
          "editor": {
            "type": "input",
            "field": "APPROVALNUM",
            "placeholder": "策略百分比",
          }
        }



      ],
      "formControlsPermissions": [
        {
          "formState": "text",
          "isLoad": true,
          "Controls": [
            {
              "id": "001",
              "state": "edit",
              "hidden": false,
              "readOnly": false
            },
            {
              "id": "003",
              "state": "edit",
              "hidden": false,
              "readOnly": false
            },
            {
              "id": "004",
              "state": "edit",
              "hidden": false,
              "readOnly": false
            },
            {
              "id": "005",
              "state": "edit",
              "hidden": false,
              "readOnly": false
            },
            {
              "id": "006",
              "state": "edit",
              "hidden": false,
              "readOnly": false
            },
            {
              "id": "007",
              "state": "edit",
              "hidden": false,
              "readOnly": false
            },
            {
              "id": "008",
              "state": "edit",
              "hidden": false,
              "readOnly": false
            },
            {
              "id": "009",
              "state": "edit",
              "hidden": false,
              "readOnly": false
            }
          ]
        }
      ],
      "ajaxConfig": [
        {
          "id": "loadform",
          "url": "resource/GET_DEPARTMENT_DTL/query",
          "urlType": "inner",
          "ajaxType": "get",
          "params": [
            {
              "name": "ID",
              "type": "tempValue",
              "valueName": "PID",
              "value": "-999"
            }
          ],
          "outputParameters": [],
          "result": []
        },
        {
          "id": "loadformselectRole",
          "url": "resource/SMT_IMP_ROLE/query",
          "urlType": "inner",
          "ajaxType": "get",
          "params": [
          ]
        },
        {
          "id": "loadformselectDept",
          "url": "resource/GET_SYSTEM_DEPT/query",
          "method": "get",
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
              "value": "-1"
            },
            {
              "name": "_pcName",
              "type": "value",
              "value": "PARENT_ID"
            },
            {
              "name": "_sort",
              "type": "value",
              "value": "CREATE_DATE"
            }
          ]
        }
      ],
      "cascade": {
        "messageSender": [],
        "messageReceiver": [
        ]
      },
      "cascadeValue": []

    },
    "form_begin": {
      "id": "form_begin",
      "type": "form",
      "component": "form",
      "state": "text",
      "loadingConfig": {
        "id": "loadform"
      },
      "enableLoadStaticData": true,
      "staticDataConfig": {
        "name": "data",
        "type": "tempValue",
        "valueName": "base_setting_data_begin"
      },
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
                "id": "ioj0mV",
                "col": "cc",
                "type": "col",
                "title": "列ioj0mV",
                "span": 24,
                "layoutContain": "input",
                "size": {
                  "nzXs": 24,
                  "nzSm": 24,
                  "nzMd": 24,
                  "nzLg": 24,
                  "ngXl": 24,
                  "nzXXl": 24
                },
                "control": {
                  "id": "003"
                }
              },
              {
                "id": "ioj0mV",
                "col": "cc",
                "type": "col",
                "title": "列ioj0mV",
                "span": 24,
                "layoutContain": "input",
                "size": {
                  "nzXs": 24,
                  "nzSm": 24,
                  "nzMd": 24,
                  "nzLg": 24,
                  "ngXl": 24,
                  "nzXXl": 24
                },
                "control": {
                  "id": "004"
                }
              },
              {
                "id": "ioj0mV",
                "col": "cc",
                "type": "col",
                "title": "列ioj0mV",
                "span": 24,
                "layoutContain": "input",
                "size": {
                  "nzXs": 24,
                  "nzSm": 24,
                  "nzMd": 24,
                  "nzLg": 24,
                  "ngXl": 24,
                  "nzXXl": 24
                },
                "control": {
                  "id": "005"
                }
              },
              {
                "id": "ioj0mV",
                "col": "cc",
                "type": "col",
                "title": "列ioj0mV",
                "span": 24,
                "layoutContain": "input",
                "size": {
                  "nzXs": 24,
                  "nzSm": 24,
                  "nzMd": 24,
                  "nzLg": 24,
                  "ngXl": 24,
                  "nzXXl": 24
                },
                "control": {
                  "id": "006"
                }
              }

            ]
          }
        ]
      },
      "formControls": [
        {
          "id": "001",
          "hidden": true,
          "title": "ID",
          "titleConfig": {
            "required": false
          },
          "field": "ID",
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
            "span": 14,
            "nzXs": 14,
            "nzSm": 14,
            "nzMd": 14,
            "nzLg": 14,
            "ngXl": 14,
            "nzXXl": 14
          },
          "state": "text",
          "text": {
            "type": "label",
            "field": "ID"
          },
          "editor": {
            "type": "label",
            "field": "ID"
          }
        },
        {
          "id": "003",
          "hidden": true,
          "title": "审批类型",
          "titleConfig": {
            "required": false
          },
          "field": "TYSE_RESOUCE_TYPE",
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
            "span": 14,
            "nzXs": 14,
            "nzSm": 14,
            "nzMd": 14,
            "nzLg": 14,
            "ngXl": 14,
            "nzXXl": 14
          },
          "state": "text",
          "text": {
            "type": "label",
            "field": "TYSE_RESOUCE_TYPE"
          },
          "editor": {
            "type": "select",
            "field": "TYSE_RESOUCE_TYPE",
            "options": [
              {
                "label": "表单审批",
                "value": 1,
                "disabled": false
              },
              {
                "label": "业务数据审批",
                "value": 2,
                "disabled": false
              }
            ],
            "showSearch": false,
            "serverSearch": false
          }
        },
        {
          "id": "004",
          "hidden": true,
          "title": "关联模块",
          "titleConfig": {
            "required": false
          },
          "field": "TYSE_PROCESS_TYPE",
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
            "span": 14,
            "nzXs": 14,
            "nzSm": 14,
            "nzMd": 14,
            "nzLg": 14,
            "ngXl": 14,
            "nzXXl": 14
          },
          "state": "text",
          "text": {
            "type": "label",
            "field": "TYSE_PROCESS_TYPE"
          },
          "editor": {
            "type": "treeSelect",
            "field": "TYSE_PROCESS_TYPE",
            "placeholder": "关联模块",
            "asyncData": false,  // 是否异步 默认是false
            "keyId": "ID",
            "loadingConfig": {
              "id": "loadformselectMenu"
            },
            "columns": [
              {
                "title": "ID",
                "type": "key",
                "field": "ID"
              },
              {
                "title": "PID",
                "type": "parentId",
                "field": "PID"
              },
              {
                "title": "NAME",
                "type": "title",
                "field": "NAME"
              }
            ]
          }
        },
        {
          "id": "005",
          "hidden": true,
          "title": "关联页面json",
          "titleConfig": {
            "required": false
          },
          "field": "TYSE_RESOUCE_JSON",
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
            "span": 14,
            "nzXs": 14,
            "nzSm": 14,
            "nzMd": 14,
            "nzLg": 14,
            "ngXl": 14,
            "nzXXl": 14
          },
          "state": "text",
          "text": {
            "type": "label",
            "field": "TYSE_RESOUCE_JSON"
          },
          "editor": {
            "type": "treeSelect",
            "field": "TYSE_RESOUCE_JSON",
            "placeholder": "请输入",
            "asyncData": true,
            "keyId": "ID",
            "loadingConfig": {
              "id": "loadPageTree"
            },
            "expandConfig": {
              "id": "loadPageTreeExpand"
            },
            "loadingItemConfig": {
              "id": "loadMenuPageitem"
            },
            "columns": [
              {
                "title": "ID",
                "type": "key",
                "field": "ID"
              },
              {
                "title": "PID",
                "type": "parentId",
                "field": "PID"
              },
              {
                "title": "NAME",
                "type": "title",
                "field": "NAME"
              }
            ]

          }
        },
        {
          "id": "006",
          "hidden": true,
          "title": "关联API",
          "titleConfig": {
            "required": false
          },
          "field": "TYSE_MODULE_API",
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
            "span": 14,
            "nzXs": 14,
            "nzSm": 14,
            "nzMd": 14,
            "nzLg": 14,
            "ngXl": 14,
            "nzXXl": 14
          },
          "state": "text",
          "text": {
            "type": "label",
            "field": "TYSE_MODULE_API"
          },
          "editor": {
            "type": "input",
            "field": "TYSE_MODULE_API",
            "placeholder": "关联API"
          }
        }



      ],
      "formControlsPermissions": [
        {
          "formState": "text",
          "isLoad": true,
          "Controls": [
            {
              "id": "001",
              "state": "edit",
              "hidden": false,
              "readOnly": false
            },
            {
              "id": "003",
              "state": "edit",
              "hidden": false,
              "readOnly": false
            },
            {
              "id": "004",
              "state": "edit",
              "hidden": false,
              "readOnly": false
            },
            {
              "id": "005",
              "state": "edit",
              "hidden": false,
              "readOnly": false
            },
            {
              "id": "006",
              "state": "edit",
              "hidden": false,
              "readOnly": false
            }
          ]
        }
      ],
      "ajaxConfig": [

        {
          "id": "loadformselectMenu",
          "url": "resource/GET_SYS_MENU_TREE/query",
          "method": "get",
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
              "value": "-1"
            },
            {
              "name": "_pcName",
              "type": "value",
              "value": "PID"
            }
          ]
        },
        {
          "id": "loadMenuPageitem",
          "url": "resource/GET_SMT_PAGE_LAYOUT_TREE/query",
          "urlType": "inner",
          "ajaxType": "get",
          "params": [
            {
              "name": "ID",
              "type": "componentValue",
              "valueName": "value"
            }
          ],
          "outputParameters": [],
          "result": []
        },
        {
          "id": "loadPageTree",
          "url": "resource/GET_SMT_PAGE_LAYOUT_TREE/query",
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
          "id": "loadPageTreeExpand",
          "url": "resource/GET_SMT_PAGE_LAYOUT_TREE/query",
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
            },
            {
              "name": "_root.PID",
              "type": "item",
              "valueName": "key"
            }
          ],
          "outputParameters": [],
          "result": []
        },
        {
          "id": "loadMenuPageTree",
          "url": "resource/GET_MENU_PAGE_TREE/query",
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
              "value": "-1"
            },
            {
              "name": "_pcName",
              "type": "value",
              "value,": "PARENT_ID"
            },
            {
              "name": "_root.MENU_ID",
              "type": "tempValue",
              "valueName": "MENU_ID"
            }
          ],
          "outputParameters": [],
          "result": []
        }
      ],
      "cascade": {
        "messageSender": [],
        "messageReceiver": [
        ]
      },
      "cascadeValue": []

    },
    "form_edge": {
      "id": "form_edge",
      "type": "form",
      "component": "form",
      "state": "text",
      "loadingConfig": {
        "id": "loadform"
      },
      "enableLoadStaticData": true,
      "staticDataConfig": {
        "name": "data",
        "type": "tempValue",
        "valueName": "base_setting_data_edge"
      },
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
                "id": "ioj0mV",
                "col": "cc",
                "type": "col",
                "title": "列ioj0mV",
                "span": 24,
                "layoutContain": "input",
                "size": {
                  "nzXs": 24,
                  "nzSm": 24,
                  "nzMd": 24,
                  "nzLg": 24,
                  "ngXl": 24,
                  "nzXXl": 24
                },
                "control": {
                  "id": "003"
                }
              },
              {
                "id": "ioj0mV",
                "col": "cc",
                "type": "col",
                "title": "列ioj0mV",
                "span": 24,
                "layoutContain": "input",
                "size": {
                  "nzXs": 24,
                  "nzSm": 24,
                  "nzMd": 24,
                  "nzLg": 24,
                  "ngXl": 24,
                  "nzXXl": 24
                },
                "control": {
                  "id": "004"
                }
              },
              {
                "id": "ioj0mV",
                "col": "cc",
                "type": "col",
                "title": "列ioj0mV",
                "span": 24,
                "layoutContain": "input",
                "size": {
                  "nzXs": 24,
                  "nzSm": 24,
                  "nzMd": 24,
                  "nzLg": 24,
                  "ngXl": 24,
                  "nzXXl": 24
                },
                "control": {
                  "id": "005"
                }
              },
              {
                "id": "ioj0mV",
                "col": "cc",
                "type": "col",
                "title": "列ioj0mV",
                "span": 24,
                "layoutContain": "input",
                "size": {
                  "nzXs": 24,
                  "nzSm": 24,
                  "nzMd": 24,
                  "nzLg": 24,
                  "ngXl": 24,
                  "nzXXl": 24
                },
                "control": {
                  "id": "006"
                }
              }

            ]
          }
        ]
      },
      "formControls": [
        {
          "id": "001",
          "hidden": true,
          "title": "ID",
          "titleConfig": {
            "required": false
          },
          "field": "ID",
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
            "span": 14,
            "nzXs": 14,
            "nzSm": 14,
            "nzMd": 14,
            "nzLg": 14,
            "ngXl": 14,
            "nzXXl": 14
          },
          "state": "text",
          "text": {
            "type": "label",
            "field": "ID"
          },
          "editor": {
            "type": "label",
            "field": "ID"
          }
        },
        {
          "id": "003",
          "hidden": true,
          "title": "前置条件",
          "titleConfig": {
            "required": false
          },
          "field": "WHERESTR",
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
            "span": 14,
            "nzXs": 14,
            "nzSm": 14,
            "nzMd": 14,
            "nzLg": 14,
            "ngXl": 14,
            "nzXXl": 14
          },
          "state": "text",
          "text": {
            "type": "label",
            "field": "WHERESTR"
          },
          "editor": {
            "type": "input",
            "field": "WHERESTR",
            "placeholder": "前置条件"
          }
        },
        {
          "id": "004",
          "hidden": true,
          "title": "前置条件状态",
          "titleConfig": {
            "required": false
          },
          "field": "WHERTSTATE",
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
            "span": 14,
            "nzXs": 14,
            "nzSm": 14,
            "nzMd": 14,
            "nzLg": 14,
            "ngXl": 14,
            "nzXXl": 14
          },
          "state": "text",
          "text": {
            "type": "label",
            "field": "WHERTSTATE"
          },
          "editor": {
            "type": "input",
            "field": "WHERTSTATE",
            "displayType": "number",
            "placeholder": "前置条件状态"

          }
        },
        {
          "id": "005",
          "hidden": true,
          "title": "启用前置条件",
          "titleConfig": {
            "required": false
          },
          "field": "WHERETACTICS",
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
            "span": 14,
            "nzXs": 14,
            "nzSm": 14,
            "nzMd": 14,
            "nzLg": 14,
            "ngXl": 14,
            "nzXXl": 14
          },
          "state": "text",
          "text": {
            "type": "label",
            "field": "WHERETACTICS"
          },
          "editor": {
            "type": "select",
            "field": "WHERETACTICS",
            "options": [
              {
                "label": "启用",
                "value": 1,
                "disabled": false
              },
              {
                "label": "无条件通过",
                "value": 2,
                "disabled": false
              }
            ],
            "showSearch": false,
            "serverSearch": false
          }
        }



      ],
      "formControlsPermissions": [
        {
          "formState": "text",
          "isLoad": true,
          "Controls": [
            {
              "id": "001",
              "state": "edit",
              "hidden": false,
              "readOnly": false
            },
            {
              "id": "003",
              "state": "edit",
              "hidden": false,
              "readOnly": false
            },
            {
              "id": "004",
              "state": "edit",
              "hidden": false,
              "readOnly": false
            },
            {
              "id": "005",
              "state": "edit",
              "hidden": false,
              "readOnly": false
            }
          ]
        }
      ],
      "ajaxConfig": [
      ],
      "cascade": {
        "messageSender": [],
        "messageReceiver": [
        ]
      },
      "cascadeValue": []

    }

  }



  switchPanel(item?) {

    let regularflag = true;
    if (item.caseValue && item.type === 'condition') {
      const reg1 = new RegExp(item.caseValue.regular);
      let regularData;
      if (item.caseValue.type) {
        if (item.caseValue.type === 'tempValue') {
          regularData = this.tempValue[item.caseValue.valueName];
        }
        if (item.caseValue.type === 'initValue') {
          regularData = this.initValue[item.caseValue.valueName];
        }
      } else {
        regularData = '';
      }
      regularflag = reg1.test(regularData);
      // 满足正则表达
    }

    return regularflag;
  }

  public getComponentValues() {

    // 页面构成，分块组合（组件、目前嵌套布局后不能获取到组件值）

    // 获取当前页组件集合

    // ？ 如何通过动态配置获取，渲染组件内容


    // 配置描述属性结构
    let structure = {
      dataType: "object",
      name: '',
      Description: "描述",
      attribute: { // 属性描述

      },
      constraint: { // 约束

      }

    }


  }


  public test_to_dialog() {
    this.ajax_liu();
    console.log(this.dialog);
  }


  /**
   * d_close
   */
  public d_close() {
    this.dialog['setting_dialog'].close();
  }




}
