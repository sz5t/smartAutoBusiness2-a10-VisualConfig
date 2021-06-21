import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-smt-form-textarea',
  templateUrl: './smt-form-textarea.component.html',
  styles: [],
})
export class SmtFormTextareaComponent implements OnInit {
  @Input() validateForm: FormGroup;
  @Input() config: any;
  @Input() public fromDataService;
  public model: any;
  constructor() {}

  ngOnInit(): void {}
}
