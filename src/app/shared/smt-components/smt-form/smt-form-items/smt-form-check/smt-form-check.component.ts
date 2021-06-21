import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { SmtComponentBase } from '../../../smt-component.base';

@Component({
  selector: 'app-smt-form-check',
  templateUrl: './smt-form-check.component.html',
  styles: [],
})
export class SmtFormCheckComponent extends SmtComponentBase implements OnInit {
  @Input() validateForm: FormGroup;
  @Input() config;
  @Input() public fromDataService;
  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) {
    super(componentService);
  }

  public bindObj: {
    options: { value: any; label: string }[];
    valueName: string;
    labelName: string;
  };

  ngOnInit(): void {
    this.dataSourceCfg = this.setDataSourceCfg(this.config);
    this._setBindObj(this.config);
    this._initData(this.config);
  }

  private _initData(config: any) {
    if (this.dataSourceCfg.loadingConfig) {
      this.load();
    }
    if (config.options) {
      setTimeout(() => {
        this.bindObj.options = config.options;
      });
    }
  }

  public async load() {
    const response: any = await this.executeHttp(this.dataSourceCfg.loadingConfig, {}, null);
    this.bindObj.options = [];
    if (response && response.state === 1) {
      const data = response.data;
      data.forEach((element) => {
        const item = { label: element[this.bindObj.labelName], value: element[this.bindObj.valueName] };
        if (item) {
          this.bindObj.options.push(item);
        }
      });
    }
  }

  private _setBindObj(config: any) {
    this.bindObj = {
      options: [],
      valueName: this.config.valueName,
      labelName: this.config.labelName,
    };
  }

  public onChange(value: string[]) {
    this.validateForm.controls[this.config.field].setValue(value);
  }
}
