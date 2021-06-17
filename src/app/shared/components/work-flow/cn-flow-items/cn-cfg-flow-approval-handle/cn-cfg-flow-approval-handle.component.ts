import { Component, Input, OnInit } from '@angular/core';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';

@Component({
  selector: 'app-cn-cfg-flow-approval-handle',
  templateUrl: './cn-cfg-flow-approval-handle.component.html',
  styles: [
  ],
  providers: [configFormDataServerService]
})
export class CnCfgFlowApprovalHandleComponent implements OnInit {
  @Input() public config;
  @Input() public initData;
  @Input() public dialog;
  @Input() public assign;
  @Input() public settingMore;

  form_process_config;
  sourceData;
  constructor(public fromDataService: configFormDataServerService) { }

  ngOnInit(): void {

    this.fromDataService.initValue = this.initData ? this.initData : {};
    if (!this.form_process_config) {
      if (this.settingMore) {
        this.form_process_config = this.getConfigBydefault_option(this.settingMore);
      } else {
        this.form_process_config = this.getConfigBydefault();
      }

    }
    console.log('处理加载');
  }


  staticFormValueChange(v?) {

    console.log('返回', v);
    if (v['backConfig'] && v['backConfig'].length > 0) {

      v['backConfig'].forEach(element => {

        this.sourceData[element['name']] = v['data'][element['name']]
      });

    } else {
      this.sourceData[v['name']] = v['data'];
    }

    console.log('====static最终====>>>', this.sourceData);

  }

  getConfigBydefault() {
    let form_process_config1 = {
      "type": "staticForm",
      "backName": "title",
      "backConfig": [
        {
          "name": "attitude"
        },
        {
          "name": "suggest"
        },
        {
          "name": "assignedUserIds"
        }
      ],
      "properties": [
        {
          "code": "001",
          "name": "attitude",
          "type": "select",
          "componentConfig": {
            "options": [
              {
                "label": "同意",
                "value": "AGREE"
              },
              {
                "label": "不同意",
                "value": "DISAGREE"
              }
            ],
            "labelName": "label",
            "valueName": "value"
          },
          "formType": "value",
          "formName": "formControlName",
          "validations": [],
          "title": "办理人态度"
        },
        {
          "code": "002",
          "name": "suggest",
          "type": "textarea",
          "componentConfig": {
          },
          "formType": "value",
          "formName": "formControlName",
          "validations": [],
          "title": "办理人意见"
        },
        {
          "code": "003",
          "name": "assignedUserIds",
          "type": "select",
          "hidden": this.assign,
          "hiddenIf": this.assign,
          "componentConfig": {
            "loadingMode": "ajax",
            "ajaxConfig": {
              "id": "load_name",
              "enableAjaxMore": true,
              "url": "/smt-jbpm/task/assignableUser/query",
              "urlType": "inner",
              "ajaxType": "post",
              "headParams": [],
              "pathParams": [
                {
                  "name": "type",
                  "type": "value",
                  "valueName": "",
                  "value": "ASSIGNABLE_USER_EXPRESSION"
                }
              ],
              "queryParams": [],
              "bodyParams": [
                {
                  "name": "$mode$",
                  "type": "value",
                  "valueName": "",
                  "value": "QUERY"
                },
                {
                  "name": "taskinstId",
                  "type": "initValue",
                  "valueName": "taskinstId",
                  "value": ""
                },
                {
                  "name": "buttonType",
                  "type": "initValue",
                  "valueName": "buttonType",
                  "value": ""
                },
                {
                  "name": "target",
                  "type": "initValue",
                  "valueName": "target",
                  "value": ""
                }
              ],
              "enableResultData": true,
              "resultData": {
                "enableResultDataMore": true,
                "resultDataMore": {
                  "name": 'root',
                  "dataProperties": {
                    "dataType": 'object'
                  },
                  "enableGetValue": false,
                  "getValueConfig": {
                    "path": '~',
                  },
                  "defalutValue": {},
                  "objectProperties": {
                    "setProperties": [
                      {
                        "name": 'data',
                        "dataProperties": {
                          "dataType": 'value'
                        },
                        "enableGetValue": true,
                        "getValueConfig": {
                          "path": '~/:data/:users'
                        },
                        "defalutValue": null,
                        "objectProperties": {
                          "setProperties": [
                          ],
                          "removeProperties": [
                          ]
                        },
                        "arrayProperties": [
                        ]
                      }
                    ]
                  }
                }
              }
            },
            "labelName": "NAME",
            "valueName": "ID"

          },
          "formType": "value",
          "formName": "formControlName",
          "validations": [],
          "title": "调度"
        }

      ]
    }
    return form_process_config1;
  }

  getConfigBydefault_option(option?) {
    let form_process_config1 = {
      "type": "staticForm",
      "backName": "title",
      "backConfig": [
        {
          "name": "reason"
        },
        {
          "name": "assignedUserIds"
        }
      ],
      "properties": [
        {
          "code": "002",
          "name": "reason",
          "type": "textarea",
          "hidden": option['reason'],
          "componentConfig": {
          },
          "formType": "value",
          "formName": "formControlName",
          "validations": [],
          "title": "原因"
        },
        {
          "code": "003",
          "name": "assignedUserIds",
          "type": "select",
          "hidden": option['assign'],
          "hiddenIf": option['assign'],
          "componentConfig": {
            "loadingMode": "ajax",
            "ajaxConfig": {
              "id": "load_name",
              "enableAjaxMore": true,
              "url": "/smt-jbpm/task/assignableUser/query",
              "urlType": "inner",
              "ajaxType": "post",
              "headParams": [],
              "pathParams": [
                {
                  "name": "type",
                  "type": "value",
                  "valueName": "",
                  "value": "ASSIGNABLE_USER_EXPRESSION"
                }
              ],
              "queryParams": [],
              "bodyParams": [
                {
                  "name": "$mode$",
                  "type": "value",
                  "valueName": "",
                  "value": "QUERY"
                },
                {
                  "name": "taskinstId",
                  "type": "initValue",
                  "valueName": "taskinstId",
                  "value": ""
                },
                {
                  "name": "buttonType",
                  "type": "initValue",
                  "valueName": "buttonType",
                  "value": ""
                },
                {
                  "name": "target",
                  "type": "initValue",
                  "valueName": "target",
                  "value": ""
                }
              ],
              "enableResultData": true,
              "resultData": {
                "enableResultDataMore": true,
                "resultDataMore": {
                  "name": 'root',
                  "dataProperties": {
                    "dataType": 'object'
                  },
                  "enableGetValue": false,
                  "getValueConfig": {
                    "path": '~',
                  },
                  "defalutValue": {},
                  "objectProperties": {
                    "setProperties": [
                      {
                        "name": 'data',
                        "dataProperties": {
                          "dataType": 'value'
                        },
                        "enableGetValue": true,
                        "getValueConfig": {
                          "path": '~/:data/:users'
                        },
                        "defalutValue": null,
                        "objectProperties": {
                          "setProperties": [
                          ],
                          "removeProperties": [
                          ]
                        },
                        "arrayProperties": [
                        ]
                      }
                    ]
                  }
                }
              }
            },
            "labelName": "NAME",
            "valueName": "ID"

          },
          "formType": "value",
          "formName": "formControlName",
          "validations": [],
          "title": "办理人"
        }

      ]
    }
    return form_process_config1;
  }



}
