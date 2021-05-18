import { ComponentFactoryResolver, ComponentRef, Directive, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, Type, ViewContainerRef, EventEmitter } from '@angular/core';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';
import { CfgLFormAttrCtrEditorComponent } from '../cfg-l-form-attr-controls/cfg-l-form-attr-controls-items/cfg-l-form-attr-ctr-editor/cfg-l-form-attr-ctr-editor.component';
import { CfgLFormAttrCtrLayoutComponent } from '../cfg-l-form-attr-controls/cfg-l-form-attr-controls-items/cfg-l-form-attr-ctr-layout/cfg-l-form-attr-ctr-layout.component';
import { CfgLFormAttrCtrSizeComponent } from '../cfg-l-form-attr-controls/cfg-l-form-attr-controls-items/cfg-l-form-attr-ctr-size/cfg-l-form-attr-ctr-size.component';
import { CfgLFormAttrCtrTextComponent } from '../cfg-l-form-attr-controls/cfg-l-form-attr-controls-items/cfg-l-form-attr-ctr-text/cfg-l-form-attr-ctr-text.component';
import { CfgLFormAttrCtrTitleComponent } from '../cfg-l-form-attr-controls/cfg-l-form-attr-controls-items/cfg-l-form-attr-ctr-title/cfg-l-form-attr-ctr-title.component';
import { CfgLFormAttrPopBaseComponent } from './cfg-l-form-attr-property-items/cfg-l-form-attr-pop-base/cfg-l-form-attr-pop-base.component';
import { CfgLFormAttrPopComponentComponent } from './cfg-l-form-attr-property-items/cfg-l-form-attr-pop-component/cfg-l-form-attr-pop-component.component';

const components: { [type: string]: Type<any> } = {
  //  input: CnFormInputComponent,
  size: CfgLFormAttrCtrSizeComponent,
  layout: CfgLFormAttrCtrLayoutComponent,
  text: CfgLFormAttrCtrTextComponent,
  editor: CfgLFormAttrCtrEditorComponent,
  title: CfgLFormAttrCtrTitleComponent,
  base: CfgLFormAttrPopBaseComponent,
  property: CfgLFormAttrPopBaseComponent,
  subComponent: CfgLFormAttrPopComponentComponent

};
@Directive({
  selector: '[CfgLFormAttrPropertyItemDirective]'
})
export class CfgLFormAttrPropertyItemDirective implements OnInit, OnChanges, OnDestroy {
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
