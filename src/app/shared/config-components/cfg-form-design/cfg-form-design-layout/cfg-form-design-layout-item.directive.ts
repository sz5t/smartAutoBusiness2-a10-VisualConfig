import { ComponentFactoryResolver, ComponentRef, Directive, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, Type, ViewContainerRef } from '@angular/core';
import { CfgFormInputComponent } from './cfg-form-input/cfg-form-input.component';
import { CfgFormSelectComponent } from './cfg-form-select/cfg-form-select.component';
const components: { [type: string]: Type<any> } = {

  cnFormInput: CfgFormInputComponent,
  cnFormSelect: CfgFormSelectComponent,
  smtFormInput: CfgFormInputComponent,
  smtFormSwitch: CfgFormInputComponent,
  smtFormSelect: CfgFormInputComponent,
  smtFormCheck: CfgFormInputComponent,
  smtFormLabel: CfgFormInputComponent,
  smtFormPickerDate: CfgFormInputComponent,
  smtFormPickerRange: CfgFormInputComponent,
  smtFormPickerMonth: CfgFormInputComponent,
  smtFormPickerWeek: CfgFormInputComponent,
  smtFormPickerYear: CfgFormInputComponent,
  smtFormRadio: CfgFormInputComponent,
  smtFormTag: CfgFormInputComponent,
  smtFormTextarea: CfgFormInputComponent,
  smtFormTreeSelect: CfgFormInputComponent,
  smtFormSpan: CfgFormInputComponent

};
@Directive({
  selector: '[appCfgFormDesignLayoutItem]'
})
export class CfgFormDesignLayoutItemDirective implements OnInit, OnChanges, OnDestroy {
  @Input() public l_config;
  @Input() public showLayout: any;
  @Input() public selectedItem: any;
  @Input() public cmptState: any;
  @Input() public fromDataService;
  public component: ComponentRef<any>;
  constructor(private resolver: ComponentFactoryResolver, private container: ViewContainerRef) { }

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
  ngOnChanges(changes: SimpleChanges): void {


  }

  ngOnDestroy(): void {
    if (this.component) {
      this.component.destroy();
    }
  }
}
