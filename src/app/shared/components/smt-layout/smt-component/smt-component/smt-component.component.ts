import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-smt-component',
  templateUrl: './smt-component.component.html',
  styles: [
  ]
})
export class SmtComponentComponent implements OnInit {

  constructor() { }
  @Input() public config;
  @Input() public dataServe;
  @Input() public col;
  @Input() public initData;
  @Input() public tempData;

  ngOnInit(): void {
  }

}
