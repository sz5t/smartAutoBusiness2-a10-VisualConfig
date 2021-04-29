import { Component, Inject, Input, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TransferItem } from 'ng-zorro-antd/transfer';
import { config } from 'process';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { ParameterResolver } from 'src/app/shared/resolver/parameter/parameter.resolver';
import { CnComponentBase } from '../../../cn-component.base';
import { CnDataFormComponent } from '../../cn-data-form.component';

@Component({
  selector: 'cn-form-transfer',
  templateUrl: './cn-form-transfer.component.html',
  styleUrls: ['./cn-form-transfer.component.less']
})
export class CnFormTransferComponent extends CnComponentBase implements OnInit {
  @Input() public config;
  @Input() public formGroup: FormGroup;
  @Input() public tempData;
  @Input() public initData;
  @Input() public changeValue: any;
  @Input() public dialogsConfig: any;
  @Output() public updateValue = new EventEmitter();




  public transferObj: {
    list: TransferItem[],
    transferArr: string,
    title: any,
    loadingData: any,
    formDataArr: string,
    formData: any,
    targetKeys: any[];
    footer: any;
  };

  constructor(@Inject(BSN_COMPONENT_SERVICES)
  public componentService: ComponentServiceProvider,
    private _cdr: ChangeDetectorRef
  ) {
    super(componentService);
    this.initValue = {};
    this.tempValue = {};
  }

  public ngOnInit() {
    console.log(this.dialogsConfig);
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
    this.transferObj = this._initTransferObj(this.config);
    if (this.config.loadingConfig) {
      this.load();
    }

  }

  private _initTransferObj(config: any) {
    return {
      list: [],
      transferArr: '',
      title: config.title,
      loadingData: [],
      formDataArr: '',
      formData: [],
      targetKeys: [],
      footer: config.footer ? config.footer : null
    };
  }

  public change($event): void {
    switch ($event.from) {
      case 'left':
        $event.list.forEach(item => {
          const index = this.transferObj.targetKeys.indexOf(item.key);
          if (index < 0) {
            this.transferObj.targetKeys.push(item.key);
          }
        });
        break;
      case 'right':
        $event.list.forEach(item => {
          this.transferObj.targetKeys = this.transferObj.targetKeys.filter(_key => _key !== item.key);
        });
        break;
    }

    this.transferObj.formDataArr = '';
    this.transferObj.targetKeys.forEach(key => {
      this.transferObj.formDataArr += key + ',';
    });
    this.transferObj.formDataArr = this.transferObj.formDataArr.substring(0, this.transferObj.formDataArr.length - 1);
    console.log('transferArrString===============>', this.transferObj.formDataArr);
    this._cdr.markForCheck();
  }

  /**
 * load 自加载
 */
  public async load() {
    let response: any;
    if (this.config.loadingConfig.ajaxConfig.enableAjaxMore) {
      response = await this.executeHttpMore(this.config.loadingConfig.ajaxConfig, {}, 'buildParameters', null);
    } else {
      console.log(this.changeValue);
      const url = this.config.loadingConfig.ajaxConfig.url;
      const method = this.config.loadingConfig.ajaxConfig.ajaxType;
      const params = {
        ...this.buildParameters(this.config.loadingConfig.ajaxConfig.params)
      };
      // 考虑满足 get 对象，集合，存储过程【指定dataset 来接收数据】，加载错误的信息提示
      response = await this.componentService.apiService.getRequest(url, method, { params }).toPromise();
    }

    if (response.data && response.data.length > 0) {
      const data_form = response.data;
      this.transferObj.loadingData = [];
      response.data.forEach(d => {
        if (d[this.config.valueField]) {
          const orginData: any = {};
          orginData.key = d[this.config.valueField];
          orginData.title = d[this.config.titleField];
          this.transferObj.loadingData.push(orginData);
        }
      });
      this.transferObj.list = this.transferObj.loadingData;
    }
  }

  /**
 * valueChange
 */
  public async valueChange(v?) {
    let backValue: any = { name: this.config.field, value: v, id: this.config.config.id };
    let rightArr = [];
    if (v && v.length > 0) {
      rightArr = v.split(',');
      if (rightArr.length > 0) {
        const arr: any = [];
        rightArr.forEach(s => {
          for (let i = 0; i < this.transferObj.list.length; i++) {
            if (this.transferObj.list[i].key === s) {
              arr.push(s);
            }
          }

        });
        this.transferObj.targetKeys = arr;
      }
      this._cdr.markForCheck();
    }
    this.updateValue.emit(backValue);
  }

  public buildParameters(paramsCfg, searchValue?) {
    if (searchValue) {
      paramsCfg.forEach(p => {
        if (p.search) {
          p.type = 'value';
          p.value = searchValue;
        }
      });
    }
    return ParameterResolver.resolve({
      params: paramsCfg,
      tempValue: this.tempValue,
      componentValue: this.formGroup.value, //  组件值？返回值？级联值，需要三值参数
      initValue: this.initValue,
      cacheValue: this.cacheValue,
      router: this.routerValue,
      cascadeValue: this.cascadeValue,
      userValue: this.userValue
    });
  }

  public click(dialogId): boolean {
    let dialog = this.componentService.cacheService.getNone(dialogId);
    if (!dialog) {
      dialog = this.dialogsConfig.find(d => d.id === dialogId);
      this.componentService.cacheService.set(dialogId, dialog);
    }
    this.showDialog(dialog);
    return false;
  }

  public showDialog(dialogCfg): void {
    let dialog;
    console.log('dialogCfg================>', dialogCfg);
    const dialogOptional = {
      nzTitle: dialogCfg.title ? dialogCfg.title : '',
      nzWidth: dialogCfg.width ? dialogCfg.width : '600px',
      nzStyle: dialogCfg.style ? dialogCfg.style : null, // style{top:'1px'},
      nzMaskClosable: dialogCfg.hasOwnProperty('maskClosable') ? dialogCfg.maskClosable : false,
      nzContent: CnDataFormComponent,
      nzComponentParams: {
        config: dialogCfg.form,
        tempValue: this.tempValue,
        initValue: this.initValue,
        changeValue: this.changeValue
        // changeValue: option.changeValue ? option.changeValue.params : [],
        // dialogsConfig: this.config.dialog
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
            /*   (async () => {
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

  public cascadeAnalysis(c?) { }
}
