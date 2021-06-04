import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cn-static-form-check',
  templateUrl: './cn-static-form-check.component.html',
  styles: [
  ]
})
export class CnStaticFormCheckComponent implements OnInit {
  @Input() validateForm: FormGroup;
  @Input() config;
  @Input() public fromDataService;
  @Output() public updateValue = new EventEmitter<any>(true);
  selectOptions: any;
  constructor() { }

  ngOnInit(): void {
    if (this.config['componentConfig']) {
      // this.selectOptions = this.config['componentConfig']['options'];

    }
  }

}
