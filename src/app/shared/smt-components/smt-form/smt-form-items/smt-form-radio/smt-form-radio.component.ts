import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-smt-form-radio',
  templateUrl: './smt-form-radio.component.html',
  styles: [],
})
export class SmtFormRadioComponent implements OnInit {
  @Input() validateForm: FormGroup;
  @Input() config;
  @Input() public fromDataService;
  public model: any;
  constructor() {}

  ngOnInit(): void {}
}
