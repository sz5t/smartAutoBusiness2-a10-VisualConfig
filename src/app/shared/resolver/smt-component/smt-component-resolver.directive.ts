import { Type, Directive, OnInit, OnDestroy, Input, ComponentRef, ComponentFactoryResolver, ViewContainerRef, Inject } from '@angular/core';
import { pageConfigCache } from '@env/page-config-cache';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { CommonUtils } from 'src/app/core/utils/common-utils';
import { SmtLayoutComponent } from '../../components/smt-layout/smt-layout/smt-layout.component';
import { SmtPageComponent } from '../../components/smt-layout/smt-page/smt-page.component';
import { SmtDataTable } from './smt-table';
import { SmtDataTableComponent } from '../../smt-components/smt-data-table/smt-data-table.component';
import { SmtTabsComponent } from '../../smt-components/smt-tabs/smt-tabs.component';
import { SmtTabs } from './smt-tabs';
import { SmtToolbar } from './smt-toolbar';
import { SmtToolbarComponent } from '../../smt-components/smt-toolbar/smt-toolbar.component';
import { SmtTreeTableComponent } from '../../smt-components/smt-tree-table/smt-tree-table.component';
import { SmtTreeComponent } from '../../smt-components/smt-tree/smt-tree.component';
import { SmtFormComponent } from '../../smt-components/smt-form/smt-form.component';
const components: { [type: string]: Type<any> } = {
  cnDataTable: SmtDataTableComponent,
  tabs: SmtTabsComponent,
  cnToolbar: SmtToolbarComponent,
  cnRowToolbar: SmtToolbarComponent,
  cnTreeTable: SmtTreeTableComponent,
  cnTree: SmtTreeComponent,
  smtLayOut: SmtLayoutComponent,
  smtPage: SmtPageComponent,
  cnForm: SmtFormComponent,

  smtToolbar: SmtToolbarComponent,
  smtRowToolbar: SmtToolbarComponent,
  smtTree: SmtTreeComponent,
  smtForm: SmtFormComponent,
  smtDataTable: SmtDataTableComponent,
};

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: ' [smtComponentResolverDirective]',
})
export class SmtComponentResolverDirective implements OnInit, OnDestroy {
  @Input() config;
  @Input() initData;
  @Input() tempData;
  @Input() dataServe;

  private _componentRef: ComponentRef<any>;
  constructor(
    private _resolver: ComponentFactoryResolver,
    private _container: ViewContainerRef,
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) { }

  ngOnInit() {
    this.assembleCmptConfig();
  }

  ngOnDestroy(): void {
    //  console.log('销毁前',  this.componentService.com,this.config.id);
    //  this.componentService.com=this.componentService.com.filter(e=>!e.hasOwnProperty(this.config.id));
    //  console.log('销毁后',  this.componentService.com);
  }

  private assembleCmptConfig() {
    this.config;
    const componentType = this.config.container === 'component' ? this.config.type : this.config.container
    const componentConfig = this.generateCmptConfig();
    // console.log('componentConfig', componentConfig);
    if (componentConfig) {
      this.resolve(componentConfig, componentType);
    }
  }

  private resolve(config, type) {
    if (type && components[type]) {
      this._buildComponent(config, type);
    } else {
      // const cmptObj: any = this._getComponentObjectById(this.config.id);
      const supportedTypes = Object.keys(components).join(', ');
      throw new Error(`Trying to use an unsupported types (${this.config.component}).Supported types: ${supportedTypes}`);

    }
  }



  private generateCmptConfig() {
    let cmptConfig;
    cmptConfig = this.dataServe.componentsConfig[this.config.id];
    cmptConfig['children'] = this.config['children'] ? this.config['children'] : [];
    return cmptConfig;
  }

  private _buildComponent(componentObj, type) {
    const comp = this._resolver.resolveComponentFactory<any>(components[type]);
    this._componentRef = this._container.createComponent(comp);
    this._componentRef.instance.config = componentObj;
    const _initValue_new = { ...this.initData };
    const _tempValue_new = { ...this.tempData };
    this._componentRef.instance.initData = _initValue_new;
    this._componentRef.instance.tempData = _tempValue_new;
    this._componentRef.instance.dataServe = this.dataServe;
    this.dataServe && this.dataServe.setComponentInstace(componentObj.id, this._componentRef.instance);
  }

  // 获取当前组件配置（从缓存读取组件信息）
  private _getMenuComponentObjectById(id): any {
    // 1.加载当前menu下的缓存信息
    const activeMenu: any = this.componentService.cacheService.getNone('activeMenu');
    // 2.从当前缓存下查找当前menu的配置集合
    const menuId = activeMenu.id;
    // const activeConfig = this.componentService.cacheService.getNone(menuId);
    // 3.层级是否控制在布局页面结构
    // this.layoutId  布局页面id 也就是子页标识
    // activeConfig= {pageConfig:{},permissionConfig:{}};
    // 4.从当前menu配置集合中查找相应组件的详细配置信息
    // let componentConfig = activeConfig['pageConfig'][id];
    let componentConfig = null;
    if (pageConfigCache[menuId].pageConfig[id]) {
      componentConfig = CommonUtils.deepCopy(pageConfigCache[menuId].pageConfig[id]);
    }
    return componentConfig;
  }
}
