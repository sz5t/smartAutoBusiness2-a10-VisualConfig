import { CnCardListComponent } from './components/cn-card-list/cn-card-list.component';
import { CnFormSearchSelectComponent } from './components/data-form/cn-form-search-items/cn-form-search-select/cn-form-search-select.component';
import { CnFormButtonComponent } from './components/data-form/cn-form-items/cn-form-button/cn-form-button.component';
import { CnCalendarComponent } from './components/cn-calendar/cn-calendar.component';
import { CnGridTagComponent } from './components/data_table/cn-grid-items/cn-grid-tag/cn-grid-tag.component';
import { CnStepsComponent } from './components/cn-steps/cn-steps.component';
import { CnDescriptionsComponent } from './components/cn-descriptions/cn-descriptions.component';
import { CnPageHeaderComponent } from './components/layout/cn-page-header.component';
import { CnTreeComponent } from './components/cn-tree/cn-tree.component';
import { CnComponentResolverDirective } from './resolver/component/component-resolver.directive';
import { CnDataTableComponent } from './components/data_table/cn-data-table.component';
import { CnTabsComponent } from './components/layout/cn-tabs.component';
import { CnLayoutComponent } from './components/layout/cn-layout.component';
import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// delon
import { AlainThemeModule } from '@delon/theme';
import { DelonChartModule } from '@delon/chart';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';
// i18n
import { TranslateModule } from '@ngx-translate/core';
// #region third libs
import { CountdownModule } from 'ngx-countdown';
import { NzResizableModule } from 'ng-zorro-antd/resizable';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { SafeUrlPipe } from '../core/pipe/safe-url.pipe';
import { CnAttributeItemDirective } from './components/cn-attribute/cn-attribute-item.directive';
import { CnAttributeArrayComponent } from './components/cn-attribute/cn-attribute-items/cn-attribute-array/cn-attribute-array.component';
import { CnAttributeFormComponent } from './components/cn-attribute/cn-attribute-items/cn-attribute-form/cn-attribute-form.component';
import { CnAttributeObjectComponent } from './components/cn-attribute/cn-attribute-items/cn-attribute-object/cn-attribute-object.component';
import { CnAttributePropertyGridComponent } from './components/cn-attribute/cn-attribute-items/cn-attribute-property-grid/cn-attribute-property-grid.component';
import { CnAttributeTableFormComponent } from './components/cn-attribute/cn-attribute-items/cn-attribute-table-form/cn-attribute-table-form.component';
import { CnAttributeTableComponent } from './components/cn-attribute/cn-attribute-items/cn-attribute-table/cn-attribute-table.component';
import { CnAttributeComponent } from './components/cn-attribute/cn-attribute.component';
import { CnCarouseComponent } from './components/cn-carouse/cn-carouse.component';
import { CnCodeEditComponent } from './components/cn-code-edit/cn-code-edit.component';
import { CnContainersComponent } from './components/cn-containers/cn-containers.component';
import { CnCustomGroupStateComponent } from './components/cn-custom-items/cn-custom-group-state/cn-custom-group-state.component';
import { CnCustomIconStateComponent } from './components/cn-custom-items/cn-custom-icon-state/cn-custom-icon-state.component';
import { CnDataStepsComponent } from './components/cn-data-steps/cn-data-steps.component';
import { CnPageComponent } from './components/cn-page/cn-page.component';
import { CnProgressComponent } from './components/cn-progress/cn-progress.component';
import { CnReportGridComponent } from './components/cn-report-grid/cn-report-grid.component';
import { CnStatisticComponent } from './components/cn-statistic/cn-statistic.component';
import { CnTagComponent } from './components/cn-tag/cn-tag.component';
import { CnStaticTreeTableComponent } from './components/cn-tree-table/cn-static-tree-table/cn-static-tree-table.component';
import { CnTreeTableComponent } from './components/cn-tree-table/cn-tree-table.component';
import { CnTreeTransferComponent } from './components/cn-tree-transfer/cn-tree-transfer.component';
import { CnUploadComponent } from './components/cn-upload/cn-upload.component';
import { CnDataFormComponent } from './components/data-form/cn-data-form.component';
import { CnFormItemDirective } from './components/data-form/cn-form-item.directive';
import { CnFormCascaderComponent } from './components/data-form/cn-form-items/cn-form-cascader/cn-form-cascader.component';
import { CnFormCheckboxGroupComponent } from './components/data-form/cn-form-items/cn-form-checkbox-group/cn-form-checkbox-group.component';
import { CnFormCheckboxComponent } from './components/data-form/cn-form-items/cn-form-checkbox/cn-form-checkbox.component';
import { CnFormCodeEditComponent } from './components/data-form/cn-form-items/cn-form-code-edit/cn-form-code-edit.component';
import { CnFormCustomInputComponent } from './components/data-form/cn-form-items/cn-form-custom-input/cn-form-custom-input.component';
import { CnFormCustomSelectComponent } from './components/data-form/cn-form-items/cn-form-custom-select/cn-form-custom-select.component';
import { CnFormDatePickerComponent } from './components/data-form/cn-form-items/cn-form-date-picker/cn-form-date-picker.component';
import { CnFormGridSelectComponent } from './components/data-form/cn-form-items/cn-form-grid-select/cn-form-grid-select.component';
import { CnFormGroupComponent } from './components/data-form/cn-form-items/cn-form-group/cn-form-group.component';
import { CnFormInputPasswordComponent } from './components/data-form/cn-form-items/cn-form-input-password/cn-form-input-password.component';
import { CnFormInputComponent } from './components/data-form/cn-form-items/cn-form-input/cn-form-input.component';
import { CnFormLabelComponent } from './components/data-form/cn-form-items/cn-form-label/cn-form-label.component';
import { CnFormMonthPickerComponent } from './components/data-form/cn-form-items/cn-form-month-picker/cn-form-month-picker.component';
import { CnFormRadioComponent } from './components/data-form/cn-form-items/cn-form-radio/cn-form-radio.component';
import { CnFormRangePickerComponent } from './components/data-form/cn-form-items/cn-form-range-picker/cn-form-range-picker.component';
import { CnFormScancodeComponent } from './components/data-form/cn-form-items/cn-form-scancode/cn-form-scancode.component';
import { CnFormSelectMultipleComponent } from './components/data-form/cn-form-items/cn-form-select-multiple/cn-form-select-multiple.component';
import { CnFormSelectComponent } from './components/data-form/cn-form-items/cn-form-select/cn-form-select.component';
import { CnFormSpanComponent } from './components/data-form/cn-form-items/cn-form-span/cn-form-span.component';
import { CnFormStaticGridComponent } from './components/data-form/cn-form-items/cn-form-static-grid/cn-form-static-grid.component';
import { CnFormSwitchComponent } from './components/data-form/cn-form-items/cn-form-switch/cn-form-switch.component';
import { CnFormTagComponent } from './components/data-form/cn-form-items/cn-form-tag/cn-form-tag.component';
import { CnFormTextareaComponent } from './components/data-form/cn-form-items/cn-form-textarea/cn-form-textarea.component';
import { CnFormTransferComponent } from './components/data-form/cn-form-items/cn-form-transfer/cn-form-transfer.component';
import { CnFormTreeSelectComponent } from './components/data-form/cn-form-items/cn-form-tree-select/cn-form-tree-select.component';
import { CnFormWeekPickerComponent } from './components/data-form/cn-form-items/cn-form-week-picker/cn-form-week-picker.component';
import { CnFormYearPickerComponent } from './components/data-form/cn-form-items/cn-form-year-picker/cn-form-year-picker.component';
import { CnGridItemDirective } from './components/data_table/cn-grid-item.directive';
import { CnGridCheckboxComponent } from './components/data_table/cn-grid-items/cn-grid-checkbox/cn-grid-checkbox.component';
import { CnGridCodeEditComponent } from './components/data_table/cn-grid-items/cn-grid-code-edit/cn-grid-code-edit.component';
import { CnGridCustomSelectComponent } from './components/data_table/cn-grid-items/cn-grid-custom-select/cn-grid-custom-select.component';
import { CnGridDatePickerComponent } from './components/data_table/cn-grid-items/cn-grid-date-picker/cn-grid-date-picker.component';
import { CnGridGridSelectComponent } from './components/data_table/cn-grid-items/cn-grid-grid-select/cn-grid-grid-select.component';
import { CnGridInputComponent } from './components/data_table/cn-grid-items/cn-grid-input/cn-grid-input.component';
import { CnGridMonthPickerComponent } from './components/data_table/cn-grid-items/cn-grid-month-picker/cn-grid-month-picker.component';
import { CnGridRadioComponent } from './components/data_table/cn-grid-items/cn-grid-radio/cn-grid-radio.component';
import { CnGridRangePickerComponent } from './components/data_table/cn-grid-items/cn-grid-range-picker/cn-grid-range-picker.component';
import { CnGridSelectMultipleComponent } from './components/data_table/cn-grid-items/cn-grid-select-multiple/cn-grid-select-multiple.component';
import { CnGridSelectComponent } from './components/data_table/cn-grid-items/cn-grid-select/cn-grid-select.component';
import { CnGridSpanComponent } from './components/data_table/cn-grid-items/cn-grid-span/cn-grid-span.component';
import { CnGridSwitchComponent } from './components/data_table/cn-grid-items/cn-grid-switch/cn-grid-switch.component';
import { CnGridTextareaComponent } from './components/data_table/cn-grid-items/cn-grid-textarea/cn-grid-textarea.component';
import { CnGridTreeSelectComponent } from './components/data_table/cn-grid-items/cn-grid-tree-select/cn-grid-tree-select.component';
import { CnGridWeekPickerComponent } from './components/data_table/cn-grid-items/cn-grid-week-picker/cn-grid-week-picker.component';
import { CnGridYearPickerComponent } from './components/data_table/cn-grid-items/cn-grid-year-picker/cn-grid-year-picker.component';
import { CnStaticTableComponent } from './components/data_table/cn-static-table.component';
import { CnCustomLayoutComponent } from './components/layout/cn-custom-layout.component';
import { CnDynamicLayoutComponent } from './components/layout/cn-dynamic-layout.component';
import { CnDynamicPageHeaderComponent } from './components/layout/cn-dynamic-page-header.component';
import { CnToolbarComponent } from './components/toolbar/cn-toolbar.component';

import { CnDynamicLayoutResolverDirective } from './resolver/layout/dynamic-layout-resolver.directive';
import { CnLayoutResolverDirective } from './resolver/layout/layout-resolver.directive';
import { SHARED_DELON_MODULES } from './shared-delon.module';
import { SHARED_ZORRO_MODULES } from './shared-zorro.module';
import { CnFlowDesignComponent } from './components/work-flow/cn-flow-design/cn-flow-design.component';
import { CnFlowPreviewComponent } from './components/work-flow/cn-flow-preview/cn-flow-preview.component';
import { CnGridDownXlsxComponent } from './components/data_table/cn-grid-items/cn-grid-down-xlsx/cn-grid-down-xlsx.component';
import { CnGridBadgeComponent } from './components/data_table/cn-grid-items/cn-grid-badge/cn-grid-badge.component';
import { CnResultComponent } from './components/cn-result/cn-result.component';
import { CnDynamicTemplateLayoutComponent } from './resolver/dynamic-template-layout/dynamic-template-layout.component';
import { CnFlowAttrSettingComponent } from './components/work-flow/cn-flow-items/cn-flow-attr-setting/cn-flow-attr-setting.component';
import { CnBarChartComponent } from './components/cn-charts/cn-charts-items/cn-bar-chart/cn-bar-chart.component';
import { CnChartsComponent } from './components/cn-charts/cn-charts.component';
import { CnChartsDirective } from './components/cn-charts/cn-charts-directive.directive';
import { CnDynamicContainersComponent } from './components/cn-dynamic-containers/cn-dynamic-containers.component';
import { CnTimeLineComponent } from './components/cn-time-line/cn-time-line.component';
import { CnFlowDesignMoreComponent } from './components/work-flow/cn-flow-design-more/cn-flow-design-more.component';
import { CnGridCustomObjectComponent } from './components/data_table/cn-grid-items/cn-grid-custom-object/cn-grid-custom-object.component';
import { CnHorizontalBarChartComponent } from './components/cn-charts/cn-charts-items/cn-horizontal-bar-chart/cn-horizontal-bar-chart.component';
import { CnBrokenLineChartComponent } from './components/cn-charts/cn-charts-items/cn-broken-line-chart/cn-broken-line-chart.component';
import { CnFanChartComponent } from './components/cn-charts/cn-charts-items/cn-fan-chart/cn-fan-chart.component';
import { CnTimeAxisChartComponent } from './components/cn-charts/cn-charts-items/cn-time-axis-chart/cn-time-axis-chart.component';
import { CnMultipleYAxisChartComponent } from './components/cn-charts/cn-charts-items/cn-multiple-y-axis-chart/cn-multiple-y-axis-chart.component';
import { CnGridChartsComponent } from './components/data_table/cn-grid-items/cn-grid-charts/cn-grid-charts.component';
import { CnMultiLevelFacetChartComponent } from './components/cn-charts/cn-charts-items/cn-multi-level-facet-chart/cn-multi-level-facet-chart.component';
import { CnFunnelChartComponent } from './components/cn-charts/cn-charts-items/cn-funnel-chart/cn-funnel-chart.component';
import { CnDashboardChartComponent } from './components/cn-charts/cn-charts-items/cn-dashboard-chart/cn-dashboard-chart.component';
import { CnColorDashboardChartComponent } from './components/cn-charts/cn-charts-items/cn-color-dashboard-chart/cn-color-dashboard-chart.component';
import { CnRadarMapChartComponent } from './components/cn-charts/cn-charts-items/cn-radar-map-chart/cn-radar-map-chart.component';
import { CnFlowAttrSettingMoreComponent } from './components/work-flow/cn-flow-items/cn-flow-attr-setting-more/cn-flow-attr-setting-more.component';
import { CnFlowApprovalComponent } from './components/work-flow/cn-flow-items/cn-flow-approval/cn-flow-approval.component';
import { CnFlowTableComponent } from './components/work-flow/cn-flow-items/cn-flow-table/cn-flow-table.component';
import { CnFlowStartComponent } from './components/work-flow/cn-flow-items/cn-flow-start/cn-flow-start.component';
import { CnFormObjectComponent } from './components/data-form/cn-form-items/cn-form-object/cn-form-object.component';

import { CfgPropertyEditorCascadeValueComponent } from './components/cn-attribute/cn-attribute-items/cfg-property-editor-cascade-value/cfg-property-editor-cascade-value.component';
import { CfgAtrributeCascadeSenderComponent } from './components/cn-attribute/cn-attribute-items/cfg-atrribute-cascade-sender/cfg-atrribute-cascade-sender.component';
import { CfgAttributeCascadeReceiverComponent } from './components/cn-attribute/cn-attribute-items/cfg-attribute-cascade-receiver/cfg-attribute-cascade-receiver.component';
import { CfgAttributeAssembleAjaxComponent } from './components/cn-attribute/cn-attribute-items/cfg-attribute-assemble-ajax/cfg-attribute-assemble-ajax.component';
import { CfgAttributeRanksCombComponent } from './components/cn-attribute/cn-attribute-items/cfg-attribute-ranks-comb/cfg-attribute-ranks-comb.component';
import { CfgAttributeRanksBasicComponent } from './components/cn-attribute/cn-attribute-items/cfg-attribute-ranks-basic/cfg-attribute-ranks-basic.component';
import { CfgAttributeRanksRowComponent } from './components/cn-attribute/cn-attribute-items/cfg-attribute-ranks-row/cfg-attribute-ranks-row.component';
import { CfgAttributeRanksColComponent } from './components/cn-attribute/cn-attribute-items/cfg-attribute-ranks-col/cfg-attribute-ranks-col.component';
import { CfgAttributeRanksRowModalComponent } from './components/cn-attribute/cn-attribute-items/cfg-attribute-ranks-row-modal/cfg-attribute-ranks-row-modal.component';

import { CfgAttributeAssembleResourceSelectComponent } from './components/cn-attribute/cn-attribute-items/cfg-attribute-assemble-resource-select/cfg-attribute-assemble-resource-select.component';
import { CfgAttributeFormStateComponent } from './components/cn-attribute/cn-attribute-items/cfg-attribute-form-state/cfg-attribute-form-state.component';
import { CfgAttributeValidationComponent } from './components/cn-attribute/cn-attribute-items/cfg-attribute-validation/cfg-attribute-validation.component';
import { CfgCascadePropertyComponent } from './components/cn-attribute/cfg-attribute-items/cfg-cascade-property/cfg-cascade-property.component';
import { CfgPageDesignComponent } from './config-components/cfg-page-design/cfg-page-design.component';
import { CfgFormDesignComponent } from './config-components/cfg-form-design/cfg-form-design.component';
import { CfgFormLayoutComponent } from './config-components/cfg-form-design/cfg-form-design-layout/cfg-form-layout/cfg-form-layout.component';
import { CfgFormPropertyComponent } from './config-components/cfg-form-design/cfg-form-design-items/cfg-form-property/cfg-form-property.component';
import { CfgFormSiderComponent } from './config-components/cfg-form-design/cfg-form-design-items/cfg-form-sider/cfg-form-sider.component';
import { CfgPageSiderComponent } from './config-components/cfg-page-design/cfg-page-design-items/cfg-page-sider/cfg-page-sider.component';
import { CfgPageViewComponent } from './config-components/cfg-page-design/cfg-page-design-items/cfg-page-view/cfg-page-view.component';
import { CfgPagePropertyComponent } from './config-components/cfg-page-design/cfg-page-design-items/cfg-page-property/cfg-page-property.component';
import { CfgFormViewComponent } from './config-components/cfg-form-design/cfg-form-design-items/cfg-form-view/cfg-form-view.component';
import { CfgPageLayoutComponent } from './config-components/cfg-page-design/cfg-page-design-layout/cfg-page-layout/cfg-page-layout.component';
import { CfgPageRowsComponent } from './config-components/cfg-page-design/cfg-page-design-layout/cfg-page-rows/cfg-page-rows.component';
import { CfgPageRowComponent } from './config-components/cfg-page-design/cfg-page-design-layout/cfg-page-row/cfg-page-row.component';
import { CfgPageColsComponent } from './config-components/cfg-page-design/cfg-page-design-layout/cfg-page-cols/cfg-page-cols.component';
import { CfgPageColComponent } from './config-components/cfg-page-design/cfg-page-design-layout/cfg-page-col/cfg-page-col.component';
import { CfgPageContainerComponent } from './config-components/cfg-page-design/cfg-page-design-layout/cfg-page-container/cfg-page-container.component';
import { CfgPageCmptFormComponent } from './config-components/cfg-page-design/cfg-page-design-layout/cfg-page-cmpt-form/cfg-page-cmpt-form.component';
import { CfgPageCmptTableComponent } from './config-components/cfg-page-design/cfg-page-design-layout/cfg-page-cmpt-table/cfg-page-cmpt-table.component';
import { CfgPageCmptToolbarComponent } from './config-components/cfg-page-design/cfg-page-design-layout/cfg-page-cmpt-toolbar/cfg-page-cmpt-toolbar.component';
import { CfgPageCmptTabsComponent } from './config-components/cfg-page-design/cfg-page-design-layout/cfg-page-cmpt-tabs/cfg-page-cmpt-tabs.component';
import { CfgFormRowsComponent } from './config-components/cfg-form-design/cfg-form-design-layout/cfg-form-rows/cfg-form-rows.component';
import { CfgFormRowComponent } from './config-components/cfg-form-design/cfg-form-design-layout/cfg-form-row/cfg-form-row.component';
import { CfgFormColsComponent } from './config-components/cfg-form-design/cfg-form-design-layout/cfg-form-cols/cfg-form-cols.component';
import { CfgFormColComponent } from './config-components/cfg-form-design/cfg-form-design-layout/cfg-form-col/cfg-form-col.component';
import { CfgFormContainerComponent } from './config-components/cfg-form-design/cfg-form-design-layout/cfg-form-container/cfg-form-container.component';
import { CfgPropertyTypeComponent } from './config-components/cfg-property/cfg-property-type/cfg-property-type.component';
import { CfgPropertyItemDirective } from './config-components/cfg-property/cfg-property-item.directive';
import { CfgPropertyFormComponent } from './config-components/cfg-property/cfg-property-form/cfg-property-form.component';
import { CfgPropertyConentComponent } from './config-components/cfg-property/cfg-property-conent/cfg-property-conent.component';
import { CnStaticFormComponent } from './components/cn-static-form/cn-static-form.component';
import { CnStaticFormItemDirective } from './components/cn-static-form/cn-static-form-item.directive';
import { CnStaticFormInputComponent } from './components/cn-static-form/cn-static-form-item/cn-static-form-input/cn-static-form-input.component';
import { CnStaticFormObjectCardComponent } from './components/cn-static-form/cn-static-form-item/cn-static-form-object-card/cn-static-form-object-card.component';
import { CnStaticFormObjectEmptyComponent } from './components/cn-static-form/cn-static-form-item/cn-static-form-object-empty/cn-static-form-object-empty.component';
import { CnStaticFormArrayCardComponent } from './components/cn-static-form/cn-static-form-item/cn-static-form-array-card/cn-static-form-array-card.component';
import { CnStaticFormArrayListComponent } from './components/cn-static-form/cn-static-form-item/cn-static-form-array-list/cn-static-form-array-list.component';
import { CnStaticFormArrayTableComponent } from './components/cn-static-form/cn-static-form-item/cn-static-form-array-table/cn-static-form-array-table.component';
import { CnStaticFormSwitchComponent } from './components/cn-static-form/cn-static-form-item/cn-static-form-switch/cn-static-form-switch.component';
import { CnStaticFormContainersComponent } from './components/cn-static-form/cn-static-form-item/cn-static-form-containers/cn-static-form-containers.component';
import { CnStaticFormSelectComponent } from './components/cn-static-form/cn-static-form-item/cn-static-form-select/cn-static-form-select.component';
import { CnStaticFormCheckComponent } from './components/cn-static-form/cn-static-form-item/cn-static-form-check/cn-static-form-check.component';
import { CnStaticFormCheckboxComponent } from './components/cn-static-form/cn-static-form-item/cn-static-form-checkbox/cn-static-form-checkbox.component';
import { CnStaticFormSliderComponent } from './components/cn-static-form/cn-static-form-item/cn-static-form-slider/cn-static-form-slider.component';
import { CnStaticFormCustomSelectComponent } from './components/cn-static-form/cn-static-form-item/cn-static-form-custom-select/cn-static-form-custom-select.component';
import { CnStaticFormAjaxComponent } from './components/cn-static-form/cn-static-form-cmpt/cn-static-form-ajax/cn-static-form-ajax.component';
import { CfgPageCmptTreeComponent } from './config-components/cfg-page-design/cfg-page-design-layout/cfg-page-cmpt-tree/cfg-page-cmpt-tree.component';
import { CfgPageDesignLayoutItemDirective } from './config-components/cfg-page-design/cfg-page-design-layout/cfg-page-design-layout-item.directive';
import { CnStaticFormArrayCollapseComponent } from './components/cn-static-form/cn-static-form-item/cn-static-form-array-collapse/cn-static-form-array-collapse.component';
import { CnStaticFormGridItemComponent } from './components/cn-static-form/cn-static-form-cmpt/cn-static-form-grid-item/cn-static-form-grid-item.component';
import { CnStaticFormFormItemComponent } from './components/cn-static-form/cn-static-form-cmpt/cn-static-form-form-item/cn-static-form-form-item.component';
import { CnStaticFormCustomInputSelectComponent } from './components/cn-static-form/cn-static-form-item/cn-static-form-custom-input-select/cn-static-form-custom-input-select.component';
import { ToolAttrJsonComponent } from './tools/tool-attr-json/tool-attr-json.component';
import { CnStaticFormLabelComponent } from './components/cn-static-form/cn-static-form-item/cn-static-form-label/cn-static-form-label.component';
import { CnStaticFormPopFormComponent } from './components/cn-static-form/cn-static-form-item/cn-static-form-pop-form/cn-static-form-pop-form.component';
import { CnStaticFormSwitchConentComponent } from './components/cn-static-form/cn-static-form-item/cn-static-form-switch-conent/cn-static-form-switch-conent.component';
import { CnStaticFormStaticFormComponent } from './components/cn-static-form/cn-static-form-cmpt/cn-static-form-static-form/cn-static-form-static-form.component';
import { SmtLayoutComponent } from './components/smt-layout/smt-layout/smt-layout.component';
import { CnStaticFormParameterStructComponent } from './components/cn-static-form/cn-static-form-cmpt/cn-static-form-parameter-struct/cn-static-form-parameter-struct.component';
import { SmtDynamicLayoutResolverDirective } from './resolver/smt-layout/smt-dynamic-layout-resolver.directive';
import { SmtPageComponent } from './components/smt-layout/smt-page/smt-page.component';
import { SmtComponentResolverDirective } from './resolver/smt-component/smt-component-resolver.directive';
import { SmtDataTableComponent } from './smt-components/smt-data-table/smt-data-table.component';
import { CnStaticFormPopSelectParameterComponent } from './components/cn-static-form/cn-static-form-item/cn-static-form-pop-select-parameter/cn-static-form-pop-select-parameter.component';
import { CnStaticFormTreeObjectComponent } from './components/cn-static-form/cn-static-form-cmpt/cn-static-form-tree-object/cn-static-form-tree-object.component';
import { CnStaticFormChildArrayComponent } from './components/cn-static-form/cn-static-form-item/cn-static-form-child-array/cn-static-form-child-array.component';
import { SmtTabsComponent } from './smt-components/smt-tabs/smt-tabs.component';
import { SmtToolbarComponent } from './smt-components/smt-toolbar/smt-toolbar.component';
import { SmtTreeTableComponent } from './smt-components/smt-tree-table/smt-tree-table.component';
import { CnStaticFormMainResourceComponent } from './components/cn-static-form/cn-static-form-cmpt/cn-static-form-main-resource/cn-static-form-main-resource.component';
import { CnStaticFormApiComponent } from './components/cn-static-form/cn-static-form-cmpt/cn-static-form-api/cn-static-form-api.component';
import { CnStaticFormPopApiComponent } from './components/cn-static-form/cn-static-form-item/cn-static-form-pop-api/cn-static-form-pop-api.component';
import { CfgFormInputComponent } from './config-components/cfg-form-design/cfg-form-design-layout/cfg-form-input/cfg-form-input.component';
import { CfgFormSelectComponent } from './config-components/cfg-form-design/cfg-form-design-layout/cfg-form-select/cfg-form-select.component';
import { CfgFormCheckComponent } from './config-components/cfg-form-design/cfg-form-design-layout/cfg-form-check/cfg-form-check.component';
import { CfgFormDesignLayoutItemDirective } from './config-components/cfg-form-design/cfg-form-design-layout/cfg-form-design-layout-item.directive';
import { CnStaticFormSubComponentComponent } from './components/cn-static-form/cn-static-form-item/cn-static-form-sub-component/cn-static-form-sub-component.component';
import { CnStaticFormSelectTreeComponent } from './components/cn-static-form/cn-static-form-item/cn-static-form-select-tree/cn-static-form-select-tree.component';
import { CnCfgFlowDesignComponent } from './components/work-flow/cn-cfg-flow-design/cn-cfg-flow-design.component';
import { CnCfgFlowAttrSettingComponent } from './components/work-flow/cn-flow-items/cn-cfg-flow-attr-setting/cn-cfg-flow-attr-setting.component';
import { CnStaticFormTextareaComponent } from './components/cn-static-form/cn-static-form-item/cn-static-form-textarea/cn-static-form-textarea.component';
import { CnCfgBusiFlowComponent } from './components/work-flow/cn-cfg-busi-flow/cn-cfg-busi-flow.component';
import { CnCfgFlowStartComponent } from './components/work-flow/cn-flow-items/cn-cfg-flow-start/cn-cfg-flow-start.component';
import { CnCfgFlowApprovalComponent } from './components/work-flow/cn-flow-items/cn-cfg-flow-approval/cn-cfg-flow-approval.component';
import { CnCfgFlowApprovalHandleComponent } from './components/work-flow/cn-flow-items/cn-cfg-flow-approval-handle/cn-cfg-flow-approval-handle.component';
import { CnCfgFlowPreviewComponent } from './components/work-flow/cn-cfg-flow-preview/cn-cfg-flow-preview.component';
import { CnStaticFormBusiPopApiComponent } from './components/cn-static-form/cn-static-form-item/cn-static-form-busi-pop-api/cn-static-form-busi-pop-api.component';
import { CnStaticFormBusiApiComponent } from './components/cn-static-form/cn-static-form-cmpt/cn-static-form-busi-api/cn-static-form-busi-api.component';
import { SmtFormComponent } from './smt-components/smt-form/smt-form.component';
import { SmtFormInputComponent } from './smt-components/smt-form/smt-form-items/smt-form-input/smt-form-input.component';
import { SmtFormSelectComponent } from './smt-components/smt-form/smt-form-items/smt-form-select/smt-form-select.component';
import { SmtFormLabelComponent } from './smt-components/smt-form/smt-form-items/smt-form-label/smt-form-label.component';
import { SmtFormSpanComponent } from './smt-components/smt-form/smt-form-items/smt-form-span/smt-form-span.component';
import { SmtFormCheckComponent } from './smt-components/smt-form/smt-form-items/smt-form-check/smt-form-check.component';
import { SmtFormSwitchComponent } from './smt-components/smt-form/smt-form-items/smt-form-switch/smt-form-switch.component';
import { SmtFormTreeSelectComponent } from './smt-components/smt-form/smt-form-items/smt-form-tree-select/smt-form-tree-select.component';
import { SmtFormTextareaComponent } from './smt-components/smt-form/smt-form-items/smt-form-textarea/smt-form-textarea.component';
import { SmtFormRadioComponent } from './smt-components/smt-form/smt-form-items/smt-form-radio/smt-form-radio.component';
import { SmtFormTagComponent } from './smt-components/smt-form/smt-form-items/smt-form-tag/smt-form-tag.component';
import { SmtFormPickerYearComponent } from './smt-components/smt-form/smt-form-items/smt-form-picker-year/smt-form-picker-year.component';
import { SmtFormPickerWeekComponent } from './smt-components/smt-form/smt-form-items/smt-form-picker-week/smt-form-picker-week.component';
import { SmtFormPickerMonthComponent } from './smt-components/smt-form/smt-form-items/smt-form-picker-month/smt-form-picker-month.component';
import { SmtFormPickerDateComponent } from './smt-components/smt-form/smt-form-items/smt-form-picker-date/smt-form-picker-date.component';
import { SmtFormCodeEditComponent } from './smt-components/smt-form/smt-form-items/smt-form-code-edit/smt-form-code-edit.component';
import { SmtFormPickerRangeComponent } from './smt-components/smt-form/smt-form-items/smt-form-picker-range/smt-form-picker-range.component';

import { SmtDynamicPageComponent } from './smt-components/smt-dynamic-page/smt-dynamic-page.component';
import { SmtTreeComponent } from './smt-components/smt-tree/smt-tree.component';
import { SmtComponentComponent } from './components/smt-layout/smt-component/smt-component/smt-component.component';
import { SmtComponentBase } from './smt-components/smt-component.base';
import { SmtFormItemDirective } from './smt-components/smt-form/smt-form-items/smt-form-item.directive';
import { SmtPopPageComponent } from './smt-components/smt-pop-page/smt-pop-page.component';
import { SmtDataTableItemDirective } from './smt-components/smt-data-table/smt-data-table-items/smt-data-table-item.directive';
import { SmtDataTableInputComponent } from './smt-components/smt-data-table/smt-data-table-items/smt-data-table-input/smt-data-table-input.component';
import { SmtDataTableSelectComponent } from './smt-components/smt-data-table/smt-data-table-items/smt-data-table-select/smt-data-table-select.component';
import { SmtDataTableDatePickerComponent } from './smt-components/smt-data-table/smt-data-table-items/smt-data-table-date-picker/smt-data-table-date-picker.component';
import { SmtDataTableShowSpanTextComponent } from './smt-components/smt-data-table/smt-data-table-items/smt-data-table-show-span-text/smt-data-table-show-span-text.component';
import { SmtDataTableTreeSelectComponent } from './smt-components/smt-data-table/smt-data-table-items/smt-data-table-tree-select/smt-data-table-tree-select.component';
import { SmtDataTableTagComponent } from './smt-components/smt-data-table/smt-data-table-items/smt-data-table-tag/smt-data-table-tag.component';
import { SmtDataTableGridSelectComponent } from './smt-components/smt-data-table/smt-data-table-items/smt-data-table-grid-select/smt-data-table-grid-select.component';
import { SmtDataTableTextAreaComponent } from './smt-components/smt-data-table/smt-data-table-items/smt-data-table-text-area/smt-data-table-text-area.component';
import { SmtDataTableRadioComponent } from './smt-components/smt-data-table/smt-data-table-items/smt-data-table-radio/smt-data-table-radio.component';
import { SmtDataTableSwitchComponent } from './smt-components/smt-data-table/smt-data-table-items/smt-data-table-switch/smt-data-table-switch.component';
import { SmtDataTableSelectMultipleComponent } from './smt-components/smt-data-table/smt-data-table-items/smt-data-table-select-multiple/smt-data-table-select-multiple.component';
import { SmtDataTableMonthPickerComponent } from './smt-components/smt-data-table/smt-data-table-items/smt-data-table-month-picker/smt-data-table-month-picker.component';
import { SmtDataTableRangePickerComponent } from './smt-components/smt-data-table/smt-data-table-items/smt-data-table-range-picker/smt-data-table-range-picker.component';
import { SmtDataTableWeekPickerComponent } from './smt-components/smt-data-table/smt-data-table-items/smt-data-table-week-picker/smt-data-table-week-picker.component';
import { SmtDataTableYearPickerComponent } from './smt-components/smt-data-table/smt-data-table-items/smt-data-table-year-picker/smt-data-table-year-picker.component';
import { SmtDataTableDateTimePickerComponent } from './smt-components/smt-data-table/smt-data-table-items/smt-data-table-date-time-picker/smt-data-table-date-time-picker.component';

// #region third libs

const THIRDMODULES = [
  // NgZorroAntdModule,
  CountdownModule,
  // UEditorModule, NgxTinymceModule
];
// #endregion

// #region your componets & directives
const COMPONENTS = [
  CnLayoutComponent,
  CnTabsComponent,
  CnCustomLayoutComponent,
  CnDataTableComponent,
  CnToolbarComponent,
  CnTreeComponent,
  CnTreeTableComponent,
  CnPageHeaderComponent,

  // --设计组件--
  CnDataFormComponent,
  CnFormInputComponent,
  CnFormSelectComponent,
  CnFormLabelComponent,
  CnFormSelectMultipleComponent,
  CnFormDatePickerComponent,
  CnFormYearPickerComponent,
  CnFormWeekPickerComponent,
  CnFormRangePickerComponent,
  CnFormMonthPickerComponent,
  CnFormSwitchComponent,
  CnFormRadioComponent,
  CnFormCheckboxComponent,
  CnFormTreeSelectComponent,
  CnFormTransferComponent,
  CnFormGridSelectComponent,
  CnFormTextareaComponent,
  CnFormCustomSelectComponent,
  CnPageComponent,
  CnGridInputComponent,
  CnGridSelectComponent,
  CnGridTagComponent,
  CnAttributeComponent,
  CnFormCodeEditComponent,
  CnCodeEditComponent,
  CnAttributeObjectComponent,
  CnAttributeArrayComponent,
  CnAttributeTableComponent,
  CnAttributePropertyGridComponent,
  CnAttributeFormComponent,
  CnAttributeTableFormComponent,
  CnDescriptionsComponent,
  CnStepsComponent,
  CnStatisticComponent,
  CnProgressComponent,
  CnCalendarComponent,
  CnStaticTableComponent,
  CnFormStaticGridComponent,
  CnGridSwitchComponent,
  CnGridRadioComponent,
  CnGridCheckboxComponent,
  CnGridGridSelectComponent,
  CnGridDatePickerComponent,
  CnGridMonthPickerComponent,
  CnGridWeekPickerComponent,
  CnGridYearPickerComponent,
  CnGridRangePickerComponent,
  CnGridCustomSelectComponent,
  CnGridCodeEditComponent,
  CnGridTextareaComponent,
  CnFormButtonComponent,
  CnGridRadioComponent,
  CnGridCheckboxComponent,
  CnGridGridSelectComponent,
  CnGridDatePickerComponent,
  CnGridMonthPickerComponent,
  CnGridWeekPickerComponent,
  CnGridYearPickerComponent,
  CnGridRangePickerComponent,
  CnGridCustomSelectComponent,
  CnGridCodeEditComponent,
  CnGridTextareaComponent,
  CnFormButtonComponent,
  CnFormSearchSelectComponent,
  CnCardListComponent,
  CnDynamicLayoutComponent,
  CnDynamicPageHeaderComponent,
  CnFormGroupComponent,
  CnTagComponent,
  CnFormTagComponent,
  CnUploadComponent,
  CnFormScancodeComponent,
  CnFormCustomInputComponent,
  CnFormCascaderComponent,
  CnCarouseComponent,
  CnGridTreeSelectComponent,
  CnContainersComponent,
  CnGridSelectMultipleComponent,
  CnDataStepsComponent,
  CnGridSpanComponent,
  CnFormSpanComponent,
  CnFormCheckboxGroupComponent,
  CnCustomIconStateComponent,
  CnCustomGroupStateComponent,
  CnFormInputPasswordComponent,
  CnReportGridComponent,
  CnStaticTreeTableComponent,
  CnFlowDesignComponent,
  CnFlowPreviewComponent,
  CnGridDownXlsxComponent,
  CnGridBadgeComponent,
  CnResultComponent,
  CnDynamicTemplateLayoutComponent,
  CnFlowAttrSettingComponent,
  CnGridChartsComponent,
  CnChartsComponent,
  CnDynamicContainersComponent,
  CnBarChartComponent,
  CnTimeLineComponent,
  CnFlowDesignMoreComponent,
  CnGridCustomObjectComponent,
  CnHorizontalBarChartComponent,
  CnBrokenLineChartComponent,
  CnFanChartComponent,
  CnTimeAxisChartComponent,
  CnMultipleYAxisChartComponent,
  CnMultiLevelFacetChartComponent,
  CnFunnelChartComponent,
  CnDashboardChartComponent,
  CnColorDashboardChartComponent,
  CnRadarMapChartComponent,
  CnFlowAttrSettingMoreComponent,
  CnFlowApprovalComponent,
  CnFlowTableComponent,
  CnFlowStartComponent,
  CnFormObjectComponent,
  CnFormTransferComponent,
  CfgPropertyEditorCascadeValueComponent,
  CfgAtrributeCascadeSenderComponent,
  CfgAttributeCascadeReceiverComponent,
  CfgAttributeAssembleAjaxComponent,
  CfgAttributeRanksCombComponent,
  CfgAttributeRanksBasicComponent,
  CfgAttributeRanksRowComponent,
  CfgAttributeRanksColComponent,
  CfgCascadePropertyComponent,

  // ------设计组件-----
  CfgAttributeAssembleResourceSelectComponent,
  CfgAttributeRanksRowModalComponent,
  CfgAttributeFormStateComponent,
  CfgAttributeValidationComponent,

  CfgPageDesignComponent,
  CfgFormDesignComponent,
  CfgFormLayoutComponent,
  CfgFormPropertyComponent,
  CfgFormSiderComponent,
  CfgPageSiderComponent,
  CfgPageViewComponent,
  CfgPagePropertyComponent,
  CfgFormViewComponent,
  CfgPageLayoutComponent,
  CfgPageRowsComponent,
  CfgPageRowComponent,
  CfgPageColsComponent,
  CfgPageColComponent,
  CfgPageContainerComponent,
  CfgPageCmptFormComponent,
  CfgPageCmptTableComponent,
  CfgPageCmptToolbarComponent,
  CfgPageCmptTabsComponent,
  CfgPageCmptTreeComponent,
  CfgFormRowsComponent,
  CfgFormRowComponent,
  CfgFormColsComponent,
  CfgFormColComponent,
  CfgFormContainerComponent,
  CfgPropertyTypeComponent,
  CfgPropertyFormComponent,
  CfgPropertyConentComponent,
  ToolAttrJsonComponent,
  CfgFormInputComponent,
  CfgFormSelectComponent,
  CfgFormCheckComponent,

  //--静态表单--
  CnStaticFormComponent,
  CnStaticFormInputComponent,
  CnStaticFormObjectCardComponent,
  CnStaticFormObjectEmptyComponent,
  CnStaticFormArrayCardComponent,
  CnStaticFormArrayListComponent,
  CnStaticFormArrayTableComponent,
  CnStaticFormSwitchComponent,
  CnStaticFormContainersComponent,
  CnStaticFormSelectComponent,
  CnStaticFormCheckComponent,
  CnStaticFormCheckboxComponent,
  CnStaticFormSliderComponent,
  CnStaticFormCustomSelectComponent,
  CnStaticFormArrayCollapseComponent,
  CnStaticFormCustomInputSelectComponent,
  CnStaticFormLabelComponent,
  CnStaticFormPopSelectParameterComponent,
  CnStaticFormChildArrayComponent,
  CnStaticFormPopApiComponent,
  CnStaticFormSubComponentComponent,
  CnStaticFormSelectTreeComponent,
  CnStaticFormTextareaComponent,
  CnStaticFormBusiApiComponent,
  // --静态表单内特殊组件结构--
  CnStaticFormAjaxComponent,
  CnStaticFormFormItemComponent,
  CnStaticFormGridItemComponent,
  CnStaticFormStaticFormComponent,
  CnStaticFormParameterStructComponent,
  CnStaticFormTreeObjectComponent,
  CnStaticFormPopFormComponent,
  CnStaticFormSwitchConentComponent,
  CnStaticFormMainResourceComponent,
  CnStaticFormApiComponent,
  CnStaticFormBusiPopApiComponent,

  // --流程--
  CnCfgFlowDesignComponent,
  CnCfgFlowAttrSettingComponent,
  CnCfgFlowStartComponent,
  CnCfgFlowApprovalComponent,
  CnCfgBusiFlowComponent,
  CnCfgFlowApprovalHandleComponent,
  CnCfgFlowPreviewComponent,
  // 解析布局组件
  SmtPageComponent,
  SmtDynamicPageComponent,
  SmtLayoutComponent,
  SmtTabsComponent,
  // 可视化生成配置解析出的组件
  SmtDataTableComponent,
  SmtToolbarComponent,
  SmtTreeTableComponent,
  // 新表单
  SmtFormComponent,
  SmtFormInputComponent,
  SmtFormSelectComponent,
  SmtFormLabelComponent,
  SmtFormSpanComponent,
  SmtFormCheckComponent,
  SmtFormSwitchComponent,
  SmtFormTreeSelectComponent,
  SmtFormTextareaComponent,
  SmtFormRadioComponent,
  SmtFormTagComponent,
  SmtFormPickerYearComponent,
  SmtFormPickerWeekComponent,
  SmtFormPickerMonthComponent,
  SmtFormPickerDateComponent,
  SmtFormCodeEditComponent,
  SmtFormPickerRangeComponent,
  SmtTreeComponent,
  // 弹出页
  SmtPopPageComponent,
  // 新表格小组件
  SmtDataTableSelectComponent,
  SmtDataTableDatePickerComponent,
  SmtDataTableShowSpanTextComponent,
  SmtDataTableTreeSelectComponent,
  SmtDataTableTagComponent,
  SmtDataTableGridSelectComponent,
  SmtDataTableTextAreaComponent,
  SmtDataTableRadioComponent,
  SmtDataTableSwitchComponent,
  SmtDataTableSelectMultipleComponent,
  SmtDataTableMonthPickerComponent,
  SmtDataTableRangePickerComponent,
  SmtDataTableWeekPickerComponent,
  SmtDataTableYearPickerComponent,
  SmtDataTableDateTimePickerComponent,
  SmtDataTableInputComponent
];
const DIRECTIVES = [
  CnLayoutResolverDirective,
  CnDynamicLayoutResolverDirective,
  CnComponentResolverDirective,
  CnFormItemDirective,
  CnGridItemDirective,
  CnAttributeItemDirective,
  CnChartsDirective,
  CnStaticFormItemDirective,
  CfgPropertyItemDirective,
  CfgPageDesignLayoutItemDirective,
  SmtDynamicLayoutResolverDirective,
  SmtComponentResolverDirective,
  CfgFormDesignLayoutItemDirective,
  SmtFormItemDirective,
  SmtDataTableItemDirective,
];
// #endregion

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NzEmptyModule,
    ReactiveFormsModule,
    AlainThemeModule.forChild(),
    DelonChartModule,
    DelonACLModule,
    DelonFormModule,
    SHARED_DELON_MODULES,
    SHARED_ZORRO_MODULES,
    // third libs
    ...THIRDMODULES,
    NzResizableModule,
  ],
  declarations: [
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
    CnTreeTransferComponent,
    SafeUrlPipe,
    CfgAttributeRanksRowModalComponent,
    ToolAttrJsonComponent,
    SmtComponentComponent,

  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AlainThemeModule,
    DelonChartModule,
    DelonACLModule,
    DelonFormModule,
    // i18n
    TranslateModule,
    // third libs
    ...THIRDMODULES,
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
    SHARED_DELON_MODULES,
    SHARED_ZORRO_MODULES,
  ],
  entryComponents: [...COMPONENTS],
  providers: [],
})
export class SharedModule { }
