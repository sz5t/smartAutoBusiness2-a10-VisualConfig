import { Component, Input, OnInit, EventEmitter, Output, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';
import { VcComponentBase } from 'src/app/shared/vc-components/vc-component';

@Component({
  selector: 'app-cn-static-form-select',
  templateUrl: './cn-static-form-select.component.html',
  styles: [
  ]
})
export class CnStaticFormSelectComponent extends VcComponentBase implements OnInit {
  @Input() validateForm: FormGroup;
  @Input() config;
  @Input() public fromDataService;
  @Output() public updateValue = new EventEmitter<any>(true);
  @Output() public cascadeValue = new EventEmitter<any>(true);
  selectValue: any;
  selectOptions: any[];
  itemConfig: any = {
    hiddenTitle: false,
    "labelSize": {
      "span": 8,
      "nzXs": {
        "span": 8,
        "offset": 0
      },
      "nzSm": {
        "span": 8,
        "offset": 0
      },
      "nzMd": {
        "span": 8,
        "offset": 0
      },
      "nzLg": {
        "span": 8,
        "offset": 0
      },
      "ngXl": {
        "span": 8,
        "offset": 0
      },
      "nzXXl": {
        "span": 8,
        "offset": 0
      }
    },
    "controlSize": {
      "span": 16,
      "nzXs": 16,
      "nzSm": 16,
      "nzMd": 16,
      "nzLg": 16,
      "ngXl": 16,
      "nzXXl": 16
    }
  };
  constructor(@Inject(BSN_COMPONENT_SERVICES)
  public componentService: ComponentServiceProvider,) {
    super(componentService);
  }

  ngOnInit(): void {
    console.log('select:', this.config);


    if (this.fromDataService) {
      if (this.fromDataService.hasOwnProperty('initValue')) {
        this.initValue = this.fromDataService['initValue'];
      }
    }




    if (this.config['componentConfig']) {
      let loadingMode = "";
      if (this.config['componentConfig'].hasOwnProperty('loadingMode')) {
        loadingMode = this.config['componentConfig']['loadingMode'];
      }
      switch (loadingMode) {
        case "ajax":
          this.load();
          break;
        default:
          this.selectOptions = this.config['componentConfig']['options'];
          break;
      }

      if (!this.config.componentConfig['labelSize']) {
        this.config.componentConfig['labelSize'] = this.itemConfig['labelSize'];
      }
      if (!this.config.componentConfig['controlSize']) {
        this.config.componentConfig['controlSize'] = this.itemConfig['controlSize'];
      }
    }

    if (this.validateForm.controls[this.config['name']]) {
      let d = this.validateForm.controls[this.config['name']].value;
      if (this.config['componentConfig']['casadeValue']) {
        this.text(d);
      }
    }


  }

  log(v?) {
    this.selectValue = v;
    if (this.config['componentConfig']['casadeValue']) {
      this.text(v);
    }
    console.log('选择中：', v);
  }

  public text(v) {

    let back = { name: this.config.name, data: v, cascadeValueObj: this.config['componentConfig']['casadeValue'] }

    this.cascadeValue.emit(back);

  }


  public async load() {
    // 【参数不全是否阻止加载！】
    // 对后续业务判断有影响
    console.log('===select 自加载====>load');

    let response: any;
    if (this.config['componentConfig'].ajaxConfig['enableAjaxMore']) {
      response = await this.executeHttpMore(this.config['componentConfig'].ajaxConfig, {}, 'buildParameters', null);
    } else {
      const url = this.config['componentConfig'].ajaxConfig.url;
      const method = this.config['componentConfig'].ajaxConfig.ajaxType;
      const params = {
        ...this.buildParameters(this.config['componentConfig'].ajaxConfig.params)
      };
      // 考虑满足 get 对象，集合，存储过程【指定dataset 来接收数据】，加载错误的信息提示
      response = await this.componentService.apiService.getRequest(url, method, { params }).toPromise();
    }

    if (response.data && response.data.length > 0) {
      const data_form = response.data;
      const newOptions = [];
      // 下拉选项赋值
      data_form.forEach(element => {
        newOptions.push({ label: element[this.config['componentConfig'].labelName], value: element[this.config['componentConfig'].valueName] });
      });
      this.selectOptions = newOptions;
      this.selectOptions = this.selectOptions.filter(d => d.lable !== null);
      console.log('下拉选择的最终数据集===》', this.selectOptions);

    }
    else {
      this.selectOptions = [];
    }
  }


}
