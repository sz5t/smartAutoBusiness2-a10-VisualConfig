import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-smt-component',
  templateUrl: './smt-component.component.html',
  styles: [
  ]
})
export class SmtComponentComponent implements OnInit {

  constructor() { }
  @Input() public config; // 结构树
  @Input() public dataServe;
  @Input() public initData;
  @Input() public tempData;

  public componentConfig // 实际配置

  ngOnInit(): void {
    this.config;
    this.componentConfig = this.dataServe.componentsConfig[this.config.id];
    this.componentConfig['header'] = (this.config.children.length > 0 && this.config.children.findIndex(e => e.type === 'cnToolbar') > -1) ? true : false;
    debugger;
  }

}
