export interface IFormBindProperties {
  id: any;
  formLayout: any[];
  componentJson: {};
  fields: any[];
}

export class SmtFormDataAdapter {
  constructor(private _config: any) { }

  public setColumns(): any[] {
    if (this._config.columns) {
      return this._config.columns;
    }
  }
  public setWindows(): any[] {
    if (this._config['windows']) {
      return this._config.windows;
    } else {
      return null;
    }
  }

  public setFormBindObj(): IFormBindProperties {
    return {
      id: this._config['id'],
      formLayout: this._config['formLayout'],
      componentJson: this._config['componentJson'],
      fields: this._config['fields']
    };
  }

  public setDataSource(): any {
    let ds: any = {};
    if (this._config.hasOwnProperty('dataSource')) {
      ds = this._config.dataSource
    }
    if (this._config.hasOwnProperty('dataSourceCfg')) {
      ds = this._config.dataSourceCfg
    }
    return {
      async: ds.hasOwnProperty('async') ? ds.async : false,
      loadingOnInit: ds.hasOwnProperty('loadingOnInit') ? ds.loadingOnInit : true,
      loadingConfig: ds['loadingConfig'] ? ds.loadingConfig : null,
      loadingItemConfig: ds['loadingItemConfig'] ? ds.loadingItemConfig : null,
      expandConfig: ds['expandConfig'] ? ds.expandConfig : null,
    };

  }

  public setEventObjs(): any[] {
    if (this._config.componentEvent) {
      return this._config.componentEvent;
    }
    return null;
  }

  public setCommandObjs(): any {
    if (this._config.customCommand) {
      return this._config.customCommand;
    }
    return null;
  }
}
