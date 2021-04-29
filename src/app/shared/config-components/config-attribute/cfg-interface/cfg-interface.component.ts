import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cfg-interface',
  templateUrl: './cfg-interface.component.html',
  styles: [
  ]
})
export class CfgInterfaceComponent implements OnInit {

  readonly: any = false;
  interfaceCount: any = 0;
  constructor() { }

  ngOnInit(): void {
    this.interfaceCount = this.data.length;
  }


  data = [
    '[public][刷新][LOAD]',
    '[public][选中][SET_SELECTED]',
    '[public][值传递]][TRANFER_VALUE]',
    '[public][编辑状态][EDIT_STATET]',
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
    this.data.push('[public][自定义][CUSTOM_EXEC]');
    this.interfaceCount = this.data.length;
  }




  config_interFace = [
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
      name: '',   // 名称 【接口标记】
      execName: '', // 组件内置操作标记
      title: '',   // 接口标题
      description: '', // 描述
      parameters: [
        {
          name: '',
          valueName: '',
          valueTo: '',
          value: ''
        }

      ]
    }
  ]


}
