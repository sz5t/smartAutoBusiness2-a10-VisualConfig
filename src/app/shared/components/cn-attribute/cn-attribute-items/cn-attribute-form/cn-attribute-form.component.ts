import { Component, OnInit, AfterViewInit, Inject, Input, Output, EventEmitter } from '@angular/core';

import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { ParameterResolver } from 'src/app/shared/resolver/parameter/parameter.resolver';
import { CnComponentBase } from '../../../cn-component.base';

@Component({
  selector: 'cn-attribute-form,[cn-attribute-form]',
  templateUrl: './cn-attribute-form.component.html',
  styleUrls: ['./cn-attribute-form.component.less'],
})
export class CnAttributeFormComponent extends CnComponentBase implements OnInit, AfterViewInit {
  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) {
    super(componentService);
    this.tempValue = {};
  }
  @Input() public config;
  @Input() public typeConfig;
  @Input() public changeValue;
  @Input() public attributeType;
  @Input() public loadConfigValue;
  @Output() public execOperation = new EventEmitter();
  public dataList: any;
  public rowData;
  public objectCompont;

  loadingConfig = {
    url: 'resource/B_P_D_CONFIG_JSON_P/operate', // operation 操作 query
    ajaxType: 'post',
    params: [
      {
        name: 'PID',
        type: 'componentValue',
        valueName: 'PID',
        dataType: 'string',
      },
      {
        name: 'TYPE',
        type: 'value',
        valueName: 'PID',
        dataType: 'int',
        value: 1,
      },
      {
        name: 'PageId',
        type: 'tempValue',
        valueName: 'ID',
        dataType: 'string',
        value: '',
      },
      {
        name: 'CMTId',
        type: 'tempValue',
        valueName: 'CMTId',
        dataType: 'string',
        value: '',
      },
      {
        name: 'ParentType',
        type: 'tempValue',
        valueName: 'ParentType',
        dataType: 'int',
        value: 2,
      },
    ],
    filter: [],
  };

  public loadData;

  saveConfig = {
    url: 'resource/B_P_SAVE_JSON/operate', // operation 操作 query
    ajaxType: 'post',
    params: [
      {
        name: 'Id',
        type: 'componentValue',
        valueName: 'ID',
        dataType: 'string',
      },
      {
        name: 'Json',
        type: 'componentValue',
        valueName: 'JSON',
        dataType: 'string',
        value: '{}',
      },
    ],
    filter: [],
  };

  async ngOnInit() {
    this.tempValue.ParentType = this.attributeType ? this.attributeType : 2;
    this.setChangeValue(this.changeValue);
    console.log(' this.tempValue=>>>', this.tempValue);
    // console.log('===弹出页面object的配置===>', this.config);
    // this.config.objectJson.forEach(element => {
    //   element['valueConfig'] = {'id':this.config.keyId?this.config.keyId:'','value':this.dataList[element.field]?this.dataList[element.field]:null}
    // });

    if (this.typeConfig) {
      if (this.typeConfig.componentType === 'table_from') {
        // 有消息过来加载数据
      }
    } else {
      if (this.loadConfigValue) {
        await this.load(this.loadConfigValue);
      } else {
        await this.load();
      }
    }
  }

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

  async ngAfterViewInit(): Promise<void> {}
  // 构建参数-》下拉选择自加载数据
  public buildParameters(paramsCfg, RcomponentValue?) {
    if (!RcomponentValue) {
      RcomponentValue = {};
    }
    if (!RcomponentValue.PID) {
      RcomponentValue.PID = this.config.keyId;
    }

    console.log('RcomponentValue', RcomponentValue);
    return ParameterResolver.resolve({
      params: paramsCfg,
      tempValue: this.tempValue,
      componentValue: RcomponentValue, //  组件值？返回值？级联值，需要三值参数
      initValue: this.initValue,
      cacheValue: this.cacheValue,
      router: this.routerValue,
      cascadeValue: this.cascadeValue,
      userValue: this.userValue,
    });
  }
  public async load(componentValue?) {
    const url = this.loadingConfig.url;
    const method = this.loadingConfig.ajaxType;
    const params = {
      ...this.buildParameters(this.loadingConfig.params, componentValue),
    };
    // 考虑满足 get 对象，集合，存储过程【指定dataset 来接收数据】，加载错误的信息提示
    const response = await this.componentService.apiService.post(url, params).toPromise();
    //  console.log("数组加载", response.data,response.data._procedure_resultset_1[0]['W']);

    if (response.data._procedure_resultset_1[0].W === '') {
      this.dataList = {};
    } else {
      const d = JSON.parse(response.data._procedure_resultset_1[0].W);
      this.loadData = d;
      this.convertData(d);
    }
    const oc = { PID: this.dataList.rowId };
    this.objectCompont = oc;
    console.log('*****************', this.objectCompont, this.loadData);
  }
  convertData(d?) {
    const datalistitem: any = {};
    datalistitem.rowId = d.keyId;

    d.data.forEach((item) => {
      datalistitem[item.feild] = item.value ? item.value : '';
    });

    // this.dataList = datalistitem;
    this.dataList = null;
    this.dataList = JSON.parse(JSON.stringify(datalistitem));
    // {'id':config.keyId?config.keyId:'','value':dataList[c.field]?dataList[c.field]:null}
    // this.config.objectJson.forEach(element => {
    //   element['valueConfig'] = {'id':this.config.keyId?this.config.keyId:'','value':this.dataList[element.field]?this.dataList[element.field]:null}
    // });
    // console.log('object最终数据集', d,this.dataList);
  }
  valueChange(d?) {
    // console.log('表单返回值',d, this.dataList,this.loadData );
    this.dataList[d.name] = d.value;

    if (d.count > 0) {
      this.save();
      this.toTableRow(this.dataList);
    }
  }

  public async save() {
    const url = this.saveConfig.url;
    const method = this.saveConfig.ajaxType;
    const componentValue = { ID: this.dataList.rowId, JSON: JSON.stringify(this.dataList) };
    const params = {
      ...this.buildParameters(this.saveConfig.params, componentValue),
    };
    // 考虑满足 get 对象，集合，存储过程【指定dataset 来接收数据】，加载错误的信息提示
    const response = await this.componentService.apiService.post(url, params).toPromise();
    console.log('执行保存', response.data);
  }

  /**
   * 变化页面数据
   */
  public async changData(r?) {
    this.rowData = r;
    if (r) {
      const componentValue = { PID: r.rowId };
      await this.load(componentValue);
    } else {
      this.dataList = null;
    }
  }

  public toTableRow(r) {
    if (this.rowData) {
      const row: any = {};
      row.rowId = this.rowData.rowId;
      const rowback = { ...r, ...row };
      this.execOperation.emit(rowback);
    }
  }
}
