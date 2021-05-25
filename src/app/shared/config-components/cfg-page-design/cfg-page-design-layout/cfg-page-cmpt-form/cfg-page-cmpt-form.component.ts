import { Component, Input, OnInit } from '@angular/core';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';

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

  constructor() { }

  public config = {
    formLayout: [
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

  ngOnInit(): void {
    this.config = this.fromDataService.layoutSourceData[this.l_config['id']].length > 0 ? this.fromDataService.layoutSourceData[this.l_config['id']] : this.config;
    this.load(this.config);
  }

  public load(config) {

  }

}
