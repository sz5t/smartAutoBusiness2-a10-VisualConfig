import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cfg-form-design',
  templateUrl: './cfg-form-design.component.html',
  styles: [
  ]
})
export class CfgFormDesignComponent implements OnInit {
  @Input() public config;
  constructor() { }

  ngOnInit(): void {
  }

}
