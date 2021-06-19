import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { CustomValidator } from '../../components/data-form/form-validator/CustomValidator';
import { SmtComponentBase } from '../smt-component.base';
import { SmtPopPageComponent } from '../smt-pop-page/smt-pop-page.component';
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
    this.INIT_VALUE = {};
    this.TEMP_VALUE = {};
    this.COMPONENT_VALUE = {};

  }


  loading = false;

  ngOnInit(): void {
    this.validateForm = this.fb.group({});
    this.formBindObj = this.setFormBindObj(this.config);
    this.dataSourceCfg = {
      loadingOnInit: true,
      loadingConfig: {
        id: 'loading',
        urlType: 'inner', // 请求地址，inner 匹配的后台地址
        urlContent: {
          // 适配外部请求
          name: 'system_url',
          title: '权限系统访问地址',
        },
        url: 'smt-app/resource/TEST_TABLE/query',
        headParams: [
          // 头部参数
        ],
        ajaxType: 'get',
        pathParams: [
          // 路径参数
          // {
          //   name: 'pathParam',
          //   type: 'value',
          //   value: 'ddd'
          // }
        ],
        queryParams: [
        ], // 查询参数
        bodyParams: [], // 请求体参数
      }
    };

    this.createControls(this.validateForm, {});
    this.loading = true;
    this.COMPONENT_VALUE = this.validateForm.value;
    // 表单值变化更新组件值
    this.validateForm.valueChanges.subscribe(data => {
      this.COMPONENT_VALUE = this.validateForm.value;
      console.log('form', data);
    });
    console.log('表单配置', this.formBindObj);
  }


  async load() {
    let response: any;
    if (!this.dataSourceCfg.loadingConfig) {
      return;
    }
    response = await this.executeHttp(this.dataSourceCfg['loadingConfig'], null, null);

    console.log('表单加载值', response);
    let data_form = {};
    if (response && response['state'] === 1) {
      if (Array.isArray(response.data)) {
        if (response.data && response.data.length > 0) {
          data_form = response.data[0];
        }
      } else {
        if (response.data) {
          data_form = response.data;
        } else {
          data_form = response;
        }
      }
    }
    let formValue = {};
    this.formBindObj.fields.forEach(item => {
      if (data_form.hasOwnProperty(item['field'])) {
        formValue[item['field']] = data_form[item['field']];
      }
    });
    console.log('表单最终值', formValue);
    this.COMPONENT_VALUE = formValue;
    return formValue;

  }

  // 赋值
  setFormValue() {

    this.validateForm.setValue(this.COMPONENT_VALUE);

  }

  // 获取表单默认值
  getFormDefaultValue() {


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
  public cascadeValueEmit(back?) {
    let cascadeValueObj;
    let currentValue;
    if (back['cascadeValueObj']) {
      cascadeValueObj = back['cascadeValueObj'];
    }
    currentValue = back['data'];

    cascadeValueObj && cascadeValueObj.forEach(cascade => {
      let index = this.config.properties.findIndex(item => item.name === cascade['cascadeName']);
      if (cascade.cascadeItems) {
        cascade.cascadeItems.forEach(_cascadeItem => {
          let isPass = true;
          if (_cascadeItem['type'] === 'condition') {
            isPass = this.analysisResult(_cascadeItem['condition']);
          }

          if (isPass) {
            let cascadeItem = _cascadeItem['content']
            if (cascadeItem['type'] === 'display') {

              if (cascadeItem['data']['option']) {
                let displayValueOption = cascadeItem['data']['option'];
                displayValueOption.forEach(element => {
                  if (element['type'] === 'currentValue') {
                    element['value'] = currentValue;
                  }

                });
                let displayValue = displayValueOption[0]['value'];
                if (index > -1) {
                  this.config.properties[index]['hidden'] = displayValue;
                }
              }

            }
          }


        });
      }

    });
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
    console.log('当前表单验证状态', this.validateForm.valid);
    console.log('当前表单', this.validateForm, this.COMPONENT_VALUE);
  }


  /**
   * 重置表单
   * @param option 
   * @returns 
   */
  resetForm(option?) {
    this.validateForm.reset();
    return true;
  }

  /**
   * 验证【表单】
   * @returns 返回验证结果，通过、不通过
   */
  public validate() {

    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    return this.validateForm.valid;
  }

  /**
   * 执行异步请求
   * @param option 
   * @param params 
   * @returns 
   */
  public async execAjax(option, params?) {
    let response: any;
    if (params !== null) {
      response = await this.executeHttp(option.ajaxConfig, params, null);
    } else {
      response = await this.executeHttp(option.ajaxConfig, null, null);
    }
    return response;
  }

  // 结果分析 参数：配置、结果  返回：next、阻止
  public execReasult(reasult, data?) {

    return "";

  }

  // 执行命令内容【叶子节点】
  public execCommand() {

    // 执行 命令（根据类型 内置执行、调用自定义命令）
    let r_data = this.execAjax({});
    // 执行 异步
    this.execReasult({});

  }

  // 值传递 
  public transferValue(option?) {
    console.log('将接受传递的值');
  }


  // SmtPopPageComponent




  windowDialog
  setting() {
    console.log('');
    let dialog;
    // 根据按钮类型初始化表单状态
    const dialogCfg = {
      title: '',
      width: '90%',
      style: null,
      maskClosable: true,
      cancelText: '取消',
      okText: '确定',
      footerButton: null,
      customAction: [],
      customContent: 'api',
      customPageConfig: {

      }
    }
    if (!dialogCfg) {
      return;
    }


    let that = this;
    const dialogOptional = {
      nzTitle: dialogCfg.title ? dialogCfg.title : '',
      nzWidth: dialogCfg.width ? dialogCfg.width : '600px',
      nzStyle: dialogCfg.style ? dialogCfg.style : null, // style{top:'1px'},
      nzMaskClosable: dialogCfg.hasOwnProperty('maskClosable') ? dialogCfg.maskClosable : false,
      nzContent: SmtPopPageComponent,
      nzComponentParams: {
        parentDom: that
      },
      nzFooter: [
        {
          label: dialogCfg.cancelText ? dialogCfg.cancelText : 'cancel',
          onClick: (componentInstance) => {
            dialog.close();
          },
        },
        {
          label: dialogCfg.okText ? dialogCfg.okText : 'OK',
          onClick: async (componentInstance) => {
            console.log('当前弹出表单值：', componentInstance);
            let target = componentInstance.popPage.pageService.componentInstance['exYPv7ZuLekRlIyWCCoJcRGLDOXdKm'];

            // 目标组件执行
            target.validate();
            // 当前组件执行
            that.test();
            console.log('当前弹出表单值：', target['COMPONENT_VALUE']);
            this.COMPONENT_VALUE = target['COMPONENT_VALUE'];
            this.setFormValue();

            // dialog.close();
          },
        },
      ],
    };

    dialog = this.componentService.modalService.create(dialogOptional);
    this.windowDialog = dialog;
  }





}
