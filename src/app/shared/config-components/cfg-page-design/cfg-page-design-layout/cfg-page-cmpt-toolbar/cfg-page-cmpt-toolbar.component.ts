import { Component, Input, OnInit } from '@angular/core';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';

@Component({
  selector: 'app-cfg-page-cmpt-toolbar',
  templateUrl: './cfg-page-cmpt-toolbar.component.html',
  styles: [
  ]
})
export class CfgPageCmptToolbarComponent implements OnInit {
  @Input() public l_config;
  @Input() public showLayout: any;
  @Input() public selectedItem: any;
  @Input() public cmptState: any;
  @Input() public fromDataService: configFormDataServerService;

  constructor() { }

  public config = {
    toolbar: [
      {
        "id": "dropdown_01",
        "targetViewId": "tree_page",
        "text": "设置",
        "dropdown": [
          {
            "id": "M_refresh",
            "text": "刷新",
            "icon": "reload",
            "color": "text-primary",
            "hidden": false,
            "disabled": false,
            "execute": [
              {
                "triggerType": "BEHAVIOR",
                "trigger": "REFRESH"
              }
            ]
          }
        ]
      },
      {
        "targetViewId": "view_01",
        "group": [
          {
            "id": "M_addRow",
            "text": "新增",
            "icon": "plus",
            "color": "text-primary",
            "hidden": false,
            "disabled": false,
            "execute": [
              {
                "triggerType": "STATE",
                "trigger": "ADD_ROW",
                "conditionId": "add_state_1"
              }
            ]
          },
          {
            "id": "dropdown_02",
            "text": "设置2",
            "dropdown": [
              {
                "id": "M_refresh2",
                "text": "刷新",
                "icon": "reload",
                "color": "text-primary",
                "hidden": false,
                "disabled": false,
                "execute": [
                  {
                    "triggerType": "BEHAVIOR",
                    "trigger": "REFRESH"
                  }
                ]
              }
            ]
          }]
      }
    ]
  }

  ngOnInit(): void {
    this.config = this.fromDataService.layoutSourceData[this.l_config['id']].length > 0 ? this.fromDataService.layoutSourceData[this.l_config['id']] : this.config;
    this.load(this.config);
  }

  public load(config) {

  }

}
