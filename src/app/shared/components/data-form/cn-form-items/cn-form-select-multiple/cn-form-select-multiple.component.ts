import { Component, OnInit, Input, Output, EventEmitter, Inject, AfterViewInit } from '@angular/core';
import { CnComponentBase } from '../../../cn-component.base';
import { FormGroup } from '@angular/forms';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { ParameterResolver } from 'src/app/shared/resolver/parameter/parameter.resolver';

@Component({
  selector: 'app-cn-form-select-multiple',
  templateUrl: './cn-form-select-multiple.component.html',
  styleUrls: ['./cn-form-select-multiple.component.less']
})
export class CnFormSelectMultipleComponent extends CnComponentBase implements OnInit, AfterViewInit {
  @Input() public config;
  @Input() formGroup: FormGroup;
  @Input() tempData;
  @Input() initData;
  @Output() public updateValue = new EventEmitter();
  public selectedValue;
  public selectOptions = [];
  public selectItems = [];
  public cascadeOptions: any;
  public myControl;
  public value;
  constructor(@Inject(BSN_COMPONENT_SERVICES)
  public componentService: ComponentServiceProvider) {
    super(componentService);
    this.tempValue = {};
    this.initValue = {};
  }


  listOfSelectedValue = [];

  ngOnInit(): void {
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

  }

  ngAfterViewInit() {
    // console.log('ngAfterViewInit ==>' , this.config.field);
    if (this.config.loadingConfig) {
      // this.load();
    } else {
      if (this.config.options) {
        setTimeout(() => {
          this.selectOptions = this.config.options;
        });
        this.selectItems = this.config.options;
      }
    }
  }
  /**
   * 值变化
   * @param v 
   */
  public async valueChange(v?) {
    console.log('多选值变化model', v);
    const backValue: any = { name: this.config.field, value: v, id: this.config.config.id };
    if (this.selectItems.length < 1) {
      if (this.config.loadingConfig) {
        await this.load();
      }
    }
    const index = this.selectItems.findIndex(item => item[this.config.valueName] === v);
    const myControl = this.formGroup.get(this.config.field);
    if (index > -1) {
      backValue.dataItem = this.selectItems[index];
    } else {
      //  if(v)
      // myControl.setValue(null, { emitEvent: true });
    }
    if (v) {
      this.listOfSelectedValue = v.split(',');
    } else {
      this.listOfSelectedValue = [];
    }

    console.log('selectMuilt 值变化', v, this.config.field, this.selectItems);
    this.updateValue.emit(backValue);
  }

  /**
   * 多选值变化
   * @param v 
   */
  public valueChangeSelect(v?) {
    console.log('多选值变化select', v);
    const newValue = v.join(',');
    if (this.value !== newValue) {
      this.value = newValue;
    }

  }

  /**
   * 级联分析
   * @param c 
   */
  public cascadeAnalysis(c?) {

    // 分类完善信息，此处完善的信息为 异步参数处理
    // cascadeValue
    if (c.hasOwnProperty(this.config.field)) {
      if (c[this.config.field].hasOwnProperty('cascadeValue')) {
        this.cascadeValue = c[this.config.field].cascadeValue;
      }
      if (c[this.config.field].hasOwnProperty('cascadeOptions')) {
        this.cascadeOptions = c[this.config.field].cascadeOptions;
      }
      if (c[this.config.field].hasOwnProperty('exec')) {
        if (c[this.config.field].exec === 'ajax') {
          this.load();
        }
      }
      if (c[this.config.field].hasOwnProperty('exec')) {
        if (c[this.config.field].exec === 'setOptions') {
          this.selectItems = this.cascadeOptions;
          const newOptions = [];
          // 下拉选项赋值
          this.cascadeOptions.forEach(element => {
            newOptions.push({ label: element[this.config.labelName], value: element[this.config.valueName] });
          });
          setTimeout(() => {
            this.selectOptions = newOptions;
          });
        }
      }

    }
    console.log('级联具体小组件接受=》', c);
  }


  // 构建参数-》下拉选择自加载数据
  public buildParameters(paramsCfg) {
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

  /**
   * load 自加载
   */
  public async load() {
    // 【参数不全是否阻止加载！】
    // 对后续业务判断有影响
    //  console.log('===select 自加载====>load');
    const url = this.config.loadingConfig.ajaxConfig.url;
    const method = this.config.loadingConfig.ajaxConfig.ajaxType;
    const params = {
      ...this.buildParameters(this.config.loadingConfig.ajaxConfig.params)
    };
    // 考虑满足 get 对象，集合，存储过程【指定dataset 来接收数据】，加载错误的信息提示
    const response = await this.componentService.apiService[method](url, params).toPromise();
    // const response = await this.componentService.apiService.getRequest(url, method, { params }).toPromise();
    console.log('--da---' + this.config.field, response);
    if (response.data && response.data.length > 0) {
      const data_form = response.data;
      this.selectItems = data_form;
      const newOptions = [];
      // 下拉选项赋值
      data_form.forEach(element => {
        newOptions.push({ label: element[this.config.labelName], value: element[this.config.valueName] });
      });
      setTimeout(() => {
        this.selectOptions = newOptions;
      });

      //   console.log('下拉选择的最终数据集===》', this.selectOptions);
      // for (const item in this.formValue) {
      //   if (data_form.hasOwnProperty(item)) {
      //     this.formValue[item] = data_form[item];
      //   }
      // }

    }
    else {
      if (response.data.hasOwnProperty('_procedure_resultset_1')) {
        const data_form = response.data['_procedure_resultset_1'];
        this.selectItems = data_form;
        const newOptions = [];
        // 下拉选项赋值
        data_form.forEach(element => {
          newOptions.push({ label: element[this.config.labelName], value: element[this.config.valueName] });
        });
        setTimeout(() => {
          this.selectOptions = newOptions;
        });
      }
      this.selectItems = [];
      this.selectOptions = [];
    }
    // this.componentService.apiService.getRequest(url, method, { params }).subscribe(response => {
    //   if (response.data && response.data.length > 0) {
    //     const data_form = response.data;
    //     this.selectItems = data_form;
    //     const newOptions = [];
    //     // 下拉选项赋值
    //     data_form.forEach(element => {
    //       newOptions.push({ label: element[this.config.labelName], value: element[this.config.valueName] });
    //     });
    //     this.selectOptions = newOptions;
    //  //   console.log('下拉选择的最终数据集===》', this.selectOptions);
    //     // for (const item in this.formValue) {
    //     //   if (data_form.hasOwnProperty(item)) {
    //     //     this.formValue[item] = data_form[item];
    //     //   }
    //     // }

    //   }
    //   else{
    //     this.selectItems = [];
    //     this.selectOptions  =[];
    //   }


    // }, error => {
    //   console.log(error);
    // });


  }


}
