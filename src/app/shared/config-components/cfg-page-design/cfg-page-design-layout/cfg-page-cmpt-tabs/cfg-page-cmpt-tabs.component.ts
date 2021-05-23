import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';
import { CommonUtils } from 'src/app/core/utils/common-utils';

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
  body_style: any = { 'padding': '1px 2px' }
  body_style_selected: any = { 'padding': '1px 2px', 'border': "3px dashed red" }
  tabs = [
    /*     {
          id: '001',
          title: '页签01'
        } */
  ]
  selectedIndex = 0;
  constructor(private modal: NzModalService, private message: NzMessageService) { }

  ngOnInit(): void {
    this.tabs = this.l_config['children'];
  }

  public closeTab(tab: string): void {

    /*     if (this.tabs.length <= 1) {
          this.createMessage('warning', 'tab页签至少有一个，不能再删除');
          return;
        } */

    this.modal.confirm({
      nzTitle: '提示',
      nzContent: '确定要删除tab页签？',
      nzOkText: '确定',
      nzCancelText: '取消',
      nzOnOk: () => {
        let deleteIndex;

        for (let i = 0; i < this.l_config['children'].length; i++) {
          if (this.l_config['children'][i]['id'] === tab) {
            deleteIndex = i;
          }
        }
        // this.tabs.splice(deleteIndex, 1);
        this.l_config['children'].splice(deleteIndex, 1);
        this.fromDataService.layoutTreeInstance.delChildrenNode(this.l_config['id'], {}, deleteIndex);

      }
    });

  }

  createMessage(type: string, messageInfo: string): void {
    this.message.create(type, `${messageInfo}`);
  }

  newTab(): void {
    const tabid = CommonUtils.uuID(30);
    //  this.tabs.push({ id: tabid, title: 'New Tab' });
    // this.selectedIndex = this.tabs.length;
    let cmptObj = {
      "type": 'tab',
      "title": "newtab",
      "container": 'layout'
    }
    let node = this.fromDataService.l_create_component_tab(this.l_config['id']);
    // this.l_config.children.splice(0, 0, node);
    this.fromDataService.layoutTreeInstance.addChildrenNode(this.l_config['id'], node, this.selectedIndex + 1);
    console.log('当前tab页签配置', this.tabs, this.l_config);
  }

  click(e?) {
    e.stopPropagation();
    // this.optionState = true;
    // 选中
    this.selectedItem['item'] = this.l_config;
    this.selectedItem['active'] = 'tabs';
    this.fromDataService.layoutNodeSelected(this.l_config);
    console.log('选中当前tabs', this.selectedItem);

  }

}
