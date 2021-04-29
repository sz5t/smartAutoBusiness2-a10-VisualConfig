import { Component, Input, OnInit } from '@angular/core';
import { CommonUtils } from 'src/app/core/utils/common-utils';

@Component({
  selector: 'app-cfg-toolbar-action-item',
  templateUrl: './cfg-toolbar-action-item.component.html',
  styles: [
  ]
})
export class CfgToolbarActionItemComponent implements OnInit {

  @Input() public dataConent;

  readonly: any = false;
  interfaceCount: any = 0;
  constructor() { }

  ngOnInit(): void {
  }



  addBtnClick(v?, p?) {
    console.log('新增');
    p.push({ id: CommonUtils.uuID(30), name: '[CMPT_CUSTOM][CUSTOM_EXEC]' });

  }

  setting(p?) {
    console.log('设置', p);

  }

  delete(item?, p?) {

    p.eventConent = p.eventConent.filter(d => d !== item);
    console.log('删除后', p)

  }


}
