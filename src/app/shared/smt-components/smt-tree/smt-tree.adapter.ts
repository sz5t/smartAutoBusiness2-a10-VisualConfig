export interface ITreeBindProperties {
  checkStrictly: boolean;
  checkStrictlyShow: boolean;
  nodeSelectionConfig: any[];
  nodes: any[];
  isAllChecked: boolean;
  indeterminate: boolean;
  checkedNumber: number;
  showSearch: boolean;
  searchValue: any;
  expandAll: boolean;
  showCheckBox: boolean;
  showLine: boolean;
  defaultSelectedKeys: string[];
  enableState: boolean;
  iconState: any[];
  leftIconState: any;
  rightIconState: any;
  descField: string;
}

export class SmtTreeDataAdapter {
  constructor(private _config: any) { }

  public setColumns(): any[] {
    if (this._config.columns) {
      return this._config.columns;
    }
  }

  public setTreeBindObj(): ITreeBindProperties {
    return {
      checkStrictlyShow: this._config.checkStrictlyShow ? this._config.checkStrictlyShow : false,
      checkStrictly: this._config.checkStrictly ? this._config.checkStrictly : false,
      nodeSelectionConfig: this._config.nodeSelectionConfig ? this._config.nodeSelectionConfig : [],
      nodes: [],
      isAllChecked: this._config.isAllChecked ? this._config.isAllChecked : false,
      indeterminate: false,
      checkedNumber: 0,
      showSearch: this._config.showSearch ? this._config.showSearch : false,
      searchValue: '',
      expandAll: this._config.expandAll ? this._config.expandAll : true,
      showCheckBox: this._config.showCheckBox ? this._config.showCheckBox : false,
      showLine: this._config.showLine ? this._config.showLine : false,
      defaultSelectedKeys: [],
      enableState: this._config.enableState ? this._config.enableState : false,
      iconState: this._config.iconState ? this._config.iconState : [],
      leftIconState: [],
      rightIconState: [],
      descField: this._config.descFile ? this._config.descField : null,
    };
  }

  public setDataSource(): any {
    if (this._config.dataSource) {
      const ds = this._config.dataSource;
      return {
        async: ds.hasOwnProperty('async') ? ds.async : false,
        loadingOnInit: ds.hasOwnProperty('loadingOnInit') ? ds.loadingOnInit : true,
        loadingConfig: ds.loadingConfig ? ds.loadingConfig : null,
        loadingItemConfig: ds.loadingItemConfig ? ds.loadingItemConfig : null,
        expandConfig: ds.expandConfig ? ds.expandConfig : null,
      };
    }
    return null;
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
