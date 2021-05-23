import { ComponentFactoryResolver, ComponentRef, Directive, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, Type, ViewContainerRef } from '@angular/core';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';
import { CfgPageCmptFormComponent } from './cfg-page-cmpt-form/cfg-page-cmpt-form.component';
import { CfgPageCmptTableComponent } from './cfg-page-cmpt-table/cfg-page-cmpt-table.component';
import { CfgPageCmptTabsComponent } from './cfg-page-cmpt-tabs/cfg-page-cmpt-tabs.component';
import { CfgPageCmptToolbarComponent } from './cfg-page-cmpt-toolbar/cfg-page-cmpt-toolbar.component';
const components: { [type: string]: Type<any> } = {

  form: CfgPageCmptFormComponent,
  cnDataTable: CfgPageCmptTableComponent,
  // tree: 'cnTree',
  // treeTable: 'cnTreeTable',
  button: CfgPageCmptToolbarComponent,
  tabs: CfgPageCmptTabsComponent


};
@Directive({
  selector: '[appCfgPageDesignLayoutItem]'
})
export class CfgPageDesignLayoutItemDirective implements OnInit, OnChanges, OnDestroy {
  @Input() public l_config;
  @Input() public showLayout: any;
  @Input() public selectedItem: any;
  @Input() public cmptState: any;
  @Input() public fromDataService: configFormDataServerService;
  public component: ComponentRef<any>;
  constructor(private resolver: ComponentFactoryResolver, private container: ViewContainerRef) { }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this.container.clear();
    if (!this.l_config['type']) {
      return;
    }
    if (!components[this.l_config['type']]) {
      return;
    }
    const comp = this.resolver.resolveComponentFactory<any>(components[this.l_config['type']]);
    this.component = this.container.createComponent(comp);
    // this.component.instance.configData = { id: '001' };

    this.component.instance.selectedItem = this.selectedItem;
    this.component.instance.l_config = this.l_config;
    this.component.instance.showLayout = this.showLayout;



    this.component.instance.fromDataService = this.fromDataService;

    // configData
    console.log('==布局col内组件=====>>>>>>', this.l_config);
  }
  ngOnChanges(changes: SimpleChanges): void {


  }

  ngOnDestroy(): void {
    if (this.component) {
      this.component.destroy();
    }
  }
}
