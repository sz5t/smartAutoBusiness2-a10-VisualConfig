import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzFormatEmitEvent, NzTreeComponent, NzTreeNode } from 'ng-zorro-antd/tree';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { SmtComponentBase } from '../../../smt-component.base';
import { IExecuteResult } from '../../../smt-component.interface';
import { SmtTreeDataAdapter } from '../../../smt-tree/smt-tree.adapter';

@Component({
  selector: 'app-smt-form-tree-select',
  templateUrl: './smt-form-tree-select.component.html',
  styles: [],
})
export class SmtFormTreeSelectComponent extends SmtComponentBase implements OnInit {
  @Input() validateForm: FormGroup;
  @Input() config: any;
  @Input() public fromDataService;
  @ViewChild('tree', { static: true }) tree: NzTreeComponent;

  public model: any;
  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) {
    super(componentService);
  }

  private columns: any[];

  public mapOfDataState: {
    [key: string]: {
      disabled: boolean;
      checked: boolean;
      selected: boolean;
      state: string;
      data: any;
      originData: any;
      actions?: any[];
      validation?: boolean;
    };
  } = {};

  public bindObj: {
    nodes: any[];
  };

  private eventObjs: any[];

  private commandObjs: any[];

  public dataSourceObj: any;

  private _initComponent() {
    const dataAdapter = new SmtTreeDataAdapter(this.config);

    this.columns = dataAdapter.setColumns();
    this.bindObj = dataAdapter.setTreeBindObj();
    this.eventObjs = dataAdapter.setEventObjs();
    this.dataSourceObj = dataAdapter.setDataSource();
    this.commandObjs = dataAdapter.setCommandObjs();
  }

  ngOnInit(): void {
    this._initComponent();
  }

  public async load() {
    let response: any;
    let result: IExecuteResult;
    this.IS_LOADING = true;
    try {
      response = await this.executeHttp(this.dataSourceObj.loadingConfig, {}, null);
      if (response && response.state === 1) {
        this.mapOfDataState = {};
        response.data.map((d, index) => {
          // 默认选中第一个节点
          if (index === 0) {
            d.selected = true;
            //  this.ACTIVED_NODE = {};
            //  this.ACTIVED_NODE['origin'] = d;
          }
          this._setTreeNode(d);
        });
        this.bindObj.nodes = response.data;
        this.IS_LOADING = false;
      } else {
        this.IS_LOADING = false;
      }

      result = this.getExecuteResult(response, false);
    } catch {
      result = this.getCatchResult();
    }

    return result;
  }

  public async loadItem() {
    let response;
    let loadedItem = null;
    if (this.dataSourceObj.loadingItemConfig) {
      response = await this.executeHttp(this.dataSourceObj.loadingItemConfig, {}, null);
      if (Array.isArray(response.data)) {
        if (response.data && response.data.length > 0) {
          const data_form = response.data;
          loadedItem = data_form[0];
        } else {
          loadedItem = null;
        }
      } else {
        if (response.data) {
          loadedItem = response.data;
        } else {
          loadedItem = null;
        }
      }
      return loadedItem;
    }
  }

  private _setTreeNode(node) {
    this.mapOfDataState[node[this.KEY_ID]] = {
      disabled: false,
      checked: false, // index === 0 ? true : false,
      selected: false, // index === 0 ? true : false,
      state: 'text',
      data: node,
      originData: { ...node },
      // validation: true,
      // actions: this.getRowActions('text')
    };
    this.columns.map((column) => {
      node[column.type] = node[column.field];
    });

    const dd = this.bindObj.nodes.find((d) => d.isSystem_Add);
    if (dd) {
      if (node.key === dd.key) {
        this.bindObj.nodes = this.bindObj.nodes.filter((d) => !d.isSystem_Add);
      }
    }

    if (node.children && node.children.length > 0) {
      if (!this.config.asyncData) {
        // 静态
        node.children.map((n) => {
          this._setTreeNode(n);
        });
      } else {
        node.children = [];
        node.expanded = false;
      }
      node.isLeaf = false;
    } else {
      node.isLeaf = true;
    }
  }

  public async expandNode($event: NzFormatEmitEvent | NzTreeNode) {
    let node;
    let currentNode;
    if ($event instanceof NzTreeNode) {
      currentNode = $event;
    } else {
      currentNode = $event.node;
    }

    node = this.tree.getTreeNodeByKey(currentNode.key);

    if (!this.config.asyncData) {
      return true;
    }

    if (node && node.isExpanded) {
      const response = await this.executeHttp(this.dataSourceObj.expandConfig, node);
      if (response && response.data && response.data.length > 0) {
        node.clearChildren();
        response.data.map((d) => {
          this._setTreeNode(d);
          // d['isLeaf'] = false;
          //  d['children'] = [];
        });
        node.addChildren(response.data);
      } else {
        node.addChildren([]);
        node.isExpanded = false;
        //node.expanded = false;
      }
    } else if (node.isExpanded === false) {
      node.clearChildren();
    }
  }

  getChidlren(id) {
    let hasFound = false; // 表示是否有找到id值
    let result = null;
    const fn = (data) => {
      if (Array.isArray(data) && !hasFound) {
        // 判断是否是数组并且没有的情况下，
        data.forEach((item) => {
          if (item.key === id) {
            // 数据循环每个子项，并且判断子项下边是否有id值
            result = item; // 返回的结果等于每一项
            hasFound = true; // 并且找到id值
          } else if (item.children) {
            fn(item.children); // 递归调用下边的子项
          }
        });
      }
    };
    fn(this.bindObj.nodes); // 调用一下
    return result;
  }

  public valueChange($event) {}
}
