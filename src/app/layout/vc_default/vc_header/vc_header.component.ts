import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SettingsService } from '@delon/theme';
import { CacheService } from '@delon/cache';
import { environment } from '@env/environment';

@Component({
  selector: 'vc-layout-header',
  templateUrl: './vc_header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VcHeaderComponent {
  searchToggleStatus: boolean;
  systemInfo: any;
  constructor(public settings: SettingsService, private _cacheService: CacheService) {
    this.systemInfo = environment.systemSettings.systemInfo;
  }

  toggleCollapsedSidebar() {
    this.settings.setLayout('collapsed', !this.settings.layout.collapsed);
  }

  searchToggleChange() {
    this.searchToggleStatus = !this.searchToggleStatus;
  }
}
