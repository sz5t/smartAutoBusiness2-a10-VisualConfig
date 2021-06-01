import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-smt-layout',
  templateUrl: './smt-layout.component.html',
  styles: [
  ]
})
export class SmtLayoutComponent implements OnInit {

  constructor() { }
  @Input() public config;
  @Input() public tempData;
  @Input() public dataServe;
  @Input() public initData;
  @Input() public layoutObj;

  ngOnInit(): void {
    // console.log('layoutObj', this.layoutObj);
  }

}
