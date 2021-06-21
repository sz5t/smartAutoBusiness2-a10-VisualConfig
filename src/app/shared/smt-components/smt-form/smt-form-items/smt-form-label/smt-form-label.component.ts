import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-smt-form-label',
  templateUrl: './smt-form-label.component.html',
  styles: [],
})
export class SmtFormLabelComponent implements OnInit {
  @Input() validateForm: FormGroup;
  @Input() config;
  @Input() public fromDataService;
  constructor() {}

  ngOnInit(): void {}
}
