import { Directive, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, Type, EventEmitter, ComponentFactoryResolver, ViewContainerRef, ComponentRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';
import { CnStaticFormArrayCardComponent } from './cn-static-form-item/cn-static-form-array-card/cn-static-form-array-card.component';
import { CnStaticFormArrayTableComponent } from './cn-static-form-item/cn-static-form-array-table/cn-static-form-array-table.component';
import { CnStaticFormCustomSelectComponent } from './cn-static-form-item/cn-static-form-custom-select/cn-static-form-custom-select.component';
import { CnStaticFormInputComponent } from './cn-static-form-item/cn-static-form-input/cn-static-form-input.component';
import { CnStaticFormObjectCardComponent } from './cn-static-form-item/cn-static-form-object-card/cn-static-form-object-card.component';
import { CnStaticFormObjectEmptyComponent } from './cn-static-form-item/cn-static-form-object-empty/cn-static-form-object-empty.component';
import { CnStaticFormSelectComponent } from './cn-static-form-item/cn-static-form-select/cn-static-form-select.component';
import { CnStaticFormSliderComponent } from './cn-static-form-item/cn-static-form-slider/cn-static-form-slider.component';
import { CnStaticFormSwitchComponent } from './cn-static-form-item/cn-static-form-switch/cn-static-form-switch.component';

const components: { [type: string]: Type<any> } = {
  input: CnStaticFormInputComponent,
  switch: CnStaticFormSwitchComponent,
  select: CnStaticFormSelectComponent,
  objectCard: CnStaticFormObjectCardComponent,
  arrayCard: CnStaticFormArrayCardComponent,
  objectEmpty: CnStaticFormObjectEmptyComponent,
  arrayTable: CnStaticFormArrayTableComponent,
  slider: CnStaticFormSliderComponent,
  customSelect: CnStaticFormCustomSelectComponent,

}
@Directive({
  selector: '[CnStaticFormItemDirective]'
})
export class CnStaticFormItemDirective implements OnInit, OnChanges, OnDestroy {
  @Input() validateForm: FormGroup;
  @Input() config;
  @Input() public fromDataService: configFormDataServerService;
  @Output() public updateValue = new EventEmitter<any>(true);
  @Output() public cascadeValue = new EventEmitter<any>(true);
  @Input() fb: FormBuilder
  public component: ComponentRef<any>;
  constructor(private resolver: ComponentFactoryResolver, private container: ViewContainerRef) { }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this.container.clear();
    const comp = this.resolver.resolveComponentFactory<any>(components[this.config.type]);
    this.component = this.container.createComponent(comp);

    if (this.config.formType === 'value') {
      this.component.instance.validateForm = this.validateForm;
    }
    if (this.config.formType === 'object') {
      this.component.instance.validateForm = this.validateForm.controls[this.config['name']];
    }
    if (this.config.formType === 'array') {
      this.component.instance.validateForm = this.validateForm;
      this.component.instance.validateFormArray = this.ArrFormArray(this.config['name']);

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
