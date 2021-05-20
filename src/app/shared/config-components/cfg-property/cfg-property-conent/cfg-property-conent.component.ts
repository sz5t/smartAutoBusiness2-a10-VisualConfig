import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';

@Component({
  selector: 'app-cfg-property-conent',
  templateUrl: './cfg-property-conent.component.html',
  styles: [
  ]
})
export class CfgPropertyConentComponent implements OnInit {
  @Input() public config;
  @Input() public sourceData;
  @Input() public configData;
  @Input() public staticData;
  @Input() public fromDataService: configFormDataServerService;
  @Output() public updateValue = new EventEmitter<any>(true);
  attr_config: any;
  attr_config_data: any;
  constructor() { }

  ngOnInit(): void {

    if (this.staticData) {
      this.attr_config = this.config['sourceConfig'];
      // 【根据配置值，读取小组件配置】  根据type 值 组件标识 加载相应小组配置 
      // this.attr_config = this.gloab_config['cmpt'];
      console.log('sssssssss', this.staticData);
    } else { // [暂时]
      this.attr_config = this.config['sourceConfig'];
    }

  }

  gloab_config = {
    input: {
      componentCode: 'form-input',
      typeConent: [
        {
          code: 'attr',
          title: '属性',
          propertyTypeConent: [
            {
              code: 'privateProperty',
              title: '属性',
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
                name: 'title'
              }
            }
          ]
        }

      ]
    },
    select: {
      componentCode: 'form-select',
      typeConent: [
        {
          code: 'attr',
          title: '属性',
          propertyTypeConent: [
            {
              code: 'privateProperty',
              title: '属性',
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

                  },
                  {
                    name: 'labelName',
                    type: 'input',
                    componentConfig: {

                    },
                    formType: 'value',
                    formName: 'formControlName',
                    validations: [],
                    title: '提示占位符'

                  },
                  {
                    name: 'valueName',
                    type: 'input',
                    componentConfig: {

                    },
                    formType: 'value',
                    formName: 'formControlName',
                    validations: [],
                    title: '提示占位符'

                  },
                ]

              },
              sourceData: {
                name: 'title'
              }
            }
          ]
        }

      ]
    }


  }


  loadConfig() {
    // 加载出当前组件的详细配置，根据数据读取配置，构建页面

    // 例如 input——》 加载input 配置 

  }

  // 定义出当前完整结构，补充内容
  // back 将backName 反馈回
  valueChange(v?) {
    console.log('子组件内容明细反馈', v);

    // 【当前这个是测试，应该返回完整结构】
    if (!this.staticData) {
      this.staticData = {};
    }
    this.staticData[v['name']] = v['data'];
    this.backValueChange(this.staticData);

  }

  backValueChange(v?) {
    console.log('子组件内容', v);
    const backData = { name: this.attr_config['backName'], data: v }
    this.updateValue.emit(backData);

  }




}
