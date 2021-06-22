import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { CfgFormCheckComponent } from './cfg-form-check/cfg-form-check.component';
import { CfgFormInputComponent } from './cfg-form-input/cfg-form-input.component';
import { CfgFormLabelComponent } from './cfg-form-label/cfg-form-label.component';
import { CfgFormPickerDateComponent } from './cfg-form-pickerDate/cfg-form-pickerDate.component';
import { CfgFormPickerMonthComponent } from './cfg-form-pickerMonth/cfg-form-pickerMonth.component';
import { CfgFormPickerRangeComponent } from './cfg-form-pickerRange/cfg-form-pickerRange.component';
import { CfgFormPickerWeekComponent } from './cfg-form-pickerWeek/cfg-form-pickerWeek.component';
import { CfgFormPickerYearComponent } from './cfg-form-pickerYear/cfg-form-pickerYear.component';
import { CfgFormRadioComponent } from './cfg-form-radio/cfg-form-radio.component';
import { CfgFormSelectComponent } from './cfg-form-select/cfg-form-select.component';
import { CfgFormSpanComponent } from './cfg-form-span/cfg-form-span.component';
import { CfgFormSwitchComponent } from './cfg-form-switch/cfg-form-switch.component';
import { CfgFormTagComponent } from './cfg-form-tag/cfg-form-tag.component';
import { CfgFormTextareaComponent } from './cfg-form-textarea/cfg-form-textarea.component';
const components: { [type: string]: Type<any> } = {
  smtFormInput: CfgFormInputComponent,
  smtFormSwitch: CfgFormSwitchComponent,
  smtFormSelect: CfgFormSelectComponent,
  smtFormCheck: CfgFormCheckComponent,
  smtFormLabel: CfgFormLabelComponent,
  smtFormPickerDate: CfgFormPickerDateComponent,
  smtFormPickerRange: CfgFormPickerRangeComponent,
  smtFormPickerMonth: CfgFormPickerMonthComponent,
  smtFormPickerWeek: CfgFormPickerWeekComponent,
  smtFormPickerYear: CfgFormPickerYearComponent,
  smtFormRadio: CfgFormRadioComponent,
  smtFormTag: CfgFormTagComponent,
  smtFormTextarea: CfgFormTextareaComponent,
  smtFormTreeSelect: CfgFormInputComponent,
  smtFormSpan: CfgFormSpanComponent,
};
@Directive({
  selector: '[appCfgFormDesignLayoutItem]',
})
export class CfgFormDesignLayoutItemDirective implements OnInit, OnChanges, OnDestroy {
  @Input() public l_config;
  @Input() public showLayout: any;
  @Input() public selectedItem: any;
  @Input() public cmptState: any;
  @Input() public fromDataService;
  public component: ComponentRef<any>;
  constructor(private resolver: ComponentFactoryResolver, private container: ViewContainerRef) {}

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
  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    if (this.component) {
      this.component.destroy();
    }
  }
}
