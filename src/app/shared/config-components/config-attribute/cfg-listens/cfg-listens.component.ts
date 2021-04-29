import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cfg-listens',
  templateUrl: './cfg-listens.component.html',
  styles: [
  ]
})
export class CfgListensComponent implements OnInit {

  readonly: any = false;
  interfaceCount: any = 0;
  constructor() { }

  ngOnInit(): void {
    this.interfaceCount = this.data.length;
  }


  data = [
    '[public][001]',
    '[public][002]',
    '[public][003]',
    '[private][004][CMPT_01]',
  ];
  /**
   【组件接口定义】
    名称可取别名，默认方法名称，不能重复，执行方法是组件、系统内置方法。

    每个方法内options 参数【不一定都写入缓存变量，valueTo=》item 局部变量，当前可用】
    【接口属性、public 所有组件均可以调用，特殊组件调用的（别名区别）】

    接口内 = 前置拦截、业务分支、业务逻辑、业务执行

    [public][刷新][LOAD]

    组件内置公共接口：message 【消息接口、所有的组件都有】 提至base中

    区分是否主页【主页涉及数据缓存、权限等内容、权限是否可以控制交互（消息是否可触发&接收）】
    加载页面渲染-》首先进入page 组件【布局、其他内容渲染】



   */

  info(v) {
    console.log(v);
  }

  addBtnClick(v?) {
    console.log('新增');
    this.data.push('[public][KEY_CODE][CUSTOM]');
    this.interfaceCount = this.data.length;
  }

  config_listens = [
    {
      id: '001',
      range: "", // 范围：全局、局部
      rangeConent: [  // 范围内容【允许访问的页】
        {
          id: '001',
          type: 'page',
          value: 'page_01'
        }

      ],
      name: '',   // 名称 【监听标记】
      title: '',   // 监听标题
      description: '', // 描述
      commandName: '', // 监听命令
      parameters: [
        {
          name: '',
          valueName: '',
          valueTo: '',
          value: ''
        }

      ],
      responseConent: [ // 监听响应
        {
          id: '',
          execName: ''  // 可执行内容
        }

      ]
    }
  ]


}
