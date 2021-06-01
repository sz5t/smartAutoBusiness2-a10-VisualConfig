import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cn-static-form-checkbox',
  templateUrl: './cn-static-form-checkbox.component.html',
  styles: [
  ]
})
export class CnStaticFormCheckboxComponent implements OnInit {
  @Input() public fromDataService;
  constructor() { }

  ngOnInit(): void {
  }

}
