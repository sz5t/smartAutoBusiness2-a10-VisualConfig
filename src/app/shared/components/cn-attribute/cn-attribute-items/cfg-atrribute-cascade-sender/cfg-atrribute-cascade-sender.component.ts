import { Component, OnInit, EventEmitter, Input, Output, Inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { CommonUtils } from 'src/app/core/utils/common-utils';
import { ParameterResolver } from 'src/app/shared/resolver/parameter/parameter.resolver';
import { CnComponentBase } from '../../../cn-component.base';

@Component({
  selector: 'app-cfg-atrribute-cascade-sender',
  templateUrl: './cfg-atrribute-cascade-sender.component.html',
  styles: [
  ]
})
export class CfgAtrributeCascadeSenderComponent extends CnComponentBase implements OnInit {
  sendArray: any = [];

  form: FormGroup;
  panelId: any; // 发出面板的INDEX
  isVisible: any = false;
  KEY_ID: any;
  sendCount: any;
  receiverCount: any;
  field: any;
  panels: any = [];

  @Input() public config;
  @Output() public updateValue = new EventEmitter();

  public sendPanels = [
    {
      Id: 's1',
      name: '发出组件01'
    },
    {
      Id: 's2',
      name: '发出组件02'
    },
    {
      Id: 's3',
      name: '发出组件03'
    }
  ];

  public receiverPanels = [
    {
      Id: 'r1',
      name: '被级联组件01',
      parentId: 's1'
    },
    {
      Id: 'r2',
      name: '被级联组件02',
      parentId: 's1'
    },
    {
      Id: 'r3',
      name: '被级联组件03',
      parentId: 's1'
    }
  ];

  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { super(componentService); }

  ngOnInit() {
    this.form = this.fb.group({
      receiverCompName: [null, [Validators.required]],
    });
    if (this.updateValue) {
      this.updateValue.subscribe((event) => {
        this.setValue(event);
      });
    }
    this.initParams();
    this.load_data();
  }

  get receiverCompName() {
    return this.form.controls.receiverCompName.value;
  }

  public setValue(data?) {
    this.updateValue.emit(data);
  }

  /**
   * initParams 初始化组件内部参数
   */
  public initParams() {
    this.field = this.config.receiverPanelConfig ? this.config.receiverPanelConfig['sendCascadeField'] : 'parentId'

    this.KEY_ID = this.config.keyId ? this.config.keyId : 'Id'
  }

  public async load_data() {
    await this.replacePanelData();
    this.assemblePanelData();
  }

  /**
   * replacePanelData 读取数据
   */
  public async replacePanelData() {
    if (this.config.sendPanelConfig) {
      const sendPanelConfig = this.assembleAjax(this.config.sendPanelConfig);
      const sendData = await this.getData(sendPanelConfig);
      if (sendData.data.length > 0) {
        this.sendPanels = sendData.data;
      }
    }

    if (this.config.receiverPanelConfig) {
      const receiverPanelConfig = this.assembleAjax(this.config.receiverPanelConfig);
      const receiverData = await this.getData(receiverPanelConfig);
      if (receiverData.data.length > 0) {
        this.receiverPanels = receiverData.data;
      }
    }


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
   * assemblePanelData 初始化级联发送方，接收方的数据，组合面板展示结构
   */
  public assemblePanelData() {
    this.panels = this.sendPanels;
    // forEach循环不一定能感知变化，需要实时变化使用FOR循环
    this.panels.forEach(send => {
      send['count'] = 0;
      send['children'] = [];
      this.receiverPanels.forEach(rec => {
        if (rec[this.field] === send['Id']) {
          send['children'].push(rec)
          send['count'] += 1;
        }
      })
    });

    // 手动检测一次页面的值变化，目前效率最优
    this.cdr.markForCheck();

    // this.panels = this.panels.filter(e => e['Id'] !== null);

    // this.panels = JSON.parse(JSON.stringify(this.panels));
  }

  /**
   * addItem 添加子面板内容
   */
  public addItem(panelId) {
    this.isVisible = true;
    this.panelId = panelId;
  }

  public handleCancel() {
    this.isVisible = false;
  }

  public handleOk() {
    // console.log('panelId', this.panelId, 'formValue', this.form.value);
    const newReceiverPanelObj = {
      Id: CommonUtils.uuID(36),
      name: this.form.value.receiverCompName,
      parentId: this.panelId
    }
    this.receiverPanels.push(newReceiverPanelObj);
    this.assemblePanelData();
    console.log(this.panels);
  }

  public valueChange(v?) {
    console.log('value', v, 'sendArray', this.sendArray);
    const index = this.sendArray.findIndex(e => e.cascadeName === v.panelName)
    if (index > -1) {

    } else {
      this.sendArray.push(v.value);
    }
    const sendComponent = this.receiverPanels.find(e => e['name'] === v.panelName);
    const sendComponentId = sendComponent['parentId'];
    const sendComponentName = this.sendPanels.find(e => e['Id'] === sendComponentId)['name'];
    const CascadeObject = {
      "controlId": sendComponentId,
      "name": sendComponentName,
      "CascadeObjects": this.sendArray
    }
    const cascadeValue = [];
    cascadeValue.push(CascadeObject);
    console.log('cascadeValue', cascadeValue);
  }
}
