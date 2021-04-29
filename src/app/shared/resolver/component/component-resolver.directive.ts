import { Type, Directive, OnInit, OnDestroy, Input, ComponentRef, ComponentFactoryResolver, ViewContainerRef, Inject } from '@angular/core';
import { pageConfigCache } from '@env/page-config-cache';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { CommonUtils } from 'src/app/core/utils/common-utils';
import { CfgAtrributeCascadeSenderComponent } from '../../components/cn-attribute/cn-attribute-items/cfg-atrribute-cascade-sender/cfg-atrribute-cascade-sender.component';
import { CfgAttributeAssembleAjaxComponent } from '../../components/cn-attribute/cn-attribute-items/cfg-attribute-assemble-ajax/cfg-attribute-assemble-ajax.component';
import { CfgAttributeAssembleResourceSelectComponent } from '../../components/cn-attribute/cn-attribute-items/cfg-attribute-assemble-resource-select/cfg-attribute-assemble-resource-select.component';
import { CfgAttributeFormStateComponent } from '../../components/cn-attribute/cn-attribute-items/cfg-attribute-form-state/cfg-attribute-form-state.component';
import { CfgAttributeRanksBasicComponent } from '../../components/cn-attribute/cn-attribute-items/cfg-attribute-ranks-basic/cfg-attribute-ranks-basic.component';
import { CfgAttributeRanksColComponent } from '../../components/cn-attribute/cn-attribute-items/cfg-attribute-ranks-col/cfg-attribute-ranks-col.component';
import { CfgAttributeRanksCombComponent } from '../../components/cn-attribute/cn-attribute-items/cfg-attribute-ranks-comb/cfg-attribute-ranks-comb.component';
import { CfgAttributeRanksRowComponent } from '../../components/cn-attribute/cn-attribute-items/cfg-attribute-ranks-row/cfg-attribute-ranks-row.component';
import { CfgAttributeValidationComponent } from '../../components/cn-attribute/cn-attribute-items/cfg-attribute-validation/cfg-attribute-validation.component';
import { CfgPropertyEditorCascadeValueComponent } from '../../components/cn-attribute/cn-attribute-items/cfg-property-editor-cascade-value/cfg-property-editor-cascade-value.component';
import { CfgCascadePropertyComponent } from '../../components/cn-attribute/cfg-attribute-items/cfg-cascade-property/cfg-cascade-property.component';
import { CnCalendarComponent } from '../../components/cn-calendar/cn-calendar.component';
import { CnCardListComponent } from '../../components/cn-card-list/cn-card-list.component';
import { CnCarouseComponent } from '../../components/cn-carouse/cn-carouse.component';
import { CnChartsComponent } from '../../components/cn-charts/cn-charts.component';
import { CnContainersComponent } from '../../components/cn-containers/cn-containers.component';
import { CnDataStepsComponent } from '../../components/cn-data-steps/cn-data-steps.component';
import { CnDescriptionsComponent } from '../../components/cn-descriptions/cn-descriptions.component';
import { CnDynamicContainersComponent } from '../../components/cn-dynamic-containers/cn-dynamic-containers.component';
import { CnProgressComponent } from '../../components/cn-progress/cn-progress.component';
import { CnReportGridComponent } from '../../components/cn-report-grid/cn-report-grid.component';
import { CnResultComponent } from '../../components/cn-result/cn-result.component';
import { CnStatisticComponent } from '../../components/cn-statistic/cn-statistic.component';
import { CnStepsComponent } from '../../components/cn-steps/cn-steps.component';
import { CnTagComponent } from '../../components/cn-tag/cn-tag.component';
import { CnTimeLineComponent } from '../../components/cn-time-line/cn-time-line.component';
import { CnStaticTreeTableComponent } from '../../components/cn-tree-table/cn-static-tree-table/cn-static-tree-table.component';
import { CnTreeTableComponent } from '../../components/cn-tree-table/cn-tree-table.component';
import { CnTreeComponent } from '../../components/cn-tree/cn-tree.component';
import { CnUploadComponent } from '../../components/cn-upload/cn-upload.component';
import { CnDataFormComponent } from '../../components/data-form/cn-data-form.component';
import { CnDataTableComponent } from '../../components/data_table/cn-data-table.component';
import { CnStaticTableComponent } from '../../components/data_table/cn-static-table.component';
import { CnToolbarComponent } from '../../components/toolbar/cn-toolbar.component';
import { CnFlowDesignMoreComponent } from '../../components/work-flow/cn-flow-design-more/cn-flow-design-more.component';
import { CnFlowDesignComponent } from '../../components/work-flow/cn-flow-design/cn-flow-design.component';
import { CnFlowApprovalComponent } from '../../components/work-flow/cn-flow-items/cn-flow-approval/cn-flow-approval.component';
import { CnFlowStartComponent } from '../../components/work-flow/cn-flow-items/cn-flow-start/cn-flow-start.component';
import { CnFlowPreviewComponent } from '../../components/work-flow/cn-flow-preview/cn-flow-preview.component';
import { CfgLFormDesignComponent } from '../../config-components/cfg-l-form-design/cfg-l-form-design.component';
import { CfgViewLayoutComponent } from '../../config-components/config-attribute/cfg-view-layout/cfg-view-layout.component';
import { CfgLayoutPageComponent } from '../../config-components/config-layout-page/cfg-layout-page/cfg-layout-page.component';

const components: { [type: string]: Type<any> } = {
  cnDataTable: CnDataTableComponent,
  cnToolbar: CnToolbarComponent,
  form: CnDataFormComponent,
  cnTree: CnTreeComponent,
  cnTreeTable: CnTreeTableComponent,
  cnDescription: CnDescriptionsComponent,
  cnSteps: CnStepsComponent,
  cnStatistic: CnStatisticComponent,
  cnProgress: CnProgressComponent,
  cnCalendar: CnCalendarComponent,
  cfgLayoutPage: CfgLayoutPageComponent,
  cnCardList: CnCardListComponent,
  cnStaticTable: CnStaticTableComponent,
  cnTag: CnTagComponent,
  cnUpload: CnUploadComponent,
  cnContainers: CnContainersComponent,
  CnCarouse: CnCarouseComponent,
  cnDataStep: CnDataStepsComponent,
  CnReportGrid: CnReportGridComponent,
  cnStaticTreeTable: CnStaticTreeTableComponent,
  cnResult: CnResultComponent,
  cnWFDesign: CnFlowDesignComponent,
  cnCharts: CnChartsComponent,
  cnDynamicContainers: CnDynamicContainersComponent,
  cnWFPreview: CnFlowPreviewComponent,
  cnTimeLine: CnTimeLineComponent,
  cnWFDesignMore: CnFlowDesignMoreComponent,
  cnWFApproval: CnFlowApprovalComponent,
  cnWFStart: CnFlowStartComponent,
  configForm: CfgLFormDesignComponent,
  configPage: CfgViewLayoutComponent,
  cfgPropertyEditor: CfgPropertyEditorCascadeValueComponent,
  cfgCascadeSender: CfgAtrributeCascadeSenderComponent,
  cfgAssembleAjax: CfgAttributeAssembleAjaxComponent,
  cfgRanksComb: CfgAttributeRanksCombComponent,
  cfgRanks: CfgAttributeRanksBasicComponent,
  cfgRanksRow: CfgAttributeRanksRowComponent,
  cfgRanksCol: CfgAttributeRanksColComponent,
  cfgResourceSelect: CfgAttributeAssembleResourceSelectComponent,
  cfgFormState: CfgAttributeFormStateComponent,
  cfgFormValidation: CfgAttributeValidationComponent,
  cnCascadeProperty: CfgCascadePropertyComponent,
};

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: ' [cnComponentResolverDirective]',
})
export class CnComponentResolverDirective implements OnInit, OnDestroy {
  @Input() config;
  @Input() initData;
  @Input() tempData;
  @Input() dataServe;
  @Input() layoutId;

  private _componentRef: ComponentRef<any>;
  constructor(
    private _resolver: ComponentFactoryResolver,
    private _container: ViewContainerRef,
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) { }

  ngOnInit() {
    this.resolve();
  }

  ngOnDestroy(): void {
    //  console.log('销毁前',  this.componentService.com,this.config.id);
    //  this.componentService.com=this.componentService.com.filter(e=>!e.hasOwnProperty(this.config.id));
    //  console.log('销毁后',  this.componentService.com);
  }

  private resolve() {
    if (this.config) {
      if (this.config.component && components[this.config.component]) {
        this._buildComponent(this.config);
      } else {
        // const cmptObj: any = this._getComponentObjectById(this.config.id);

        // 2020.11.21
        const cmptObj: any = this._getMenuComponentObjectById(this.config.id);

        cmptObj.component = this.config.container;
        if (!components[cmptObj.component]) {
          const supportedTypes = Object.keys(components).join(', ');
          throw new Error(`Trying to use an unsupported types (${this.config.component}).Supported types: ${supportedTypes}`);
        } else {
          this._buildComponent(cmptObj);
        }
      }
    }

    // const comp = this._resolver.resolveComponentFactory<any>(
    //     components[this.config.component]
    // );

    // this._componentRef = this._container.createComponent(comp);
    // console.log(this.config);
    // if (this.config.component) {
    //     this._componentRef.instance.config = this.config;
    // } else {
    //     this._componentRef.instance.config = this.getComponentObjectById(this.config.id);
    // }

    // this._componentRef.instance.initData = this.initData;
    // this._componentRef.instance.tempData = this.tempData;
    // console.log('创建创建创建', this._componentRef );
    //  this.componentService.com.push({[this.config.id]:this._componentRef});
    //  console.log('创建创建创建+++', this.componentService.com );
  }

  private _buildComponent(componentObj) {
    const comp = this._resolver.resolveComponentFactory<any>(components[componentObj.component]);

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
