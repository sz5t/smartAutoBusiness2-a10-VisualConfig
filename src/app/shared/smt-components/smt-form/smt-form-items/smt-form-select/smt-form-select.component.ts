import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { SmtCommandResolver } from 'src/app/shared/resolver/smt-command/smt-command.resovel';
import { SmtComponentBase } from '../../../smt-component.base';

@Component({
  selector: 'app-smt-form-select',
  templateUrl: './smt-form-select.component.html',
  styles: [],
})
export class SmtFormSelectComponent extends SmtComponentBase implements OnInit {
  @Input() validateForm: FormGroup;
  @Input() config;
  @Input() public fromDataService;
  public model: any;
  searchChange$ = new BehaviorSubject('');
  public bindObj: {
    options: { value: any; label: string }[];
    valueName: string;
    labelName: string;
    serverSearch: boolean;
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
      serverSearch: this.config.serverSearch ? this.config.serverSearch : false,
    };
  }

  public onSearch(searchValue: string) {
    if (this.config['serverSearch']) {
      const url = this.dataSourceCfg.loadingConfig.ajaxConfig.url;
      const method = this.dataSourceCfg.loadingConfig.ajaxConfig.ajaxType;
      const params = {
        ...this.buildParameters(this.dataSourceCfg.loadingConfig.ajaxConfig.params, searchValue),
      };
      this.IS_LOADING = true;

      const response = () =>
        this.componentService.apiService
          .getRequest(url, method, { params })
          .pipe(map((res: any) => (res.data ? res.data : [])))
          .pipe(
            map((list: any) => {
              return list.map((item: any) => {
                console.log(item);
                return { label: item[this.bindObj.labelName], value: item[this.bindObj.valueName] };
              });
            }),
          );

      const optionList$: Observable<[{ label: string; value: any }]> = this.searchChange$
        .asObservable()
        .pipe(debounceTime(500))
        .pipe(switchMap(response));
      optionList$.subscribe((data) => {
        this.bindObj.options = data;
        this.IS_LOADING = false;
      });
    } else {
    }
  }
}
