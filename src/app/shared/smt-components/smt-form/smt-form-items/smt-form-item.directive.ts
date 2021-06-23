import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  Output,
  SimpleChanges,
  ViewContainerRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  OnChanges,
  Type,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { SmtFormCheckComponent } from './smt-form-check/smt-form-check.component';
import { SmtFormInputComponent } from './smt-form-input/smt-form-input.component';
import { SmtFormLabelComponent } from './smt-form-label/smt-form-label.component';
import { SmtFormPickerDateComponent } from './smt-form-picker-date/smt-form-picker-date.component';
import { SmtFormPickerMonthComponent } from './smt-form-picker-month/smt-form-picker-month.component';
import { SmtFormPickerRangeComponent } from './smt-form-picker-range/smt-form-picker-range.component';
import { SmtFormPickerWeekComponent } from './smt-form-picker-week/smt-form-picker-week.component';
import { SmtFormPickerYearComponent } from './smt-form-picker-year/smt-form-picker-year.component';
import { SmtFormRadioComponent } from './smt-form-radio/smt-form-radio.component';
import { SmtFormSelectComponent } from './smt-form-select/smt-form-select.component';
import { SmtFormSpanComponent } from './smt-form-span/smt-form-span.component';
import { SmtFormSwitchComponent } from './smt-form-switch/smt-form-switch.component';
import { SmtFormTagComponent } from './smt-form-tag/smt-form-tag.component';
import { SmtFormTextareaComponent } from './smt-form-textarea/smt-form-textarea.component';
import { SmtFormTreeSelectComponent } from './smt-form-tree-select/smt-form-tree-select.component';
const components: { [type: string]: Type<any> } = {
  cnFormInput: SmtFormInputComponent,
  smtFormInput: SmtFormInputComponent,
  smtFormSwitch: SmtFormSwitchComponent,
  smtFormSelect: SmtFormSelectComponent,
  smtFormCheck: SmtFormCheckComponent,
  smtFormLabel: SmtFormLabelComponent,
  smtFormPickerDate: SmtFormPickerDateComponent,
  smtFormPickerRange: SmtFormPickerRangeComponent,
  smtFormPickerMonth: SmtFormPickerMonthComponent,
  smtFormPickerWeek: SmtFormPickerWeekComponent,
  smtFormPickerYear: SmtFormPickerYearComponent,
  smtFormRadio: SmtFormRadioComponent,
  smtFormTag: SmtFormTagComponent,
  smtFormTextarea: SmtFormTextareaComponent,
  smtFormTreeSelect: SmtFormTreeSelectComponent,
  smtFormSpan: SmtFormSpanComponent,
};
@Directive({
  selector: '[appSmtFormItem]',
})
export class SmtFormItemDirective implements OnInit, OnChanges, OnDestroy {
  @Input() validateForm: FormGroup;
  @Input() config;
  @Input() globalConfig;

  @Input() public fromDataService;
  @Output() public updateValue = new EventEmitter<any>(true);
  @Output() public cascadeValue = new EventEmitter<any>(true);
  @Input() fb: FormBuilder;
  public component: ComponentRef<any>;
  constructor(private resolver: ComponentFactoryResolver, private container: ViewContainerRef) { }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this.container.clear();
    const comp = this.resolver.resolveComponentFactory<any>(components[this.config.container]);
    this.component = this.container.createComponent(comp);
    this.component.instance.validateForm = this.validateForm;

    if (this.config.formType === 'value') {
      this.component.instance.validateForm = this.validateForm;
      this.component.instance.globalConfig = this.globalConfig;
    }
    if (this.config.formType === 'object') {
      this.component.instance.validateForm = this.validateForm.controls[this.config['name']];
    }
    if (this.config.formType === 'array') {
      this.component.instance.validateForm = this.validateForm;
      this.component.instance.validateFormArray = this.ArrFormArray(this.config['name']);
      this.component.instance.globalConfig = this.globalConfig;
    }
    if (this.component.instance.cascadeValue) {
      this.component.instance.cascadeValue.subscribe((event) => {
        this.subscribe_cascadeValue(event);
      });
    }
    this.component.instance.fromDataService = this.fromDataService;

    this.component.instance.config = this.config;
  }
  ngOnChanges(changes: SimpleChanges): void {
    // throw new Error('Method not implemented.');
  }
  ngOnDestroy(): void {
    if (this.component) {
      this.component.destroy();
    }
  }

  ArrFormArray(controlName) {
    return this.validateForm.controls[controlName] as FormArray;
  }

  subscribe_cascadeValue(data) {
    this.cascadeValue.emit(data);
  }
}
