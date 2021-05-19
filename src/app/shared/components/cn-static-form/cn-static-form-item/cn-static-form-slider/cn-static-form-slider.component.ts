import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cn-static-form-slider',
  templateUrl: './cn-static-form-slider.component.html',
  styles: [
  ]
})
export class CnStaticFormSliderComponent implements OnInit {
  @Input() validateForm: FormGroup;
  @Input() config;
  @Output() public updateValue = new EventEmitter<any>(true);
  componentConfig: any;
  selectValue: any;
  constructor() { }

  ngOnInit(): void {

    console.log('select:', this.config);
    if (this.config['componentConfig']) {
      this.componentConfig = this.config['componentConfig'];

    }
  }
  log(v) {
    console.log('sider', v);
    this.selectValue = v;
    this.validateForm.controls[this.config['name']].markAsDirty();
    // this.valueChange(v);
  }
  valueChange(v?) {
    this.validateForm.get(this.config['name'])!.setValue(v);
  }

}
