import { AfterViewInit, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { RelationResolver } from 'src/app/shared/resolver/relation/relation.resolver';
import { CnComponentBase } from '../../../cn-component.base';

@Component({
  selector: 'app-cfg-cascade-property',
  templateUrl: './cfg-cascade-property.component.html',
  styles: [
  ]
})
export class CfgCascadePropertyComponent extends CnComponentBase implements OnInit, OnDestroy, AfterViewInit {

  @Input() public config;
  @Input() public changeValue;
  @Input() public tempData;
  @Input() public initData;

  public COMPONENT_NAME = 'CfgCascedeProperty';
  /**
   * 组件操作对外名称
   * 所有组件实现此属性
   */
  // public COMPONENT_METHODS = CN_FLOW_PREVIEW_METHOD;

  // public COMPONENT_PROPERTY = CN_FLOW_PREVIEW_PROPERTY;
  public FORM_VALUE: any = {}; // 当前表单组件值
  public FORM_STATE: any; // 表单的状态=》新增、修改、展示
  public FORM_VALID: any;

  public condition: any;
  public cascadeType: any;

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
  }

  public ngOnInit(): void {
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
    this.setChangeValue(this.changeValue);

    this.resolveRelations();

    this.test_form();

    this.condition = true;
  }

  public ngAfterViewInit() { }

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
   * setChangeValue 接受 初始变量值
   */
  public setChangeValue(ChangeValues?) {
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

  /**
     *  解析级联消息
     */
  private resolveRelations() {
    if (this.config.cascade && this.config.cascade.messageSender) {
      if (!this._sender_source$) {
        // 解析组件发送消息配置,并注册消息发送对象
        this._sender_source$ = new RelationResolver(this).resolveSender(this.config);
        this._sender_subscription$ = this._sender_source$.subscribe();
      }
    }
    if (this.config.cascade && this.config.cascade.messageReceiver) {
      // 解析消息接受配置,并注册消息接收对象
      // this._receiver_source$ = new RelationResolver(this).resolveReceiver(this.config);
      // this._receiver_subscription$ = this._receiver_source$.subscribe();
      new RelationResolver(this).resolveReceiver(this.config);
    }

    this._trigger_source$ = new RelationResolver(this).resolve();
  }

  public getCurrentComponentId() {
    return this.config.id;
  }

  validateForm!: FormGroup;

  public test_form() {
    this.validateForm = this.fb.group({
      connection: this.fb.group({
        SenderCompId: [null, [Validators.required]],
        SenderCompName: [null, [Validators.required]]
      }),
      stageContent: this.fb.array([
        this.fb.group({
          SenderCompId: new FormControl(null, Validators.required),
          SenderCompName: new FormControl(null, Validators.required),
          TriggerMode: new FormControl(null, Validators.required),
          CascadeType: new FormControl(null, Validators.required),
          ParamType: new FormControl(null, Validators.required),
          ParamName: new FormControl(null, Validators.required),
          expressionList: new FormControl(null, Validators.required),
          paramsTable: new FormControl(null, Validators.required)
        })
      ])
    });


  }

  public getComponentValueNew() {

    let submitData = {};
    // submitData['configjson'] = JSON.stringify(dddd);
    submitData['process'] = {
      "code": "vocation",
      "version": "v2020",
      "name": "",
      "title": "",
      "pageID": "",
      "strict": true, // 是否强制保存(用在存在实例的流程定义), 默认值为false
      "typeId": 1, // 关联的类型id, 数字类型
      "description": "" // 描述
    }
    console.log('最终数据', submitData)
    console.log('最终数据', JSON.stringify(submitData))
    return submitData;
  }

  public test_to_form() {
    console.log('====>', this.validateForm);
  }

  ajaxOptionDataList: any[] = [];

  testArryCopy = [
    { option: "第一场" },
    { option: "第二场" }
  ];

  // get isCondition(): boolean {
  //   return this.validateForm.controls.TriggerMode?.value === 'condition';
  // }

  get testArrFormArray() {
    return this.validateForm.controls['stageContent'] as FormArray;
  }

  /**
   * changeTriigerMode 改变触发方式的值
   */
  public changeTriigerMode($event?) {
    this.condition = $event === 'condition' ? true : false;
  }

  /**
   * changeCascadeType 改变级联响应体结构
   */
  public changeCascadeType($event) {
    this.cascadeType = $event
  }

  creatRow() {
    return this.fb.group({
      SenderCompId: [null, [Validators.required]],
      SenderCompName: [null, [Validators.required]],
      TriggerMode: [null, [Validators.required]],
      CascadeType: [null, [Validators.required]],
      ParamType: [null, [Validators.required]],
      ParamName: [null, [Validators.required]]
    });
  }




  value

  /**
   * creatTableRow 创建表单内表格新行
   */
  public creatTableRow() {
    this.ajaxOptionDataList = [
      {
        name: "",
        type: "",
        valueName: "",
        isDefault: "",
        value: ""
      },
      ...this.ajaxOptionDataList
    ];
  }

  add() {
    this.ajaxOptionDataList.push(this.creatTableRow());
    // this.ajaxOptionDataList = this.ajaxOptionDataList.filter(d => d.name !== "i");
  }

  //新增组合
  addItem() {
    this.testArrFormArray.push(this.creatRow());
  }
  //刪除组合
  delItem(i) {
    this.testArrFormArray.removeAt(i);
  }

  test_del(i?) {
    console.log("xxxxxx", i);
  }

}
