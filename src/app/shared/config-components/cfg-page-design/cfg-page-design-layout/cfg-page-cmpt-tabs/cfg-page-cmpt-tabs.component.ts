import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';

@Component({
  selector: 'app-cfg-page-cmpt-tabs',
  templateUrl: './cfg-page-cmpt-tabs.component.html',
  styles: [
  ]
})
export class CfgPageCmptTabsComponent implements OnInit {
  @Input() public l_config;
  @Input() public showLayout: any;
  @Input() public selectedItem: any;
  @Input() public cmptState: any;
  @Input() public fromDataService: configFormDataServerService;
  @Output() public layoutOptions = new EventEmitter();
  tabs = [
    {
      id: '001',
      title: '页签01'
    },
    {
      id: '002',
      title: '页签02'
    }
  ]
  constructor(private modal: NzModalService) { }

  ngOnInit(): void {
  }

  public closeTab(tab: string): void {
    this.modal.confirm({
      nzTitle: '提示',
      nzContent: '确定要删除tab页签？',
      nzOkText: '确定',
      nzCancelText: '取消',
      nzOnOk: () => {
        let deleteIndex;
        for (let i = 0; i < this.tabs.length; i++) {
          if (this.tabs[i]['id'] === tab) {
            deleteIndex = i;
          }
        }
        this.tabs.splice(deleteIndex, 1);
      }
    });

  }

}
