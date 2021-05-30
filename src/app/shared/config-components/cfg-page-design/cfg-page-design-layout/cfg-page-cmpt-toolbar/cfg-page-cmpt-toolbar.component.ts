import { Component, Input, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';
import { CommonUtils } from 'src/app/core/utils/common-utils';

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

  constructor(private modal: NzModalService, private message: NzMessageService) { }


  public config = {};
  public buttonConfig = {};
  body_style: any = { 'padding': '1px 2px', 'min-height': '40px' }
  body_style_selected: any = { 'padding': '1px 2px', 'border': "3px dashed red", 'min-height': '40px' }
  ngOnInit(): void {
    this.config = this.fromDataService.layoutSourceData[this.l_config['id']].length > 0 ? this.fromDataService.layoutSourceData[this.l_config['id']] : this.config;
    this.load();
  }

  public load() {

    let newConfig = {}
    this.l_config['children'].forEach(element => {

      newConfig[element['id']] = this.fromDataService.layoutSourceData[element['id']];
      if (element['children'] && element['children'].length > 0) {
        this.l_config['children'].forEach(item => {
          newConfig[item['id']] = this.fromDataService.layoutSourceData[item['id']];
        })

      }

    });
    this.buttonConfig = newConfig;

  }

  click(e?) {
    e.stopPropagation();
    // this.optionState = true;
    // 选中
    this.selectedItem['item'] = this.l_config;
    this.selectedItem['active'] = 'cnToolbar';
    this.fromDataService.layoutNodeSelected(this.l_config);
    console.log('选中当前tabs', this.selectedItem);

  }

  toolbarArray: any = [
    {
      title: '按钮01'
    }
  ];

  selectedIndex = 0;
  addToolbar() {
    this.toolbarArray.push({
      title: '按钮新增'
    });
    const tabid = CommonUtils.uuID(30);
    //  this.tabs.push({ id: tabid, title: 'New Tab' });
    // this.selectedIndex = this.tabs.length;
    let cmptObj = {
      "type": 'button',
      "title": "按钮",
      "container": 'exec'
    }
    let node = this.fromDataService.l_create_component_conent_button(this.l_config['id'], cmptObj);
    // this.l_config.children.splice(0, 0, node);
    this.fromDataService.layoutTreeInstance.addChildrenNode(this.l_config['id'], node, this.selectedIndex + 1);
    console.log('当前按钮配置', this.toolbarArray, this.l_config);
    this.load();
  }

  addDropdownItem(btn) {
    const tabid = CommonUtils.uuID(30);
    //  this.tabs.push({ id: tabid, title: 'New Tab' });
    // this.selectedIndex = this.tabs.length;
    let cmptObj = {
      "type": 'dropdownItem',
      "title": "下拉按钮",
      "container": 'exec'
    }
    let node = this.fromDataService.l_create_component_conent_button(btn['id'], cmptObj);
    // this.l_config.children.splice(0, 0, node);
    this.fromDataService.layoutTreeInstance.addChildrenNode(btn['id'], node, this.selectedIndex + 1);
    console.log('当前下拉按钮配置', btn);


  }

  clickItem(e?, btn?) {
    e.stopPropagation();
    // this.optionState = true;
    // 选中
    this.selectedItem['item'] = btn;
    this.selectedItem['active'] = btn['type'];
    this.fromDataService.layoutNodeSelected(btn);
    console.log('按钮选中当前', this.selectedItem);

  }

  closebutton(btn, pconfig) {
    this.modal.confirm({
      nzTitle: '提示',
      nzContent: '确定要删除按钮？',
      nzOkText: '确定',
      nzCancelText: '取消',
      nzOnOk: () => {
        let deleteIndex;

        for (let i = 0; i < pconfig['children'].length; i++) {
          if (pconfig['children'][i]['id'] === btn['id']) {
            deleteIndex = i;
          }
        }

        pconfig['children'].splice(deleteIndex, 1);
        this.fromDataService.layoutTreeInstance.delChildrenNode(pconfig['id'], {}, deleteIndex);
        this.fromDataService.deleteLayoutSourceData(btn['id']);
        /* */
      }
    });
    console.log('删除', btn);
  }

  getButonConfig(btn) {
    return this.fromDataService.layoutSourceData[btn['id']];
  }




}
