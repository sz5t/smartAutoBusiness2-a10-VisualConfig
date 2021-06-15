import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { SmtComponentBase } from '../smt-component.base';

@Component({
  selector: 'smt-tree',
  templateUrl: './smt-tree.component.html',
  styles: [],
})
export class SmtTreeComponent extends SmtComponentBase implements OnInit {
  @Input()
  public config: any;
  @Input()
  public initData: any;
  @Input()
  public tempData: any;
  @ViewChild('treeObj', { static: true })
  public treeComponentObj: NzTreeComponent;

  public treeBindObj: {
    loadingOnInit: boolean;
    nodes: any[];
  };

  public mapOfDataState;

  public ACTIVED_NODE: any;

  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) {
    super(componentService);
    this.TEMP_VALUE = {};
    this.INIT_VALUE = {};
  }

  private _initComponent(config: any) {
    this.KEY_ID = this.config.keyId ? this.config.keyId : 'ID';
    if (this.tempData) {
      this.TEMP_VALUE = this.tempData;
    }
    if (this.initData) {
      this.INIT_VALUE = this.initData;
    }

    this.treeBindObj = this.setTreeBindObj(this.config);
    this._buildIconState(this.treeBindObj, this.config);
    this.setTreeBindObj(this.config);
  }

  private setTreeBindObj(config: any): any {
    return {};
  }

  ngOnInit(): void {
    this._initComponent(this.config);

    this._resolveRelations();

    this.treeBindObj.loadingOnInit && this.load();
  }

  public async load() {
    this.IS_LOADING = true;
    this.treeBindObj.nodes = [];
    const response = await this.executeHttp(this.dataSourceCfg.loadingConfig, {}, '');
    if ((response && response.state === 1, response.data)) {
      response.data.map((item, index): void => {
        if (index === 0) {
          this.ACTIVED_NODE = {};
          this.ACTIVED_NODE['origin'] = item;
        }
        this._setTreeNode(item);
      });

      this.treeBindObj.nodes = response.data;
      this.IS_LOADING = false;
    } else {
      this.IS_LOADING = false;
    }
    if (this.treeBindObj.nodes.length <= 0) {
      this.emptyLoad();
    }
  }

  emptyLoad() {
    throw new Error('Method not implemented.');
  }

  private _setTreeNode(item: any) {
    throw new Error('Method not implemented.');
  }

  private _resolveRelations() {
    throw new Error('Method not implemented.');
  }

  private _buildIconState(tbo: any, config: any) {
    if (tbo.iconState) {
      tbo.leftIconState = config.iconState.filter((item: any) => item.position === 'left');
      tbo.rightIconState = config.iconState.filter((item: any) => item.position === 'right');
    }
  }

  public reSelectNode(option?: any) {
    if (option) {
      const _node = this.treeComponentObj.getTreeNodeByKey(option[this.KEY_ID]);
      const _cNode = {
        eventName: 'click',
        node: _node,
      };
      this.clickNode(_cNode);
    }
  }

  clickNode(_cNode: any) {
    throw new Error('Method not implemented.');
  }
}
