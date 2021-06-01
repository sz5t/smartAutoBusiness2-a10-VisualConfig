import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';
import { CnStaticFormComponent } from '../../cn-static-form.component';

@Component({
  selector: 'app-cn-static-form-parameter-struct',
  templateUrl: './cn-static-form-parameter-struct.component.html',
  styles: [
    `
    .selectedRow {
      color: #000;
      background-color: rgba(232, 249, 243);
    }
    `
  ]
})
export class CnStaticFormParameterStructComponent implements OnInit {
  public sourceData: any;
  public config: any;
  @Input() public fromDataService: configFormDataServerService;
  @ViewChild('staticForm', { static: true }) public staticForm: CnStaticFormComponent;

  selectCmpt: any = 'notSet';
  staticData: any;
  constructor(private httpClient: HttpClient,) { }

  defaultCheckedKeys = [];
  defaultSelectedKeys = [];
  defaultExpandedKeys = [];
  ngOnInit(): void {
    if (!this.sourceData) {
      this.sourceData = {
        type: null,
        valueName: null,
        value: null
      }
    } else {
      this.sourceData = {
        type: this.sourceData['type'],
        valueName: this.sourceData['valueName'],
        value: this.sourceData['value']
      }
    }


  }

  nodes: any[] = [
    {
      title: '参数',
      key: '100',
      parameterType: '',
      disabled: true,
      children: [
        {
          title: '主资源参数[main]',
          key: '0001',
          parameterType: 'item',
          isLeaf: true,
          loadConfig: {
            // 加载全局配置 【用户信息，系统参数】
            global: false,
            path: "vc/config/userValue.json",
            local: true, // 加载局部配置 【从当前组件节点读取数据】
            localConfig: [  // 从当前节点，可向上，也可向下取参数，页面初始参数 可合并
              {
                nodeType: "root",
                enableParameter: true, // 取当前节点参数
                parameterType: "mainParameters",
                parent: { // 可向上

                },
                children: [
                  {
                  }
                ]
              },
              {
                nodeType: "sub",
                enableParameter: true, // 取当前节点参数
                parameterType: "mainParameters",
                parent: { // 可向上

                },
                children: [
                  {
                  }
                ]
              }
            ]



          }
        },
        {
          title: '固定值[value]',
          key: '0002',
          parameterType: 'value',
          isLeaf: true,
          loadConfig: {
            // 加载全局配置 【用户信息，系统参数】
            // 加载局部配置 【从当前组件节点读取数据】
          }
        },
        {
          title: '组件参数[componentValue]',
          key: '1001',
          parameterType: 'componentValue',
          disabled: true,
          children: [
            { title: '选中行[selectedRow]', key: '10010', parameterType: 'selectedRow', isLeaf: true },
            { title: '勾选行[checkedRow]', key: '10011', parameterType: 'checkedRow', isLeaf: true },
            { title: '当前行[currentRow]', key: '10012', parameterType: 'currentRow', isLeaf: true },
            {
              title: '当前单元格[currentCell]', key: '10013', parameterType: 'currentCell', isLeaf: true,
              loadConfig: {
                // 加载全局配置 【用户信息，系统参数】
                // 加载局部配置 【从当前组件节点读取数据】
                global: true,
                path: "vc/config/currentCell.json"
              }
            }
          ],
          loadConfig: {
            // 加载全局配置 【用户信息，系统参数】
            // 加载局部配置 【从当前组件节点读取数据】
            global: true,
            path: "vc/config/gridComponentValue.json"
          }
        },
        {
          title: '当前执行[item]',
          key: '1002',
          parameterType: 'item',
          isLeaf: true
        },
        {
          title: '初始值[initValue]',
          key: '1003',
          parameterType: 'initValue',
          isLeaf: true
        },
        {
          title: '临时值[tempValue]',
          key: '1004',
          parameterType: 'tempValue',
          isLeaf: true
        },
        {
          title: '级联参数[cascadeValue]',
          parameterType: 'cascadeValue',
          key: '1005',
          isLeaf: true
        },
        {
          title: '用户信息[userValue]',
          parameterType: 'userValue',
          key: '1006',
          isLeaf: true,
          loadConfig: {
            // 加载全局配置 【用户信息，系统参数】
            // 加载局部配置 【从当前组件节点读取数据】
            global: true,
            path: "vc/config/userValue.json"
          }
        },
        {
          title: '系统参数[sysValue]',
          parameterType: 'sysValue',
          key: '1007',
          isLeaf: true,
          loadConfig: {
            // 加载全局配置 【用户信息，系统参数】
            // 加载局部配置 【从当前组件节点读取数据】
            global: true,
            path: "vc/config/sysValue.json"
          }
        },
      ]
    }
  ];
  listOfData: any[] = [];
  Parameter = {
    tempValue: [
      { id: '001', name: 'pid', title: '父id', type: 'tempValue', source: '[消息]', description: '', dataType: '' }
    ],
    initValue: [
      { id: '002', name: 'pageId', title: '页id', type: 'initValue', source: '[初始化]', description: '', dataType: '' }
    ],
    userValue1: [
      { id: '004', name: 'userId', title: '用户id', type: 'componentValue', source: '[组件值]', description: '', dataType: '' },
      { id: '005', name: 'userName', title: '用户名称', type: 'componentValue', source: '[组件值]', description: '', dataType: '' },
      { id: '006', name: 'realName', title: '姓名', type: 'componentValue', source: '[组件值]', description: '', dataType: '' }
    ]
  }
  async nzClick(event: NzFormatEmitEvent): Promise<void> {
    console.log(event);
    console.log('======选中节点信息=======', this.fromDataService.selectedItem);
    let _pname = event['node']['origin']['parameterType'];


    this.sourceData['type'] = _pname;
    this.staticForm.validateForm.setValue(this.sourceData);
    if (_pname) {
      if (event['node']['origin'].hasOwnProperty('loadConfig')) {
        const _loadConfig = event['node']['origin']['loadConfig'];
        if (_loadConfig['global']) {
          this.listOfData = await this.loadConfig(_loadConfig['path']);
        }
        if (_loadConfig['local']) {
          this.listOfData = this.fromDataService.getParameters(_loadConfig['localConfig'])
        }


      } else {
        // 读取组件测试值
        if (this.Parameter.hasOwnProperty(_pname)) {
          this.listOfData = this.Parameter[_pname];
        } else {
          this.listOfData = [];
        }
      }




    }
  }

  nzCheck(event: NzFormatEmitEvent): void {
    console.log(event);
  }

  selectRow = {}
  setSelectRow(rowData?, e?) {
    console.log('选中行', rowData);
    this.selectRow = rowData;
    let _pname = rowData['name'];
    this.sourceData['valueName'] = _pname;
    this.staticForm.validateForm.setValue(this.sourceData);
  }

  _form_config = {

    type: 'staticForm',
    backName: 'ajaxConfig',
    backConfig: [      // 返回指定字段
      {
        name: 'type'
      },
      {
        name: 'valueName'
      },
      {
        name: 'value'
      }
    ],
    properties: [
      {
        name: 'type',
        type: 'input',
        componentConfig: {
          "options": [
            {
              "label": "输入",
              "value": "cnGridInput"
            },
            {
              "label": "开关",
              "value": "cnGridSwitch"
            }
          ],
          "labelName": "label",
          "valueName": "value",
          "labelTooltipTitle": "参数类型",
          "labelTooltipIcon": 'question-circle'

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
          "labelTooltipTitle": "参数取值名称",
          "labelTooltipIcon": 'question-circle'

        },
        formType: 'value',
        formName: 'formControlName',
        validations: [],
        title: '参数名称'

      },
      {
        name: 'value',
        type: 'input',
        componentConfig: {
          "labelTooltipTitle": "参数默认值",
          "labelTooltipIcon": 'question-circle'

        },
        formType: 'value',
        formName: 'formControlName',
        validations: [],
        title: '默认值'

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
                "span": 8,
                "nzXs": 12,
                "nzSm": 12,
                "nzMd": 8,
                "nzLg": 8,
                "ngXl": 8,
                "nzXXl": 8
              },
              "container": "control",
              "controlName": 'email',
              "controlIndex": 0,

            },
            {
              id: 'c_002',
              "type": "col",
              "size": {
                "span": 8,
                "nzXs": 12,
                "nzSm": 12,
                "nzMd": 8,
                "nzLg": 8,
                "ngXl": 8,
                "nzXXl": 8
              },
              "container": "control",
              "controlName": 'valueName',
              "controlIndex": 1,

            },
            {
              id: 'c_003',
              "type": "col",
              "size": {
                "span": 8,
                "nzXs": 12,
                "nzSm": 12,
                "nzMd": 8,
                "nzLg": 8,
                "ngXl": 8,
                "nzXXl": 8
              },
              "container": "control",
              "controlName": 'value',
              "controlIndex": 2,

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

    console.log('====static最终====>>>', this.sourceData);
  }

  async loadConfig(cmpt): Promise<any[]> {
    // 加载出当前组件的详细配置，根据数据读取配置，构建页面

    // 例如 input——》 加载input 配置 
    let backData = [];
    const timestamp = new Date().getTime();
    const data = await this.httpClient.get(`assets/${cmpt}?${timestamp}`).toPromise();
    if (data && data.hasOwnProperty('data')) {
      backData = data['data'];
    }
    console.log('加载配置', data);
    return backData;


  }

}
