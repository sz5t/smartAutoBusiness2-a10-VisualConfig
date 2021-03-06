import { Directive, ComponentFactoryResolver, ViewContainerRef, Type, ComponentRef, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { CnGridInputComponent } from 'src/app/shared/components/data_table/cn-grid-items/cn-grid-input/cn-grid-input.component';
import { CnGridSelectComponent } from 'src/app/shared/components/data_table/cn-grid-items/cn-grid-select/cn-grid-select.component';
import { CfgAttributeObjectComponent } from '../cfg-attribute-item/cfg-attribute-object/cfg-attribute-object.component';
import { CfgAttributeArrayComponent } from '../cfg-attribute-item/cfg-attribute-array/cfg-attribute-array.component';
import { CnAttributeTableComponent } from 'src/app/shared/components/cn-attribute/cn-attribute-items/cn-attribute-table/cn-attribute-table.component';
import { CnAttributePropertyGridComponent } from 'src/app/shared/components/cn-attribute/cn-attribute-items/cn-attribute-property-grid/cn-attribute-property-grid.component';
import { CfgAttributeTableFormComponent } from '../cfg-attribute-item/cfg-attribute-table-form/cfg-attribute-table-form.component';
import { CnGridSwitchComponent } from 'src/app/shared/components/data_table/cn-grid-items/cn-grid-switch/cn-grid-switch.component';
import { CfgAttributeGridSelectComponent } from '../cfg-attribute-item/cfg-attribute-grid-select/cfg-attribute-grid-select.component';

const components: { [type: string]: Type<any> } = {
  input: CnGridInputComponent,
  select: CnGridSelectComponent,
  AttributeObject: CfgAttributeObjectComponent,
  AttributeArray: CfgAttributeArrayComponent,
  AttributeTable: CnAttributeTableComponent,
  AttributePropertyGrid: CnAttributePropertyGridComponent,
  AttributeTableForm: CfgAttributeTableFormComponent,
  switch: CnGridSwitchComponent,
  gridSelect: CfgAttributeGridSelectComponent
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
  selector: '[CfgAttributeItemDirective]'
})
export class CfgAttributeItemDirective implements OnInit, OnChanges, OnDestroy {
  @Input() public config;
  @Input() public attributeConfig;
  @Input() public initData;
  @Input() public formCascade;
  @Input() public state;
  @Input() public valueConfig;
  @Input() public typeConfig;
  @Input() public changeValue;
  @Input() public attributeType;
  @Input() public loadConfigValue;

  @Output() public updateValue = new EventEmitter();
  @Output() public execOperation = new EventEmitter();
  public component: ComponentRef<any>;
  public componentConfig;
  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) {

  }


  public ngOnInit() {
    //  console.log('**********', this.valueConfig)
    if (!components[this.config.type]) {
      const supportedTypes = Object.keys(components).join(', ');
      throw new Error(
        `??????????????????????????? (${
        this.config.type
        }).?????????????????????: ${supportedTypes}`
      );
    }
    this.container.clear();
    const comp = this.resolver.resolveComponentFactory<any>(
      components[this.config.type]
    );

    this.component = this.container.createComponent(comp);
    this.component.instance.config = this.config;
    this.component.instance.valueConfig = this.valueConfig;
    this.component.instance.state = this.state;
    this.component.instance.attributeConfig = this.attributeConfig;
    this.component.instance.typeConfig = this.typeConfig;
    this.component.instance.changeValue = this.changeValue;
    this.component.instance.attributeType = this.attributeType;
    this.component.instance.initData = this.initData;

    if (this.component.instance.hasOwnProperty('loadConfigValue')) {
      this.component.instance.loadConfigValue = this.loadConfigValue;
    }
    // ?????????????????? liu
    if (this.component.instance.updateValue) {
      this.component.instance.updateValue.subscribe(event => {
        this.setValue(event);
      });
    }
    if (this.component.instance.execOperation) {
      this.component.instance.execOperation.subscribe(event => {
        this.setOperation(event);
      });
    }


    // console.log('?????????????????????????????????', _config);
  }

  // ?????????????????????????????????-????????? 
  public setValue(data?) {
    this.updateValue.emit(data);
  }
  public setOperation(data?) {
    this.execOperation.emit(data);
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('****ngOnChanges******', changes, this.valueConfig)
    // ngOnChanges????????????????????????????????????????????????
    // ???????????????(@Input)???????????????????????????????????????????????????????????????ngOnChanges??????
    // ????????????????????????????????????????????????????????????????????????????????????????????????form???????????????
    if (changes.hasOwnProperty('formCascade')) {
      if (!changes['formCascade'].firstChange) { // ??????????????????????????????????????????
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
          throw new Error(
            `??????????????????????????? (${
            this.config.type
            }).?????????????????????: ${supportedTypes}`
          );
        }
        this.container.clear();
        const comp = this.resolver.resolveComponentFactory<any>(
          components[this.config.type]
        );

        this.component = this.container.createComponent(comp);
        this.component.instance.config = this.config;
        this.component.instance.valueConfig = this.valueConfig;
        this.component.instance.state = this.state;
        this.component.instance.attributeConfig = this.attributeConfig;
        this.component.instance.typeConfig = this.typeConfig;
        this.component.instance.attributeType = this.attributeType;
        this.component.instance.initData = this.initData;
        // ?????????????????? liu
        if (this.component.instance.updateValue) {
          this.component.instance.updateValue.subscribe(event => {
            this.setValue(event);
          });
        }
        if (this.component.instance.execOperation) {
          this.component.instance.execOperation.subscribe(event => {
            this.setOperation(event);
          });
        }
        // if(this.config.field ==='inputname4')
        // this.formGroup.setValue(this.value);
      }
    }
    if (changes.hasOwnProperty('valueConfig')) {
      if (!changes['valueConfig'].firstChange) { // ??????????????????????????????????????????
        if (this.valueConfig) {
          //  console.log('????????????', this.formCascade, this.componentConfig);

        }

        this.component.instance.valueConfig = this.valueConfig;
        this.component.instance.remoteOperation();
      }
    }
    if (changes.hasOwnProperty('initData')) {
      if (!changes['initData'].firstChange) { // ??????????????????????????????????????????

        this.component.instance.initData = this.initData;

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
