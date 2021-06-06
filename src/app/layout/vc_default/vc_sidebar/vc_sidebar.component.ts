import { state } from '@angular/animations';
import { Component, ChangeDetectionStrategy, Input, OnInit, Inject } from '@angular/core';
import { DA_SERVICE_TOKEN, ITokenService, TokenService } from '@delon/auth';
import { SettingsService } from '@delon/theme';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';

@Component({
  selector: 'vc-layout-sidebar',
  templateUrl: './vc_sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VcSidebarComponent implements OnInit {
  @Input()
  public layoutCollapsed;
  public projectList: any;
  public currentProject: {
    name: string;
    code: string;
  };
  constructor(
    public settings: SettingsService,
    @Inject(DA_SERVICE_TOKEN) private _tokenService: ITokenService,
    @Inject(BSN_COMPONENT_SERVICES)
    private _componentService: ComponentServiceProvider,
  ) {}
  ngOnInit() {
    this.projectList = this.settings.app.data;
    this.currentProject = {
      name: this.projectList[0].NAME,
      code: this.projectList[0].CODE,
    };
    this.updateProjectInfo(this.currentProject.code);
  }

  public change(project: any) {
    this.currentProject = {
      name: project.NAME,
      code: project.CODE,
    };
    this._componentService.reloadDynamicLayoutSubject.next(this.currentProject.code);
    this.updateProjectInfo(this.currentProject.code);
  }

  private updateProjectInfo(projectCode: string) {
    this._componentService.apiService.post('smt-base/token/update', { projectCode: projectCode }).subscribe((response) => {
      if (response && response.data && response.state === 1) {
        this._componentService.cacheService.set('userInfo', response.data);
        this._tokenService.set({ key: 'token', token: response.data.value });
      }
    });
  }
}
