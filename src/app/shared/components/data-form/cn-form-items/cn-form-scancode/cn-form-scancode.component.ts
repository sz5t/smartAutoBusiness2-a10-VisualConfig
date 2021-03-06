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
    console.log('input εΌεε', v, this.selectedRowItem);
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

  // ζε»Ίεζ°-γδΈζιζ©θͺε θ½½ζ°ζ?
  public buildParameters(paramsCfg) {
    return ParameterResolver.resolve({
      params: paramsCfg,
      tempValue: this.tempValue,
      componentValue: { value: this.value }, //  η»δ»ΆεΌοΌθΏεεΌοΌηΊ§θεΌοΌιθ¦δΈεΌεζ°
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
      //  ζ«η ε θ§¦εθΏε
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
      //  ζ«η ε θ§¦εθΏε
      //  this.valueChange(this.value, result.data);
      this.valueChange(this.value);
    }
  }

  // ζ«η εζ°ζ?ε θ½½  ε―ιη½?οΌε½εζ«η ζ―ε¦ε θ½½ζ°ζ?οΌεη»­ζδ½εη±θΏεθ§¦εηΊ§θζ§θ‘
  public async load() {
    // γεζ°δΈε¨ζ―ε¦ι»ζ­’ε θ½½οΌγ
    // ε―Ήεη»­δΈε‘ε€ζ­ζε½±ε
    //  console.log('===select θͺε θ½½====>load');
    if (!this.config.loadingItemConfig.ajaxConfig) {
      return false;
    }
    const url = this.config.loadingItemConfig.ajaxConfig.url;
    const method = this.config.loadingItemConfig.ajaxConfig.ajaxType;
    const params = {
      ...this.buildParameters(this.config.loadingItemConfig.ajaxConfig.params),
    };
    // θθζ»‘θΆ³ get ε―Ήθ±‘οΌιεοΌε­ε¨θΏη¨γζε?dataset ζ₯ζ₯ζΆζ°ζ?γοΌε θ½½ιθ――ηδΏ‘ζ―ζη€Ί

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
