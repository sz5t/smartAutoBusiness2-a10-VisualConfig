import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidator } from '../../../data-form/form-validator/CustomValidator';

@Component({
  selector: 'app-cn-static-form-array-card',
  templateUrl: './cn-static-form-array-card.component.html',
  styles: [
  ]
})
export class CnStaticFormArrayCardComponent implements OnInit {
  @Input() validateForm: FormGroup;
  @Input() validateFormArray: FormArray;
  @Input() config;
  @Output() public updateValue = new EventEmitter<any>(true);
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {

  }

  ArrFormArray(controlName) {
    return this.validateForm.controls[controlName] as FormArray;
  }

  demo() {
    console.log('内容', this.validateFormArray);
  }

  add() {

    this.validateFormArray.push(this.set_formGroupControlName({}, this.config));
    // this.validateFormArray.push(this.creatRow());
    this.validateFormArray.controls.forEach(item => {
      item.markAsPristine();
      // pristine
    })
    for (const key in this.validateForm.controls) {
      if (key === this.config.name) {
        this.validateForm.controls[key].markAsPristine();
      }
    }

    // console.log('', this.validateForm)


  }
  //刪除组合
  delItem(i) {
    this.validateFormArray.removeAt(i);
  }



  set_formGroupControlName(data, Control) {

    let obj: any = {};
    Control.properties.forEach(item => {
      let value = null;
      let obj_key = item['name'];
      if (data && data.hasOwnProperty(obj_key)) {
        value = data[obj_key];
      }
      if (item.formType === 'object') {
        obj[obj_key] = this.set_formGroupControlName(value, item);
      }
      if (item.formType === 'array') {
        obj[obj_key] = this.set_formArrayControlName(value, item);
      }
      if (item.formType === 'value') {
        obj[obj_key] = new FormControl(
          value,
          this.getValidations(item.validations),
          this.getValidations1(item.validations),
        );
      }

    });
    return this.fb.group(obj);
  }
  set_formArrayControlName(data, Control) {

    let _array: FormArray = this.fb.array([]);

    if (data && data.length > 0) {

      data.forEach(element => {
        let value = element;
        let _obj = this.set_formGroupControlName(value, Control);
        _array.push(_obj);
      });

    }


    return _array;

  }

  public getValidations(validations) {
    const validation = [];
    validations &&
      validations.forEach((valid) => {
        if (valid.type && valid.type === 'custom') {
          if (valid.type === 'custom') {
            if (valid.validator === 'remote') {
              // validation.push(CustomValidator[valid.validator](valid, this));
              // validation.push(this[valid.validator]);
            } else {
              validation.push(CustomValidator[valid.validator](valid));
            }
          } else {
            validation.push(Validators[valid.validator]);
          }
        } else {
          if (valid.validator === 'required' || valid.validator === 'email') {
            validation.push(Validators[valid.validator]);
          } else if (valid.validator === 'minLength' || valid.validator === 'maxLength') {
            validation.push(Validators[valid.validator](valid.length));
          } else if (valid.validator === 'pattern') {
            validation.push(Validators[valid.validator](valid.pattern));
          } else if (valid.validator === 'min' || valid.validator === 'max') {
            validation.push(Validators[valid.validator](valid.value));
          }
        }
      });
    return validation;
  }

  public getValidations1(validations) {
    const validation = [];
    validations &&
      validations.forEach((valid) => {
        if (valid.type && valid.type === 'custom') {
          if (valid.type === 'custom') {
            if (valid.validator === 'remote') {
              // validation.push(CustomValidator[valid.validator](valid, this));
              validation.push(CustomValidator[valid.validator](valid, this));
            }
          }
        }
      });
    return validation;
  }

}
