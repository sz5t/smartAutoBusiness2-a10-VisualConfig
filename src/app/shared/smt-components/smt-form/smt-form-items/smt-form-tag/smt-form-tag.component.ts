import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-smt-form-tag',
  templateUrl: './smt-form-tag.component.html',
  styles: [],
})
export class SmtFormTagComponent implements OnInit {
  @Input() validateForm: FormGroup;
  @Input() config: any;
  @Input() public fromDataService;
  public model: any;

  public text: string;
  public color: string;
  constructor() {}

  ngOnInit(): void {
    this._colorMappingResolve();
  }

  private _colorMappingResolve() {
    if (this.config.dataMapping) {
      this.config.dataMapping.forEach((d) => {
        let val = this.model;
        if (d.type === 'rowValue') {
          val = this.validateForm.value[d.field];
        }
        if (d.type === 'formValue') {
          val = this.validateForm.value[d.field];
        }
        if (d.type === 'currentValue') {
          val = this.model;
        }
        if ((val || val === 0 || val === false) && d.value === val) {
          this.color = d.color;
          if (d.valueText) {
            this.text = d.valueText;
          }
          if (d.valueField) {
            this.text = this.validateForm.value[d.valueField];
          }
          if (!d.valueText && !d.valueField) {
            this.text = this.model;
          }
          return false;
        }
      });
    }
  }
}
