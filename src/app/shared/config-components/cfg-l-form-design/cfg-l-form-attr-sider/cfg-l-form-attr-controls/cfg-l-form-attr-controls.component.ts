import { Component, Input, OnInit } from '@angular/core';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';

@Component({
  selector: 'app-cfg-l-form-attr-controls',
  templateUrl: './cfg-l-form-attr-controls.component.html',
  styles: [
  ]
})
export class CfgLFormAttrControlsComponent implements OnInit {
  @Input() public selectedItem: any;
  @Input() public fromDataService: configFormDataServerService;
  constructor() { }

  event_panels = [];
  structure_config: any;
  conentData: any;

  data: any;

  ngOnInit(): void {

    this.fromDataService.controlsInstance = this;

  }

  public load(node?) {

    // 加载当前数据

    this.structure_config = null;


    console.log('cfg-l-form-attr-controls====::::loading', node);
    // 从缓存读取当前配置属性，构建属性列表
    if (this.selectedItem['active'] === 'cmpt') {


      setTimeout(() => {
        this.data = this.fromDataService.layoutSourceData[node['id']];
        this.structure_config = this.structure_config2;

        this.createData(this.structure_config, this.data);

        console.log('组件配置信息', this.fromDataService.layoutSourceData[node['id']]);
      });

    } else {


      setTimeout(() => {
        this.data = this.fromDataService.layoutSourceData[node['id']];
        this.structure_config = this.structure_config1;
      });

    }

  }




  public saveControls() {
    console.log('保存ing...', this.data);
  }




  formControls = {
    "id": "001",                  // 组件标题
    "hidden": true,               // 是否显示
    "field": "provinceName",      // 绑定字段 (API资源中的属性)
    "state": "edit",             // 表单组件初始化状态


    "title": "省名称",             // 标签
    "titleConfig": {              // 标签配置
      "required": true            // 是否显示必填符号
    },

    "labelSizce": {                // 标签文本所占布局
      "span": 8,                  // 默认比例
      "nzXs": {
        "span": 7,
        "offset": 1
      },
      "nzSm": {
        "span": 7,
        "offset": 1
      },
      "nzMd": {
        "span": 7,
        "offset": 1
      },
      "nzLg": {
        "span": 7,
        "offset": 1
      },
      "ngXl": {
        "span": 7,
        "offset": 1
      },
      "nzXXl": {
        "span": 7,
        "offset": 1
      }
    },
    "controlSize": {             // 组件所占布局比例
      "span": 16,                // 默认比例
      "nzXs": 16,
      "nzSm": 16,
      "nzMd": 16,
      "nzLg": 16,
      "ngXl": 16,
      "nzXXl": 16
    },

    "text": {                    // 表单文本状态下绑定设定
      "type": "label",           // 展示类型 label 为标签类型
      "field": "provinceName"    // 要显示字段
    },
    "editor": {                  // 表单编辑状态设置
      "type": "input",           // 编辑状态的展示类型
      "field": "provinceName",   // 要编辑的字段
      "placeholder": "请输入",    // 设置默认显示内容
      "validations": [           // 设置表单数据验证器
        {
          "validator": "required",    // 设置验证类型: 包含 requried
          "type": "default",          // 验证类型: default 代表系统级别验证
          "message": "请输入省名称"     // 验证错误时的错误信息
        },
        {
          "validator": "repeat",
          "type": "custom",
          "message": "重复名称",
          "data": {
            "type": "value",
            "value": "中国香港"
          }
        },
        {
          "validator": "repeat1",
          "type": "custom",           // custom 自定义验证类型、由系统提供
          "message": "重复名称2",
          "data": {                   // 验证数据、根据不同的验证类型,验证数据会有一定的区别,详细具体内容
            "type": "value",
            "value": "中国香港2"
          }
        }
      ]
    }
  }

  spelit() {

    let newcfg = {
      base: {

      },
      title: {

      },
      text: {
        base: {
          id: '',
          field: '',
          type: '',
          option: { // 具体配置

          }
        }
      }
    }

  }

  structure_config1 = {

    conentComponent: {
      name: '基本信息',
      type: 'base',
      sourceData: {
        name: 'title'
      }
    },
    childrenComponents: [
      {
        active: true,
        name: '标签',
        disabled: false,
        type: 'title',
        sourceData: {
          name: 'title'
        }

      }
    ]


  }

  structure_config2 = {

    conentComponent: {
      name: '基本信息',
      type: 'base',
      sourceData: {
        name: 'title'
      }
    },
    childrenComponents: [
      {
        active: true,
        name: '标签',
        disabled: false,
        type: 'title',
        sourceData: {
          name: 'title'
        }

      },
      {
        active: false,
        name: '标签布局',
        disabled: false,
        type: 'size',
        sourceData: {
          name: 'labelSize'
        }
      },
      {
        active: false,
        name: '控件布局',
        disabled: false,
        type: 'size',
        sourceData: {
          name: 'controlSize'
        }
      },
      {
        active: false,
        disabled: false,
        name: '文本',
        type: 'text',
        sourceData: {
          name: 'text'
        }
      },
      {
        active: false,
        disabled: false,
        name: '编辑',
        type: 'editor',
        sourceData: {
          name: 'editor'
        }
      }
    ]


  }


  event_panels1 = [
    {
      active: false,
      name: '标签',
      disabled: false,
      panelConent: {
        type: 'title'
      }
    },
    {
      active: false,
      name: '标签布局',
      disabled: false,
      panelConent: {
        type: 'size'
      }
    },
    {
      active: false,
      name: '控件布局',
      disabled: false,
      panelConent: {
        type: 'size'
      }
    },
    {
      active: false,
      disabled: false,
      name: '文本',
      panelConent: {
        type: 'text'
      }
    },
    {
      active: false,
      disabled: false,
      name: '编辑',
      panelConent: {
        type: 'editor'
      }
    }
  ];



  setting(v?) {

  }

  // 构建出当前组件信息
  createData(structure?, data?) {

    if (!data) {
      data = {};
    }

    if (structure['conentComponent']) {

    }
    if (structure['childrenComponents']) {

      structure['childrenComponents'].forEach(element => {
        if (element['sourceData']) {

          // 补充结构
          if (!data.hasOwnProperty(element['sourceData']['name'])) {
            data[element['sourceData']['name']] = null;
          }

        }

      });
    }


    console.log('xxxx====createData====xxxxx', data);




  }





}
