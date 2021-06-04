import { Component, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'vc-header-storage',
  template: `
    <i nz-icon nzType="tool"></i>
    {{ 'menu.clear.local.storage' | translate }}
  `,
  host: {
    '[class.d-block]': 'true',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VcHeaderStorageComponent {
  constructor(private modalSrv: NzModalService, private messageSrv: NzMessageService) {}

  @HostListener('click')
  _click() {
    this.modalSrv.confirm({
      nzTitle: 'Make sure clear all local storage?',
      nzOnOk: () => {
        localStorage.clear();
        this.messageSrv.success('Clear Finished!');
      },
    });
  }
}
