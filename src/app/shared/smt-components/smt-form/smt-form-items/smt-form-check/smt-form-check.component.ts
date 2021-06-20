import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-smt-form-check',
  templateUrl: './smt-form-check.component.html',
  styles: [],
})
export class SmtFormCheckComponent implements OnInit {
  @Input() validateForm: FormGroup;
  @Input() config;
  @Input() public fromDataService;
  constructor() {}

  ngOnInit(): void {}

  public onChange(value: string[]) {
    this.validateForm.controls[this.config.field].setValue(value);
  }
}
