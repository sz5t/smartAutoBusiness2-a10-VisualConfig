import { Component, Inject, Input, OnInit } from '@angular/core';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { pageServerService } from 'src/app/core/services/page/page.service';
import { CnComponentBase } from '../../components/cn-component.base';

@Component({
  selector: 'app-smt-dynamic-page,[smt-dynamic-page]',
  templateUrl: './smt-dynamic-page.component.html',
  styles: [],
  providers: [pageServerService],
})
export class SmtDynamicPageComponent extends CnComponentBase implements OnInit {
  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
    public pageService: pageServerService,
  ) {
    super(componentService);
  }

  @Input() public config;
  @Input() public initData;

  ngOnInit(): void {
    // this.pageService['componentsConfig'] = this.config['pageJson']['componentsJson'];
    // this.pageService['permissionConfig'] = this.config['permissionJson'];
    // console.log('initData', this.initData);
    this.pageService['componentsConfig'] = this.config['pageJson'].hasOwnProperty('componentsJson') ? this.config['pageJson']['componentsJson'] : {}
    this.pageService['permissionConfig'] = this.config['permissionJson'].length > 0 ? this.config['permissionJson'] : [];
    this.pageService['pageCode'] = this.initData['name'];
  }
}
