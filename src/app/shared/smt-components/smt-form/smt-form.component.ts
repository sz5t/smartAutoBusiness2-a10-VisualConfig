import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { CustomValidator } from '../../components/data-form/form-validator/CustomValidator';
import { SmtComponentBase } from '../smt-component.base';
interface IFormBindProperties {
  id: boolean;
  formLayout: any[];
  componentJson: any;
  fields: any[];

}
@Component({
  selector: 'app-smt-form',
  templateUrl: './smt-form.component.html',
  styles: [
  ]
})
export class SmtFormComponent extends SmtComponentBase implements OnInit, OnDestroy {
  @Input()
  public config: any;
  @Input()
  public initData: any;
  @Input()
  public tempData: any;
  validateForm: FormGroup;
  @Input() dataServe: any;

  fromDataService: any;
  formBindObj: {
    id: any;
    formLayout: any[];
    componentJson: {};
    fields: any[];
  }

  private _sender$: Subject<any>;
  private _sender_subscription$: Subscription;
  private _receiver_subscription$: Subscription;

  constructor(private fb: FormBuilder, @Inject(BSN_COMPONENT_SERVICES)
  public componentService: ComponentServiceProvider,
  ) {
    super(componentService);

  }


  loading = false;

  ngOnInit(): void {
    this.validateForm = this.fb.group({});
    this.formBindObj = this.setFormBindObj(this.config);
    this.createControls(this.validateForm, {});
    this.loading = true;
    console.log('表单配置', this.formBindObj);
  }


  load() {

  }

  // 清空表单
  // 加载表单
  // 执行ajax
  // 级联
  // 校验【执行前置】
  // 默认值

  private setFormBindObj(config: any): IFormBindProperties {
    return {
      id: config['id'],
      formLayout: config['formLayout'],
      componentJson: config['componentJson'],
      fields: config['fields']
    }
  }

  /**
   * 生成表单项
   * field: 'name1', formType: 'value',  validations: []
   * @param f 
   * @param data 
   * @returns 
   */
  private createControls(f, data) {

    this.formBindObj.fields.forEach(Control => {
      let value = null;
      let key = Control['field'];
      if (data && data.hasOwnProperty(key)) {
        value = data[key];
      }
      let formType = 'value';
      if (Control.formType) {
        formType = Control.formType;
      }
      if (formType === 'value') {
        f.addControl(
          `${key}`,
          new FormControl(value, this.getValidations(Control.validations), this.getValidations1(Control.validations)),
        );
      }
      if (formType === 'object') {
        f.addControl(`${key}`, this.set_formGroupControlName(value, Control));

      }
      if (formType === 'array') {
        // 需要知道数组行数
        f.addControl(`${key}`, this.set_formArrayControlName(value, Control));
      }

    });

    return true;

  }
  private set_formGroupControlName(data, Control) {

    let obj: any = {};
    Control.properties.forEach(item => {
      let value = null;
      let obj_key = item['field'];
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

    validation.push(Validators['required']);
    validation.push(Validators['email']);

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
  public cascadeValueEmit(options?) {

  }

  /**
   * 销毁
   */
  ngOnDestroy(): void {
    // 释放级联对象
    this.unsubscribeRelation();
    // 释放及联接受对象
    if (this._receiver_subscription$) {
      this._receiver_subscription$.unsubscribe();
    }

    if (this._sender_subscription$) {
      this._sender_subscription$.unsubscribe();
    }

    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

  /**
   * 测试【查看表单值】
   */
  test() {

    this.validate();
    console.log('当前表单验证状态', this.validateForm.valid);
    console.log('当前表单', this.validateForm);
  }



  public validate() {
    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
      // Promise.resolve().then(() => this.validateForm.controls[i].updateValueAndValidity());
    }
    return this.validateForm.valid;
  }



}
