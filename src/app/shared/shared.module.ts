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
import { CfgAttrAjaxConfigComponent } from './config-components/config-attribute/cfg-attribute-item/cfg-attr-ajax-config/cfg-attr-ajax-config.component';
import { CfgAttrCascadeComponent } from './config-components/config-attribute/cfg-attribute-item/cfg-attr-cascade/cfg-attr-cascade.component';
import { CfgAttributeArrayComponent } from './config-components/config-attribute/cfg-attribute-item/cfg-attribute-array/cfg-attribute-array.component';
import { CfgAttributeFormComponent } from './config-components/config-attribute/cfg-attribute-item/cfg-attribute-form/cfg-attribute-form.component';
import { CfgAttributeGridSelectComponent } from './config-components/config-attribute/cfg-attribute-item/cfg-attribute-grid-select/cfg-attribute-grid-select.component';
import { CfgAttributeMasterDataComponent } from './config-components/config-attribute/cfg-attribute-item/cfg-attribute-master-data/cfg-attribute-master-data.component';
import { CfgAttributeObjectComponent } from './config-components/config-attribute/cfg-attribute-item/cfg-attribute-object/cfg-attribute-object.component';
import { CfgAttributeTableFormComponent } from './config-components/config-attribute/cfg-attribute-item/cfg-attribute-table-form/cfg-attribute-table-form.component';
import { CfgAttributeTableComponent } from './config-components/config-attribute/cfg-attribute-item/cfg-attribute-table/cfg-attribute-table.component';
import { CfgAttributeItemDirective } from './config-components/config-attribute/cfg-attribute/cfg-attribute-item.directive';
import { CfgAttributeComponent } from './config-components/config-attribute/cfg-attribute/cfg-attribute.component';
import { CfgFormInputComponent } from './config-components/config-form-layout/cfg-form-component/cfg-form-input/cfg-form-input.component';
import { CfgFormSelectComponent } from './config-components/config-form-layout/cfg-form-component/cfg-form-select/cfg-form-select.component';
import { CfgFormItemContentDirective } from './config-components/config-form-layout/cfg-form-item-content.directive';
import { CfgFormItemComponent } from './config-components/config-form-layout/cfg-form-item/cfg-form-item.component';
import { CfgFormLayoutColComponent } from './config-components/config-form-layout/cfg-form-layout-col/cfg-form-layout-col.component';
import { CfgFormLayoutRowComponent } from './config-components/config-form-layout/cfg-form-layout-row/cfg-form-layout-row.component';
import { CfgFormLayoutComponent } from './config-components/config-form-layout/cfg-form-layout/cfg-form-layout.component';
import { CfgLayoutPageComponent } from './config-components/config-layout-page/cfg-layout-page/cfg-layout-page.component';
import { CfgCustomLayoutComponent } from './config-components/config-layout/cfg-custom-layout/cfg-custom-layout.component';
import { CfgLayoutCardComponent } from './config-components/config-layout/cfg-layout-card/cfg-layout-card.component';
import { CfgLayoutColComponent } from './config-components/config-layout/cfg-layout-col/cfg-layout-col.component';
import { CfgLayoutCollapseComponent } from './config-components/config-layout/cfg-layout-collapse/cfg-layout-collapse.component';
import { CfgCalendarComponent } from './config-components/config-layout/cfg-layout-component/cfg-calendar/cfg-calendar.component';
import { CfgCarouselComponent } from './config-components/config-layout/cfg-layout-component/cfg-carousel/cfg-carousel.component';
import { CfgDataTableComponent } from './config-components/config-layout/cfg-layout-component/cfg-data-table/cfg-data-table.component';
import { CfgFormComponent } from './config-components/config-layout/cfg-layout-component/cfg-form/cfg-form.component';
import { CfgToolbarComponent } from './config-components/config-layout/cfg-layout-component/cfg-toolbar/cfg-toolbar.component';
import { CfgTreeComponent } from './config-components/config-layout/cfg-layout-component/cfg-tree/cfg-tree.component';
import { CfgLayoutItemContentDirective } from './config-components/config-layout/cfg-layout-item-content.directive';
import { CfgLayoutItemComponent } from './config-components/config-layout/cfg-layout-item/cfg-layout-item.component';
import { CfgLayoutRowComponent } from './config-components/config-layout/cfg-layout-row/cfg-layout-row.component';
import { CfgLayoutTabsComponent } from './config-components/config-layout/cfg-layout-tabs/cfg-layout-tabs.component';
import { CfgLayoutComponent } from './config-components/config-layout/cfg-layout/cfg-layout.component';
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
import { CfgConditionComponent } from './config-components/config-attribute/cfg-condition/cfg-condition.component';
import { CfgBracketsComponent } from './config-components/config-attribute/cfg-condition/cfg-brackets/cfg-brackets.component';
import { CfgViewLayoutComponent } from './config-components/config-attribute/cfg-view-layout/cfg-view-layout.component';
import { CfgInterfaceComponent } from './config-components/config-attribute/cfg-interface/cfg-interface.component';
import { CfgInterfaceItemComponent } from './config-components/config-attribute/cfg-interface/cfg-interface-item/cfg-interface-item.component';
import { CfgEventComponent } from './config-components/config-attribute/cfg-event/cfg-event.component';
import { CfgEventItemComponent } from './config-components/config-attribute/cfg-event/cfg-event-item/cfg-event-item.component';
import { CfgListensComponent } from './config-components/config-attribute/cfg-listens/cfg-listens.component';
import { CfgMethodComponent } from './config-components/config-attribute/cfg-method/cfg-method.component';
import { CfgRowActionComponent } from './config-components/config-attribute/cfg-row-action/cfg-row-action.component';
import { CfgToolbarActionComponent } from './config-components/config-attribute/cfg-toolbar-action/cfg-toolbar-action.component';
import { CfgToolbarActionItemComponent } from './config-components/config-attribute/cfg-toolbar-action/cfg-toolbar-action-item/cfg-toolbar-action-item.component';
import { CfgToolbarActionDropdownComponent } from './config-components/config-attribute/cfg-toolbar-action/cfg-toolbar-action-dropdown/cfg-toolbar-action-dropdown.component';
import { CfgCommandComponent } from './config-components/config-attribute/cfg-command/cfg-command.component';
import { CfgLCascadeComponent } from './config-components/config-attribute/cfg-l-cascade/cfg-l-cascade.component';
import { CfgLCascadeSendComponent } from './config-components/config-attribute/cfg-l-cascade/cfg-l-cascade-send/cfg-l-cascade-send.component';
import { CfgLCascadeReceiveComponent } from './config-components/config-attribute/cfg-l-cascade/cfg-l-cascade-receive/cfg-l-cascade-receive.component';
import { CfgLCascadeSendItemComponent } from './config-components/config-attribute/cfg-l-cascade/cfg-l-cascade-send-item/cfg-l-cascade-send-item.component';
import { CfgLBaseComponent } from './config-components/config-attribute/cfg-l-base/cfg-l-base.component';
import { CfgLBaseConfigComponent } from './config-components/config-attribute/cfg-l-base/cfg-l-base-config/cfg-l-base-config.component';
import { CfgLBaseMainResourceComponent } from './config-components/config-attribute/cfg-l-base/cfg-l-base-main-resource/cfg-l-base-main-resource.component';
import { ConfigLLayoutComponent } from './config-components/config-l-layout/config-l-layout.component';
import { ConfigLRowComponent } from './config-components/config-l-layout/config-l-row/config-l-row.component';
import { ConfigLColComponent } from './config-components/config-l-layout/config-l-col/config-l-col.component';
import { ConfigLDragComponent } from './config-components/config-l-layout/config-l-drag/config-l-drag.component';
import { ConfigLDragContainerComponent } from './config-components/config-l-layout/config-l-drag-container/config-l-drag-container.component';
import { ConfigLRowsComponent } from './config-components/config-l-layout/config-l-rows/config-l-rows.component';
import { ConfigLColsComponent } from './config-components/config-l-layout/config-l-cols/config-l-cols.component';
import { CfgLFormDesignComponent } from './config-components/cfg-l-form-design/cfg-l-form-design.component';
import { CfgLMainPageDesignComponent } from './config-components/cfg-l-main-page-design/cfg-l-main-page-design.component';
import { CfgLSubPageDesignComponent } from './config-components/cfg-l-sub-page-design/cfg-l-sub-page-design.component';
import { CfgLFormSiderComponent } from './config-components/cfg-l-form-design/cfg-l-form-sider/cfg-l-form-sider.component';
import { CfgLFormAttrSiderComponent } from './config-components/cfg-l-form-design/cfg-l-form-attr-sider/cfg-l-form-attr-sider.component';
import { CfgLFormAttrStyleComponent } from './config-components/cfg-l-form-design/cfg-l-form-attr-sider/cfg-l-form-attr-style/cfg-l-form-attr-style.component';
import { CfgLFormAttrStyleColComponent } from './config-components/cfg-l-form-design/cfg-l-form-attr-sider/cfg-l-form-attr-style/cfg-l-form-attr-style-col/cfg-l-form-attr-style-col.component';
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
import { CfgFormSelectDesignComponent } from './config-components/config-form-layout/cfg-form-component/cfg-form-select-design/cfg-form-select-design.component';
import { CfgLControlDesignDirective } from './config-components/cfg-l-form-design/cfg-l-form-attr-sider/cfg-l-form-attr-controls/cfg-l-control-design.directive';
import { CfgLFormAttrCtrBaseComponent } from './config-components/cfg-l-form-design/cfg-l-form-attr-sider/cfg-l-form-attr-controls/cfg-l-form-attr-controls-items/cfg-l-form-attr-ctr-base/cfg-l-form-attr-ctr-base.component';
import { CfgLFormAttrCtrEditorComponent } from './config-components/cfg-l-form-design/cfg-l-form-attr-sider/cfg-l-form-attr-controls/cfg-l-form-attr-controls-items/cfg-l-form-attr-ctr-editor/cfg-l-form-attr-ctr-editor.component';
import { CfgLFormAttrCtrLayoutComponent } from './config-components/cfg-l-form-design/cfg-l-form-attr-sider/cfg-l-form-attr-controls/cfg-l-form-attr-controls-items/cfg-l-form-attr-ctr-layout/cfg-l-form-attr-ctr-layout.component';
import { CfgLFormAttrCtrSizeComponent } from './config-components/cfg-l-form-design/cfg-l-form-attr-sider/cfg-l-form-attr-controls/cfg-l-form-attr-controls-items/cfg-l-form-attr-ctr-size/cfg-l-form-attr-ctr-size.component';
import { CfgLFormAttrCtrTextComponent } from './config-components/cfg-l-form-design/cfg-l-form-attr-sider/cfg-l-form-attr-controls/cfg-l-form-attr-controls-items/cfg-l-form-attr-ctr-text/cfg-l-form-attr-ctr-text.component';
import { CfgLFormAttrCtrTitleComponent } from './config-components/cfg-l-form-design/cfg-l-form-attr-sider/cfg-l-form-attr-controls/cfg-l-form-attr-controls-items/cfg-l-form-attr-ctr-title/cfg-l-form-attr-ctr-title.component';
import { CfgLFormAttrControlsComponent } from './config-components/cfg-l-form-design/cfg-l-form-attr-sider/cfg-l-form-attr-controls/cfg-l-form-attr-controls.component';
import { CfgLFormSelectParameterComponent } from './config-components/cfg-l-form-design/cfg-l-form-select-parameter/cfg-l-form-select-parameter.component';
import { CfgFormInputDesignComponent } from './config-components/config-form-layout/cfg-form-component/cfg-form-input-design/cfg-form-input-design.component';
import { CfgFormLayoutColsComponent } from './config-components/config-form-layout/cfg-form-layout-cols/cfg-form-layout-cols.component';
import { CfgFormLayoutRowsComponent } from './config-components/config-form-layout/cfg-form-layout-rows/cfg-form-layout-rows.component';
import { CfgLFormAttrPropertyTypeComponent } from './config-components/cfg-l-form-design/cfg-l-form-attr-sider/cfg-l-form-attr-property-type/cfg-l-form-attr-property-type.component';
import { CfgLFormAttrPropertyItemDirective } from './config-components/cfg-l-form-design/cfg-l-form-attr-sider/cfg-l-form-attr-property-type/cfg-l-form-attr-property-item.directive';
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
import { CfgLFormAttrPopBaseComponent } from './config-components/cfg-l-form-design/cfg-l-form-attr-sider/cfg-l-form-attr-property-type/cfg-l-form-attr-property-items/cfg-l-form-attr-pop-base/cfg-l-form-attr-pop-base.component';
import { CnStaticFormSliderComponent } from './components/cn-static-form/cn-static-form-item/cn-static-form-slider/cn-static-form-slider.component';
import { CfgLFormAttrPopComponentComponent } from './config-components/cfg-l-form-design/cfg-l-form-attr-sider/cfg-l-form-attr-property-type/cfg-l-form-attr-property-items/cfg-l-form-attr-pop-component/cfg-l-form-attr-pop-component.component';
import { CnStaticFormCustomSelectComponent } from './components/cn-static-form/cn-static-form-item/cn-static-form-custom-select/cn-static-form-custom-select.component';
import { CnStaticFormAjaxComponent } from './components/cn-static-form/cn-static-form-cmpt/cn-static-form-ajax/cn-static-form-ajax.component';
import { CfgFormContainerComponent } from './config-components/config-form-layout/cfg-form-container/cfg-form-container.component';

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
  CfgLayoutPageComponent,
  CfgCustomLayoutComponent,
  CfgLayoutComponent,
  CfgLayoutCardComponent,
  CfgLayoutColComponent,
  CfgLayoutCollapseComponent,
  CfgLayoutRowComponent,
  CfgLayoutTabsComponent,
  CfgLayoutItemComponent,
  CfgDataTableComponent,
  CfgTreeComponent,
  CfgFormComponent,
  CfgCalendarComponent,
  CfgCarouselComponent,

  CfgFormItemComponent,
  CfgFormLayoutComponent,
  CfgFormLayoutColComponent,
  CfgFormLayoutRowComponent,
  CfgFormInputComponent,
  CfgFormSelectComponent,

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
  CfgToolbarComponent,
  CfgAttributeComponent,
  CfgAttributeFormComponent,
  CfgAttributeTableComponent,
  CfgAttributeObjectComponent,
  CfgAttributeArrayComponent,
  CfgAttributeTableFormComponent,
  CfgAttributeGridSelectComponent,
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
  CfgAttributeMasterDataComponent,
  CfgAttrAjaxConfigComponent,
  CfgAttrCascadeComponent,
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
  CfgConditionComponent,
  CfgBracketsComponent,
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
  CfgViewLayoutComponent,
  CfgInterfaceComponent,
  CfgInterfaceItemComponent,
  CfgEventComponent,
  CfgEventItemComponent,
  CfgListensComponent,
  CfgMethodComponent,
  CfgRowActionComponent,
  CfgToolbarActionComponent,
  CfgToolbarActionItemComponent,
  CfgToolbarActionDropdownComponent,
  CfgCommandComponent,
  CfgLCascadeComponent,
  CfgLCascadeSendComponent,
  CfgLCascadeReceiveComponent,
  CfgLCascadeSendItemComponent,
  CfgLBaseComponent,
  CfgLBaseConfigComponent,
  CfgLBaseMainResourceComponent,
  ConfigLLayoutComponent,
  ConfigLRowComponent,
  ConfigLColComponent,
  ConfigLDragComponent,
  ConfigLDragContainerComponent,
  ConfigLRowsComponent,
  ConfigLColsComponent,
  CfgLFormDesignComponent,
  CfgLMainPageDesignComponent,
  CfgLSubPageDesignComponent,
  CfgLFormSiderComponent,
  CfgLFormAttrSiderComponent,
  CfgLFormAttrStyleComponent,
  CfgLFormAttrStyleColComponent,
  CfgLFormAttrCtrBaseComponent,
  CfgLFormAttrCtrLayoutComponent,
  CfgLFormAttrCtrSizeComponent,
  CfgLFormAttrCtrTextComponent,
  CfgLFormAttrCtrEditorComponent,
  CfgLFormAttrCtrTitleComponent,
  CfgAttributeAssembleResourceSelectComponent,
  CfgAttributeRanksRowModalComponent,
  CfgAttributeFormStateComponent,
  CfgAttributeValidationComponent,
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
  // --静态表单内特殊组件结构--
  CnStaticFormAjaxComponent,

  CfgLFormAttrPopBaseComponent,
  CfgLFormAttrPopComponentComponent,
];
const DIRECTIVES = [
  CnLayoutResolverDirective,
  CnDynamicLayoutResolverDirective,
  CnComponentResolverDirective,
  CfgFormItemContentDirective,
  CfgLayoutItemContentDirective,
  CnFormItemDirective,
  CnGridItemDirective,
  CnAttributeItemDirective,
  CfgAttributeItemDirective,
  CnChartsDirective,
  CfgLControlDesignDirective,
  CfgLFormAttrPropertyItemDirective,
  CnStaticFormItemDirective,
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
    CfgLFormSelectParameterComponent,
    CfgFormLayoutRowsComponent,
    CfgFormLayoutColsComponent,
    CfgLFormAttrControlsComponent,
    CfgFormInputDesignComponent,
    CfgFormSelectDesignComponent,
    CfgLFormAttrPropertyTypeComponent,
    CfgFormContainerComponent,
















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
