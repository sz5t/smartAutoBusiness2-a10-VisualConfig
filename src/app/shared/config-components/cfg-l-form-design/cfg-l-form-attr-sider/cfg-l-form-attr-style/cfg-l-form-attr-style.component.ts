import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cfg-l-form-attr-style',
  templateUrl: './cfg-l-form-attr-style.component.html',
  styles: [
  ]
})
export class CfgLFormAttrStyleComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  public compute_config() {
    // 计算出当前style 配置

    // 区分 样式分类、数据回写类型
    // 列 引用回写，需要及时更新画布状态
    // 样式分类：布局栅格、布局样式（style；边框、大小、背景等）

    let hasConfig = {
      type: '',
      hasContent: [
        {
          code: "",
          title: '',
          transmit: ''  // 传递（区分值内容）
        }
      ]
    }


    //=====
    /*
       结构主对象 （选中主对象-》属性编辑栏-》切换为当前表单（给标识，从通用数据服务取值，回写，保存值一致））
       |--布局
          |-- 行（列）


      组件： 运行组件（预览、实际项目用）
             展示组件（配置过程用）
             属性组件（当前组件的属性内容）

      拖拽组件，带版本信息（配置匹配）可根据版本升级
      默认填充空数据，静态数据，配置可修改，查阅配置效果

     */


  }

}
