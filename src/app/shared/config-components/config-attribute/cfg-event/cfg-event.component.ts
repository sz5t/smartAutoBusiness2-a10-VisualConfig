import { Component, OnInit } from '@angular/core';
import { CommonUtils } from 'src/app/core/utils/common-utils';

@Component({
  selector: 'app-cfg-event',
  templateUrl: './cfg-event.component.html',
  styles: [
  ]
})
export class CfgEventComponent implements OnInit {

  readonly: any = false;
  interfaceCount: any = 0;
  constructor() { }

  ngOnInit(): void {
  }

  event_panels = [
    {
      active: false,
      name: '加载完成【finishLoad】',
      disabled: false,
      eventConent: []
    },
    {
      active: false,
      name: '选中行【selectedRow】',
      disabled: false,
      eventConent: []
    },
    {
      active: false,
      disabled: false,
      name: '勾选行【checkedRows】',
      eventConent: []
    },
    {
      active: false,
      disabled: false,
      name: '值变化【valueChange】',
      eventConent: []
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

  setting(p?) {
    console.log('设置', p);
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
