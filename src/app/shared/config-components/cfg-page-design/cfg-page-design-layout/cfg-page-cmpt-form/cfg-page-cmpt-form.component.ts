import { Component, Input, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';
import { CfgFormDesignComponent } from '../../../cfg-form-design/cfg-form-design.component';

@Component({
  selector: 'app-cfg-page-cmpt-form',
  templateUrl: './cfg-page-cmpt-form.component.html',
  styles: [
    ` .ant-card-type-inner .ant-card-body {
            padding: 1px 2px;
          }`
  ]
})
export class CfgPageCmptFormComponent implements OnInit {
  @Input() public l_config;
  @Input() public showLayout: any;
  @Input() public selectedItem: any;
  @Input() public cmptState: any;
  @Input() public fromDataService: configFormDataServerService;

  constructor(private modal: NzModalService) { }

  public config = {
    formLayout: [],
    formLayout1: [
      {
        children: [
          {
            children: [
              {
                children: [
                  {
                    children: [],
                    container: "cnDataTable",
                    expanded: true,
                    id: "aIW6dyJUU60c8BqeYysNuKg5eop7t8",
                    key: "aIW6dyJUU60c8BqeYysNuKg5eop7t8",
                    level: 3,
                    parentId: "gvC0lSer13uY0LPWcewLTIKq8jcZ6D",
                    title: "组件cnDataTable",
                    type: "cnDataTable"
                  }
                ],
                container: "component",
                expanded: true,
                id: "gvC0lSer13uY0LPWcewLTIKq8jcZ6D",
                key: "gvC0lSer13uY0LPWcewLTIKq8jcZ6D",
                parentId: "AXsfB48bsO7mh1GVIdrvoCACciaLCi",
                size: {
                  ngXl: 12,
                  nzLg: 12,
                  nzMd: 12,
                  nzSm: 12,
                  nzXXl: 12,
                  nzXs: 12
                },
                span: 12,
                title: "列",
                type: "col"
              },
              {
                children: [],
                container: "component",
                expanded: true,
                id: "MkSfK15LsRSwSrd6c600TF27huUnWY",
                key: "MkSfK15LsRSwSrd6c600TF27huUnWY",
                parentId: "AXsfB48bsO7mh1GVIdrvoCACciaLCi",
                size: {
                  ngXl: 12,
                  nzLg: 12,
                  nzMd: 12,
                  nzSm: 12,
                  nzXXl: 12,
                  nzXs: 12
                },
                span: 12,
                title: "列",
                type: "col"
              }
            ],
            container: "cols",
            expanded: true,
            id: "AXsfB48bsO7mh1GVIdrvoCACciaLCi",
            key: "AXsfB48bsO7mh1GVIdrvoCACciaLCi",
            parentId: "Wz4NyejyZeojCJKij4YSVv1TDvmUOl",
            showTitle: false,
            title: "行",
            type: "row"
          },
          {
            children: [],
            container: "cols",
            expanded: true,
            id: "BbK15R8zLE9nEBmyviK2JW2ndtU2bR",
            key: "BbK15R8zLE9nEBmyviK2JW2ndtU2bR",
            parentId: "Wz4NyejyZeojCJKij4YSVv1TDvmUOl",
            showTitle: false,
            title: "行",
            type: "row"
          }
        ],
        container: "rows",
        expanded: true,
        id: "Wz4NyejyZeojCJKij4YSVv1TDvmUOl",
        key: "Wz4NyejyZeojCJKij4YSVv1TDvmUOl",
        parentId: "null",
        title: "【页面】布局",
        type: "layout",
      }
    ]
  }

  // body_style: any = { 'padding': '1px 2px' }
  body_style: any = { 'padding': '1px 2px' }
  body_style_selected: any = { 'padding': '1px 2px', 'border': "3px dashed red" }
  ngOnInit(): void {
    this.config = this.fromDataService.layoutSourceData[this.l_config['id']].length > 0 ? this.fromDataService.layoutSourceData[this.l_config['id']] : this.config;
    this.load(this.config);
  }

  public load(config) {

  }

  click(e?) {
    e.stopPropagation();
    // this.optionState = true;
    // 选中
    this.selectedItem['item'] = this.l_config;
    this.selectedItem['active'] = 'cnForm';
    this.fromDataService.layoutNodeSelected(this.l_config);
    console.log('选中当前tabs', this.selectedItem);

  }
  windowDialog;
  formDesign() {
    console.log('');
    let dialog;
    // 根据按钮类型初始化表单状态
    const dialogCfg = {
      title: '表单设计器',
      width: '100%',
      "style": {
        "top": "0px",
        "padding-bottom": "0px"
      },
      maskClosable: true,
      cancelText: '取消',
      okText: '确定',
      footerButton: null,
      customAction: [],
      customContent: 'api',
      customPageConfig: {

      }
    }
    if (!dialogCfg) {
      return;
    }

    let staticData;


    const dialogOptional = {
      nzTitle: dialogCfg.title ? dialogCfg.title : '',
      nzWidth: dialogCfg.width ? dialogCfg.width : '600px',
      nzStyle: dialogCfg.style ? dialogCfg.style : null, // style{top:'1px'},
      nzMaskClosable: dialogCfg.hasOwnProperty('maskClosable') ? dialogCfg.maskClosable : false,
      nzContent: CfgFormDesignComponent,
      nzComponentParams: {
        layoutTree: this.config['formLayout'] ? this.config['formLayout'] : [],
        layoutSourceData: this.config['componentJson'] ? this.config['componentJson'] : {}
      },
      nzFooter: [
        {
          label: dialogCfg.cancelText ? dialogCfg.cancelText : 'cancel',
          onClick: (componentInstance) => {
            dialog.close();
          },
        },
        {
          label: dialogCfg.okText ? dialogCfg.okText : 'OK',
          onClick: async (componentInstance) => {

            console.log('当前弹出表单值：', componentInstance)
            this.config['formLayout'] = componentInstance.fromDataService.layoutTreeInstance['layoutTree'];
            this.config['componentJson'] = componentInstance.fromDataService.layoutSourceData;
            // this.loadShowValue();
            // console.log('当前弹出表单值：', componentInstance['staticForm']['validateForm']['value'])
            dialog.close();
          },
        },
      ],
    };

    dialog = this.modal.create(dialogOptional);
    this.windowDialog = dialog;
  }

}
