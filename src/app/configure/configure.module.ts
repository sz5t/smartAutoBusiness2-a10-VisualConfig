import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigureFormComponent } from './configure-form/configure-form.component';
import { ConfigureTableComponent } from './configure-table/configure-table.component';
import { ConfigureHomeComponent } from './configure-home/configure-home.component';
import { ConfigureRoutingModule } from './configure-routing.module';
import { ConfigureComponentComponent } from './configure-home/configure-component/configure-component.component';
import { ConfigureLayoutComponent } from './configure-home/configure-layout/configure-layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigureFormDirectiveDirective } from './configure-form/configure-form-directive.directive';
import { FormItemCheckboxComponent } from './configure-form/configure-form-items/form-item-checkbox/form-item-checkbox.component';
import { FormItemInputComponent } from './configure-form/configure-form-items/form-item-input/form-item-input.component';
import { FormItemRadioComponent } from './configure-form/configure-form-items/form-item-radio/form-item-radio.component';
import { FormItemSwitchComponent } from './configure-form/configure-form-items/form-item-switch/form-item-switch.component';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzUploadModule } from 'ng-zorro-antd/upload';

@NgModule({
  declarations: [
    ConfigureFormComponent,
    ConfigureTableComponent,
    ConfigureHomeComponent,
    ConfigureComponentComponent,
    ConfigureLayoutComponent,
    FormItemCheckboxComponent,
    ConfigureFormDirectiveDirective,
    FormItemInputComponent,
    FormItemRadioComponent,
    FormItemSwitchComponent,
  ],
  imports: [
    CommonModule,
    ConfigureRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzGridModule,
    NzButtonModule,
    NzInputModule,
    NzInputNumberModule,
    NzAlertModule,
    NzProgressModule,
    NzSelectModule,
    NzAvatarModule,
    NzCardModule,
    NzDropDownModule,
    NzMessageModule,
    NzSpinModule,
    NzPopconfirmModule,
    NzTableModule,
    NzPaginationModule,
    NzPopoverModule,
    NzDrawerModule,
    NzModalModule,
    NzTabsModule,
    NzBadgeModule,
    NzToolTipModule,
    NzIconModule,
    NzDividerModule,
    NzSwitchModule,
    NzRadioModule,
    NzCheckboxModule,
    NzAutocompleteModule,
    NzLayoutModule,
    NzTableModule,
    NzCarouselModule,
    NzDatePickerModule,
    NzTreeModule,
    NzDescriptionsModule,
    NzPageHeaderModule,
    NzTagModule,
    NzTreeSelectModule,
    NzBackTopModule,
    NzStepsModule,
    NzStatisticModule,
    NzCalendarModule,
    NzSkeletonModule,
    NzListModule,
    NzUploadModule,
    NzCascaderModule,
    NzSliderModule,
    NzCollapseModule,
    NzTimePickerModule,
  ],
})
export class ConfigureModule {}
