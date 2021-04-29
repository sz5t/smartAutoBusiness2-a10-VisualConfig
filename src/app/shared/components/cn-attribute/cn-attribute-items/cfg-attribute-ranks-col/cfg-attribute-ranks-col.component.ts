import { Component, OnInit, EventEmitter, Input, Output, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { CommonUtils } from 'src/app/core/utils/common-utils';
import { ParameterResolver } from 'src/app/shared/resolver/parameter/parameter.resolver';
import { CnComponentBase } from '../../../cn-component.base';

@Component({
  selector: 'app-cfg-attribute-ranks-col',
  templateUrl: './cfg-attribute-ranks-col.component.html',
  styles: [
    `
      nz-select {
        margin: 0 8px 10px 0;
        width: 200px;
      }
    `
  ]
})
export class CfgAttributeRanksColComponent extends CnComponentBase implements OnInit {
  backValue: any;
  colEditCache: { [key: string]: { edit: boolean; data: any } } = {};

  @Input() rowData; // 接收组件的面板名称
  @Input() config;
  @Input() columns;
  @Output() public updateValue = new EventEmitter();
  public colTableList: any = [];

  public unSelectedColumnsMap: any = [];

  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
    private fb: FormBuilder,
  ) { super(componentService); }

  ngOnInit() {
    this.getInitData();
    // console.log(this.columns);
  }

  public ngAfterViewInit() {
  }

  public setValue(data?) {
    // this.receiverValue.emit(data);
  }

  public async getInitData() {
    // await this.load_data();
    this.changeColumnsMapping(null);
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
          // this.userList = sendData.data;
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
    const length = type ? this.colTableList.length : 0
    return {
      id: `${length}`,
      mergeColName: ``,
      singleEdit: ``
    }
  }

  _submitForm() {

  }
  add(groupName: string) {
    // 判断数组是否已经存在数据进行不同的处理
    let tableList = this.colTableList;
    const tableItemObj = this.createTableData(groupName)
    if (tableList.length > 0) {
      tableList = [...tableList, { ...tableItemObj }]
    } else {
      tableList = [{ ...tableItemObj }]
    }
    this.colTableList = tableList;
    this.pushEditCache(tableItemObj);
  }

  startEdit(id: string): void {
    this.colEditCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.colTableList.findIndex(item => item.id === id);
    this.colEditCache[id] = {
      data: { ...this.colTableList[index] },
      edit: false
    };
  }

  saveEdit(id: string): void {
    const index = this.colTableList.findIndex(item => item.id === id);
    Object.assign(this.colTableList[index], this.colEditCache[id].data);
    this.colEditCache[id].edit = false;
    // console.log(this.colEditCache);
    this.changeColumnsMapping(this.colEditCache);
    this.valueChange(this.colEditCache);
  }

  pushEditCache(tableItemObj): void {
    this.colEditCache[tableItemObj.id] = {
      edit: true,
      data: { ...tableItemObj }
    };
  }

  updateEditCache(): void {
    this.colTableList.forEach(item => {
      this.colEditCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  deleteRow(id: string): void {
    this.colTableList = this.colTableList.filter(d => d.id !== id);
  }

  assembleGroupCols(v) {
    const groupCols = [];
    const tempArray = Object.values(v)
    tempArray.forEach(e => {
      groupCols.push(
        {
          "groupColName": e['data']['mergeColName'],
          "singleEdit": e['data']['singleEdit']
        }
      )
    });
    return groupCols;
  }

  changeColumnsMapping(obj) {
    let selectedColumns: any = {}
    if (obj) {
      const tempArray = Object.values(obj);
      tempArray.forEach(e => {
        if (Object.values(selectedColumns).length === 0) {
          selectedColumns = {
            ...{
              [e['data']['mergeColName']]: true
            }
          }
        } else if (selectedColumns[e['data']['mergeColName']]) {

        } else {
          selectedColumns = {
            ...{
              [e['data']['mergeColName']]: true
            }
          }
        }
      });
      this.columns.forEach(col => {
        if (selectedColumns[col['field']]) {
          const index = this.unSelectedColumnsMap.findIndex(e => e['field'] === col['field'])
          this.unSelectedColumnsMap.splice(index, 1);
          this.unSelectedColumnsMap = this.unSelectedColumnsMap.filter(e => e['field'] !== null)
        }
      });
    } else {
      this.columns.forEach(col => {
        this.unSelectedColumnsMap.push(col);
      });
    }

  }

  /**
   * valueChange
v?   */
  public valueChange(v?) {
    // console.log('value', v);
    this.backValue = {
      "colName": this.rowData['colName'],
      "groupName": this.rowData['groupName'],
      "groupCols": this.assembleGroupCols(v)
    };
    // console.log('backValue', this.backValue);
    this.updateValue.emit(this.backValue);
  }
}
