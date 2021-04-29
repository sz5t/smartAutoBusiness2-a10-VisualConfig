import { Component, OnInit, EventEmitter, Input, Output, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { CnComponentBase } from '../../../cn-component.base';

@Component({
  selector: 'app-cfg-attribute-cascade-receiver',
  templateUrl: './cfg-attribute-cascade-receiver.component.html',
  styles: [
  ]
})
export class CfgAttributeCascadeReceiverComponent extends CnComponentBase implements OnInit {

  editIndex = -1;
  editObj = {};
  isVisible = false;
  backValue: any;
  rowData: any = {};
  responseArray: any = [];
  @Input() panelId; // 接收组件的面板ID
  @Input() panelName; // 接收组件的面板名称
  @Input() config;
  @Output() public updateValue = new EventEmitter();

  form: FormGroup;

  public userList = [
    {
      key: '1',
      receiverComponentName: '001',
      receiverRelationName: 'ajax',
      panelId: 'r1'
    },
    {
      key: '2',
      receiverComponentName: '002',
      receiverRelationName: 'setOptions',
      panelId: 'r1'
    },
    {
      key: '3',
      receiverComponentName: '003',
      receiverRelationName: 'relation',
      panelId: 'r1'
    },
    {
      key: '4',
      receiverComponentName: '004',
      receiverRelationName: 'compute',
      panelId: 'r1'
    },
  ];

  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
    private fb: FormBuilder,
  ) { super(componentService); }

  ngOnInit() {
    this.form = this.fb.group({
      ReceiverOptionsConfig: this.fb.array([]),
    });
    // console.log('config', this.config);
    this.getInitData();
    // this.createTableData();

    // if (this.receiverValue) {
    //   this.receiverValue.subscribe((event) => {
    //     this.setValue(event);
    //   });
    // }
  }

  public ngAfterViewInit() {
  }

  public setValue(data?) {
    // this.receiverValue.emit(data);
  }

  public async getInitData() {
    await this.load_data();
    this.createTableData();
  }

  /**
   * load_data 读取需要的数据
   */
  public async load_data() {
    if (this.config.cascadeTypeConfig) {
      const sendPanelConfig = this.assembleAjax(this.config.cascadeTypeConfig);
      if (sendPanelConfig['id']) {
        const sendData = await this.getData(sendPanelConfig);
        if (sendData.data.length > 0) {
          this.userList = sendData.data;
        }
      }
    }
  }

  /**
   * assembleAjax 组装AJAX结构
   */
  public assembleAjax(config) {
    let ajaxId;
    ajaxId = config.ajaxId
    this.config.ajaxConfig.forEach(ajax => {
      if (ajax['id'] === ajaxId) {
        config = ajax
      }
    });
    return config;
  }

  /**
   * getData 读取数据
   */
  public async getData(config) {
    const url = config.url;
    const method = config.method ? config.method : config.ajaxType;

    // const response: any = await this.componentService.apiService[method](url, method, { params }).toPromise();
    const response = await this.executeHttpRequest(url, method, {});
    return response;
  }

  public async executeHttpRequest(url, method, paramData) {
    return this.componentService.apiService[method](url, paramData).toPromise();
  }

  /**
   * 动态生成表数据
   */
  public createTableData(type?) {
    this.userList.forEach(i => {
      if (i['panelId'] === this.panelId) {
        const field = this.createUser();
        field.patchValue(i);
        this.ReceiverOptionsConfig.push(field);
      }
    });
  }

  createUser(): FormGroup {
    return this.fb.group({
      key: [null],
      receiverComponentName: [null, [Validators.required]],
      receiverRelationName: [null, [Validators.required]],
    });
  }

  //#region get form fields
  get ReceiverOptionsConfig() {
    return this.form.controls.ReceiverOptionsConfig as FormArray;
  }
  //#endregion

  add() {
    this.ReceiverOptionsConfig.push(this.createUser());
    this.edit(this.ReceiverOptionsConfig.length - 1);
  }

  del(index: number) {
    this.ReceiverOptionsConfig.removeAt(index);
  }

  edit(index: number) {
    if (this.editIndex !== -1 && this.editObj) {
      this.ReceiverOptionsConfig.at(this.editIndex).patchValue(this.editObj);
    }
    this.editObj = { ...this.ReceiverOptionsConfig.at(index).value };
    this.editIndex = index;
  }

  save(index: number) {
    this.ReceiverOptionsConfig.at(index).markAsDirty();
    // if (this.ReceiverOptionsConfig.at(index).invalid) { return; }
    this.editIndex = -1;
  }

  cancel(index: number) {
    if (!this.ReceiverOptionsConfig.at(index).value.key) {
      this.del(index);
    } else {
      this.ReceiverOptionsConfig.at(index).patchValue(this.editObj);
    }
    this.editIndex = -1;
  }

  set(i): void {
    this.isVisible = true;
    this.rowData = this.form.value.ReceiverOptionsConfig[i];
    // console.log(this.form.value, i, this.rowData);
  }

  handleOk() {

  }

  handleCancel() {
    this.isVisible = false;
  }

  /**
   * valueChange
v?   */
  public valueChange(v?) {
    // console.log('value', v);
    this.handleCancel();
    if (this.responseArray.findIndex(e => e.Id === v.Id) > -1) {

    } else {
      this.responseArray.push(v.value);
    }
    const receiverComponent = this.userList.find(e => e['key'] === v.Id);
    const receiverComponentName = receiverComponent['panelId'];
    const CascadeObject = {
      "controlId": receiverComponentName,
      "cascadeName": this.panelName,
      "cascadeItems": this.responseArray
    }
    this.backValue = { name: 'cascadeObject', value: CascadeObject, panelName: this.panelName };
    // console.log('backValue', this.backValue);
    this.updateValue.emit(this.backValue);
  }
}
