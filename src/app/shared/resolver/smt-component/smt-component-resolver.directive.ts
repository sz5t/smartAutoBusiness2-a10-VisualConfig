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
const components: { [type: string]: Type<any> } = {
  cnDataTable: SmtDataTableComponent,
  tabs: SmtTabsComponent,
  cnToolbar: SmtToolbarComponent,
  cnTreeTable: SmtTreeTableComponent,
  smtLayOut: SmtLayoutComponent,
  smtPage: SmtPageComponent,
  cnTree: SmtTreeComponent,
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
  @Input() originData; // 配置数据

  private _componentRef: ComponentRef<any>;
  constructor(
    private _resolver: ComponentFactoryResolver,
    private _container: ViewContainerRef,
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) {}

  ngOnInit() {
    //this.assembleCmptConfig();
    this._buildComponent(this.config);
  }

  ngOnDestroy(): void {
    //  console.log('销毁前',  this.componentService.com,this.config.id);
    //  this.componentService.com=this.componentService.com.filter(e=>!e.hasOwnProperty(this.config.id));
    //  console.log('销毁后',  this.componentService.com);
  }

  private resolve(config) {
    if (config.component && components[config.component]) {
      this._buildComponent(config);
    } else {
      // const cmptObj: any = this._getComponentObjectById(this.config.id);

      // 2020.11.21
      const cmptObj: any = this._getMenuComponentObjectById(config.id);

      cmptObj.component = config.container;
      if (!components[cmptObj.component]) {
        const supportedTypes = Object.keys(components).join(', ');
        throw new Error(`Trying to use an unsupported types (${this.config.component}).Supported types: ${supportedTypes}`);
      } else {
        this._buildComponent(cmptObj);
      }
    }
  }

  private assembleCmptConfig() {
    this.config;
    this.originData;
    const componentType = this.config.container === 'component' ? this.config.type : this.config.container;
    const componentConfig = this.generateCmptConfig(componentType);
    // console.log('componentConfig', componentConfig);
    if (componentConfig) {
      this.resolve(componentConfig);
    }
  }

  private generateCmptConfig(cmptType) {
    let cmptConfig;
    switch (cmptType) {
      case 'cnDataTable':
        cmptConfig = this.getDataTableConfig();
        break;
      case 'tabs':
        cmptConfig = this.getTabsConfig();
        break;
      case 'cnToolbar':
        cmptConfig = this.getToolbarConfig();
        break;
      case 'cnRowToolbar':
        cmptConfig = this.getRowToolbarConfig();
        break;
    }
    return cmptConfig;
  }

  private getDataTableConfig() {
    const configData = this.originData[this.config.id];
    const config = new SmtDataTable();
    config.id = configData['id'];
    config.title = configData['title'];
    config.keyId = configData['keyId'] ? configData['keyId'] : 'ID';
    config.size = configData['size'] ? configData['size'] : 'deafult';
    config.pageSize = configData['pageSize'] ? configData['pageSize'] : 5;
    config.isBordered = configData['isBordered'] ? configData['isBordered'] : false;
    config.isFrontPagination = configData['isFrontPagination'] ? configData['isFrontPagination'] : false;
    config.isPagination = configData['isPagination'] ? configData['isPagination'] : true;
    config.isShowSizeChanger = configData['isShowSizeChanger'] ? configData['isShowSizeChanger'] : false;
    config.showTotal = configData['showTotal'] ? configData['showTotal'] : false;
    config.showCheckBox = configData['showCheckBox'] ? configData['showCheckBox'] : false;
    config.enableColSummary = configData['enableColSummary'] ? configData['enableColSummary'] : false;
    config.loadingOnInit = configData['loadingOnInit'] ? configData['loadingOnInit'] : false;
    config.isSelected = configData['isSelected'] ? configData['isSelected'] : false;
    config.pageSizeOptions = configData['pageSizeOptions'] ? configData['pageSizeOptions'] : [];
    config.scroll = configData['scroll'] ? configData['scroll'] : {};
    config.columns = configData['columns'] ? configData['columns'] : [];
    config.children = this.config['children'] ? this.config['children'] : [];
    config.customCommand = configData['customCommand'] ? configData['customCommand'] : [];
    config.eventConent = configData['eventConent'] ? configData['eventConent'] : [];
    return config;
  }

  private getTabsConfig() {
    const configData = this.originData[this.config.id];
    const config = new SmtTabs();
    config.id = configData['id'];
    config.title = configData['title'];
    config.children = this.config['children'] ? this.config['children'] : [];
    config.originData = this.originData;
    return config;
  }

  private getToolbarConfig() {
    let configData;
    if (this.originData) {
      configData = this.originData[this.config.id];
    }
    const config = new SmtToolbar();
    config.id = configData ? configData['id'] : this.config['id'];
    config.title = configData ? configData['title'] : this.config['title'];
    config.children = this.config['children'] ? this.config['children'] : [];
    config.originData = this.originData;
    config.parentId = configData ? configData['parentId'] : this.config['parentId'];
    config.customCommand = configData['customCommand'] ? configData['customCommand'] : this.config['customCommand'];
    config.eventConent = configData['eventConent'] ? configData['eventConent'] : this.config['eventConent'];
    return config;
  }

  private getRowToolbarConfig() {
    const config = new SmtToolbar();
    config.id = this.config['id'];
    config.title = this.config['title'];
    config.children = this.config['children'] ? this.config['children'] : [];
    config.originData = null;
    config.parentId = this.config['parentId'];
    config.customCommand = this.config['eventConent'];
    config.eventConent = this.config['eventConent'];
    return config;
  }

  private _buildComponent(componentObj) {
    const comp = this._resolver.resolveComponentFactory<any>(components[componentObj.type]);
    this._componentRef = this._container.createComponent(comp);
    this._componentRef.instance.config = componentObj;
    const _initValue_new = { ...this.initData };
    const _tempValue_new = { ...this.tempData };
    this._componentRef.instance.initData = _initValue_new;
    this._componentRef.instance.tempData = _tempValue_new;
    this._componentRef.instance.dataServe = this.dataServe;
    this.dataServe && this.dataServe.setComponentInstace(componentObj.id, this._componentRef);
  }

  private _getComponentObjectById(id) {
    return this.componentService.cacheService.getNone(id);
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
