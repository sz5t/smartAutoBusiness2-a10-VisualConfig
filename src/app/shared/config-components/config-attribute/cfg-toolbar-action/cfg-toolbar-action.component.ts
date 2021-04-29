import { Component, OnInit } from '@angular/core';
import { CommonUtils } from 'src/app/core/utils/common-utils';

@Component({
  selector: 'app-cfg-toolbar-action',
  templateUrl: './cfg-toolbar-action.component.html',
  styles: [
    `
    :host ::ng-deep .ant-collapse-content > .ant-collapse-content-box {
      padding: 2px 2px 2px 8px;
    }
   `
  ]
})
export class CfgToolbarActionComponent implements OnInit {

  readonly: any = false;
  interfaceCount: any = 0;
  constructor() { }

  ngOnInit(): void {
  }

  event_panels = [
    {
      id: 'group001',
      type: 'group',
      name: '分组1',
      group: [
        {
          id: 'btn001001',
          active: false,
          name: '新增【add】',
          disabled: false,
          eventConent: []
        },
        {
          id: 'btn001002',
          active: false,
          name: '修改【update】',
          disabled: false,
          eventConent: []
        },
        {
          id: 'btn001003',
          active: false,
          disabled: false,
          name: '删除【delete】',
          eventConent: []
        }
      ]
    },
    {
      id: 'group002',
      type: 'group',
      name: '分组2',
      group: [
        {
          id: 'btn002001',
          active: false,
          disabled: false,
          name: '取消【cancel】',
          eventConent: []
        },
        {
          id: 'btn002002',
          active: false,
          disabled: false,
          name: '下拉【cancel】',
          eventConent: [],
          dropdown: [
            {
              id: 'btn002002001',
              active: false,
              disabled: false,
              name: '下拉1【cancel】',
              eventConent: []
            },
            {
              id: 'btn002002002',
              active: false,
              disabled: false,
              name: '下拉2【cancel】',
              eventConent: []
            },
          ]
        }
      ]
    }
  ];

  data = [
    '[CMPT_01][LOAD]',
    '[CMPT_02][LOAD]'

  ];

  addBtnClick(v?, p?) {
    console.log('新增');
    p.push({ id: CommonUtils.uuID(30), name: '[CMPT_CUSTOM][CUSTOM_EXEC]' });
    this.data.push('[CMPT_CUSTOM][CUSTOM_EXEC]');
    this.interfaceCount = this.data.length;
  }

  setting($event, p?) {
    console.log('设置', p);
    $event.stopPropagation()
  }

  delete(item?, p?) {

    p.eventConent = p.eventConent.filter(d => d !== item);
    console.log('删除后', p)

  }



  config_event = [
    {
      id: '001',
      name: '',   // 名称 【接口标记】
      title: '',   // 接口标题
      description: '', // 描述
      eventConent: [
        {
          id: "",
          execType: '', // 【组件接口 Interface】、【命令 command】
          InterfaceConent: {
            pageId: '',
            cmptId: '',
            InterfaceName: '',
            parameters: [
              {
                name: '',
                valueName: '',
                value: ''
              }
            ]

          },
          commandConent: {
            commandName: '',  // 命令
            range: "", // 范围：全局、局部
            rangeConent: [  // 范围内容【允许访问的页】
              {
                id: '001',
                type: 'page',
                value: 'page_01'
              }
            ],
            parameters: [
              {
                name: '',
                valueName: '',
                value: ''
              }
            ]
          }
        }

      ]
    }
  ]


}
