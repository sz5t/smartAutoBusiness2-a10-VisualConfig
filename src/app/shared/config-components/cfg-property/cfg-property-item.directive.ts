import { ComponentFactoryResolver, ComponentRef, Directive, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, Type, ViewContainerRef, EventEmitter } from '@angular/core';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';
import { CfgPropertyConentComponent } from './cfg-property-conent/cfg-property-conent.component';
import { CfgPropertyFormComponent } from './cfg-property-form/cfg-property-form.component';
const components: { [type: string]: Type<any> } = {
  //  input: CnFormInputComponent,
  /*   size: CfgLFormAttrCtrSizeComponent,
    layout: CfgLFormAttrCtrLayoutComponent,
    text: CfgLFormAttrCtrTextComponent,
    editor: CfgLFormAttrCtrEditorComponent,
    title: CfgLFormAttrCtrTitleComponent,
    */
  base: CfgPropertyFormComponent,
  property: CfgPropertyFormComponent,
  subComponent: CfgPropertyConentComponent

};
@Directive({
  selector: '[CfgPropertyItemDirective]'
})
export class CfgPropertyItemDirective implements OnInit, OnChanges, OnDestroy {

  @Input() public config;
  @Input() public sourceData;
  @Input() public fromDataService: configFormDataServerService;
  @Output() public updateValue = new EventEmitter<any>(true);
  public component: ComponentRef<any>;
  constructor(private resolver: ComponentFactoryResolver, private container: ViewContainerRef) { }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this.container.clear();
    if (!this.config['type']) {
      return;
    }
    if (!components[this.config['type']]) {
      return;
    }
    const comp = this.resolver.resolveComponentFactory<any>(components[this.config['type']]);
    this.component = this.container.createComponent(comp);
    // this.component.instance.configData = { id: '001' };
    this.component.instance.config = this.config;


    if (this.config.sourceData) {
      if (this.sourceData) {
        this.component.instance.staticData = this.sourceData[this.config.sourceData['name']];
        console.log('----------------->>>>>>', this.sourceData[this.config.sourceData['name']]);
      }

    }

    if (this.component.instance.updateValue) {
      this.component.instance.updateValue.subscribe((event) => {
        this.setValue(event);
      });
    }
    this.component.instance.fromDataService = this.fromDataService;

    // configData
    console.log('base=============>base=============>>>>>>', this.config, this.sourceData);
  }
  ngOnChanges(changes: SimpleChanges): void {
    // throw new Error('Method not implemented.');
    if (changes.hasOwnProperty('config')) {
      if (!changes.config.firstChange) {
        // 处理后续变化，初始变化不处理
        if (this.config) {
          // console.log('触发级联', this.formCascade, this.componentConfig);
          this.container.clear();
          if (!this.config['type']) {
            return;
          }
          if (!components[this.config['type']]) {
            return;
          }
          const comp = this.resolver.resolveComponentFactory<any>(components[this.config['type']]);
          this.component = this.container.createComponent(comp);
          if (this.config.sourceData) {
            if (this.sourceData) {
              this.component.instance.staticData = this.sourceData[this.config.sourceData['name']];
            }
          }
          this.component.instance.config = this.config;
          if (this.component.instance.updateValue) {
            this.component.instance.updateValue.subscribe((event) => {
              this.setValue(event);
            });
          }
          this.component.instance.fromDataService = this.fromDataService;



        }
      }
    }
    if (changes.hasOwnProperty('sourceData')) {
      if (!changes.sourceData.firstChange) {
        // 处理后续变化，初始变化不处理
        if (this.config) {
          // console.log('触发级联', this.formCascade, this.componentConfig);
          this.container.clear();
          if (!this.config['type']) {
            return;
          }
          if (!components[this.config['type']]) {
            return;
          }
          const comp = this.resolver.resolveComponentFactory<any>(components[this.config['type']]);
          this.component = this.container.createComponent(comp);
          if (this.config.sourceData) {
            if (this.sourceData) {
              this.component.instance.staticData = this.sourceData[this.config.sourceData['name']];
            }

          }
          this.component.instance.config = this.config;
          if (this.component.instance.updateValue) {
            this.component.instance.updateValue.subscribe((event) => {
              this.setValue(event);
            });
          }
          this.component.instance.fromDataService = this.fromDataService;

        }
      }
    }
  }

  // 组件将值写回、级联数据-》回写
  public setValue(data?) {
    this.updateValue.emit(data);
  }
  ngOnDestroy(): void {
    if (this.component) {
      this.component.destroy();
    }
  }

}
