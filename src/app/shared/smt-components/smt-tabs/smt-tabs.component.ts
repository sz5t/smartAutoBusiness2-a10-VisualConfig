import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-smt-tabs',
  templateUrl: './smt-tabs.component.html',
  styles: [
  ]
})
export class SmtTabsComponent implements OnInit {

  constructor() { }
  @Input() public config; // dataTables 的配置参数
  @Input() public initData;
  @Input() public tempData;
  @Input() public dataServe;

  ngOnInit(): void {
    console.log(this.config)
  }

}
