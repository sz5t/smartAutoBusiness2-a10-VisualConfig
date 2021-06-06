import { Component, Inject, Input, OnInit } from '@angular/core';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { CnComponentBase } from '../../cn-component.base';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { tr } from 'date-fns/locale';

@Component({
  selector: 'app-smt-page',
  templateUrl: './smt-page.component.html',
  styles: [
  ]
})
export class SmtPageComponent extends CnComponentBase implements OnInit {

  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) {
    super(componentService);
  }
  @Input() public config;

  public configdemo: any;

  public isShow: boolean = false;

  async ngOnInit() {
    this.configdemo = await this.loadPageConfig();
  }

  async loadPageConfig() {
    const url = this.config.loadingConfig.url;
    const method = this.config.loadingConfig.method ? this.config.loadingConfig.method : this.config.loadingConfig.ajaxType;
    const params = { ID: '154A38B0-EB91-4E18-8DE7-86031D140363' };
    const response = await this.executeHttpRequest(url, method, params).toPromise();
    return response['data'][0]['JSON'];
  }

  public executeHttpRequest(url, method, paramData): any {
    switch (method) {
      case 'get':
        return this.componentService.apiService[method](url, paramData);
      default:
        return this.componentService.apiService[method](url, paramData, {});
    }
  }

  showLayout($event) {
    this.isShow = true;
  }

}
