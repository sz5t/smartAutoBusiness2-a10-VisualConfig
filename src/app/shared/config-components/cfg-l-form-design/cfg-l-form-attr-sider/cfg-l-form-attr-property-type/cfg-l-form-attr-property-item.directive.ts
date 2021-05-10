import { ComponentFactoryResolver, ComponentRef, Directive, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, Type, ViewContainerRef } from '@angular/core';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';
import { CfgLFormAttrCtrEditorComponent } from '../cfg-l-form-attr-controls/cfg-l-form-attr-controls-items/cfg-l-form-attr-ctr-editor/cfg-l-form-attr-ctr-editor.component';
import { CfgLFormAttrCtrLayoutComponent } from '../cfg-l-form-attr-controls/cfg-l-form-attr-controls-items/cfg-l-form-attr-ctr-layout/cfg-l-form-attr-ctr-layout.component';
import { CfgLFormAttrCtrSizeComponent } from '../cfg-l-form-attr-controls/cfg-l-form-attr-controls-items/cfg-l-form-attr-ctr-size/cfg-l-form-attr-ctr-size.component';
import { CfgLFormAttrCtrTextComponent } from '../cfg-l-form-attr-controls/cfg-l-form-attr-controls-items/cfg-l-form-attr-ctr-text/cfg-l-form-attr-ctr-text.component';
import { CfgLFormAttrCtrTitleComponent } from '../cfg-l-form-attr-controls/cfg-l-form-attr-controls-items/cfg-l-form-attr-ctr-title/cfg-l-form-attr-ctr-title.component';

const components: { [type: string]: Type<any> } = {
  //  input: CnFormInputComponent,
  size: CfgLFormAttrCtrSizeComponent,
  layout: CfgLFormAttrCtrLayoutComponent,
  text: CfgLFormAttrCtrTextComponent,
  editor: CfgLFormAttrCtrEditorComponent,
  title: CfgLFormAttrCtrTitleComponent,

};
@Directive({
  selector: '[CfgLFormAttrPropertyItemDirective]'
})
export class CfgLFormAttrPropertyItemDirective implements OnInit, OnChanges, OnDestroy {
  @Input() public config;
  @Input() public sourceData;
  @Input() public fromDataService: configFormDataServerService;

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
    this.component.instance.configData = this.sourceData;
    // configData
    console.log('base=============>base=============>>>>>>');
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
          this.component.instance.configData = this.sourceData;

        }
      }
    }
  }
  ngOnDestroy(): void {
    if (this.component) {
      this.component.destroy();
    }
  }


}
