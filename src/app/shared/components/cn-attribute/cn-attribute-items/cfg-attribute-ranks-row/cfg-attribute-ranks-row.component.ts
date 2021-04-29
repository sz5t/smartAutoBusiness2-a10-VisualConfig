import { Component, OnInit, EventEmitter, Input, Output, Inject, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { CommonUtils } from 'src/app/core/utils/common-utils';
import { ParameterResolver } from 'src/app/shared/resolver/parameter/parameter.resolver';
import { CnComponentBase } from '../../../cn-component.base';
@Component({
  selector: 'app-cfg-attribute-ranks-row',
  templateUrl: './cfg-attribute-ranks-row.component.html',
  styles: [
    `
      nz-select {
        margin: 0 8px 10px 0;
        width: 200px;
      }
    `
  ]
})
export class CfgAttributeRanksRowComponent extends CnComponentBase implements OnInit {
  backValue: any;
  rowEditCache: { [key: string]: { edit: boolean; data: any } } = {};

  @Input() rowData; // 接收组件的面板名称
  @Input() config;
  @Input() columns;
  @Output() public updateValue = new EventEmitter();
  public rowTableList: any = [];

  public unSelectedColumnsMap: any = [];

  public columnsMap: any = [];

  public assembleGroupColsMap: any = [];

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
    const length = type ? this.rowTableList.length : 0
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
    let tableList = this.rowTableList;
    const tableItemObj = this.createTableData(groupName)
    if (tableList.length > 0) {
      tableList = [...tableList, { ...tableItemObj }]
    } else {
      tableList = [{ ...tableItemObj }]
    }
    this.rowTableList = tableList;
    this.pushEditCache(tableItemObj);
  }

  startEdit(id: string): void {
    this.rowEditCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.rowTableList.findIndex(item => item.id === id);
    this.rowEditCache[id] = {
      data: { ...this.rowTableList[index] },
      edit: false
    };
  }

  saveEdit(id: string): void {
    const index = this.rowTableList.findIndex(item => item.id === id);
    Object.assign(this.rowTableList[index], this.rowEditCache[id].data);
    this.rowEditCache[id].edit = false;
    this.valueChange(this.rowEditCache);
    this.changeColumnsMapping(this.rowEditCache);
  }

  pushEditCache(tableItemObj): void {
    this.rowEditCache[tableItemObj.id] = {
      edit: true,
      data: { ...tableItemObj }
    };
  }

  updateEditCache(): void {
    this.rowTableList.forEach(item => {
      this.rowEditCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  deleteRow(id: string): void {
    this.rowTableList = this.rowTableList.filter(d => d.id !== id);
    const recoveryIndex = parseInt(id);
    this.unSelectedColumnsMap = [];
    for (let i = 0; i < this.columnsMap.length; i++) {
      if (i >= recoveryIndex) {
        this.unSelectedColumnsMap.push(
          this.columnsMap[i]
        )
      }
    }
  }

  assembleGroupCols(v) {
    for (let i = 0; i < this.columns.length; i++) {
      this.assembleGroupColsMap.push(
        {
          index: i,
          data: this.columns[i]
        }
      );
    }
    const groupCols = [];
    const tempArray = Object.values(v);
    tempArray.forEach(e => {
      // 根据输入的列，需要合并的列数量进行计算，数组插值，值传递
      if (e['data']['mergeLength']) {
        const inputLength = e['data']['mergeLength'];
        const field = e['data']['mergeColName'];
        const inputObj = this.assembleGroupColsMap.find(c => c['data']['field'] === field);
        const inputIndex = inputObj.index; // 开始插入数据的索引
        const changebaleNum = this.assembleGroupColsMap.length - inputIndex
        const actualNum = inputLength > changebaleNum ? changebaleNum : inputLength // 实际可以插入数据的长度
        for (let i = inputIndex; i <= actualNum; i++) {
          groupCols.push(
            {
              "id": this.rowData['id'],
              "mergeColName": this.assembleGroupColsMap[i]['data']['field'],
              "singleEdit": e['data']['singleEdit']
            }
          )
        }
      } else {
        groupCols.push(
          {
            "id": this.rowData['id'],
            "mergeColName": e['data']['mergeColName'],
            "singleEdit": e['data']['singleEdit']
          }
        )
      }
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
              [e['data']['mergeColName']]: true,
              selectedIndex: e['data']['mergeLength']
            }
          }
        } else if (selectedColumns[e['data']['mergeColName']]) {

        } else {
          selectedColumns = {
            ...{
              [e['data']['mergeColName']]: true,
              selectedIndex: e['data']['mergeLength']
            }
          }
        }
      });
      this.columns.forEach(col => {
        if (selectedColumns[col['field']]) {
          const index = this.unSelectedColumnsMap.findIndex(e => e['data']['field'] === col['field']);
          const selectedIndex = selectedColumns['selectedIndex'] ? selectedColumns['selectedIndex'] : 1
          const spliceNum = this.unSelectedColumnsMap.length > selectedIndex ? selectedIndex : this.unSelectedColumnsMap.length
          this.unSelectedColumnsMap.splice(index, spliceNum);
          this.unSelectedColumnsMap = this.unSelectedColumnsMap.filter(e => e['field'] !== null)
        }
      });
    } else {
      for (let i = 0; i < this.columns.length; i++) {
        this.unSelectedColumnsMap.push(
          {
            index: i,
            data: this.columns[i]
          }
        );
        this.columnsMap.push(
          {
            index: i,
            data: this.columns[i]
          }
        );
      }
    }
  }

  /**
   * valueChange
v?   */
  public valueChange(v?) {
    // console.log('value', v);
    this.backValue = {
      "id": parseInt(this.rowData['id']),
      "mergeCols": this.assembleGroupCols(v)
    };
    // console.log('backValue', this.backValue);
    this.updateValue.emit(this.backValue);
  }
}
