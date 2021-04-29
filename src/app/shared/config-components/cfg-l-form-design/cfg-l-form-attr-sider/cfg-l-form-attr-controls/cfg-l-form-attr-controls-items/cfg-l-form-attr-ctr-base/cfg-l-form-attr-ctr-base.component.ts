import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cfg-l-form-attr-ctr-base',
  templateUrl: './cfg-l-form-attr-ctr-base.component.html',
  styles: [
  ]
})
export class CfgLFormAttrCtrBaseComponent implements OnInit {
  @Input() public config;
  @Input() public configData;

  constructor() { }

  ngOnInit(): void {
  }

}
