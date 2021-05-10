import { Component, Input, OnInit } from '@angular/core';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';

@Component({
  selector: 'app-cfg-l-form-attr-sider',
  templateUrl: './cfg-l-form-attr-sider.component.html',
  styles: [
  ]
})
export class CfgLFormAttrSiderComponent implements OnInit {
  @Input() public selectedItem: any;
  @Input() public fromDataService: configFormDataServerService;
  constructor() { }

  ngOnInit(): void {
    this.fromDataService.attrSiderInstance = this;

    this.load();
  }


  public layout_attr() {
    // 解析当前包含属性
    // 构建属性块
    // 传递属性块明细

    let layout_attr_types = [
      {
        name: '',
        type: 'style',
        sourceData: {
          name: 'title'
        }

      },
      {
        name: '',
        type: 'attr',
        sourceData: {
          name: 'title'
        }

      },
      {
        name: '',
        type: 'paremater',
        sourceData: {
          name: 'title'
        }

      }


    ]


  }

  public service() {
    // 数据服务
    // 1.当前实例标识
    // 2.当前实例的主体
    // 3.当前实例的属性

  }


  attr_config;
  attr_config_data;

  load(node?) {

    if (this.selectedItem['active']) {
      this.attr_config = this.gloab_config[this.selectedItem['active']];
      this.attr_config_data = node;
    }
  }



  public test_cmpt() {

    // 基本格式
    let form_a = {
      id: '',
      base: {
        type: '',
        feild: ''
      },
      privateProperty: { // 私有属性

        lableName: '',
        valueName: ''

      },
      sourceData: {  // 数据
        sourceDataType: 'static',  // staticData 静态数据 apiData 数据
        options: [],
        loadingConfig: {}, // 主资源
        expandConfig: {}, // 展开资源
        loadingItemConfig: {} // 加载初值资源（根据value值，加载当前内容，例如 名称）
      },
      formatConfig: {  // 文本收缩

      },
      dataMapping: {  // 字段展示效果映射

      },
      columns: { // 列字段映射

      },
      customPage: { // 自定义页面

      }
    }

    // 配置结构
    let input = {
      id: '001',
      base: {
        type: 'input',
        feild: '',
        placeholder: "请输入",
      },
      privateProperty: { // 私有属性
        displayType: "text"
      }
    }

    // 配置结构
    let select = {
      base: {
        id: '001',
        type: 'select',
        feild: '',
        placeholder: "请输入",
      },
      style: {  // 当前样式
        width: '100%'

      },
      privateProperty: { // 私有属性
        "labelName": "label",                //设置显示内容的属性名称, 静态下拉列表为固定的内容
        "valueName": "value",
        "showSearch": true,                  // 是否启用查询
        "serverSearch": true                 // 服务端查询 
      },
      sourceData: {  // 数据
        sourceDataType: 'static',  // staticData 静态数据 apiData 数据
        options: [],
        loadingConfig: {} // 主资源
      }
    }

    // 组件描述
    let f_input = {

      componentCode: 'form-input',
      typeConent: [
        {
          code: 'style',
          propertyTypeConent: [
            {
              code: 'style'
            }
          ]
        },
        {
          code: 'attr',
          propertyTypeConent: [
            {
              code: 'privateProperty'
            },
            {
              code: 'validations'
            }
          ]
        }

      ]


    }



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
              type: 'size',
              active: true
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
              type: 'size',
              active: true,
              sourceConfig: {
                //
              },
              sourceData: {
                name: 'title'
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
              active: true
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













}
