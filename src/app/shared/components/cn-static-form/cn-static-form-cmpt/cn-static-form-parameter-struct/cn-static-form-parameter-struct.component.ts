import { Component, Input, OnInit } from '@angular/core';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';

@Component({
  selector: 'app-cn-static-form-parameter-struct',
  templateUrl: './cn-static-form-parameter-struct.component.html',
  styles: [
  ]
})
export class CnStaticFormParameterStructComponent implements OnInit {
  public sourceData: any;
  public config: any;
  @Input() public fromDataService: configFormDataServerService;
  selectCmpt: any = 'notSet';
  staticData: any;
  constructor() { }
  defaultCheckedKeys = [];
  defaultSelectedKeys = [];
  defaultExpandedKeys = [];
  p_valueName: any;
  p_type: any;
  p_value: any;
  ngOnInit(): void {
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
          isLeaf: true
        },
        {
          title: '固定值[value]',
          key: '0002',
          parameterType: 'value',
          isLeaf: true
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
            { title: '当前列[currentCol]', key: '10013', parameterType: 'currentCol', isLeaf: true }
          ]
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
          isLeaf: true
        },
        {
          title: '系统参数[sysValue]',
          parameterType: 'sysValue',
          key: '1007',
          isLeaf: true
        },
      ]
    }
  ];

  nzClick(event: NzFormatEmitEvent): void {
    console.log(event);
    let _pname = event['node']['origin']['parameterType'];
    this.p_type = _pname;
    if (_pname) {

      /*  if (this.Parameter.hasOwnProperty(_pname)) {
         this.listOfData = this.Parameter[_pname];
       } else {
         this.listOfData = [];
       } */



    }
  }

  nzCheck(event: NzFormatEmitEvent): void {
    console.log(event);
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

}
