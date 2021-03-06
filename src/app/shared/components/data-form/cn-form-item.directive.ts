import {
  Type,
  Directive,
  OnInit,
  OnChanges,
  OnDestroy,
  Input,
  Output,
  ComponentRef,
  ComponentFactoryResolver,
  ViewContainerRef,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';
import { CnFormInputComponent } from './cn-form-items/cn-form-input/cn-form-input.component';
import { CnFormSelectComponent } from './cn-form-items/cn-form-select/cn-form-select.component';
import { CnFormLabelComponent } from './cn-form-items/cn-form-label/cn-form-label.component';
import { CnFormSelectMultipleComponent } from './cn-form-items/cn-form-select-multiple/cn-form-select-multiple.component';
import { CnFormDatePickerComponent } from './cn-form-items/cn-form-date-picker/cn-form-date-picker.component';
import { CnFormYearPickerComponent } from './cn-form-items/cn-form-year-picker/cn-form-year-picker.component';
import { CnFormWeekPickerComponent } from './cn-form-items/cn-form-week-picker/cn-form-week-picker.component';
import { CnFormRangePickerComponent } from './cn-form-items/cn-form-range-picker/cn-form-range-picker.component';
import { CnFormMonthPickerComponent } from './cn-form-items/cn-form-month-picker/cn-form-month-picker.component';
import { CnFormSwitchComponent } from './cn-form-items/cn-form-switch/cn-form-switch.component';
import { CnFormRadioComponent } from './cn-form-items/cn-form-radio/cn-form-radio.component';
import { CnFormCheckboxComponent } from './cn-form-items/cn-form-checkbox/cn-form-checkbox.component';
import { CnFormTreeSelectComponent } from './cn-form-items/cn-form-tree-select/cn-form-tree-select.component';
import { CnFormTransferComponent } from './cn-form-items/cn-form-transfer/cn-form-transfer.component';
import { CnFormGridSelectComponent } from './cn-form-items/cn-form-grid-select/cn-form-grid-select.component';
import { CnFormTextareaComponent } from './cn-form-items/cn-form-textarea/cn-form-textarea.component';
import { CnFormCustomSelectComponent } from './cn-form-items/cn-form-custom-select/cn-form-custom-select.component';
import { CnFormCodeEditComponent } from './cn-form-items/cn-form-code-edit/cn-form-code-edit.component';
import { CnFormStaticGridComponent } from './cn-form-items/cn-form-static-grid/cn-form-static-grid.component';
import { CnFormButtonComponent } from './cn-form-items/cn-form-button/cn-form-button.component';
import { CnFormSearchSelectComponent } from './cn-form-search-items/cn-form-search-select/cn-form-search-select.component';
import { CnFormGroupComponent } from './cn-form-items/cn-form-group/cn-form-group.component';
import { CnFormTagComponent } from './cn-form-items/cn-form-tag/cn-form-tag.component';
import { CnFormScancodeComponent } from './cn-form-items/cn-form-scancode/cn-form-scancode.component';
import { CnFormCustomInputComponent } from './cn-form-items/cn-form-custom-input/cn-form-custom-input.component';
import { CnFormCascaderComponent } from './cn-form-items/cn-form-cascader/cn-form-cascader.component';
import { CnFormSpanComponent } from './cn-form-items/cn-form-span/cn-form-span.component';
import { CnFormInputPasswordComponent } from './cn-form-items/cn-form-input-password/cn-form-input-password.component';
import { FormGroup } from '@angular/forms';
import { CnFormObjectComponent } from './cn-form-items/cn-form-object/cn-form-object.component';

const components: { [type: string]: Type<any> } = {
  input: CnFormInputComponent,
  select: CnFormSelectComponent,
  label: CnFormLabelComponent,
  selectMultiple: CnFormSelectMultipleComponent,
  datePicker: CnFormDatePickerComponent,
  yearPicker: CnFormYearPickerComponent,
  weekPicker: CnFormWeekPickerComponent,
  rangePicker: CnFormRangePickerComponent,
  monthPicker: CnFormMonthPickerComponent,
  switch: CnFormSwitchComponent,
  radio: CnFormRadioComponent,
  checkbox: CnFormCheckboxComponent,
  treeSelect: CnFormTreeSelectComponent,
  transfer: CnFormTransferComponent,
  gridSelect: CnFormGridSelectComponent,
  textarea: CnFormTextareaComponent,
  customSelect: CnFormCustomSelectComponent,
  codeEdit: CnFormCodeEditComponent,
  staticGrid: CnFormStaticGridComponent,
  button: CnFormButtonComponent,
  searchSelect: CnFormSearchSelectComponent,
  group: CnFormGroupComponent,
  tag: CnFormTagComponent,
  scancode: CnFormScancodeComponent,
  customInput: CnFormCustomInputComponent,
  cascader: CnFormCascaderComponent,
  span: CnFormSpanComponent,
  inputPassword: CnFormInputPasswordComponent,
  object: CnFormObjectComponent
};
@Directive({
  selector: '[CnFormItemDirective]',
})
export class CnFormItemDirective implements OnInit, OnChanges, OnDestroy {
  @Input() public config;
  @Input() formGroup: FormGroup;
  @Input() public formCascade;
  @Input() public formState;
  @Input() public tempData;
  @Input() public initData;
  @Input() public dialogsConfig: any;
  // @Input() public value;

  @Output() public updateValue = new EventEmitter<any>(true);
  public component: ComponentRef<any>;
  public componentConfig;
  constructor(private resolver: ComponentFactoryResolver, private container: ViewContainerRef) { }
  public ngOnInit() {
    // console.log('**********', this.config, this.formCascade)
    if (!this.config) {
      return true;
    }
    let _config: any = {};
    if (this.config.state === 'text' && this.config.text) {
      _config = JSON.parse(JSON.stringify(this.config.text));
    }
    if (this.config.state === 'edit' && this.config.editor) {
      _config = JSON.parse(JSON.stringify(this.config.editor));
    }
    _config.config = JSON.parse(JSON.stringify(this.config));
    this.componentConfig = _config;
    if (!components[_config.type]) {
      const supportedTypes = Object.keys(components).join(', ');
      throw new Error(`??????????????????????????? (${_config.type}).?????????????????????: ${supportedTypes}`);
    }
    this.container.clear();
    const comp = this.resolver.resolveComponentFactory<any>(components[_config.type]);

    this.component = this.container.createComponent(comp);
    this.component.instance.formGroup = this.formGroup;
    this.component.instance.config = _config;
    this.component.instance.tempData = this.tempData;
    this.component.instance.initData = this.initData;

    // ??????????????????????????????????????????????????????????????????
    if (_config.type === 'transfer') {
      // ????????????,????????????dialog?????????????????????????????????,??????????????????
      this.component.instance.dialogsConfig = this.dialogsConfig;
    }
    // ?????????????????? liu
    if (this.component.instance.updateValue) {
      this.component.instance.updateValue.subscribe((event) => {
        this.setValue(event);
      });
    }

    //   console.log('?????????????????????????????????-----------------------------', this.tempData,_config,this.formGroup.controls);
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
      if (!changes.formCascade.firstChange) {
        // ??????????????????????????????????????????
        if (this.formCascade) {
          // console.log('????????????', this.formCascade, this.componentConfig);
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
      if (!changes.formState.firstChange) {
        // console.log('****formState******', this.config.field, this.formState);
        // console.log('****formState******',this.config.field, this.value,this.formState, this.config, JSON.stringify(this.formGroup.value));
        let _config;
        if (this.config.state === 'text' && this.config.text) {
          _config = JSON.parse(JSON.stringify(this.config.text));
        }
        if (this.config.state === 'edit' && this.config.editor) {
          _config = JSON.parse(JSON.stringify(this.config.editor));
        }
        _config.config = JSON.parse(JSON.stringify(this.config));
        this.componentConfig = _config;
        if (!components[_config.type]) {
          const supportedTypes = Object.keys(components).join(', ');
          throw new Error(`??????????????????????????? (${_config.type}).?????????????????????: ${supportedTypes}`);
        }
        this.container.clear();
        const comp = this.resolver.resolveComponentFactory<any>(components[_config.type]);

        this.component = this.container.createComponent(comp);
        this.component.instance.formGroup = this.formGroup;
        this.component.instance.config = _config;
        this.component.instance.tempData = this.tempData;
        this.component.instance.initData = this.initData;
        if (_config.type === 'transfer') {
          this.component.instance.dialogsConfig = this.dialogsConfig;
        }
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
