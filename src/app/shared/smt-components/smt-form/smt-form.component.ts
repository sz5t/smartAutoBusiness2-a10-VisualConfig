import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { SMT_FORM_METHOD } from 'src/app/core/relations/bsn-methods/smt-form-methods';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { CommonUtils } from 'src/app/core/utils/common-utils';
import { CustomValidator } from '../../components/data-form/form-validator/CustomValidator';
import { SmtCommandResolver } from '../../resolver/smt-command/smt-command.resovel';
import { SmtEventResolver } from '../../resolver/smt-event/smt-event-resolver';
import { SmtMessageSenderResolver } from '../../resolver/smt-relation/smt-relation-resolver';
import { SmtComponentBase } from '../smt-component.base';
import { SmtPopPageComponent } from '../smt-pop-page/smt-pop-page.component';
import { SmtExec } from './smt-exec';
import { SmtFormDataAdapter } from './smt-form.adapter';

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
  public formBindObj: any;
  private eventObjs: any[];
  private commandObjs: any[];
  public dataSourceObj: any;
  public windows: any[];


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
    this.COMPONENT_METHODS = SMT_FORM_METHOD;
    this.EXEC_THAT = new SmtExec(this);

  }

  EXEC_THAT: any;
  loading = false;

  ngOnInit(): void {
    this._initComponent(this.config);
    this.validateForm = this.fb.group({});

    this.createControls(this.validateForm, {});
    this.loading = true;
    this.COMPONENT_VALUE = this.validateForm.value;
    // 表单值变化更新组件值
    this.validateForm.valueChanges.subscribe(data => {
      this.COMPONENT_VALUE = this.validateForm.value;
      console.log('form', data);
    });
    console.log('表单配置', this.formBindObj);

    this.initEvent(this.eventObjs);

    this.initCommand(this.commandObjs);

    this.dataSourceObj.loadingOnInit && this.load();

  }

  private _initComponent(config: any) {
    this.KEY_ID = this.config.keyId ? this.config.keyId : 'ID';
    if (this.tempData) {
      this.TEMP_VALUE = this.tempData;
    }
    if (this.initData) {
      this.INIT_VALUE = this.initData;
    }

    const dataAdapter = new SmtFormDataAdapter(this.config);

    this.formBindObj = dataAdapter.setFormBindObj();
    this.eventObjs = dataAdapter.setEventObjs();
    this.dataSourceObj = dataAdapter.setDataSource();
    this.commandObjs = dataAdapter.setCommandObjs();
    this.windows = dataAdapter.setWindows();

  }

  public initEvent(_eventObjs: any) {
    if (_eventObjs) {
      this._sender$ = new SmtEventResolver(this).resolve(_eventObjs);
      this._sender_subscription$ = this._sender$.subscribe();
    }
  }

  public initCommand(_commandObjs: any) {
    if (_commandObjs && _commandObjs.length > 0) {
      new SmtCommandResolver(this).resolve(_commandObjs);
    }
  }


  async load() {
    let response: any;
    if (!this.dataSourceObj.loadingConfig) {
      return;
    }
    response = await this.executeHttp(this.dataSourceObj['loadingConfig'], null, null);

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
    this.formBindObj['fields'] && this.formBindObj.fields.forEach(item => {
      if (data_form.hasOwnProperty(item['field'])) {
        formValue[item['field']] = data_form[item['field']];
      }
    });
    console.log('表单最终值', formValue);
    this.COMPONENT_VALUE = formValue;
    this.setFormValue();
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



  /**
   * 生成表单项
   * field: 'name1', formType: 'value',  validations: []
   * @param f 
   * @param data 
   * @returns 
   */
  private createControls(f, data) {

    this.formBindObj.fields && this.formBindObj.fields.forEach(Control => {
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
  public async execute(option, params?) {
    let response: any;
    if (params !== null) {
      response = await this.executeHttp(option.ajaxConfig, params, null);
    } else {
      response = await this.executeHttp(option.ajaxConfig, null, null);
    }
    return response;
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
      customAction: [],
      customContent: 'api',
      customPageConfig: {

      },
      // 自定义按钮
      "footerButton": [
        {
          "name": 'ok',  // 确定按钮
          "text": "【确定】",
          "customActionId": '001',
          "eventConent": [
            {
              "type": "pop", // 弹出页面对象
              "targetPageId": "pop",
              "targetViewId": "001",
              "command": "load"
            }
          ]
        },
        {
          "name": 'cancel', // 取消按钮
          "text": "【取消】",
          "customActionId": '002',
          "eventConent": [
            {
              "type": "pop", // 弹出页面对象
              "targetPageId": "pop",
              "targetViewId": "001",
              "command": "setFormValue"
            }
          ]
        },
        {
          "name": 'cancel', // 取消按钮
          "text": "【自定义】",
          "customActionId": '002'
        },
        {
          "name": 'cancel', // 取消按钮
          "text": "【按钮大全】",
          "customActionId": '002',
          // 需要连续动作
          "eventConent": [
            {
              "type": "pop", // 弹出页面对象
              "targetPageId": "pop",
              "targetViewId": "001",
              "command": "add_row"
            },
            {
              "type": "current", // 当前 父对象
              "targetPageId": "parent",
              "targetViewId": "001",
              "command": "add_row"
            }
          ]
        }
      ]
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

    // 自定义 操作按钮
    if (dialogCfg.footerButton && dialogCfg.footerButton.length > 0) {
      dialogOptional.nzFooter = [];

      dialogCfg.footerButton.forEach((_button) => {
        dialogOptional.nzFooter.push({
          label: _button.text,
          onClick: (componentInstance) => {

            console.log(_button);
            // 获取当前目标实例
            let target = componentInstance.popPage.pageService.componentInstance['exYPv7ZuLekRlIyWCCoJcRGLDOXdKm'];

            // this.execCustomAction(_button, target);
          },
        });
      });
    }

    dialog = this.componentService.modalService.create(dialogOptional);
    this.windowDialog = dialog;
  }


  public showWindow(option?) {

    let dialog;
    let dialogCfg: any;
    if (option && option['$WINDOW_CODE']) {
      dialogCfg = this.getWindowObj(option['$WINDOW_CODE']);
    }
    else {
      console.log('参数不正确');
    }

    let dialogCfg1 = {
      title: '测试弹出',
      width: "90%",
      style: { "top": "100px", "padding-bottom": "0px" },
      targetPageTitle: null,
      targetPageCode: 'PAGE_USER_FORM_TEST', // 'LAYOUT_TEST',
      targetPageId: null,
      maskClosable: null,
      buttonContent: [
        {
          buttonTitle: '确定',
          buttonType: "default",
          buttonSize: "buttonSize",
          buttonDanger: false,
          eventContent: []

        }

      ]

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
        parentDom: that,
        pageCode: dialogCfg.targetPageCode,
        pageInitData: option
      },
      nzFooter: [
      ]
    };
    if (dialogCfg.buttonContent && dialogCfg.buttonContent.length > 0) {
      dialogOptional.nzFooter = [];

      dialogCfg.buttonContent.forEach((_button) => {
        dialogOptional.nzFooter.push({
          label: _button.buttonTitle,
          type: _button.buttonType,
          danger: _button.buttonDanger,
          size: _button.buttonSize,
          onClick: (componentInstance) => {


            // _button.eventContent
            console.log(_button, "执行内容");
            // 获取当前目标实例

            this.execCustomAction(_button);
          },
        });
      });
    }
    dialog = this.componentService.modalService.create(dialogOptional);
    this.windowDialog = dialog;
    console.log('弹出配置');
  }

  public getWindowObj(code?) {
    let windowObj: any;
    if (this.windows && code) {
      let index = this.windows.findIndex(item => item['windowCode'] === code);
      if (index > -1) {
        windowObj = this.windows[index];
      }
    }
    return windowObj;
  }

  execCustomAction(_button) {
    console.log('执行事件');
    if (_button['eventConent'] && _button['eventConent'].length > 0) {
      for (let i = 0; i < _button['eventConent'].length; i++) {
        new SmtMessageSenderResolver(this).resolve(_button['eventConent'][i]);
      }
    }

  }

  public windowClose(option?) {
    if (this.windowDialog) {
      this.windowDialog['close']();
    }
  }


  _testTHAT() {
    console.log('执行');
    this.EXEC_THAT.testTHAT();

  }



  createDefault() {
    let d = {

      "name": "data",
      "type": "label",
      "componentConfig": {},
      "formType": "object",
      "title": "主键",
      "data": null,
      "properties": [
        {
          "name": "id",
          "defaultType": "custom",
          "customValue": {
            "type": "GUID",
            "valueName": "",
            "value": ""
          },
          "formType": "value",
          "title": "主键"
        },
        {
          "name": "name",
          "defaultType": "default",  // default  custom 
          "customValue": {
            "type": "",
            "valueName": "",
            "value": ""
          },
          "formType": "value"
        }
      ]

    }

    let d1 = {

      "name": "formData",
      "type": "label",
      "formType": "object",
      "title": "表单值",
      "data": {
        "componentEvent": [
          {
            "eventTitle": "刷新",
            "eventName": "load",
            "eventContent": null
          },
          {
            "eventTitle": "点击事件",
            "eventName": "action",
            "eventContent": null
          }
        ]
      },
      "properties": [
        {
          "name": "componentEvent",
          "defaultType": "default",
          "formType": "array",
          "properties": [
            {
              "name": "eventTitle",
              "defaultType": "default",
              "formType": "value"
            },
            {
              "name": "eventName",
              "defaultType": "default",
              "formType": "value"
            }
          ]
        }
      ]

    }

    let defaultValue: any;

    defaultValue = this.jx_object(d1['properties'], d1['data']);


    console.log('默认值', defaultValue);

  }


  jx_object(d_config, data?) {
    let v = {};
    d_config.forEach(element => {

      let formType = "value";

      if (element['formType']) {
        formType = element['formType']
      }
      if (formType === 'object') {
        v[element['name']] = this.jx_object(element['properties'], data[element['name']]);
      }
      if (formType === 'array') {
        v[element['name']] = this.jx_array(element['properties'], data[element['name']]);
      }
      if (formType === 'value') {
        v[element['name']] = this.jx_value(element, data);
      }

    });
    v = { ...data, ...v }
    return v;
  }

  jx_array(d_config, data) {

    let v = [];
    if (data) {
      data.forEach(element => {
        let obj = this.jx_object(d_config, element);
        obj = { ...element, ...obj }
        v.push(obj);
      });
    }
    return v;
  }

  jx_value(d_config, data) {

    let v: any;
    if (d_config['defaultType'] === 'custom') {
      v = this.jx_coustomValue(d_config['customValue']);

    } else {
      v = data[d_config['name']];
    }
    return v;
  }
  jx_coustomValue(d_config) {
    let v: any;
    if (d_config['type'] === 'value') {
      v = d_config['value'];
    }
    if (d_config['type'] === 'GUID') {
      v = CommonUtils.uuID(36)
    }
    return v;
  }



}
