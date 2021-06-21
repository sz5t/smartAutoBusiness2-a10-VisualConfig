import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { SmtComponentBase } from '../../../smt-component.base';

@Component({
  selector: 'app-smt-form-span',
  templateUrl: './smt-form-span.component.html',
  styles: [],
})
export class SmtFormSpanComponent extends SmtComponentBase implements OnInit {
  @Input() validateForm: FormGroup;
  @Input() config;
  @Input() public fromDataService;
  public showTitle;
  public isShow = true;
  public showAll = false;
  public showLable;
  public showShortLable;
  public model: any;
  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) {
    super(componentService);
  }

  ngOnInit(): void {}

  public initText(v?) {
    if (this.config.formatConfig) {
      const formatConfig = this.config.formatConfig;
      let regularData = v;
      if (formatConfig.type) {
        if (formatConfig.type === 'row') {
          if (this.validateForm.value) {
            regularData = this.validateForm.value[formatConfig.valueName];
          }
        }
      }
      this.showTitle = regularData;
      this.showLable = regularData;
      const regularflag = formatConfig.responseConfig.substrlength ? formatConfig.responseConfig.substrlength : 50;
      if (regularData) {
        if (regularData.length <= regularflag) {
          this.isShow = true;
          return true;
        } else {
          this.isShow = false;
          this.showShortLable = regularData.substring(0, regularflag);
          return true;
        }
      }
    }
  }
  // 展开文本
  public openSapn() {
    this.showAll = !this.showAll;
  }

  // 收缩文本
  public closeSapn() {
    this.showAll = !this.showAll;
  }
}
