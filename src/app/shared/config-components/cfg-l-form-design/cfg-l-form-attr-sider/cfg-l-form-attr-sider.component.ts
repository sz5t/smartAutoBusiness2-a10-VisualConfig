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










}
