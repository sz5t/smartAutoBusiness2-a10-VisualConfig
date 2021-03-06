import {
  Directive,
  ComponentFactoryResolver,
  ViewContainerRef,
  Type,
  ComponentRef,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { CnGridInputComponent } from './cn-grid-items/cn-grid-input/cn-grid-input.component';
import { CnGridSelectComponent } from './cn-grid-items/cn-grid-select/cn-grid-select.component';
import { CnAttributeObjectComponent } from '../cn-attribute/cn-attribute-items/cn-attribute-object/cn-attribute-object.component';
import { CnAttributeArrayComponent } from '../cn-attribute/cn-attribute-items/cn-attribute-array/cn-attribute-array.component';
import { CnAttributeTableComponent } from '../cn-attribute/cn-attribute-items/cn-attribute-table/cn-attribute-table.component';
import { CnAttributePropertyGridComponent } from '../cn-attribute/cn-attribute-items/cn-attribute-property-grid/cn-attribute-property-grid.component';
import { CnProgressComponent } from '../cn-progress/cn-progress.component';
import { CnGridTagComponent } from './cn-grid-items/cn-grid-tag/cn-grid-tag.component';
import { CnGridSwitchComponent } from './cn-grid-items/cn-grid-switch/cn-grid-switch.component';
import { CnGridRadioComponent } from './cn-grid-items/cn-grid-radio/cn-grid-radio.component';
import { CnGridCheckboxComponent } from './cn-grid-items/cn-grid-checkbox/cn-grid-checkbox.component';
import { CnGridGridSelectComponent } from './cn-grid-items/cn-grid-grid-select/cn-grid-grid-select.component';
import { CnGridSelectMultipleComponent } from './cn-grid-items/cn-grid-select-multiple/cn-grid-select-multiple.component';
import { CnGridDatePickerComponent } from './cn-grid-items/cn-grid-date-picker/cn-grid-date-picker.component';
import { CnGridMonthPickerComponent } from './cn-grid-items/cn-grid-month-picker/cn-grid-month-picker.component';
import { CnGridWeekPickerComponent } from './cn-grid-items/cn-grid-week-picker/cn-grid-week-picker.component';
import { CnGridYearPickerComponent } from './cn-grid-items/cn-grid-year-picker/cn-grid-year-picker.component';
import { CnGridRangePickerComponent } from './cn-grid-items/cn-grid-range-picker/cn-grid-range-picker.component';
import { CnGridCustomSelectComponent } from './cn-grid-items/cn-grid-custom-select/cn-grid-custom-select.component';
import { CnGridCodeEditComponent } from './cn-grid-items/cn-grid-code-edit/cn-grid-code-edit.component';
import { CnGridTextareaComponent } from './cn-grid-items/cn-grid-textarea/cn-grid-textarea.component';
import { CnGridTreeSelectComponent } from './cn-grid-items/cn-grid-tree-select/cn-grid-tree-select.component';
import { CnGridSpanComponent } from './cn-grid-items/cn-grid-span/cn-grid-span.component';
import { CnGridBadgeComponent } from './cn-grid-items/cn-grid-badge/cn-grid-badge.component';
import { CnGridCustomObjectComponent } from './cn-grid-items/cn-grid-custom-object/cn-grid-custom-object.component';
import { CnGridChartsComponent } from './cn-grid-items/cn-grid-charts/cn-grid-charts.component';

const components: { [type: string]: Type<any> } = {
  input: CnGridInputComponent,
  select: CnGridSelectComponent,
  AttributeObject: CnAttributeObjectComponent,
  AttributeArray: CnAttributeArrayComponent,
  AttributeTable: CnAttributeTableComponent,
  AttributePropertyGrid: CnAttributePropertyGridComponent,
  progress: CnProgressComponent,
  tag: CnGridTagComponent,
  switch: CnGridSwitchComponent,
  radio: CnGridRadioComponent,
  checkbox: CnGridCheckboxComponent,
  gridSelect: CnGridGridSelectComponent,
  selectMultiple: CnGridSelectMultipleComponent,
  datePicker: CnGridDatePickerComponent,
  monthPicker: CnGridMonthPickerComponent,
  weekPicke: CnGridWeekPickerComponent,
  yearPicker: CnGridYearPickerComponent,
  rangePicker: CnGridRangePickerComponent,
  customSelect: CnGridCustomSelectComponent,
  codeEdit: CnGridCodeEditComponent,
  textarea: CnGridTextareaComponent,
  treeSelect: CnGridTreeSelectComponent,
  span: CnGridSpanComponent,
  badge: CnGridBadgeComponent,
  customObject: CnGridCustomObjectComponent,
  charts: CnGridChartsComponent
  // label: ,
  // selectMultiple:,
  // datePicker:,
  // yearPicker:,
  // weekPicke:,
  // rangePicker:,
  // monthPicker:,
  // switch:,
  // radio:,
  // checkbox:,
  // treeSelect:,
  // transfer: ,
  // gridSelect:,
  // textarea: ,
  // customSelect: ,
};
@Directive({
  selector: '[CnGridItemDirective]',
})
export class CnGridItemDirective implements OnInit, OnChanges, OnDestroy {
  @Input() public config;
  @Input() public formCascade;
  @Input() public state;
  @Input() public valueConfig;
  @Input() public rowData;
  @Input() public initData;
  @Input() public tempData;

  @Output() public updateValue = new EventEmitter();
  public component: ComponentRef<any>;
  public componentConfig;
  constructor(private resolver: ComponentFactoryResolver, private container: ViewContainerRef) { }
  public ngOnInit() {
    // console.log('**********', this.config, this.formCascade)
    if (!components[this.config.type]) {
      const supportedTypes = Object.keys(components).join(', ');
      throw new Error(`??????????????????????????? (${this.config.type}).?????????????????????: ${supportedTypes}`);
    }
    this.container.clear();
    const comp = this.resolver.resolveComponentFactory<any>(components[this.config.type]);

    this.component = this.container.createComponent(comp);
    this.component.instance.config = this.config;
    this.component.instance.valueConfig = this.valueConfig;
    this.component.instance.state = this.state;

    this.component.instance.rowData = this.rowData;
    this.component.instance.initData = this.initData;
    this.component.instance.tempData = this.tempData;

    // ?????????????????? liu
    if (this.component.instance.updateValue) {
      this.component.instance.updateValue.subscribe((event) => {
        this.setValue(event);
      });
    }
    //  console.log('?????????????????????????????????',  this.config);
  }

  // ?????????????????????????????????-?????????
  public setValue(data?) {
    this.updateValue.emit(data);
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('****ngOnChanges******', changes, this.formGroup)
    // ngOnChanges????????????????????????????????????????????????
    // ???????????????(@Input)???????????????????????????????????????????????????????????????ngOnChanges??????
    // ????????????????????????????????????????????????????????????????????????????????????????????????form???????????????
    if (changes.hasOwnProperty('formCascade')) {
      if (!changes['formCascade'].firstChange) {
        // ??????????????????????????????????????????
        if (this.formCascade) {
          //  console.log('????????????', this.formCascade, this.componentConfig);
        }
        //  console.log('****formCascade******', this.formCascade, this.config.field);
        // console.log('ngOnChanges???inputVal??????????????????' + changes['formCascade'].previousValue);
        //  console.log('ngOnChanges???inputVal??????????????????' + changes['formCascade'].currentValue);
        //  console.log('ngOnChanges???inputVal????????????????????????' + changes['formCascade'].firstChange);
        // ?????????????????????????????????????????????????????????
        this.component.instance.cascadeAnalysis(this.formCascade);
      }
    }
    if (changes.hasOwnProperty('formState')) {
      if (!changes['formState'].firstChange) {
        //    console.log('****formState******',this.config.field, this.formState);
        // console.log('****formState******',this.config.field, this.value,this.formState, this.config, JSON.stringify(this.formGroup.value));
        if (!components[this.config.type]) {
          const supportedTypes = Object.keys(components).join(', ');
          throw new Error(`??????????????????????????? (${this.config.type}).?????????????????????: ${supportedTypes}`);
        }
        this.container.clear();
        const comp = this.resolver.resolveComponentFactory<any>(components[this.config.type]);

        this.component = this.container.createComponent(comp);
        this.component.instance.config = this.config;
        this.component.instance.valueConfig = this.valueConfig;
        this.component.instance.state = this.state;
        this.component.instance.rowData = this.rowData;
        this.component.instance.initData = this.initData;
        this.component.instance.tempData = this.tempData;
        // ?????????????????? liu
        if (this.component.instance.updateValue) {
          this.component.instance.updateValue.subscribe((event) => {
            this.setValue(event);
          });
        }
        // if(this.config.field ==='inputname4')
        // this.formGroup.setValue(this.value);
      }
    }
  }
  // Angular??????SimpleChanges????????????????????????????????????????????????????????????????????????????????????(firstChange: boolean)?????????changes??????????????????

  public ngOnDestroy() {
    if (this.component) {
      this.component.destroy();
    }
  }
}
