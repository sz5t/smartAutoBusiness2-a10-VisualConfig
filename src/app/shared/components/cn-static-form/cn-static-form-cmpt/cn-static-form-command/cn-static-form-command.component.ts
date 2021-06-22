import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';
import { CommonUtils } from 'src/app/core/utils/common-utils';
import { VcComponentBase } from 'src/app/shared/vc-components/vc-component';
import { CnStaticFormComponent } from '../../cn-static-form.component';

@Component({
  selector: 'app-cn-static-form-command',
  templateUrl: './cn-static-form-command.component.html',
  styles: [
    `
    .selectedRow {
      color: #000;
      background-color: #9bebd8;
    }
    `
  ]
})
export class CnStaticFormCommandComponent extends VcComponentBase implements OnInit, AfterViewInit {
  public sourceData: any;
  public config: any;
  @Input() public fromDataService: configFormDataServerService;
  @ViewChild('staticForm', { static: true }) public staticForm: CnStaticFormComponent;
  @ViewChild('staticPageForm', { static: true }) public staticPageForm: CnStaticFormComponent;


  selectCmpt: any = 'notSet';
  staticData: any;
  selectRow: any;
  selectNode: any;
  constructor(@Inject(BSN_COMPONENT_SERVICES)
  public componentService: ComponentServiceProvider, private httpClient: HttpClient,) {
    super(componentService);
  }
  ngAfterViewInit(): void {

  }

  defaultCheckedKeys = [];
  defaultSelectedKeys = [];
  defaultExpandedKeys = [];
  nodes: any[] = [];
  listOfData: any[] = [];
  sourceDataCmpt: any;

  ngOnInit(): void {
    // this.loadDataService();

    if (this.sourceData) {
      this.sourceDataCmpt = this.sourceData['sourceDataCmpt'];
      this.sourceDataPage = this.sourceData['sourceDataPage'];
      this.showLayoutTree(this.sourceDataPage);
    }




  }
  async nzClick(event: NzFormatEmitEvent): Promise<void> {
    console.log(event);
    console.log('======选中节点信息=======', this.fromDataService.selectedItem);
    this.selectNode = event['node']['origin'];
    // 生成命令列表
    this.command_data(event['node']);

  }
  public loadDataService() {
    this.nodes = this.fromDataService.layoutTreeInstance.layoutTree;
  }

  clickExpand(event?) {
    event.stopPropagation();
  }
  nzCheck(event: NzFormatEmitEvent): void {
    console.log(event);
  }
  setSelectRow(rowData?, e?) {
    console.log('选中行', rowData);
    this.selectRow = rowData;
    this.sourceDataCmpt = {};
    this.sourceDataCmpt['commandTitle'] = rowData['commandTitle'];
    this.sourceDataCmpt['commandType'] = rowData['commandType'];
    this.sourceDataCmpt['command'] = rowData['command'];
    this.sourceDataCmpt['targetViewId'] = this.selectNode['id'];
    this.sourceDataCmpt['targetViewTitle'] = this.selectNode['title'];
    if (rowData['declareParameters']) {
      let _parameters = [];
      rowData['declareParameters'].forEach(element => {
        let _parametersObj = {};
        _parametersObj['name'] = element['name'];
        _parametersObj['title'] = element['title'];
        _parameters.push(_parametersObj);
      });
      this.sourceDataCmpt['parameters'] = _parameters;

    } else {
      this.sourceDataCmpt['parameters'] = [];
    }



    this.staticForm.validateForm.setValue(this.sourceDataCmpt);
  }

  _form_config = {

    type: 'staticForm',
    backName: 'ajaxConfig',
    backConfig: [      // 返回指定字段
      {
        name: 'targetViewTitle'
      },
      {
        name: 'targetViewId'
      },
      {
        name: 'commandTitle'
      },
      {
        name: 'commandType'
      },
      {
        name: 'command'
      },
      {
        name: 'parameters'
      }

    ],
    properties: [
      {
        name: 'targetViewTitle',
        type: 'label',
        componentConfig: {
          "labelTooltipTitle": "目标组件",
          "labelTooltipIcon": 'question-circle'
        },
        formType: 'value',
        formName: 'formControlName',
        validations: [],
        title: '目标组件标题'

      },
      {
        name: 'targetViewId',
        type: 'label',
        componentConfig: {
          "labelTooltipTitle": "目标组件",
          "labelTooltipIcon": 'question-circle'
        },
        formType: 'value',
        formName: 'formControlName',
        validations: [],
        title: '目标组件'

      },
      {
        name: 'commandTitle',
        type: 'label',
        componentConfig: {
          "labelTooltipTitle": "命令标题",
          "labelTooltipIcon": 'question-circle'
        },
        formType: 'value',
        formName: 'formControlName',
        validations: [],
        title: '命令标题'

      },
      {
        name: 'command',
        type: 'label',
        componentConfig: {
          "labelTooltipTitle": "命令编码",
          "labelTooltipIcon": 'question-circle'
        },
        formType: 'value',
        formName: 'formControlName',
        validations: [],
        title: '命令编码'

      },
      {
        "name": "commandType",
        "type": "tag",
        "componentConfig": {
          "dataMapping": [
            {
              "type": "currentValue",
              "color": "#2db7f5",
              "field": "commandType",
              "value": "custom",
              "valueText": "自定义"

            },
            {
              "type": "currentValue",
              "color": "#87d068",
              "field": "commandType",
              "value": "builtin",
              "valueText": "系统内置"

            }
          ]
        },
        "formType": "value",
        "formName": "formControlName",
        "validations": [],
        "title": "命令类型"
      },
      {
        name: 'parameters',
        type: 'input',
        hidden: true,
        componentConfig: {
          "labelTooltipTitle": "命令编码",
          "labelTooltipIcon": 'question-circle'
        },
        formType: 'value',
        formName: 'formControlName',
        validations: [],
        title: '参数'

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
              "controlIndex": 0

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
              "controlName": 'valueName',
              "controlIndex": 1

            },
            {
              id: 'c_003',
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
              "controlName": 'value',
              "controlIndex": 2

            },
            {
              id: 'c_004',
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
              "controlName": 'value',
              "controlIndex": 3

            },
            {
              id: 'c_005',
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
              "controlName": 'value',
              "controlIndex": 4

            }
          ]
        }
      ]

    }
  }

  resetForm(): void {
    this.staticForm.validateForm.reset();
  }

  staticFormValueChange(v?) {
    console.log('属性编辑器返回', v);
    if (v['backConfig'] && v['backConfig'].length > 0) {

      v['backConfig'].forEach(element => {

        this.sourceDataCmpt[element['name']] = v['data'][element['name']]
      });

    } else {
      this.sourceDataCmpt[v['name']] = v['data'];
    }

    console.log('====static最终====>>>', this.sourceDataCmpt);
  }

  async load_component_default_command(cmpt?) {

    let backData = null;
    const timestamp = new Date().getTime();
    const data = await this.httpClient.get(`assets/${cmpt}?${timestamp}`).toPromise();
    console.log('加载配置', data);
    if (data)
      backData = data['builtinCommand'];
    return backData;
  }


  // 加载页 smt-app/resource/SMT_SETTING_LAYOUT/query
  // PAGE_CODE STATE

  // smt-app/resource/GET_FUNC_PAGE_TREE/query?_recursive=true&_deep=2&_pcName=PID

  // 当前页
  //  PAGE_CODE: "F67248F7-C89B-47EF-A299-816448EBBA8B"

  async staticFormPageValueChange(v?) {
    if (v['backConfig'] && v['backConfig'].length > 0) {

      v['backConfig'].forEach(element => {

        this.sourceDataPage[element['name']] = v['data'][element['name']]
      });

    } else {
      this.sourceDataPage[v['name']] = v['data'];
    }

    this.showLayoutTree(v['data']);
    console.log('页面选择', v);


  }

  async showLayoutTree(node?) {

    let isGetJSON = true;
    let page_data = null;


    let type = 'loadPage';
    if (node) {
      if (node['targetPageCode']) {
        if (this.PAGE_SELECT === node['targetPageCode']) {
          isGetJSON = false;
        } else {
          this.PAGE_SELECT = node['targetPageCode'];
          if (node['targetPageCode'] === this.fromDataService.currentPage) {
            type = 'current';
            page_data = this.getPageLayoutJsonByCurrentPage();
          } else {
            page_data = await this.getPageLayoutJson(node['targetPageCode']);
          }

        }

      } else {
        this.PAGE_SELECT = null;
      }
    } else {
      this.PAGE_SELECT = null;
    }
    console.log('加载当前页配置', page_data);
    if (isGetJSON) {
      this.page_data(page_data, type);
    }
  }

  public async getPageLayoutJson(PAGE_CODE?) {
    // 【参数不全是否阻止加载！】
    // 对后续业务判断有影响
    console.log('===select 自加载====>load');
    let ajaxConfig = {
      "id": "load_name",
      "enableAjaxMore": true,
      "url": "smt-app/resource/SMT_SETTING_LAYOUT/query",
      "urlType": "inner",
      "ajaxType": "get",
      "headParams": [],
      "queryParams": [
        {
          "name": "PAGE_CODE",
          "type": "value",
          "valueName": "",
          "value": PAGE_CODE
        },
        {
          "name": "STATE",
          "type": "value",
          "valueName": "",
          "value": 1
        }

      ],
      "pathParams": [],
      "bodyParams": [],
      "enableResultData": false
    }
    let response: any;
    if (ajaxConfig) {
      response = await this.executeHttpMore(ajaxConfig, {}, 'buildParameters', null);
    }
    let data_form;
    if (response && response['state'] === 1) {
      if (Array.isArray(response.data)) {
        if (response.data && response.data.length > 0) {
          data_form = response.data[0];
        }
      } else {
        if (response.data) {
          data_form = response.data;
        } else {
          data_form = response;
        }
      }
    }
    return data_form;

  }

  public getPageLayoutJsonByCurrentPage() {
    let back = {
      componentsJson: this.fromDataService.layoutSourceData,
      layoutJson: this.fromDataService.layoutTreeInstance.layoutTree
    }
    return back;
  }

  PAGE_SELECT: any;
  PAGE_JSON: any;
  public page_data(data, type?) {
    if (type && type === "current") {
      this.PAGE_JSON = data;
    } else {
      if (data && data['JSON']) {
        let json_config = data['JSON'];

        this.PAGE_JSON = JSON.parse(json_config);
      } else {
        this.PAGE_JSON = null;
      }
    }

    console.log('页面json内容', this.PAGE_JSON);
    if (this.PAGE_JSON) {
      this.nodes = this.PAGE_JSON['layoutJson'];
      this.listOfData = [];
    } else {
      this.nodes = [];
      this.listOfData = [];
    }
  }

  public async command_data(node?) {
    let _pname = node['key'];
    let cmpt_name = node['origin']['type'];
    let _listOfData = [];
    let cmpt_config = this.PAGE_JSON['componentsJson'][_pname];
    if (cmpt_config && cmpt_config['customCommand']) {
      _listOfData = cmpt_config['customCommand'];
    } else {
      _listOfData = [];
    }
    if (cmpt_name) {
      let __listOfData_builtin = await this.load_component_default_command('vc/componentInit/' + cmpt_name + '.json');
      if (__listOfData_builtin) {
        _listOfData = [..._listOfData, ...__listOfData_builtin];
      }
    }
    _listOfData.forEach(item => {
      if (!item.hasOwnProperty('id')) {
        item['id'] = CommonUtils.uuID(36);
      }
      item['expand'] = false;
    })


    this.listOfData = _listOfData.filter(item => item !== null);
  }


  sourceDataPage: any = {};
  _form_page_config = {
    type: 'staticForm',
    backName: 'ajaxConfig',
    backConfig: [      // 返回指定字段
      {
        name: 'targetPageTitle'
      },
      {
        name: 'targetPageId'
      },
      {
        name: 'targetPageCode'
      }
    ],
    properties: [
      {
        name: 'targetPageId',
        type: 'treeSelect',
        componentConfig: {
          "labelTooltipTitle": "目标组件",
          "labelTooltipIcon": 'question-circle',
          "loadingMode": "ajax",  // dataService 数据服务读取
          "dropdownStyle": { 'max-height': '300px' },
          "ajaxConfig": {
            "id": "load_name",
            "enableAjaxMore": true,
            "url": "smt-app/resource/GET_FUNC_ALL_PAGE_TREE/query",
            "urlType": "inner",
            "ajaxType": "get",
            "headParams": [],
            "queryParams": [
              {
                "name": "_recursive",
                "type": "value",
                "valueName": "",
                "value": true
              },
              {
                "name": "_deep",
                "type": "value",
                "valueName": "",
                "value": -1
              },
              {
                "name": "_pcName",
                "type": "value",
                "valueName": "",
                "value": "PID"
              }


            ],
            "pathParams": [],
            "bodyParams": [],
            "enableResultData": false
          },
          "columns": [{
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
          ],
          "casadeValue": [
            {
              "cascadeName": "targetPageCode",
              "cascadeItems": [
                {
                  "type": "condition",
                  "condition": [
                    {
                      "conditionType": "and",
                      "type": "expression",
                      "centent": [],
                      "expression": {
                        "comput": "null",
                        "leftExpression": {
                          "type": "componentValue",
                          "value": "0",
                          "valueName": "targetPageId"
                        },
                        "righitExpression": {
                          "type": "value",
                          "value": "^commandConfig$"
                        }
                      }
                    }
                  ],
                  "content": {
                    "type": "setValue",
                    "data": {
                      "option": [
                        {
                          "name": "setValue",
                          "type": "value",
                          "value": null,
                          "valueName": "CODE"
                        }
                      ]
                    }
                  }
                },
                {
                  "type": "condition",
                  "condition": [
                    {
                      "conditionType": "and",
                      "type": "expression",
                      "centent": [],
                      "expression": {
                        "comput": "notnull",
                        "leftExpression": {
                          "type": "componentValue",
                          "value": "0",
                          "valueName": "targetPageId"
                        },
                        "righitExpression": {
                          "type": "value",
                          "value": "^commandConfig$"
                        }
                      }
                    }
                  ],
                  "content": {
                    "type": "setValue",
                    "data": {
                      "option": [
                        {
                          "name": "setValue",
                          "type": "dataItem",
                          "value": false,
                          "valueName": "CODE"
                        }
                      ]
                    }
                  }
                }
              ]
            },
            {
              "cascadeName": "targetPageTitle",
              "cascadeItems": [
                {
                  "type": "condition",
                  "condition": [
                    {
                      "conditionType": "and",
                      "type": "expression",
                      "centent": [],
                      "expression": {
                        "comput": "null",
                        "leftExpression": {
                          "type": "componentValue",
                          "value": "0",
                          "valueName": "targetPageId"
                        },
                        "righitExpression": {
                          "type": "value",
                          "value": "^commandConfig$"
                        }
                      }
                    }
                  ],
                  "content": {
                    "type": "setValue",
                    "data": {
                      "option": [
                        {
                          "name": "setValue",
                          "type": "value",
                          "value": null,
                          "valueName": "NAME"
                        }
                      ]
                    }
                  }
                },
                {
                  "type": "condition",
                  "condition": [
                    {
                      "conditionType": "and",
                      "type": "expression",
                      "centent": [],
                      "expression": {
                        "comput": "notnull",
                        "leftExpression": {
                          "type": "componentValue",
                          "value": "0",
                          "valueName": "targetPageId"
                        },
                        "righitExpression": {
                          "type": "value",
                          "value": "^commandConfig$"
                        }
                      }
                    }
                  ],
                  "content": {
                    "type": "setValue",
                    "data": {
                      "option": [
                        {
                          "name": "setValue",
                          "type": "dataItem",
                          "value": false,
                          "valueName": "NAME"
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
        title: '目标页面id'

      },
      {
        name: 'targetPageCode',
        type: 'label',
        componentConfig: {
          "labelTooltipTitle": "目标组件",
          "labelTooltipIcon": 'question-circle'
        },
        formType: 'value',
        formName: 'formControlName',
        validations: [],
        title: '目标页面编码'

      },
      {
        name: 'targetPageTitle',
        type: 'label',
        componentConfig: {
          "labelTooltipTitle": "目标页面标题",
          "labelTooltipIcon": 'question-circle'
        },
        formType: 'value',
        formName: 'formControlName',
        validations: [],
        title: '目标页面标题'

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
              "controlName": 'valueName',
              "controlIndex": 0

            },
            {
              id: 'c_003',
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
              "controlName": 'value',
              "controlIndex": 1

            }
          ]
        }
      ]

    }
  }

}
