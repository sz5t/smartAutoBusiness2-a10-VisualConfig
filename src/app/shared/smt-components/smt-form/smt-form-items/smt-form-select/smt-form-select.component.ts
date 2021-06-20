import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-smt-form-select',
  templateUrl: './smt-form-select.component.html',
  styles: [],
})
export class SmtFormSelectComponent implements OnInit {
  @Input() validateForm: FormGroup;
  @Input() config;
  @Input() public fromDataService;
  public model: any;
  constructor() {}

  ngOnInit(): void {}

  onSearch($event) {}
}
