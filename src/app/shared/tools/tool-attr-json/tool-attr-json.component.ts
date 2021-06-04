import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CnDataFormComponent } from '../../components/data-form/cn-data-form.component';

@Component({
  selector: 'app-tool-attr-json',
  templateUrl: './tool-attr-json.component.html',
  styles: [
  ]
})
export class ToolAttrJsonComponent implements OnInit {
  @ViewChild('settingform', { static: true }) public settingform: CnDataFormComponent;
  constructor(private modal: NzModalService, private message: NzMessageService) { }

  fromDataService: any;
  ngOnInit(): void {
  }


  changeValue = [
    {
      name: 'layout_version_pagejson',
      type: 'tempValue',
      valueName: 'layout_version_pagejson',
      value: '{}',
      valueTo: 'tempValue'
    }
  ]

  formConfig = {
    "id": "form_city",
    "type": "form",
    "component": "form",
    "state": "text",
    "enableLoadStaticData": true, // 是否启用静态数据【启用静态数据，则不执行ajax加载数据】
    "staticDataConfig": {
      "name": "data", //-- name是data 固定写法
      "type": "tempValue",
      "valueName": "layout_version_pagejson"
    },
    "loadingConfig": {
      "id": "loadform"
    },
    "formLayout": {
      "id": "b86s2i11",
      "type": "layout",
      "title": "表单布局b86s2i",
      "rows": [
        {
          "id": "MefhXa",
          "type": "row",
          "cols": [
            {
              "id": "iHspYn",
              "col": "cc",
              "type": "col",
              "title": "列iHspYn",
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
                "id": "layout_version_pagejson"
              }
            }
          ]
        }
      ]
    },
    "formControls": [
      {
        "id": "layout_version_pagejson",
        "hidden": true,
        "title": "版本页面json",
        "titleConfig": {
          "required": true
        },
        "field": "PAGE_JSON",
        "labelSize": {
          "span": 6,
          "nzXs": {
            "span": 6
          },
          "nzSm": {
            "span": 6
          },
          "nzMd": {
            "span": 6
          },
          "nzLg": {
            "span": 6
          },
          "ngXl": {
            "span": 6
          },
          "nzXXl": {
            "span": 6
          }
        },
        "controlSize": {
          "span": 18,
          "nzXs": 18,
          "nzSm": 18,
          "nzMd": 18,
          "nzLg": 18,
          "ngXl": 18,
          "nzXXl": 18
        },
        "state": "edit",
        "text": {
          "type": "codeEdit",
          "field": "PAGE_JSON",
          "autofocus": false,
          "mode": "text/javascript",
          "readOnly": true,
          "height": 650
        },
        "editor": {
          "type": "codeEdit",
          "field": "PAGE_JSON",
          "mode": "text/javascript",
          "placeholder": "请输入",
          "autofocus": true,
          "readOnly": false,
          "height": 650,
          "nzWidth": "100%",
          "width": "100%"
        }
      }
    ],
    "formControlsPermissions": [
      {
        "formState": "new",
        "formStateContent": {
          "isLoad": false,
          "loadAjax": {},
          "isDefault": true,
          "defaultComponentValue": {

          }
        },
        "Controls": [
          {
            "id": "layout_version_pagejson",
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
            "id": "layout_version_pagejson",
            "state": "edit",
            "hidden": false,
            "readOnly": false
          }
        ]
      },
      {
        "formState": "text",
        "Controls": [
          {
            "id": "layout_version_pagejson",
            "state": "edit",
            "hidden": false,
            "readOnly": false
          }
        ]
      }
    ],
    "ajaxConfig": [
    ]
  }

  CreateLayout() {

    let p = this.settingform.FORM_VALUE['PAGE_JSON'];
    console.log(this.settingform.FORM_VALUE['PAGE_JSON']);
    if (p) {
      let pagejson;
      try {
        pagejson = JSON.parse(p);
        this.load(pagejson);
      } catch (e) {
        // this.createMessage('warning', 'json格式不对');
      }


    }
  }

  attr_typeConent = [];
  attr_config_data = {};
  attr_config;

  load(node?) {


    this.attr_config_data = {};
    this.attr_config = node;
    this.attr_typeConent = this.attr_config['typeConent'].filter(d => d !== '');



    console.log('_sider', this.attr_config, this.attr_config_data);
  }

  createMessage(type: string, messageInfo: string): void {
    this.message.create(type, `${messageInfo}`);
  }

  valueChange(v) {

    console.log('属性编辑器返回', v);
    if (v['backConfig'] && v['backConfig'].length > 0) {

      v['backConfig'].forEach(element => {

        this.attr_config_data[element['name']] = v['data'][element['name']]
      });

    } else {
      this.attr_config_data[v['name']] = v['data'];
    }


    console.log('====组合后====>>>', this.attr_config_data);


  }

  printJson() {
    console.log('====最终====>>>', this.attr_config_data);
  }

}
