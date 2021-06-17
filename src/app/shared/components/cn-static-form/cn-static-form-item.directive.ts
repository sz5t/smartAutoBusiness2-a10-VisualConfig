import { Directive, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, Type, EventEmitter, ComponentFactoryResolver, ViewContainerRef, ComponentRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';
import { CnStaticFormTreeObjectComponent } from './cn-static-form-cmpt/cn-static-form-tree-object/cn-static-form-tree-object.component';
import { CnStaticFormArrayCardComponent } from './cn-static-form-item/cn-static-form-array-card/cn-static-form-array-card.component';
import { CnStaticFormArrayCollapseComponent } from './cn-static-form-item/cn-static-form-array-collapse/cn-static-form-array-collapse.component';
import { CnStaticFormArrayTableComponent } from './cn-static-form-item/cn-static-form-array-table/cn-static-form-array-table.component';
import { CnStaticFormBusiPopApiComponent } from './cn-static-form-item/cn-static-form-busi-pop-api/cn-static-form-busi-pop-api.component';
import { CnStaticFormChildArrayComponent } from './cn-static-form-item/cn-static-form-child-array/cn-static-form-child-array.component';
import { CnStaticFormCustomInputSelectComponent } from './cn-static-form-item/cn-static-form-custom-input-select/cn-static-form-custom-input-select.component';
import { CnStaticFormCustomSelectComponent } from './cn-static-form-item/cn-static-form-custom-select/cn-static-form-custom-select.component';
import { CnStaticFormInputComponent } from './cn-static-form-item/cn-static-form-input/cn-static-form-input.component';
import { CnStaticFormLabelComponent } from './cn-static-form-item/cn-static-form-label/cn-static-form-label.component';
import { CnStaticFormObjectCardComponent } from './cn-static-form-item/cn-static-form-object-card/cn-static-form-object-card.component';
import { CnStaticFormObjectEmptyComponent } from './cn-static-form-item/cn-static-form-object-empty/cn-static-form-object-empty.component';
import { CnStaticFormPopApiComponent } from './cn-static-form-item/cn-static-form-pop-api/cn-static-form-pop-api.component';
import { CnStaticFormPopSelectParameterComponent } from './cn-static-form-item/cn-static-form-pop-select-parameter/cn-static-form-pop-select-parameter.component';
import { CnStaticFormSelectTreeComponent } from './cn-static-form-item/cn-static-form-select-tree/cn-static-form-select-tree.component';
import { CnStaticFormSelectComponent } from './cn-static-form-item/cn-static-form-select/cn-static-form-select.component';
import { CnStaticFormSliderComponent } from './cn-static-form-item/cn-static-form-slider/cn-static-form-slider.component';
import { CnStaticFormSubComponentComponent } from './cn-static-form-item/cn-static-form-sub-component/cn-static-form-sub-component.component';
import { CnStaticFormSwitchComponent } from './cn-static-form-item/cn-static-form-switch/cn-static-form-switch.component';
import { CnStaticFormTextareaComponent } from './cn-static-form-item/cn-static-form-textarea/cn-static-form-textarea.component';

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
  arrayCollapse: CnStaticFormArrayCollapseComponent,
  customInputSelect: CnStaticFormCustomInputSelectComponent,
  label: CnStaticFormLabelComponent,
  popSelectParameter: CnStaticFormPopSelectParameterComponent,
  treeObject: CnStaticFormTreeObjectComponent,
  childArray: CnStaticFormChildArrayComponent,
  popApi: CnStaticFormPopApiComponent,
  subComponent: CnStaticFormSubComponentComponent,
  treeSelect: CnStaticFormSelectTreeComponent,
  textarea: CnStaticFormTextareaComponent,
  busiPopApi: CnStaticFormBusiPopApiComponent

}
@Directive({
  selector: '[CnStaticFormItemDirective]'
})
export class CnStaticFormItemDirective implements OnInit, OnChanges, OnDestroy {
  @Input() validateForm: FormGroup;
  @Input() config;
  @Input() globalConfig;

  @Input() public fromDataService;
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
