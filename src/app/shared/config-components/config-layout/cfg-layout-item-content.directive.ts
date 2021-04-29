import { Type, Directive, OnInit, Input, ComponentRef, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { CfgFormInputComponent } from '../config-form-layout/cfg-form-component/cfg-form-input/cfg-form-input.component';
import { CfgFormSelectComponent } from '../config-form-layout/cfg-form-component/cfg-form-select/cfg-form-select.component';
import { CfgCalendarComponent } from './cfg-layout-component/cfg-calendar/cfg-calendar.component';
import { CfgCarouselComponent } from './cfg-layout-component/cfg-carousel/cfg-carousel.component';
import { CfgDataTableComponent } from './cfg-layout-component/cfg-data-table/cfg-data-table.component';
import { CfgFormComponent } from './cfg-layout-component/cfg-form/cfg-form.component';
import { CfgToolbarComponent } from './cfg-layout-component/cfg-toolbar/cfg-toolbar.component';
import { CfgTreeComponent } from './cfg-layout-component/cfg-tree/cfg-tree.component';

const components: { [type: string]: Type<any> } = {
  input: CfgFormInputComponent,
  select: CfgFormSelectComponent,
  cnDataTable: CfgDataTableComponent,
  cnTree: CfgTreeComponent,
  cnForm: CfgFormComponent,
  calendar: CfgCalendarComponent,
  carousel: CfgCarouselComponent,
  cnToolbar: CfgToolbarComponent,
};
@Directive({
  selector: '[CfgLayoutItemContent]',
})
export class CfgLayoutItemContentDirective implements OnInit {
  @Input() public config;
  public component: ComponentRef<any>;
  constructor(private resolver: ComponentFactoryResolver, private container: ViewContainerRef) {}
  public ngOnInit() {
    if (!components[this.config.container]) {
      const supportedTypes = Object.keys(components).join(', ');
      throw new Error(`不支持此类型的组件 (${this.config.type}).可支持的类型为: ${supportedTypes}`);
    }
    this.container.clear();
    const comp = this.resolver.resolveComponentFactory<any>(components[this.config.type]);
    this.component = this.container.createComponent(comp);
    this.component.instance.config = this.config;

    console.log('创建布局内部组件。。。', this.config);
  }
}
