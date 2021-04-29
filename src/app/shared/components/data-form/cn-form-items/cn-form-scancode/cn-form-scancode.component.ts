import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CnComponentBase } from '../../../cn-component.base';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { ParameterResolver } from 'src/app/shared/resolver/parameter/parameter.resolver';

@Component({
  selector: 'app-cn-form-scancode,[cn-form-scancode]',
  templateUrl: './cn-form-scancode.component.html',
  styleUrls: ['./cn-form-scancode.component.less'],
})
export class CnFormScancodeComponent extends CnComponentBase implements OnInit {
  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) {
    super(componentService);
  }

  @Input() public config;
  @Input() formGroup: FormGroup;
  @Input() public initData;
  @Input() public tempData;
  @Output() public updateValue = new EventEmitter();
  value = null;
  selectedRowItem;

  isScan = true;
  oldvalue = null;
  ngOnInit() {
    // console.log('input=>:', this.config,this.formGroup);
  }

  /**
   * valueChange
   */
  public valueChange(v?) {
    console.log('input 值变化', v, this.selectedRowItem);
    // tslint:disable-next-line:forin
    for (const key in this.formGroup.controls) {
      if (this.config.field === key) {
        this.formGroup.controls[key].markAsPristine();
        this.formGroup.controls[key].updateValueAndValidity();
      }
    }
    const backValue = { name: this.config.field, value: v, id: this.config.config.id, dataItem: this.selectedRowItem };
    this.updateValue.emit(backValue);
  }
  public cascadeAnalysis(c?) {
    if (c.hasOwnProperty(this.config.field)) {
      if (c[this.config.field].hasOwnProperty('cascadeValue')) {
        this.cascadeValue = c[this.config.field].cascadeValue;
      }
      if (c[this.config.field].hasOwnProperty('exec')) {
        if (c[this.config.field].exec === 'ajax') {
          this.load();
        }
      }
    }
  }

  // 构建参数-》下拉选择自加载数据
  public buildParameters(paramsCfg) {
    return ParameterResolver.resolve({
      params: paramsCfg,
      tempValue: this.tempValue,
      componentValue: { value: this.value }, //  组件值？返回值？级联值，需要三值参数
      initValue: this.initValue,
      cacheValue: this.cacheValue,
      router: this.routerValue,
      cascadeValue: this.cascadeValue,
      userValue: this.userValue,
    });
  }
  public async onKeyPress(e) {
    if (e.code === 'Enter') {
      this.isScan = false;
      this.oldvalue = this.value;
      const result = await this.load();
      //  扫码后 触发返回
      //  this.valueChange(this.value, result.data);
      this.valueChange(this.value);
      e.stopPropagation();
    } else {
      if (e.code === 'ArrowDown') {
      } else {
        if (!this.isScan) {
          const newvalue = this.value;
          if (this.oldvalue) {
            this.value = newvalue.substring(this.oldvalue.length ? this.oldvalue.length : 0);
          }
          this.isScan = true;
        }
      }
    }
  }
  groupClick(e) {
    //  console.log('group_click');
    e.stopPropagation();
    // e.preventDefault();
  }
  public async scanCodeClick(e?) {
    console.log('scanCodeClick', e);
    if (e.code === 'Enter') {
    } else {
      console.log(this.value);
      this.oldvalue = this.value;
      const result = await this.load();
      //  扫码后 触发返回
      //  this.valueChange(this.value, result.data);
      this.valueChange(this.value);
    }
  }

  // 扫码后数据加载  可配置，当前扫码是否加载数据，后续操作均由返回触发级联执行
  public async load() {
    // 【参数不全是否阻止加载！】
    // 对后续业务判断有影响
    //  console.log('===select 自加载====>load');
    if (!this.config.loadingItemConfig.ajaxConfig) {
      return false;
    }
    const url = this.config.loadingItemConfig.ajaxConfig.url;
    const method = this.config.loadingItemConfig.ajaxConfig.ajaxType;
    const params = {
      ...this.buildParameters(this.config.loadingItemConfig.ajaxConfig.params),
    };
    // 考虑满足 get 对象，集合，存储过程【指定dataset 来接收数据】，加载错误的信息提示

    const response = await this.componentService.apiService.getRequest(url, method, { params }).toPromise();
    console.log('--da---' + this.config.field, response);
    let _selectedRowItem;
    if (Array.isArray(response.data)) {
      if (response.data && response.data.length > 0) {
        const data_form = response.data;
        _selectedRowItem = data_form[0];
      } else {
        _selectedRowItem = null;
      }
    } else {
      if (response.data) {
        const _data = response.data;
        _selectedRowItem = _data;
      } else {
        _selectedRowItem = null;
      }
    }

    if (this.config.columns && this.config.columns.length > 0) {
      const _new_selectedRowItem = {};
      this.config.columns.map((column) => {
        if (_selectedRowItem && _selectedRowItem.hasOwnProperty(column.field)) {
          _new_selectedRowItem[column.type] = _selectedRowItem[column.field];
        }
      });
      this.selectedRowItem = _new_selectedRowItem;
    } else {
      this.selectedRowItem = _selectedRowItem;
    }
  }
}
