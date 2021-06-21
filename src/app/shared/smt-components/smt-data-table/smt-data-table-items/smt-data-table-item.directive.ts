import { ComponentFactoryResolver, ComponentRef, Directive, Input, Output, SimpleChanges, ViewContainerRef, EventEmitter, OnDestroy, OnInit, OnChanges, Type } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { SmtDataTableInputComponent } from './smt-data-table-input/smt-data-table-input.component';
const components: { [type: string]: Type<any> } = {
  cnGridInput: SmtDataTableInputComponent,
  // cnGridSwitch:'',
  // cnGridShowSpanText:'',
  // cnGridTag:'',
  // cnGridSelectMultiple:'',
  // cnGridTreeSelect:'',
  // cnGridSelect:'',
  // cnGridGridSelect:'',
  // cnGridTextArea:'',
  // cnGridRadio:'',
  // cnGridDatePicker:'',
  // cnGridDateTimePicker:'',
  // cnGridYearPicker:'',
  // cnGridWeekPicker:'',
  // cnGridMonthPicker:'',
  // cnGridRangePicker:'',

}
@Directive({
  selector: '[appSmtDataTableItem]'
})
export class SmtDataTableItemDirective implements OnInit, OnChanges, OnDestroy {
  // @Input() validateForm: FormGroup;
  @Input() public config;
  @Input() public formCascade;
  @Input() public state;
  @Input() public valueConfig;
  @Input() public dataTableDataServe;
  @Output() public updateValue = new EventEmitter<any>(true);
  @Output() public cascadeValue = new EventEmitter<any>(true);
  // @Input() fb: FormBuilder
  public component: ComponentRef<any>;
  constructor(private resolver: ComponentFactoryResolver, private container: ViewContainerRef) { }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this.container.clear();
    const comp = this.resolver.resolveComponentFactory<any>(components[this.config.type]);
    this.component = this.container.createComponent(comp);
    this.component.instance.config = this.config;
    this.component.instance.valueConfig = this.valueConfig;
    this.component.instance.state = this.state;
    if (this.component.instance.cascadeValue) {
      this.component.instance.cascadeValue.subscribe((event) => {
        this.subscribe_cascadeValue(event);
      });
    }
    if (this.component.instance.updateValue) {
      this.component.instance.updateValue.subscribe((event) => {
        this.setValue(event);
      });
    }

    this.component.instance.dataTableDataServe = this.dataTableDataServe;



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

  // ArrFormArray(controlName) {
  //   return this.validateForm.controls[controlName] as FormArray;
  // }

  subscribe_cascadeValue(data) {
    this.cascadeValue.emit(data);
  }

  // 组件将值写回、级联数据-》回写
  public setValue(data?) {
    this.updateValue.emit(data);
  }

}
