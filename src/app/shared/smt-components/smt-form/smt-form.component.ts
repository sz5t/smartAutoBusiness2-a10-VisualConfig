import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidator } from '../../components/data-form/form-validator/CustomValidator';

@Component({
  selector: 'app-smt-form',
  templateUrl: './smt-form.component.html',
  styles: [
  ]
})
export class SmtFormComponent implements OnInit {

  config: any;
  validateForm: FormGroup;

  constructor(private fb: FormBuilder) {

  }

  ngOnInit(): void {
  }


  load() {

  }

  /*
       【加载】

   */


  private createControls(f, data) {

    this.config.properties.forEach(Control => {
      let value = null;
      let key = Control['name'];
      if (data && data.hasOwnProperty(key)) {
        value = data[key];
      }
      if (Control.formType === 'value') {
        f.addControl(
          `${key}`,
          new FormControl(value, this.getValidations(Control.validations), this.getValidations1(Control.validations)),
        );
      }
      if (Control.formType === 'object') {
        f.addControl(`${key}`, this.set_formGroupControlName(value, Control));

      }
      if (Control.formType === 'array') {
        // 需要知道数组行数
        f.addControl(`${key}`, this.set_formArrayControlName(value, Control));
      }

    });

  }
  private set_formGroupControlName(data, Control) {

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
  private set_formArrayControlName(data, Control) {

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

  private getValidations(validations) {
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

  private getValidations1(validations) {
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


  /**
   * 值级联
   * @param options 
   */
  private cascadeValueEmit(options?) {

  }



}
