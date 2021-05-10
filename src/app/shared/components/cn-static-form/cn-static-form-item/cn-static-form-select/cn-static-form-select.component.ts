import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cn-static-form-select',
  templateUrl: './cn-static-form-select.component.html',
  styles: [
  ]
})
export class CnStaticFormSelectComponent implements OnInit {
  @Input() validateForm: FormGroup;
  @Input() config;
  @Output() public updateValue = new EventEmitter<any>(true);
  selectValue: any;
  selectOptions: any[];
  constructor() { }

  ngOnInit(): void {
    console.log('select:', this.config);
    if (this.config['componentConfig']) {
      this.selectOptions = this.config['componentConfig']['options'];

    }

  }

  log(v?) {
    this.selectValue = v;
    console.log('选择中：', v);
  }

}
