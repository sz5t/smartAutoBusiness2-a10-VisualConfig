import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { ParameterResolver } from 'src/app/shared/resolver/parameter/parameter.resolver';
import { CnComponentBase } from '../../../cn-component.base';
import { CnPageComponent } from '../../../cn-page/cn-page.component';

@Component({
  selector: 'app-cn-grid-custom-object',
  templateUrl: './cn-grid-custom-object.component.html',
  styles: [
  ]
})
export class CnGridCustomObjectComponent extends CnComponentBase implements OnInit {

  @Input() public config;
  @Input() public valueConfig;
  @Output() public updateValue = new EventEmitter();
  @Input() public state;
  @Input() public initData;
  @Input() public rowData;
  @Input() public tempData;

  selectedRowItem;
  value = null;
  _value = null;
  tableConfig;
  count = 0;
  _changeValue: any;

  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) {
    super(componentService);
  }

  tags = [];

  async ngOnInit() {
    // 加载页面配置

    if (this.config.layoutName) {
      // 20.11.12
      this.tableConfig = this.getMenuComponentConfigById('PAGE_' + this.config.layoutName);
      // this.tableConfig = this.componentService.cacheService.getNone("PAGE_"+this.config.layoutName);
    }
    if (!this.tableConfig) {
      await this.getCustomConfig(this.config.layoutName);
      // this.tableConfig = this.componentService.cacheService.getNone("PAGE_"+this.config.layoutName);
      this.tableConfig = this.getMenuComponentConfigById('PAGE_' + this.config.layoutName);
    }

    // if(!this.valueConfig){
    //   this.valueConfig ={
    //     id:'001',
    //     value: "9F2D4A2D-5C57-44AA-8F06-B8F5D0B96AAE,93F1C6C9-140D-42A5-9379-FE47EDA2DEEB"
    //   }
    // }

    if (!this.initData) {
      this.initData = {};
    }

    if (this.initData) {
      this.initValue = this.initData;
    } else {
      this.initValue = {};
    }

    if (this.tempData) {
      this.tempValue = { ...this.tempData };
    }

    // 静态数据，动态数据
    let v_value;
    if (this.valueConfig) {
      v_value = this.valueConfig.value;
    }
    if (this.state === 'new') {
      if (this.config.defaultValue) {
        if (!this.value) {
          v_value = this.config.defaultValue;
        }
      }
    }

    this.value = v_value;
    this.valueChange(this.value);
  }





  // 构建参数-》下拉选择自加载数据
  public buildParameters(paramsCfg) {
    return ParameterResolver.resolve({
      params: paramsCfg,
      tempValue: this.tempValue,
      componentValue: { value: this.value }, //  组件值？返回值？级联值，需要三值参数
      selectedRow: this.rowData,
      item: this.rowData,
      initValue: this.initValue,
      cacheValue: this.cacheValue,
      router: this.routerValue,
      cascadeValue: this.cascadeValue,
      userValue: this.userValue,
    });
  }

  /**
   * load 自加载
   */
  public async load() {
    // 【参数不全是否阻止加载！】
    // 对后续业务判断有影响
    //  console.log('===select 自加载====>load');
    const url = this.config.loadingItemConfig.ajaxConfig.url;
    const method = this.config.loadingItemConfig.ajaxConfig.ajaxType;
    const params = {
      ...this.buildParameters(this.config.loadingItemConfig.ajaxConfig.params),
    };
    // 考虑满足 get 对象，集合，存储过程【指定dataset 来接收数据】，加载错误的信息提示

    const response = await this.componentService.apiService.getRequest(url, method, { params }).toPromise();
    console.log('--da---' + this.config.field, response);
    if (Array.isArray(response.data)) {
      if (response.data && response.data.length > 0) {
        const data_form = response.data;
        this.tags = data_form;
      } else {
        this.selectedRowItem = null;
      }
    } else {
      if (response.data) {
        const _data = response.data;
        _data.label = _data[this.config.labelName];
        _data.value = _data[this.config.valueName];
        this.tags = [];
        this.tags.push(_data);
        //  this.selectedRowItem = response.data;
      } else {
        this.selectedRowItem = null;
      }
    }


  }

  /**
   * 弹出自定义选择
   */
  createCustomModal() {
    console.log('createModal', this.initData, this.rowData, this.valueConfig);
    this.initData[this.config.targetValue ? this.config.targetValue : 'tags'] = this.rowData[this.config.field];
    this.componentService.modalService.create({
      nzWidth: this.config.customWidth ? this.config.customWidth : '85%',
      nzBodyStyle: this.config.customBodyStyle ? this.config.customBodyStyle : { overflow: 'auto' },
      nzTitle: this.config.customTitle ? this.config.customTitle : '', // '自定义组件',
      nzMaskClosable: this.config.hasOwnProperty('customMaskClosable') ? this.config.customMaskClosable : false,
      //  nzContent: '可实现树+表等多种组件组合',
      nzContent: CnPageComponent,
      nzComponentParams: {
        config: this.tableConfig,
        customPageId: this.config.layoutName,
        initData: this.initData,
        changeValue: this._changeValue,
      },
      nzClosable: false,
      nzOnOk: (componentInstance) => {
        console.log('OK', componentInstance.SELECTED_VALUE);
        componentInstance.test_get();
        let _componentInstance = 'form_assignPolicy';
        if (this.config['componentInstance']) {
          _componentInstance = this.config['componentInstance'];
        }
        let z = componentInstance.componentDataService.componentInstance[_componentInstance];
        let obj_value = z['instance']['FORM_VALUE'];
        console.log('=表单值：=', obj_value)

        console.log('=================>>>>', this.selectedRowItem);
        this.valueChange(obj_value);
        this.value = obj_value;
      },
    });
  }

  createCustomModalRead() {
    console.log('createModal', this.initData, this.rowData);
    this.initData[this.config.targetValue ? this.config.targetValue : 'tags'] = this.tags;
    this.componentService.modalService.create({
      nzWidth: this.config.customWidth ? this.config.customWidth : '85%',
      nzBodyStyle: this.config.customBodyStyle ? this.config.customBodyStyle : { overflow: 'auto' },
      nzTitle: this.config.customTitle ? this.config.customTitle : '', // '自定义组件',
      nzMaskClosable: this.config.hasOwnProperty('customMaskClosable') ? this.config.customMaskClosable : false,
      //  nzContent: '可实现树+表等多种组件组合',
      nzContent: CnPageComponent,
      nzComponentParams: {
        config: this.tableConfig,
        customPageId: this.config.layoutName,
        initData: this.initData,
        changeValue: this._changeValue,
      },
      nzClosable: false,
      nzOnOk: (componentInstance) => {
        console.log('OK', componentInstance.SELECTED_VALUE);
      },
    });
  }

  /**
   * 值变化
   * @param v
   */
  public async valueChange(v?) {
    console.log('自定义页面-》 值变化', v);
    // v="6IkDKuH1iXCnC5xiszniEVbbUWnOLRKm";

    //  this.table.selectedRowValue = v;  !!反向写值
    const backValue = { id: this.valueConfig.id, name: this.config.field, value: v, count: this.count, dataItem: this.selectedRowItem };
    this.updateValue.emit(backValue);
    this.count += 1;
    console.log('自定义页面backValue=>', backValue);
  }

  public cascadeAnalysis(c?) {
    if (c && c.hasOwnProperty(this.config.field)) {
      if (c[this.config.field].hasOwnProperty('cascadeValue')) {
        this.cascadeValue = c[this.config.field].cascadeValue;
      }

      if (c[this.config.field].hasOwnProperty('exec')) {
        if (c[this.config.field].exec === 'ajax') {
          // this.load();
        }
      }
      if (c[this.config.field].hasOwnProperty('exec')) {
        if (c[this.config.field].exec === 'setValue') {
          this.value = c[this.config.field].setValue.value;
        }
        if (c[this.config.field].exec === 'changeValue') {
          this.buildChangeValue(this.config);
        }
      }
    }
  }

  public buildChangeValue(option: any) {
    if (option.changeValue) {
      const d = ParameterResolver.resolve({
        params: option.changeValue.params,
        tempValue: this.tempValue,
        componentValue: this.rowData, // 当前行
        item: this.selectedRowItem,
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

    this._changeValue = option.changeValue ? option.changeValue.params : [];
    console.log('===*****************===', option);
  }
}
