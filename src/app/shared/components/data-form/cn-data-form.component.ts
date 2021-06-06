import { Component, OnInit, OnDestroy, OnChanges, AfterViewInit, Input, Inject, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CnComponentBase } from '../cn-component.base';
import { FormGroup, FormBuilder, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { CN_DATA_FORM_METHOD } from 'src/app/core/relations/bsn-methods/bsn-form-methods';
import { CN_DATA_FORM_PROPERTY } from 'src/app/core/relations/bsn-property/data-form.property.interface';
import { Subject, Subscription, Observable, Observer } from 'rxjs';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { CustomValidator } from './form-validator/CustomValidator';
import { ParameterResolver } from '../../resolver/parameter/parameter.resolver';
import { RelationResolver } from '../../resolver/relation/relation.resolver';
import { CommonUtils } from 'src/app/core/utils/common-utils';
import { CnPageComponent } from '../cn-page/cn-page.component';
import { environment } from '@env/environment';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'cn-data-form,[cn-data-form]',
  templateUrl: './cn-data-form.component.html',
  styleUrls: ['./cn-data-form.component.less'],
  // changeDetection: ChangeDetectionStrategy.Default
})
export class CnDataFormComponent extends CnComponentBase implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  // IDataFormProperty

  @Input() public config;
  @Input() public changeValue;
  @Input() public tempData;
  @Input() public initData;
  @Input() public dialogsConfig: any;
  @Input() dataServe;
  @Output() public updateValue = new EventEmitter();
  layoutRowsCfg: any[];
  validateForm: FormGroup;
  controlArray: any[] = [];
  value;
  formControlObj: any = {};
  ajaxConfigObj: any = {};
  formValue: any = {}; // 表单值
  formCascade = {}; // 级联信息
  fromFieldPermissions; // 表单字段权限
  public staticLoadKeyField: any; // 表单二次加载切换成edit状态是对应主键的映射字段，有这个字段才加载数据
  //  字段权限 于状态有关，insert、update、text 3大状态下 某个小组件的状态，
  // 有一套dufault 配置，用户权限加载后合并当前 字段权限，再处理一次，以每个control 控制
  /**
   * 组件名称
   * 所有组件实现此属性
   */
  public COMPONENT_NAME = 'CnDataForm';
  /**
   * 组件操作对外名称
   * 所有组件实现此属性
   */
  public COMPONENT_METHODS = CN_DATA_FORM_METHOD;

  public COMPONENT_PROPERTY = CN_DATA_FORM_PROPERTY;
  public FORM_VALUE: any = {}; // 当前表单组件值
  public FORM_STATE: any; // 表单的状态=》新增、修改、展示
  public FORM_VALID: any;
  private _sender_source$: Subject<any>;
  private _receiver_source$: Subject<any>;
  private _trigger_source$: Subject<any>;

  private _receiver_subscription$: Subscription;
  private _sender_subscription$: Subscription;
  private _trigger_receiver_subscription$: Subscription;

  constructor(
    private fb: FormBuilder,
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) {
    super(componentService);
    this.cacheValue = this.componentService.cacheService;
  }

  ngOnInit() {
    this.layoutRowsCfg = this.config.formLayout && this.config.formLayout.rows ? this.config.formLayout.rows.filter((r) => r.id) : [];
    this.staticLoadKeyField = this.config.staticLoadKeyField ? this.config.staticLoadKeyField : 'ID';
    if (this.initData) {
      this.initValue = this.initData;
    } else {
      this.initValue = {};
    }
    if (this.tempData) {
      this.tempValue = this.tempData;
    } else {
      this.tempValue = {};
    }
    this.staticComponentValue = {};
    // 动态构建表单的初始默认值, 校验规则
    // this.validateForm = this.fb.group({
    //   code: ['liu', [Validators.required]],
    //   inputname2: [null, [Validators.required]],
    //   inputname5: ['', [Validators.required]],

    // });
    this.setChangeValue(this.changeValue);
    this.validateForm = this.fb.group({});

    // 生成Controls
    this.createControls(this.validateForm);
    console.log('this.validateForm=> ', this.validateForm);
    // 生成表单的异步请求  ajaxConfigObj 对象
    this.config.ajaxConfig.forEach((ajax) => {
      this.ajaxConfigObj[ajax.id] = ajax;
    });

    // 将异步请求结果拼接组装到 controls、load ，方便后面程序解析。
    if (this.config.loadingConfig) {
      // 构建load异步请求
      this.config.loadingConfig.ajaxConfig = this.ajaxConfigObj[this.config.loadingConfig.id];
    }

    // 生成表单formControlObj 对象
    this.config.formControls.forEach((Control) => {
      if (Control.editor) {
        if (Control.editor.loadingConfig) {
          Control.editor.loadingConfig.ajaxConfig = this.ajaxConfigObj[Control.editor.loadingConfig.id];
        }
        if (Control.editor.loadingItemConfig) {
          Control.editor.loadingItemConfig.ajaxConfig = this.ajaxConfigObj[Control.editor.loadingItemConfig.id];
        }
        if (Control.editor.expandConfig) {
          Control.editor.expandConfig.ajaxConfig = this.ajaxConfigObj[Control.editor.expandConfig.id];
        }

        if (Control.editor.hasOwnProperty('changeValueId')) {
          Control.editor.changeValue = this.findChangeValueConfig(Control.editor.changeValueId);
        }
      }
      if (Control.text) {
        if (Control.text.loadingConfig) {
          Control.text.loadingConfig.ajaxConfig = this.ajaxConfigObj[Control.text.loadingConfig.id];
        }
        if (Control.text.loadingItemConfig) {
          Control.text.loadingItemConfig.ajaxConfig = this.ajaxConfigObj[Control.text.loadingItemConfig.id];
        }
        if (Control.text.expandConfig) {
          Control.text.expandConfig.ajaxConfig = this.ajaxConfigObj[Control.text.expandConfig.id];
        }
        if (Control.text.hasOwnProperty('changeValueId')) {
          Control.text.changeValue = this.findChangeValueConfig(Control.text.changeValueId);
        }
      }
      this.formControlObj[Control.id] = Control;
    });
    // 初始化表单状态
    this.formStateChange(this.config.state);

    // 解析及联配置
    this.resolveRelations();
    // => 正则校验
    /*     this.validateForm = this.fb.group({
          userName: ['', [Validators.required], [this.userNameAsyncValidator]],
          email: ['', [Validators.email, Validators.required]],
          password: ['', [Validators.required]],
          confirm: ['', [this.confirmValidator]],
          comment: ['', [Validators.required]]
        });
     */

    // this.load();
  }

  async ngAfterViewInit(): Promise<void> {
    const permission = this.config.formControlsPermissions.find((p) => p.formState === this.config.state);
    if (permission && permission.formStateContent) {
      const isload = permission.formStateContent.isLoad;
      const defaultComponentValue = permission.formStateContent.defaultComponentValue;
      if (this.tempValue.hasOwnProperty(this.staticLoadKeyField) && this.tempValue[this.staticLoadKeyField] !== null) {
        await this.loadByContaines();
      } else {
        if (isload) {
          await this.load(defaultComponentValue);
        }
      }
    } else {
      await this.load();
    }

    this.FORM_VALID = this.validateForm.valid;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.validateForm) {
      console.log('form 变化', this.validateForm);
    }
  }
  /**
   * Controls 生成（根据配置信息生成Controls）
   */
  private createControls(f) {
    // const controls = Object.keys(this.validateForm.controls);
    // controls.forEach(control => this.validateForm.removeControl(control));

    this.config.formControls.forEach((Control) => {
      if (Control.children) {
        let obj: any = {};
        Control.children.forEach((element) => {
          obj[element['field']] = new FormControl(
            'dd',
            this.getValidations(element.editor.validations),
            this.getValidations1(element.editor.validations),
          );
        });

        f.addControl(`${Control.field}`, this.fb.group(obj));
      } else {
        if (Control.text && Control.editor) {
          if (Control.text.field === Control.editor.field) {
            f.addControl(
              `${Control.field}`,
              new FormControl(null, this.getValidations(Control.editor.validations), this.getValidations1(Control.editor.validations)),
            );
            this.formValue[Control.field] = null;
          } else {
            f.addControl(`${Control.text.field}`, new FormControl());
            this.formValue[Control.text.field] = null;
            f.addControl(
              `${Control.field}`,
              new FormControl(null, this.getValidations(Control.editor.validations), this.getValidations1(Control.editor.validations)),
            );
            this.formValue[Control.editor.field] = null;
          }
        } else {
          if (Control.text) {
            if (Control.text.field === Control.field) {
              f.addControl(`${Control.text.field}`, new FormControl());
              this.formValue[Control.text.field] = null;
            } else {
              f.addControl(`${Control.text.field}`, new FormControl());
              this.formValue[Control.text.field] = null;
              f.addControl(`${Control.field}`, new FormControl());
              this.formValue[Control.field] = null;
            }
          }
          if (Control.editor) {
            // f.addControl(`${Control.editor.field}`, new FormControl());
            if (Control.editor.field === Control.field) {
              f.addControl(
                `${Control.editor.field}`,
                new FormControl(null, this.getValidations(Control.editor.validations), this.getValidations1(Control.editor.validations)),
              );
              this.formValue[Control.editor.field] = null;
            } else {
              f.addControl(`${Control.field}`, new FormControl());
              this.formValue[Control.field] = null;
              f.addControl(
                `${Control.editor.field}`,
                new FormControl(null, this.getValidations(Control.editor.validations), this.getValidations1(Control.editor.validations)),
              );
              this.formValue[Control.editor.field] = null;
            }
          }
        }
      }

      this.formCascade[Control.id] = {};
    });
  }

  /**
   * 生成 校验规则
   */
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

  /**
   * Controls 状态生成（根据配置信息生成Controls 的状态）
   * @param state
   */
  private ControlsPermissions(state?) {
    // const ob = JSON.parse(JSON.stringify( this.formControlObj));
    this.config.formControlsPermissions.forEach((items) => {
      if (state && items.formState === state) {
        items.Controls.forEach((Control) => {
          this.formControlObj[Control.id] && (this.formControlObj[Control.id].state = Control.state);
          // 读写等操作 未处理
          // 将 Control 的其他行为也写入
        });
      }
    });
    console.log('ControlsPermissions', this.formControlObj);
  }
  /**
   * formStateChange  表单状态切换=》 编辑状态、新增状态、浏览状态
   * 状态切换时，可根据权限控制 formControls 的字段读写权限
   * @param state
   */
  public formStateChange(state?) {
    // insert  update   text  新增、修改、查看 3种状态切换
    this.FORM_STATE = state;
    // 新增状态可填写默认值，其他状态无默认值
    this.ControlsPermissions(this.FORM_STATE);
  }

  public formStateSwitch(option?) {
    // insert  update   text  新增、修改、查看 3种状态切换
    console.log('formStateSwitch', option);
    if (option && option.state) {
      const state = option.state;
      this.FORM_STATE = state;
      // 新增状态可填写默认值，其他状态无默认值
      this.ControlsPermissions(this.FORM_STATE);
      return true;
    } else {
      return false;
    }
  }

  /**
   * setChangeValue 接受 初始变量值
   */
  public setChangeValue(ChangeValues?) {
    // debugger;
    console.log('changeValue', ChangeValues);
    // const ChangeValues = [{ name: "", value: "", valueTo: "" }];
    if (ChangeValues && ChangeValues.length > 0) {
      ChangeValues.forEach((p) => {
        switch (p.valueTo) {
          case 'tempValue':
            this.tempValue[p.name] = p.value;
            break;
          case 'initValue':
            this.initValue[p.name] = p.value;
            break;
          case 'staticComponentValue':
            this.staticComponentValue[p.name] = p.value;
            break;
        }
      });
    }
  }

  private findChangeValueConfig(changeValueId) {
    let changeValueConfig;
    if (this.config.changeValue && Array.isArray(this.config.changeValue) && this.config.changeValue.length > 0) {
      const c = this.config.changeValue.find((cfg) => cfg.id === changeValueId);
      if (c) {
        changeValueConfig = c;
      }
    }
    return changeValueConfig;
  }
  /**
   * 表单设计理念=》 1.0中编辑字段不能灵活切换
   * 2.0设计=》字段展示编辑可自由切换不同字段
   *
   * 字段的默认值，只有表单状态是新增的时候有效，在setValue时赋值
   *
   */

  /**
   * SaveJson
   */
  public SaveJson() {
    // this.validateForm.valid  表单校验状态  是否提供，写在前置条件中，判断是否通过校验
    console.log('提交表单', this.validateForm.valid, this.validateForm.value);
  }

  public buildParameters(paramsCfg, returnData?, itemData?) {
    return ParameterResolver.resolve({
      params: paramsCfg,
      tempValue: this.tempValue,
      componentValue: this.validateForm.value,
      initValue: this.initValue,
      cacheValue: this.cacheValue,
      router: this.routerValue,
      returnValue: returnData ? returnData : {},
      item: itemData ? itemData : {},
      userValue: this.userValue,
      menuValue: this.componentService.cacheService.getNone('activeMenu') ? this.componentService.cacheService.getNone('activeMenu') : {},
    });
  }

  public submitForm(): void {
    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    this.FORM_VALID = this.validateForm.valid;
  }

  /**
   * validate
   */
  public validate() {
    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
      // Promise.resolve().then(() => this.validateForm.controls[i].updateValueAndValidity());
    }

    this.FORM_VALID = this.validateForm.valid;
    return this.validateForm.valid;
  }
  /**
   * load 自加载
   */
  public async load(defaultComponentValue?) {
    let response;
    let data_form;
    if (!defaultComponentValue) {
      defaultComponentValue = null;
    }
    if (this.config.enableLoadStaticData) {
      response = this.buildParameters([this.config.staticDataConfig]);
    } else {
      if (!this.config.loadingConfig.ajaxConfig) {
        return;
      }
      if (this.config.loadingConfig.ajaxConfig['enableAjaxMore']) {
        response = await this.executeHttpMore(this.config.loadingConfig.ajaxConfig, {}, 'buildParameters', null);
      } else {
        const url = this.config.loadingConfig.ajaxConfig.url;
        const method = this.config.loadingConfig.ajaxConfig.ajaxType;
        const params = {
          ...this.buildParameters(this.config.loadingConfig.ajaxConfig.params),
        };
        // 考虑满足 get 对象，集合，存储过程【指定dataset 来接收数据】，加载错误的信息提示
        response = await this.componentService.apiService[method](url, params).toPromise();
      }
    }

    if (response) {
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

      //...defaultComponentValue,
      data_form = { ...defaultComponentValue, ...data_form, ...this.staticComponentValue };
      for (const item in this.formValue) {
        if (data_form.hasOwnProperty(item)) {
          this.formValue[item] = data_form[item];
        }
      }

      this.FORM_VALUE = this.formValue;
      // setTimeout(() => {
      this.validateForm.setValue(this.formValue);
      // });
      // 需要赋值后触发满足当前展示字段的布局
      // 根据状态，触发级联 xx状态下 xx字段级联触发
      /*   "triggerFeilds":[         -- 加载完成后，主动触发级联字段
          {
             feildName:'',        -- 需要触发的字段
             type:'',             -- value、formValue  
             valueName:'',        -- 取值名称
             value:''             -- 常量取值   
          }
        ] */
      const permission = this.config.formControlsPermissions.find((p) => p.formState === this.FORM_STATE);
      if (permission && permission.formStateContent) {
        const triggerFeilds = permission.formStateContent.triggerFeilds;
        if (triggerFeilds && triggerFeilds.length > 0) {
          triggerFeilds.forEach((element) => {
            let triggerFeild_value;
            if (element.type === 'value') {
              // 选中行对象数据
              triggerFeild_value = element.value;
            }
            if (element.type === 'formValue') {
              // 选中行对象数据
              if (this.FORM_VALUE) {
                const _name = element.valueName;
                triggerFeild_value = this.FORM_VALUE[_name];
              }
            }
            this.valueChange({ id: element['controlId'], name: element.name, value: triggerFeild_value });
          });
        }
      }
      // this.valueChange({name:'CP_USE',value: this.FORM_VALUE['CP_USE']});
      console.log('------------------formValue', this.FORM_STATE, this.formValue, this.validateForm.value);
    } else {
      data_form = { ...defaultComponentValue, ...data_form, ...this.staticComponentValue };
      for (const item in this.formValue) {
        if (data_form.hasOwnProperty(item)) {
          this.formValue[item] = data_form[item];
        }
      }

      this.FORM_VALUE = this.formValue;
      this.validateForm.setValue(this.formValue);
    }

    return true;
  }

  /**
   *  解析级联消息
   */
  private resolveRelations() {
    if (this.config.cascade && this.config.cascade.messageSender) {
      if (this.config.isApproval) {
        const messageSend: any[] = this.componentService.cacheService.getNone('ApprovalMessageSend')
          ? this.componentService.cacheService.getNone('ApprovalMessageSend')
          : [];
        if (messageSend.length > 0) {
          if (this.config.cascade.messageSender) {
            this.config.cascade.messageSender = [...this.config.cascade.messageSender, ...messageSend];
          } else {
            this.config.cascade.messageSender = messageSend;
          }
        }
      }
      if (!this._sender_source$) {
        // 解析组件发送消息配置,并注册消息发送对象
        this._sender_source$ = new RelationResolver(this).resolveSender(this.config);
        this._sender_subscription$ = this._sender_source$.subscribe();
      }
    }
    if (this.config.cascade && this.config.cascade.messageReceiver) {
      if (this.config.isApproval) {
        const messageReceiver: any[] = this.componentService.cacheService.getNone('ApprovalMessageReceiver')
          ? this.componentService.cacheService.getNone('ApprovalMessageReceiver')
          : [];
        if (messageReceiver.length > 0) {
          if (this.config.cascade.messageReceiver) {
            this.config.cascade.messageReceiver = [...this.config.cascade.messageReceiver, ...messageReceiver];
          } else {
            this.config.cascade.messageReceiver = messageReceiver;
          }
        }
      }
      // this.componentService.cacheService.remove('ApprovalMessageReceiver');
      // 解析消息接受配置,并注册消息接收对象
      // this._receiver_source$ = new RelationResolver(this).resolveReceiver(this.config);
      // this._receiver_subscription$ = this._receiver_source$.subscribe();
      new RelationResolver(this).resolveReceiver(this.config);
    }

    this._trigger_source$ = new RelationResolver(this).resolve();
  }

  public ngOnDestroy() {
    // 释放级联对象
    this.unsubscribeRelation();
    // 释放及联接受对象
    if (this._receiver_subscription$) {
      this._receiver_subscription$.unsubscribe();
    }

    if (this._sender_subscription$) {
      this._sender_subscription$.unsubscribe();
    }

    // 释放触发器对象
    if (this._trigger_receiver_subscription$) {
      this._trigger_receiver_subscription$.unsubscribe();
    }

    if (this._trigger_source$) {
      this._trigger_source$.unsubscribe();
    }

    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

  /**
   * valueChange 表单内值变化
   * 需要构建一个表单状态级联对象，将每个被级联对象的控制，组装，被级联对象解析该对象
   * 考虑，如何解决1.0的问题，控制级联状态的分割，级联参数的优先级
   */
  public valueChange(v?) {
    console.log('===valueChange==', v, this.validateForm.value);
    this.FORM_VALUE[v.name] = v.value;
    if (!this.formCascade) {
      this.formCascade = {};
    }

    if (this.config.cascadeLayout && this.config.cascadeLayout.length > 0) {
      this.config.cascadeLayout.forEach((cascade) => {
        if (cascade.field === v.name) {
          cascade.mapping.forEach((m) => {
            if (m.value === v.value) {
              // const oldRows = this.config.formLayout.rows;
              // const newRows = [];
              // const newCols = [];
              // oldRows.forEach(r => {
              //   const newCols = r.cols.filter(c => m.layout.findIndex(_m => c.id === _m) > -1);
              //   newRows.push({
              //     "id": r.id,
              //     "type": "row",
              //     "cols": newCols
              //   });
              // })
              // this.layoutRowsCfg = newRows;
              this.config.formLayout.rows.forEach((r) => {
                r.cols.filter((c) => m.layout.findIndex((_m) => c.id === _m) > -1).forEach((_c) => (_c.display = false));
                r.cols.filter((c) => m.layout.findIndex((_m) => c.id === _m) < 0).forEach((_c) => (_c.display = 'none'));
              });
            }
          });
        }
      });
    }

    if (v.value === undefined) {
      return true;
    }
    // 1. 循环发出对象

    // 2. 解析应答对象（应答策略） 本次优化，将1.0里的data value 变化合并为一种策略，
    //      条件变化为原来的value变化
    //      条件默认default 则是data变化，如此 配置是1种结构

    // 做配置转化，否则需要不断循环处理，转化为对象，则直接访问属性
    const triggerKey = v.name;
    if (this.config.cascadeValue) {
      this.config.cascadeValue.forEach((cascade) => {
        // 满足应答触发
        if (cascade.controlId !== v.id) {
          return true;
        }
        if (cascade.name !== triggerKey) {
          return true;
        }
        // console.log('==****开始应答解析*****==', cascade);
        cascade.CascadeObjects.forEach((cascadeObj) => {
          const cascadeResult = this.formCascade[cascadeObj.controlId] ? this.formCascade[cascadeObj.controlId] : {}; // 单个应答对象
          cascadeResult[cascadeObj.cascadeName] = {};
          cascadeObj.cascadeItems.forEach((item) => {
            let regularflag = true;
            if (item.caseValue && item.type === 'condition') {
              const reg1 = new RegExp(item.caseValue.regular);
              let regularData;
              if (item.caseValue.type) {
                if (item.caseValue.regularType === 'value') {
                  regularData = item.caseValue.value;
                }
                if (item.caseValue.type === 'selectValue') {
                  // 选中行数据[这个是单值]
                  regularData = v.value;
                }
                if (item.caseValue.type === 'selectObjectValue') {
                  // 选中行对象数据
                  if (v.dataItem) {
                    regularData = v.dataItem[item.caseValue.valueName];
                  }
                }
                if (item.caseValue.type === 'rowValue') {
                  // 选中行对象数据
                  if (this.validateForm.value) {
                    regularData = this.validateForm.value[item.caseValue.valueName];
                  }
                }
                if (item.caseValue.type === 'formValue') {
                  // 选中行对象数据
                  if (this.FORM_VALUE) {
                    regularData = this.FORM_VALUE[item.caseValue.valueName];
                  }
                }
              } else {
                regularData = v.value;
              }
              regularflag = reg1.test(regularData);
            }

            // 正则校验
            if (regularflag) {
              // 满足前置条件、或者 类型是default
              if (item.content.type === 'ajax') {
                const _cascadeValue = {};
                item.content.data.option.forEach((ajaxItem) => {
                  if (ajaxItem.type === 'value') {
                    _cascadeValue[ajaxItem.name] = ajaxItem.value;
                  }
                  if (ajaxItem.type === 'selectValue') {
                    // 选中行数据[这个是单值]
                    if (ajaxItem.isDefault) {
                      // tslint:disable-next-line:prefer-conditional-expression
                      if (!v.value) {
                        _cascadeValue[ajaxItem.name] = ajaxItem.value;
                      } else {
                        _cascadeValue[ajaxItem.name] = v.value;
                      }
                    } else {
                      _cascadeValue[ajaxItem.name] = v.value;
                    }
                  }

                  if (ajaxItem.type === 'selectObjectValue') {
                    // 选中行对象数据
                    if (v.dataItem) {
                      //  _cascadeValue[ajaxItem['name']] = v.dataItem[ajaxItem['valueName']];
                      if (ajaxItem.isDefault) {
                        // tslint:disable-next-line:prefer-conditional-expression
                        if (!v.dataItem[ajaxItem.valueName]) {
                          _cascadeValue[ajaxItem.name] = ajaxItem.value;
                        } else {
                          _cascadeValue[ajaxItem.name] = v.dataItem[ajaxItem.valueName];
                        }
                      } else {
                        _cascadeValue[ajaxItem.name] = v.dataItem[ajaxItem.valueName];
                      }
                    } else {
                      if (ajaxItem.isDefault) {
                        _cascadeValue[ajaxItem.name] = ajaxItem.value;
                      }
                    }
                  }

                  if (ajaxItem.type === 'rowValue') {
                    // 选中行对象数据
                    if (this.validateForm.value) {
                      _cascadeValue[ajaxItem.name] = this.validateForm.value[ajaxItem.valueName];
                    }
                  }
                  if (ajaxItem.type === 'formValue') {
                    // 选中行对象数据
                    if (this.FORM_VALUE) {
                      _cascadeValue[ajaxItem.name] = this.FORM_VALUE[ajaxItem.valueName];
                    }
                  }

                  // 其他取值【日后扩展部分】
                });
                if (cascadeResult[cascadeObj.cascadeName].hasOwnProperty('cascadeValue')) {
                  cascadeResult[cascadeObj.cascadeName].cascadeValue = {
                    ...cascadeResult[cascadeObj.cascadeName].cascadeValue,
                    ..._cascadeValue,
                  };
                } else {
                  cascadeResult[cascadeObj.cascadeName].cascadeValue = { ..._cascadeValue };
                }
                cascadeResult[cascadeObj.cascadeName].exec = 'ajax';
                // this.setValue(cascadeObj.cascadeName, null); // 异步执行前，将组件值置空
              }
              if (item.content.type === 'setOptions') {
                // 小组件静态数据集 , 目前静态数据，支持 多字段
                const _cascadeOptions = item.content.data.option;

                if (cascadeResult[cascadeObj.cascadeName].hasOwnProperty('cascadeOptions')) {
                  cascadeResult[cascadeObj.cascadeName].cascadeOptions = _cascadeOptions;
                } else {
                  cascadeResult[cascadeObj.cascadeName].cascadeOptions = _cascadeOptions;
                }
                cascadeResult[cascadeObj.cascadeName].exec = 'setOptions';
                this.setValue(cascadeObj.cascadeName, null); // 异步执行前，将组件值置空
              }
              if (item.content.type === 'setValue') {
                let __setValue;
                item.content.data.option.forEach((ajaxItem) => {
                  if (ajaxItem.type === 'value') {
                    __setValue = ajaxItem.value;
                  }
                  if (ajaxItem.type === 'selectValue') {
                    // 选中行数据[这个是单值]
                    __setValue = v.value;
                  }
                  if (ajaxItem.type === 'selectObjectValue') {
                    // 选中行对象数据
                    if (v.dataItem) {
                      __setValue = v.dataItem[ajaxItem.valueName];
                    }
                  }
                  if (ajaxItem.type === 'selectObjectValue') {
                    // 选中行对象数据
                    if (v.dataItem) {
                      __setValue = v.dataItem[ajaxItem.valueName];
                    }
                  }
                  if (ajaxItem.type === 'rowValue') {
                    // 选中行对象数据
                    if (this.validateForm.value) {
                      __setValue = this.validateForm.value[ajaxItem.valueName];
                    }
                  }
                  if (ajaxItem.type === 'uuID') {
                    // 随机值
                    __setValue = CommonUtils.uuID(36);
                  }
                  if (ajaxItem.type === 'formValue') {
                    // 选中行对象数据
                    if (this.FORM_VALUE) {
                      __setValue = this.FORM_VALUE[ajaxItem.valueName];
                    }
                  }

                  // 其他取值【日后扩展部分】
                });
                // 表单赋值
                this.setValue(cascadeObj.cascadeName, __setValue);
              }
              if (item.content.type === 'compute') {
                let __setValue;
                const computeObj = {};

                item.content.data.option.forEach((ajaxItem) => {
                  if (ajaxItem.type === 'value') {
                    __setValue = ajaxItem.value;
                  }
                  if (ajaxItem.type === 'selectValue') {
                    // 选中行数据[这个是单值]
                    __setValue = v.value;
                  }
                  if (ajaxItem.type === 'selectObjectValue') {
                    // 选中行对象数据
                    if (v.dataItem) {
                      __setValue = v.dataItem[ajaxItem.valueName];
                    }
                  }
                  if (ajaxItem.type === 'rowValue') {
                    // 选中行对象数据
                    if (this.validateForm.value) {
                      __setValue = this.validateForm.value[ajaxItem.valueName];
                    }
                  }
                  if (ajaxItem.type === 'formValue') {
                    // 选中行对象数据
                    if (this.FORM_VALUE) {
                      __setValue = this.FORM_VALUE[ajaxItem.valueName];
                    }
                  }

                  computeObj[ajaxItem.name] = Number(__setValue) ? Number(__setValue) : 0;
                  // 其他取值【日后扩展部分】
                });

                const _computeValue = this.L__getComputeSymbol(item.content.compute.expression[0], computeObj);
                cascadeResult[cascadeObj.cascadeName].setValue = { value: _computeValue };
                cascadeResult[cascadeObj.cascadeName].exec = 'setValue';
                this.setValue(cascadeObj.cascadeName, _computeValue);
                // cascadeResult[cascadeObj.cascadeName]['computeSetValue'] = { value: _computeValue };
                // cascadeResult[cascadeObj.cascadeName]['exec'] = 'computeSetValue';
                // this.mapOfDataState[v.id]['data'][cascadeObj.cascadeName] = _computeValue;
                // 赋值
                // this.setValue(cascadeObj.cascadeName, __setValue);
              }
              if (item.content.type === 'changeValue') {
                cascadeResult[cascadeObj.cascadeName].exec = 'changeValue';
              }
              if (item.content.type === 'display') {
                // 控制 小组件的显示、隐藏，由于组件不可控制，故而控制行列布局的显示隐藏
                const _dd = {
                  name: cascadeObj.cascadeName,
                  value: this.FORM_VALUE[cascadeObj.cascadeName] ? 1 : 0,
                  value1: this.FORM_VALUE[cascadeObj.cascadeName] ? 1 : 0,
                };
                this.L_getComputeDisplay(_dd);
              }
              if (item.content.type === 'message') {
                // 某种操作后，或者返回后，弹出提示消息，可提示静态消息，可提示动态消息
              }
              if (item.content.type === 'relation') {
                // 当满足某种条件下，触发某种消息，消息值的组转，-》调用配置完善的消息结构
                // 提供 消息配置名称，发送参数组合
                const _cascadeValue = {};
                item.content.data.option.forEach((ajaxItem) => {
                  if (ajaxItem.type === 'value') {
                    _cascadeValue[ajaxItem.name] = ajaxItem.value;
                  }
                  if (ajaxItem.type === 'selectValue') {
                    // 选中行数据[这个是单值]
                    _cascadeValue[ajaxItem.name] = v.value;
                  }
                  if (ajaxItem.type === 'rowValue') {
                    // 选中行对象数据
                    if (this.validateForm.value) {
                      _cascadeValue[ajaxItem.name] = this.validateForm.value[ajaxItem.valueName];
                    }
                  }
                  if (ajaxItem.type === 'formValue') {
                    // 选中行对象数据
                    if (this.FORM_VALUE) {
                      _cascadeValue[ajaxItem.name] = this.FORM_VALUE[ajaxItem.valueName];
                    }
                  }
                  if (ajaxItem.type === 'selectObjectValue') {
                    // 选中行对象数据
                    if (v.dataItem) {
                      _cascadeValue[ajaxItem.name] = v.dataItem[ajaxItem.valueName];
                    }
                  }
                  // 其他取值【日后扩展部分】
                });

                // console.log('********', _cascadeValue);
                if (item.content.sender) {
                  new RelationResolver(this).resolveInnerSender(
                    item.content.sender, // 消息泪痣
                    _cascadeValue, // 消息数据
                    Array.isArray(_cascadeValue), // 是否数组
                  );
                }
              }
              if (item.content.type === 'preventCascade') {
                // 【大招】 某条件下，将级联阻止
              }
              if (item.content.type === 'updateValue') {
                cascadeResult[cascadeObj.cascadeName].exec = 'updateValue';
              }
              if (item.content.type === 'resetForm') {
                this.resetForm();
              }
            }
          });
          this.formCascade[cascadeObj.controlId] = JSON.parse(JSON.stringify(this.formCascade[cascadeObj.controlId]));
          // console.log('==表单内值变化反馈==', this.formCascade);
        });
      });
    }

    // tslint:disable-next-line:forin liu 自定义
    // for (const key in this.validateForm.controls) {
    //   this.validateForm.controls[key].markAsPristine();
    //   this.validateForm.controls[key].updateValueAndValidity();
    // }
    console.log('当前表单最新值：', this.validateForm.value);

    // const msgCfg = this.config.cascade.messageSender;
    // if (msgCfg) {
    //   const sender = msgCfg.find(m => m.trigger === 'VALUE_CHANGE');
    //   if (sender) {
    //     new RelationResolver(this)
    //       .resolveInnerSender(
    //         sender.sendData,
    //         this.validateForm.value,
    //         Array.isArray(this.validateForm.value)
    //       );
    //   }
    // }

    if (this.config['enableUpdateValue']) {
      this.updateValue.emit(this.validateForm.value);
    }
  }

  public L_getComputeDisplay(v) {
    if (this.config.cascadeLayout && this.config.cascadeLayout.length > 0) {
      this.config.cascadeLayout.forEach((cascade) => {
        if (cascade.field === v.name) {
          cascade.mapping.forEach((m) => {
            if (m.type === 'default') {
              this.config.formLayout.rows.forEach((r) => {
                r.cols.filter((c) => m.layout.findIndex((_m) => c.id === _m) > -1).forEach((_c) => (_c.display = false));
                r.cols.filter((c) => m.layout.findIndex((_m) => c.id === _m) < 0).forEach((_c) => (_c.display = 'none'));
              });
            } else {
              if (m.value === v.value) {
                // const oldRows = this.config.formLayout.rows;
                // const newRows = [];
                // const newCols = [];
                // oldRows.forEach(r => {
                //   const newCols = r.cols.filter(c => m.layout.findIndex(_m => c.id === _m) > -1);
                //   newRows.push({
                //     "id": r.id,
                //     "type": "row",
                //     "cols": newCols
                //   });
                // })
                // this.layoutRowsCfg = newRows;
                this.config.formLayout.rows.forEach((r) => {
                  r.cols.filter((c) => m.layout.findIndex((_m) => c.id === _m) > -1).forEach((_c) => (_c.display = false));
                  r.cols.filter((c) => m.layout.findIndex((_m) => c.id === _m) < 0).forEach((_c) => (_c.display = 'none'));
                });
              }
            }
          });
        }
      });
    }
  }

  /*
   * 核心方法，实现加减乘除运算，确保不丢失精度
   * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
   *
   */
  public L__getComputeSymbol(symbolObj?, computeObj?) {
    let r = 0;
    if (symbolObj.valueName === 'result') {
    }
    if (symbolObj.valueName === '*') {
      r = 1;
      if (symbolObj.children) {
        symbolObj.children.forEach((_item) => {
          // r = r * this.L_getComputeValue(_item, computeObj);
          r = parseFloat((r * this.L_getComputeValue(_item, computeObj)).toFixed(10));
        });
        return r;
      }
      return 0;
    }
    if (symbolObj.valueName === '+') {
      r = 0;
      if (symbolObj.children) {
        symbolObj.children.forEach((_item) => {
          // r = r + this.L_getComputeValue(_item, computeObj);
          r = parseFloat((r + this.L_getComputeValue(_item, computeObj)).toFixed(10));
        });
      }
      return r;
    }
    if (symbolObj.valueName === '-') {
      // r = 0;
      // if (symbolObj.children) {
      //     symbolObj.children.forEach(_item => {
      //         r = r - this.L_getComputeValue(_item, computeObj);
      //     });
      //     r = r+ 2* this.L_getComputeValue(symbolObj.children[0], computeObj);

      // }
      // return r;
      r = 0;
      if (symbolObj.children) {
        r = r + this.L_getComputeValue(symbolObj.children[0], computeObj);
        for (let i = 1; i < symbolObj.children.length; i++) {
          const comput_value = this.L_getComputeValue(symbolObj.children[i], computeObj);
          //  r = r - comput_value;
          r = parseFloat((r - comput_value).toFixed(10));
        }
      }
      return r;
    }
    if (symbolObj.valueName === '/') {
      //
      r = 0.0;
      if (symbolObj.children) {
        r = r + this.L_getComputeValue(symbolObj.children[0], computeObj);
        for (let i = 1; i < symbolObj.children.length; i++) {
          const comput_value = this.L_getComputeValue(symbolObj.children[i], computeObj);
          if (comput_value === 0) {
            return 0;
          }
          //  r = r / comput_value;
          r = parseFloat((r / comput_value).toFixed(10));
        }
      }
      // const dd =  parseFloat((110.0 / 1.1).toFixed(10)) ;

      return r;
    }

    return r;
  }

  public L_getComputeValue(item?, computeObj?) {
    if (item.type === 'symbol') {
      return this.L__getComputeSymbol(item, computeObj);
    }
    if (item.type === 'value') {
      return computeObj[item.valueName] ? computeObj[item.valueName] : 0;
    }
  }
  /**
   * 表单内置 赋值操作
   * @param name
   * @param value
   */
  public setValue(name: string, value: any) {
    const control = this.validateForm.controls[name];
    if (control) {
      control.setValue(value, { emitEvent: true });
    }
  }

  /**
   * 【表单内置操作】
   *  动态执行配置，组件提供参数
   *
   *
   */

  public getCurrentComponentId() {
    return this.config.id;
  }

  public addForm(v?) {
    this.validateForm = this.fb.group({});
    this.createControls(this.validateForm);
    this.value = this.formValue;
    if (v.hasOwnProperty('builtinConfig')) {
      if (v.builtinConfig.event === 'formStateChange') {
        this.formStateChange(v.builtinConfig.state ? v.builtinConfig.state : 'insert');
      }
    }
    return true;

    console.log(this.config.id + '-------------addForm', v);
  }
  public editForm(v?) {
    const ss = JSON.parse(JSON.stringify(this.validateForm.value));
    // this.validateForm = this.fb.group({});
    // this.createControls( this.validateForm);
    this.value = ss;
    if (v.hasOwnProperty('builtinConfig')) {
      if (v.builtinConfig.event === 'formStateChange') {
        this.formStateChange(v.builtinConfig.state ? v.builtinConfig.state : 'update');
      }
    }
    this.load();
    return true;
    //  this.validateForm.setValue( this.validateForm.value);
    console.log(this.config.id + '-------------editForm', v, this.validateForm.value);
  }
  public cancel(v?) {
    const ss = JSON.parse(JSON.stringify(this.validateForm.value));
    console.log(this.config.id + '-------------cancel【开始】------------');

    // this.validateForm = this.fb.group({});
    // this.createControls(this.validateForm);
    // this.validateForm.setValue(ss,{onlySelf:false,emitEvent:true});
    this.value = ss;
    if (v.hasOwnProperty('builtinConfig')) {
      if (v.builtinConfig.event === 'formStateChange') {
        this.formStateChange(v.builtinConfig.state ? v.builtinConfig.state : 'text');
      }
    } else {
      this.formStateChange('text');
    }
    // this.validateForm.setValue(this.validateForm.value);
    this.load();
    return true;
    console.log(this.config.id + '-------------cancel【结束】', v, this.validateForm.value);
    // setTimeout(() => this.setValue('code','liu'), 1000);
    // setTimeout(() => this.validateForm.setValue(ss), 1000);
    // this.setValue('code','liu');
  }

  getLogInfo(btnCfg) {
    let componentId;
    if (btnCfg.targetViewId) {
      componentId = btnCfg.targetViewId;
    } else {
      componentId = this.config.id;
    }

    // 记录 按钮、按钮组件标识、作用组件
    let btnData;
    // 构建按钮对应的操作信息
    btnData = {
      componentId: this.config.id, // 当前组件
      targetViewId: componentId, // 目标作用组件
      btnId: btnCfg.id,
      btnText: btnCfg.text,
      description: '[表单]：' + (btnCfg.description ? btnCfg.description : btnCfg.text),
    };
    // 构建系统功能模块数据
    const logConfig = environment.systemSettings.logInfo.logAjaxConfig;
    const params = this.buildParameters(logConfig.params, btnData, false);
    return { ...btnData, ...params };
  }

  /**
   * 执行sql
   * @param Config
   * logging
   */
  public async execute(execConfig) {
    // debugger;
    const valid = this.validate(); // 这个方法通过配置来调用
    console.log('  this.FORM_VALID', this.FORM_VALID);
    console.log(this.config.id + '-------------执行sql', execConfig, this.validateForm.value, this.validateForm.valid);
    // 构建业务对象
    // 执行异步操作
    // this.componentService.apiService.doPost();
    if (valid) {
      const url = execConfig.ajaxConfig.url;
      const params = this.buildParameters(execConfig.ajaxConfig.params);
      const method = execConfig.ajaxConfig.ajaxType;
      console.log(this.config.id + '-------------执行sql params:', params);

      let _logInfo;
      if (execConfig.logInfo) {
        _logInfo = execConfig.logInfo;
      } else if (execConfig.btnCfg) {
        _logInfo = this.getLogInfo(execConfig.btnCfg);
      }

      const response = await this.executeHttpRequest(url, method, params, _logInfo).toPromise();

      // 批量对象数据,返回结果都将以对象的形式返回,如果对应结果没有值则返回 {}
      this._sendDataSuccessMessage(response, execConfig.ajaxConfig.result);

      // 处理validation结果
      const validationResult = this._sendDataValidationMessage(response, execConfig.ajaxConfig.result);

      // 处理error结果
      const errorResult = this._sendDataErrorMessage(response, execConfig.ajaxConfig.result);

      return validationResult && errorResult;
    }
  }

  public executeHttpRequest(url, method, paramData, logInfo?: any): any {
    let _header = {};
    if (logInfo) {
      const logInfoStr = JSON.stringify(logInfo);
      const dd = encodeURI(logInfoStr);
      _header = new HttpHeaders({
        _log: dd,
      });
    }
    switch (method) {
      case 'get':
        return this.componentService.apiService[method](url, paramData, { headers: _header });
      default:
        return this.componentService.apiService[method](url, paramData, {}, { headers: _header });
    }
  }

  /**
   *
   * @param execConfig
   * @returns
   * logging
   */
  public async executeModal(execConfig) {
    const valid = this.validate(); // 这个方法通过配置来调用
    console.log('  this.FORM_VALID', this.FORM_VALID);
    console.log(this.config.id + '-------------执行sql', execConfig, this.validateForm.value, this.validateForm.valid);
    if (valid) {
      // 构建业务对象
      // 执行异步操作
      // this.componentService.apiService.doPost();
      let response: any;
      if (execConfig.ajaxConfig['enableAjaxMore']) {
        if (execConfig['data'] && execConfig['data']['data']) {
          response = await this.executeHttpMore(execConfig.ajaxConfig, execConfig['data']['data'], 'buildParameters', null);
        } else {
          response = await this.executeHttpMore(execConfig.ajaxConfig, {}, 'buildParameters', null);
        }
      } else {
        const url = execConfig.ajaxConfig.url;
        const params = this.buildParameters(execConfig.ajaxConfig.params);
        const method = execConfig.ajaxConfig.ajaxType;
        console.log(this.config.id + '-------------执行sql params:', params);
        const back = false;

        let _logInfo;
        if (execConfig.logInfo) {
          _logInfo = execConfig.logInfo;
        } else if (execConfig.btnCfg) {
          _logInfo = this.getLogInfo(execConfig.btnCfg);
        }

        response = await this.executeHttpRequest(url, method, params, _logInfo).toPromise();
        // response = await this.componentService.apiService[](url, params).toPromise();
      }
      return response;
    } else {
      return false;
    }
  }

  private _sendDataSuccessMessage(response, resultCfg): boolean {
    let result = false;
    if (Array.isArray(response.data) && response.data.length <= 0) {
      return result;
    }
    if (response && response.data) {
      const successCfg = resultCfg.find((res) => res.name === 'data');
      // 弹出提示框
      if (successCfg) {
        new RelationResolver(this).resolveInnerSender(successCfg, response.data, Array.isArray(response.data));
      }
      result = true;
    }

    return result;
  }

  private _sendDataValidationMessage(response, resultCfg) {
    let result = true;
    if (response && Array.isArray(response.validation) && response.validation.length <= 0) {
      return result;
    }
    if (response && response.validation) {
      const validationCfg = resultCfg.find((res) => res.name === 'validation');
      if (validationCfg) {
        new RelationResolver(this).resolverDataValidationSender(validationCfg, response.validation);
      }
      result = false;
    }
    return result;
  }

  private _sendDataErrorMessage(response, resultCfg) {
    let result = true;
    if (response && Array.isArray(response.error) && response.error.length <= 0) {
      return result;
    }
    if (response && response.error) {
      const errorCfg = resultCfg.find((res) => res.name === 'error');
      if (errorCfg) {
        new RelationResolver(this).resolverDataErrorSender(errorCfg, response.error);
      }
      result = false;
    }
    return result;
  }

  //       return new SenderResolver(this._componentInstance).resolve(config.cascade.messageSender);

  /**
   * 状态更改-》直接修改配置
   *  消息过来时，判断当前组件相应的内置操作，
   * 例如当接受主子刷新时，子组件状态保存当前，还是恢复到某个状态
   * 可控=》子组件可连续操作不间断。
   * 消息的前置条件可控
   */

  repeat33 = (control: FormControl, data: any): { [s: string]: boolean } => {
    console.log('repeat==>', control, data);
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value === '中国香港') {
      return { repeat: true };
    }
    return {};
  };

  repeat1 = (control: FormControl): { [s: string]: boolean } => {
    // console.log('repeat2==>', control);
    let dd = {};

    if (!control.value) {
      dd = { error: true, required: true };
    } else if (control.value === '中国香港2') {
      dd = { repeat1: true };
    }

    return dd;
  };

  repeat = (targetField: any): { [s: string]: boolean } => {
    const dd = {};
    console.log('参数=======repeat========>', targetField);
    //   return (self:AbstractControl):{[key:string]:any}=>{    //这里严格按照ValidatorFn的声明来
    //     let _form=self.parent;
    //     if(_form){
    //        let targetControl:AbstractControl=_form.controls[targetField];
    //        if(targetControl.value && self.value!=targetControl.value){   //如果两个值不一致
    //              return {repeat:''}
    //        }
    //     }
    //  }
    return dd;
  };

  validating1 = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        console.log('validating>>>>>>>>>>测试远程校验');

        if (control.value === '中国香港1') {
          // you have to return `{error: true}` to mark it as an error event
          observer.next({ validating: true, repeat: true });
          console.log('validating>>>>>>>>>>');
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 200);
    });

  userNameAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      //  setTimeout(() => {
      if (control.value === '中国香港1') {
        // you have to return `{error: true}` to mark it as an error event
        console.log('validating>>>>>>>>>>');
        observer.next({ error: true, userNameAsyncValidator: true });
      } else {
        observer.next(null);
      }
      observer.complete();
      //  }, 1000);
    });

  /**
   *
   * @param option option.linkConfig -> {id: '', link: '', params:[{name: '', type:'', valueName: ''}]}
   */
  public link(option) {
    console.log('link', option);
    let url;
    let params;
    if (option && option.linkConfig) {
      if (option.linkConfig.link) {
        url = option.linkConfig.link;
      }

      if (option.linkConfig.params && Array.isArray(option.linkConfig.params)) {
        params = this.buildParameters(option.linkConfig.params, option.data.originData);
        url = `${url}/${params.ID}`;
      }

      if (url && params) {
        this.componentService.router.navigate([url], { queryParams: { ...params } });
      } else if (url) {
        this.componentService.router.navigate([url]);
      }
    } else {
      console.log('error');
    }
    // this.componentService.router.navigate([option.link], { queryParams: { ...option.data.originData } });
    // this.componentService.activeRoute
    // this.router.navigate(['../home'],{relativeTo:this.route});
  }

  public linkTo(option) {
    console.log('linkTo', option);
    const link_config = this.config.linkConfig.filter((item) => item.id === option.LINKID);
    if (link_config && link_config.length > 0) {
      const url = link_config[0].link;
      this.componentService.router.navigate([url]);
    }
  }

  // liu 20200821  未完成 需要状态和参数一致 和跳转差不多
  public changeState(v?) {
    const ss = JSON.parse(JSON.stringify(this.validateForm.value));
    console.log(this.config.id + '-------------cancel【开始】------------');

    // this.validateForm = this.fb.group({});
    // this.createControls(this.validateForm);
    // this.validateForm.setValue(ss,{onlySelf:false,emitEvent:true});
    this.value = ss;
    if (v.hasOwnProperty('builtinConfig')) {
      if (v.builtinConfig.event === 'formStateChange') {
        this.formStateChange(v.builtinConfig.state ? v.builtinConfig.state : 'text');
      }
    } else {
      this.formStateChange('text');
    }
    // this.validateForm.setValue(this.validateForm.value);
    this.load();
    console.log(this.config.id + '-------------cancel【结束】', v, this.validateForm.value);
    // setTimeout(() => this.setValue('code','liu'), 1000);
    // setTimeout(() => this.validateForm.setValue(ss), 1000);
    // this.setValue('code','liu');
  }

  /**
   * 显示消息框
   * @param option
   */
  public showMessage(option) {
    let msgObj;
    if (option && Array.isArray(option)) {
      // 后续需要根据具体情况解析批量处理结果
      msgObj = this.buildMessageContent(option[0]);
    } else if (option) {
      msgObj = this.buildMessageContent(option);
    }
    option && this.componentService.msgService.create(msgObj.type, `${msgObj.message}`);
  }

  public showWindow(option: any) {
    let dialog;
    // 根据按钮类型初始化表单状态
    const dialogCfg = option.window;
    // dialogCfg.form.state = option.btnCfg.state ? option.btnCfg.state : 'text';

    // const isEditForm = dialogCfg.form.state === 'edit' ? true : false;
    // if(isEditForm) {

    // }
    if (option.changeValue) {
      const d = ParameterResolver.resolve({
        params: option.changeValue.params,
        tempValue: this.tempValue,
        componentValue: this.validateForm.value,
        item: this.FORM_VALUE,
        initValue: this.initValue,
        cacheValue: this.cacheValue,
        router: this.routerValue,
        userValue: this.userValue,
      });
      option.changeValue.params.map((param) => {
        if (param.type === 'value') {
          // 类型为value是不需要进行任何值的解析和变化
        } else {
          if (d[param.name]) {
            param.value = d[param.name];
          }
        }
      });
    }

    const dialogOptional = {
      nzTitle: dialogCfg.title ? dialogCfg.title : '',
      nzWidth: dialogCfg.width ? dialogCfg.width : '600px',
      nzStyle: dialogCfg.style ? dialogCfg.style : null, // style{top:'1px'},
      nzMaskClosable: dialogCfg.hasOwnProperty('maskClosable') ? dialogCfg.maskClosable : false,
      nzContent: CnPageComponent,
      nzComponentParams: {
        config: {},
        customPageId: dialogCfg.layoutName, // "0MwdEVnpL0PPFnGISDWYdkovXiQ2cIOG",
        // initData:this.initData
        changeValue: option.changeValue ? option.changeValue.params : [],
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
          onClick: (componentInstance) => {
            dialog.close();
            /*    (async () => {
                   const response = await componentInstance.executeModal(option);
                   this._sendDataSuccessMessage(response, option.ajaxConfig.result);
  
                   // 处理validation结果
                   this._sendDataValidationMessage(response, option.ajaxConfig.result)
                       &&
                       this._sendDataErrorMessage(response, option.ajaxConfig.result)
                       && dialog.close();
               })(); */
          },
        },
      ],
    };
    dialog = this.componentService.modalService.create(dialogOptional);
  }

  public buildMessageContent(msgObj) {
    const message: any = {};
    let array: any[];
    if (msgObj.type) {
    } else {
      array = msgObj.message.split(':');
    }

    if (!array) {
      if (msgObj.code) {
        message.message = msgObj.code;
      } else if (msgObj.message) {
        message.message = msgObj.message;
      }
      // message.message = option.code ? option.code : '';
      msgObj.field && (message.field = msgObj.field ? msgObj.field : '');
      message.type = msgObj.type;
    } else {
      message.type = array[0];
      message.message = array[1];
    }
    return message;
  }

  public transferValue(option?) {
    console.log('将接受传递的值');
  }

  // 分组属性表单=》动态读取属性，分布提交
  // 根据属性生成-》折叠+表格+扩展页面=>组合属性
  // 【分组】?
  // tab页签下：折叠面板+Descriptions描述列表 ==构成属性编辑器

  // 远程校验(也可通过校验做后续结果操作)
  public async remoteExecute(remoteAjaxConfig, itemData?) {
    const ajaxConfigId = remoteAjaxConfig.id;
    const resultData = remoteAjaxConfig.resultData;
    const execConfig: any = {};
    execConfig.ajaxConfig = this.ajaxConfigObj[ajaxConfigId];
    if (!execConfig.ajaxConfig) {
      return false;
    }
    const url = execConfig.ajaxConfig.url;
    const params = this.buildParameters(execConfig.ajaxConfig.params, {}, itemData);
    console.log(this.config.id + '-------远程------执行sql params:', params);
    const response = await this.componentService.apiService[execConfig.ajaxConfig.ajaxType](url, params).toPromise();

    let backData = {};
    if (Array.isArray(response.data)) {
      if (response.data.length > 0) {
        backData = { ...response.data[0] };
      }
      backData = { ...backData, ...{ resultDatasLength: response.data.length } };
    } else {
      backData = { ...response.data };
      if (response.data.hasOwnProperty('_procedure_resultset_1')) {
        backData = {
          ...backData,
          ...response.data._procedure_resultset_1[0],
          ...{ _procedure_resultset_1Length: response.data._procedure_resultset_1.length },
        };
      }
      if (response.data.hasOwnProperty('resultDatas')) {
        backData = { ...backData, ...response.data.resultDatas[0], ...{ resultDatasLength: response.data.resultDatas.length } };
      }
    }

    if (execConfig.ajaxConfig.result) {
      // 批量对象数据,返回结果都将以对象的形式返回,如果对应结果没有值则返回 {}
      this._sendDataSuccessMessage(response, execConfig.ajaxConfig.result);
      // 处理validation结果
      const validationResult = this._sendDataValidationMessage(response, execConfig.ajaxConfig.result);
      // 处理error结果
      const errorResult = this._sendDataErrorMessage(response, execConfig.ajaxConfig.result);
    }
    if (backData[resultData.valueName] === resultData.passValue) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 写日志
   * @param Description 操作描述
   * @param itemData 操作涉及数据
   */
  public async writeLog(Description?, itemData?, btnOption?) {
    //       this.writeLog('测试执行按钮',params,execConfig);
    const text = btnOption.btnCfg.text;
    let componentId;
    if (btnOption.btnCfg.targetViewId) {
      componentId = btnOption.btnCfg.targetViewId;
    } else {
      componentId = this.config.id;
    }
    console.log('操作按钮', text, '操作组件', componentId);
    // 所属组件 targetViewId ，无 targetViewId 则是当前组件行内操作
    console.log('记录操作日志', Description, itemData, btnOption);
    // 构建参数
    // 根据执行情况，写入日志信息

    // 【菜单】【主页】【页】【组件】【按钮标识】【按钮名称】【业务描述】【业务数据】【执行结果】【执行人】【执行时间】
    // 通过toolbar 基本描述清楚当前按钮上面时候点击，子表描述，点击按钮后执行什么内容（可以将一个按钮下的多个执行记录）
    // 日志，可以记录 谁，在什么时间，打开什么页面，操作什么数据，执行结果如何
    // 当前结构，不太满足aop
    // 逻辑执行的取值，在参数传递的时候未知，需要公用方法解析后，调用统一的执行
  }

  /**
   * 清空表单
   * @param option
   */
  resetForm(option?) {
    this.validateForm.reset();
    for (const item in this.validateForm.value) {
      if (this.FORM_VALUE.hasOwnProperty(item)) {
        this.FORM_VALUE[item] = this.validateForm.value[item];
      }
    }
    return true;
  }

  // 表单向其他组件发送参数消息
  public sendValue() {
    this.messageSendValue();
  }

  public messageSendValue() {
    return true;
  }

  // 接收容器中的传值，套用容器时处理方案
  public async loadByContaines() {
    // console.log('1566:', this.tempValue)
    const staticState = this.config.staticState ? this.config.staticState : 'edit';
    this.formStateChange(staticState);
    let response;
    let data_form;
    if (!this.config.loadingConfig.ajaxConfig) {
      return;
    }
    const url = this.config.loadingConfig.ajaxConfig.url;
    const method = this.config.loadingConfig.ajaxConfig.ajaxType;
    const params = {
      ...this.buildParameters(this.config.loadingConfig.ajaxConfig.params),
    };
    // 考虑满足 get 对象，集合，存储过程【指定dataset 来接收数据】，加载错误的信息提示
    response = await this.componentService.apiService[method](url, params).toPromise();

    if (response) {
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

      data_form = { ...data_form, ...this.staticComponentValue };
      for (const item in this.formValue) {
        if (data_form.hasOwnProperty(item)) {
          this.formValue[item] = data_form[item];
        }
      }

      this.FORM_VALUE = this.formValue;
      this.validateForm.setValue(this.formValue);
      const permission = this.config.formControlsPermissions.find((p) => p.formState === this.FORM_STATE);
      if (permission && permission.formStateContent) {
        const triggerFeilds = permission.formStateContent.triggerFeilds;
        if (triggerFeilds && triggerFeilds.length > 0) {
          triggerFeilds.forEach((element) => {
            let triggerFeild_value;
            if (element.type === 'value') {
              // 选中行对象数据
              triggerFeild_value = element.value;
            }
            if (element.type === 'formValue') {
              // 选中行对象数据
              if (this.FORM_VALUE) {
                const _name = element.valueName;
                triggerFeild_value = this.FORM_VALUE[_name];
              }
            }
            this.valueChange({ name: element.name, value: triggerFeild_value });
          });
        }
      }
      // this.valueChange({name:'CP_USE',value: this.FORM_VALUE['CP_USE']});
      console.log('------------------formValue', this.FORM_STATE, this.formValue, this.validateForm.value);
    }

    return true;
  }
}
