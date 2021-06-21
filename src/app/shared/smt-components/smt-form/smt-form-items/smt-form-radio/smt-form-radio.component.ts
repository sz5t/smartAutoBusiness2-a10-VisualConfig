import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { SmtComponentBase } from '../../../smt-component.base';

@Component({
  selector: 'app-smt-form-radio',
  templateUrl: './smt-form-radio.component.html',
  styles: [],
})
export class SmtFormRadioComponent extends SmtComponentBase implements OnInit {
  @Input() validateForm: FormGroup;
  @Input() config;
  @Input() public fromDataService;
  public model: any;

  public bindObj: {
    options: { value: any; label: string }[];
    valueName: string;
    labelName: string;
  };
  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) {
    super(componentService);
  }

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
}
