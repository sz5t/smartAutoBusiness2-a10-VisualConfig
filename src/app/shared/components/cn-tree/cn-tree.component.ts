import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, OnDestroy, Inject, Input, Output, ViewChild, EventEmitter } from '@angular/core';

import { NzTreeComponent, NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd/tree';
import { Subject, Subscription } from 'rxjs';
import { CN_TREE_METHOD } from 'src/app/core/relations/bsn-methods/bsn-tree-methods';
import { CN_TREE_PROPERTY } from 'src/app/core/relations/bsn-property/tree.property.interface';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider, DataServerService } from 'src/app/core/services/components/component.service';
import { CommonUtils } from 'src/app/core/utils/common-utils';
import { ButtonOperationResolver } from '../../resolver/buttonOperation/buttonOperation.resolver';
import { ParameterResolver } from '../../resolver/parameter/parameter.resolver';
import { RelationResolver } from '../../resolver/relation/relation.resolver';
import { CnComponentBase } from '../cn-component.base';
import { CnPageComponent } from '../cn-page/cn-page.component';
import { CnDataFormComponent } from '../data-form/cn-data-form.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cn-tree,[cn-tree]',
  templateUrl: './cn-tree.component.html',
  styleUrls: [`cn-tree.component.less`],
})
export class CnTreeComponent extends CnComponentBase implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) {
    super(componentService);
    this.cacheValue = this.componentService.cacheService;
    this.tempValue = {};
    this.initValue = {};
    // init cacheValue
  }
  // ITreeProperty
  @Input()
  public config; // dataTables 的配置参数
  @Input()
  public permissions = [];
  @Input()
  public nodes = [];
  @Input() initData;
  @Input() tempData;
  @Input() dataServe: DataServerService;
  @Output() public updateValue = new EventEmitter();

  @ViewChild('treeObj', { static: true })
  public treeObj: NzTreeComponent;
  /**
   * 组件名称
   * 所有组件实现此属性
   */
  public COMPONENT_NAME = 'CnTree';
  /**
   * 组件操作对外名称
   * 所有组件实现此属性
   */
  public COMPONENT_METHODS = CN_TREE_METHOD;

  public COMPONENT_PROPERTY = CN_TREE_PROPERTY;

  public tableColumns = [];

  public spanCount = 0;

  public isLoading = false;
  public loading = false;
  public pageIndex = 1;
  public pageSize = 10;
  public total = 0;
  public focusIds;

  public isAllChecked = false;
  public indeterminate = false;
  // public mapOfCheckedId: { [key: string]: boolean } = {};
  // public mapOfSelectedId: { [key: string]: boolean } = {};
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
  public checkedNumber = 0;

  public KEY_ID: string;

  public _sortName;
  public _sortValue;

  public NODES_ADDED: any[] = [];
  public NODES_EDITED: any[] = [];
  public NODE_SELECTED: any;
  public NODES_CHECKED: any[] = [];
  public COMPONENT_VALUE: any[] = [];
  public ACTIVED_NODE: any;
  public leftIconState: any[] = [];
  public rightIconState: any[] = [];

  private _columnFilterList;

  private _sender_source$: Subject<any>;
  private _receiver_source$: Subject<any>;
  private _trigger_source$: Subject<any>;

  private _receiver_subscription$: Subscription;
  private _sender_subscription$: Subscription;
  private _trigger_receiver_subscription$: Subscription;

  // 前置条件集合
  public beforeOperation;
  searchValue = '';
  defaultSelectedKeys = [];
  windowDialog;

  private _initInnerValue() {
    if (this.tempData) {
      this.tempValue = this.tempData;
    } else {
      this.tempValue = {};
    }
    if (this.initData) {
      this.initValue = this.initData;
    } else {
      this.initValue = {};
    }
  }

  public async ngOnInit() {
    this._initInnerValue();
    this.buildIconState();
    // 设置数据操作主键
    this.KEY_ID = this.config.keyId ? this.config.keyId : 'ID';

    if (!this.config.hasOwnProperty('checkStrictly')) {
      this.config.checkStrictly = false;
    }

    // 初始化默认分页大小

    // 构建表格列及列标题
    // this._buildColumns(this.config.columns);

    // 解析及联配置
    this.resolveRelations();

    // 是否需要进行初始化数据加载
    if (this.config.loadingOnInit) {
      await this.load();
    }
  }

  public reSelectNode(option?) {
    if (option) {
      const cNode = this.treeObj.getTreeNodeByKey(option[this.KEY_ID]);
      const clickNode = {
        eventName: 'click',
        node: cNode,
      };
      this.clickNode(clickNode);
    }
    return true;
  }

  public buildIconState() {
    if (this.config.enableState && this.config.iconState) {
      this.leftIconState = this.config.iconState.filter((item) => item.position === 'left');
      this.rightIconState = this.config.iconState.filter((item) => item.position === 'right');
    }
  }

  public getSeletedkeys(_con?, _nodelist?, _hierarchy?) {
    console.log('计算选中节点', _con, _nodelist);
    let back_key;
    if (!_con) {
      return back_key;
    }

    if (_nodelist.length >= _con.index) {
      const new__nodelist = _nodelist[_con.index];
      if (_con.isLeaf) {
        back_key = new__nodelist.key;
      } else {
        back_key = this.getSeletedkeys(_con.locationContent, new__nodelist.children);
      }
    }
    return back_key;
  }

  public ngAfterViewInit() {}

  public ngOnDestroy() {
    // 释放级联对象
    this.unsubscribeRelation();
    // 释放及联接受对象
    if (this._receiver_subscription$) {
      this._receiver_subscription$.unsubscribe();
    }

    if (this._sender_subscription$) {
      this._sender_subscription$.unsubscribe();
    }

    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }

    // 释放触发器对象
    if (this._trigger_source$) {
      this._trigger_source$.unsubscribe();
    }
  }

  /**
   * 解析级联消息
   */
  private resolveRelations() {
    if (this.config.cascade && this.config.cascade.messageSender) {
      if (!this._sender_source$) {
        // 解析组件发送消息配置,并注册消息发送对象
        this._sender_source$ = new RelationResolver(this).resolveSender(this.config);
        this._sender_subscription$ = this._sender_source$.subscribe();
      }
    }
    if (this.config.cascade && this.config.cascade.messageReceiver) {
      // 解析消息接受配置,并注册消息接收对象
      // this._receiver_source$ = new RelationResolver(this).resolveReceiver(this.config);
      // this._receiver_subscription$ = this._receiver_source$.subscribe();
      new RelationResolver(this).resolveReceiver(this.config);
    }

    if (!this._trigger_source$) {
      this._trigger_source$ = new RelationResolver(this).resolve();
      // this._trigger_receiver_subscription$ = this._trigger_source$.subscribe();
    }
  }

  public async load() {
    this.isLoading = true;
    this.nodes = [];
    let response: any;
    if (this.config.loadingConfig['enableAjaxMore']) {
      response = await this.executeHttpMore(this.config.loadingConfig, {}, 'buildParameters', null);
    } else {
      response = await this._getAsyncTreeData(this.config.loadingConfig);
    }
    if (response && response.data) {
      response.data.map((d, index) => {
        // 默认选中第一个节点
        if (index === 0) {
          // d.selected = true;
          this.ACTIVED_NODE = {};
          this.ACTIVED_NODE.origin = d;
        }
        this._setTreeNode(d);
      });
      this.nodes = response.data;
      this.isLoading = false;
    } else {
      this.isLoading = false;
    }
    if (this.nodes.length <= 0) {
      this.emptyLoad();
    }

    if (!this.config.isSelected && this.config.defaultSelectedKeys) {
      this.defaultSelectedKeys = [];
      this.defaultSelectedKeys.push(this.config.defaultSelectedKeys);
      this.defaultSelectedKeys = this.defaultSelectedKeys.filter((r) => r !== '');
    }
    if (!this.config.isSelected && this.config.defaultSelectedConfig) {
      let location_id;
      if (this.config.defaultSelectedConfig.location) {
        location_id = this.getSeletedkeys(this.config.defaultSelectedConfig.location.locationContent, this.nodes);
      }
      if (!location_id) {
        if (this.config.defaultSelectedConfig.default) {
          location_id = this.getSeletedkeys(this.config.defaultSelectedConfig.default.locationContent, this.nodes);
        }
      }
      if (location_id) {
        this.defaultSelectedKeys = [];
        this.defaultSelectedKeys.push(location_id);
        this.defaultSelectedKeys = this.defaultSelectedKeys.filter((r) => r !== '');
      }
    }

    setTimeout(() => {
      if (this.defaultSelectedKeys.length > 0) {
        const select_node = this.treeObj.getTreeNodeByKey(this.defaultSelectedKeys[0]);
        if (select_node) {
          const clickNode = {
            eventName: 'click',
            node: select_node,
          };
          this.clickNode(clickNode);
        }
      }
    });
    console.log('+++++树++++++++++', this.dataServe);
  }

  private emptyLoad(option?) {
    return true;
  }

  private async _getAsyncTreeData(ajaxConfig = null, nodeValue = null) {
    const params = ParameterResolver.resolve({
      params: ajaxConfig.params,
      tempValue: this.tempValue,
      initValue: this.initValue,
      cacheValue: this.cacheValue,
      item: nodeValue,
      userValue: this.userValue,
    });
    const ajaxData = await this.componentService.apiService.getRequest(ajaxConfig.url, 'get', { params }).toPromise();
    return ajaxData;
  }

  private _setTreeNode(node) {
    this.config.columns.map((column) => {
      node[column.type] = node[column.field];
    });
    this.mapOfDataState[node[this.KEY_ID]] = {
      disabled: false,
      checked: node.checked ? node.checked : false, // index === 0 ? true : false,
      selected: false, // index === 0 ? true : false,
      state: 'text',
      data: node,
      originData: { ...node },
      // validation: true,
      // actions: this.getRowActions('text')
    };

    if (node.children && node.children.length > 0) {
      if (!this.config.async) {
        // 静态
        node.expanded = this.config.expandAll;
        node.children.map((n) => {
          this._setTreeNode(n);
        });
      }
      node.isLeaf = false;
    } else {
      node.isLeaf = true;
    }

    /*        if (node.children && node.children.length > 0) {
                   node['isLeaf'] = false;
                   node['children'] = [];
                   // node.children.map(n => {
                   //     // this._setTreeNode(n);
                   // })
               } else {
                   node['isLeaf'] = true;
               } */
  }

  public async expandNode($event: NzFormatEmitEvent | NzTreeNode) {
    console.log('ex');
    let node;
    let currentNode;
    if ($event instanceof NzTreeNode) {
      currentNode = $event;
    } else {
      currentNode = $event.node;
    }
    if (!this.config.async) {
      return true;
    }

    node = this.treeObj.getTreeNodeByKey(currentNode.key);

    if (node && node.isExpanded) {
      let response: any;
      if (this.config.loadingConfig['enableAjaxMore']) {
        response = await this.executeHttpMore(this.config.loadingConfig, node, 'buildParameters', null);
      } else {
        response = await this._getAsyncTreeData(this.config.expandConfig, node);
      }
      if (response && response.data && response.data.length > 0) {
        node.clearChildren();
        response.data.map((d) => {
          this._setTreeNode(d);
          if (d.children && d.children.length > 0) {
            // d['isLeaf'] = true;
            // d['children'] = [];
          }
        });
        node.addChildren(response.data);
      } else {
        node.addChildren([]);
        node.isExpanded = false;
      }
      // (async () => {
      //     const s = await Promise.all(
      //         this.config.expand
      //             .filter(p => p.type === node.isLeaf)
      //             .map(async expand => {

      //             })
      //     )
      // })()
    } else if (node.isExpanded === false) {
      node.clearChildren();
    }
  }

  public preventClickNode($event) {
    const finalResults = []; // 最外部“或”结果
    // 判断是否存在可被选中节点判断配置
    if (this.config.hasOwnProperty('nodeSelectionConfig') && Array.isArray(this.config.nodeSelectionConfig)) {
      if ($event.node.origin) {
        this.config.nodeSelectionConfig.forEach((cpm: any) => {
          if (cpm.compare && Array.isArray(cpm.compare)) {
            const results = []; // 内部“并”结果
            cpm.compare.forEach((ele) => {
              switch (ele.type) {
                case 'clickNode':
                  const sNodeValue = $event.node.origin[ele.valueName];
                  const cValue = ele.value;
                  const r = this._compare(sNodeValue, cValue, ele.compare, ele.method, ele.prevent);
                  results.push(r);
                  break;
              }
            });
            // 计算并且关系
            const innerResult = results.findIndex((r: boolean) => r === true) >= 0;
            finalResults.push(innerResult);
          }
        });
      }
    }
    // 计算或的关系
    if (finalResults.length > 0) {
      return finalResults.findIndex((r: boolean) => r) >= 0;
    } else {
      return true;
    }
  }

  private _compare(nodeValue, cValue, compare, method, prevent) {
    let result;
    let mr;
    switch (method) {
      case 'value':
        mr = CommonUtils.compareValueByMethod(nodeValue, cValue, compare);
        result = CommonUtils.checkCompareResult(mr, prevent);
        break;
      case 'regular':
        mr = CommonUtils.compareValueByRegular(nodeValue, cValue);
        result = CommonUtils.checkCompareResult(mr, prevent);
        break;
    }
    return result;
  }

  public clickNode($event?: NzFormatEmitEvent) {
    console.log('选节点', $event);
    const prevent = this.preventClickNode($event);
    if (!prevent) {
      return;
    }
    if (this.ACTIVED_NODE) {
      this.ACTIVED_NODE.isSelected = false;
      this.ACTIVED_NODE.selected && (this.ACTIVED_NODE.selected = false);
      this.ACTIVED_NODE = null;
    }
    // 需要修改选中状态的代码
    // $event.node.isSelected = true;
    this.treeObj.getTreeNodeByKey($event.node.key).isSelected = true;
    this.ACTIVED_NODE = $event.node;
    this.NODE_SELECTED = this.ACTIVED_NODE.origin;

    this.tempValue.selectedNode = {
      ...$event.node.origin,
    };
    const ss1 = this.treeObj.getTreeNodeByKey(this.ACTIVED_NODE.key);
    console.log('clickNode', this.defaultSelectedKeys, ss1, this.treeObj.getTreeNodes());

    return true;
  }

  public openFolder(data: NzTreeNode | Required<NzFormatEmitEvent>) {
    if (data instanceof NzTreeNode) {
      if (!data.isExpanded) {
        data.isExpanded = true;
        this.expandNode(data);
      }
    } else {
      const node = data.node;
      if (node) {
        if (!node.isExpanded) {
          node.isExpanded = true;
          this.expandNode(data);
        }
      }
    }
  }

  public loadRefreshData(option) {
    this.isLoading = true;
    const url = this.config.loadingConfig.url;
    const method = this.config.loadingConfig.method;
    // 返回结果解析id参数,构建ids
    const param1: any = {};
    if (option && Array.isArray(option)) {
      const rids = [];
      option.map((opt) => {
        rids.push(opt[this.KEY_ID]);
      });
      param1.ids = `in(${rids.join(',')})`;
    } else if (option) {
      param1.ids = `in(${option[this.KEY_ID]})`;
    }

    // 页面其他参数
    const params = {
      ...this.buildParameters(this.config.loadingConfig.params),
      // ...this._buildPaging(),
      ...param1,
    };

    this.componentService.apiService.getRequest(url, method, { params }).subscribe(
      (response) => {
        if (response && response.data && response.data) {
          this.refreshData(response.data);
          this.isLoading = false;
        } else {
          this.isLoading = false;
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }

  // #region 内置方法

  /**
   * 构建查询过滤参数
   * @param filterConfig
   * @returns {{}}
   * @private
   */
  private _buildFilter(filterConfig) {
    let filter = {};
    if (filterConfig) {
      filter = ParameterResolver.resolve({
        params: filterConfig,
        tempValue: this.tempValue,
        cacheValue: this.cacheValue,
        userValue: this.userValue,
      });
    }
    return filter;
  }

  /**
   * 构建URL
   * @param ajaxUrl
   * @returns {string}
   * @private
   */
  private _buildURL(ajaxUrl) {
    let url = '';
    if (ajaxUrl && this._isUrlString(ajaxUrl)) {
      url = ajaxUrl;
    } else if (ajaxUrl) {
    }
    return url;
  }

  /**
   * 处理URL格式
   * @param url
   * @returns {boolean}
   * @private
   */
  private _isUrlString(url) {
    return Object.prototype.toString.call(url) === '[object String]';
  }
  /**
   * 构建排序
   * @returns {{}}
   * @private
   */
  private _buildSort() {
    const sortObj: any = {};
    // if (this._sortName && this._sortType) {
    if (this._sortName && this._sortValue) {
      sortObj._sort = this._sortName + this._sortValue;
      // sortObj['_order'] = sortObj['_order'] ? 'DESC' : 'ASC';
    }
    return sortObj;
  }
  /**
   * 构建查询焦点
   * @returns {{}}
   * @private
   */
  private _buildFocusId() {
    const focusParams: any = {};
    // 服务器端待解决
    if (this.focusIds) {
      focusParams._focusedId = this.focusIds;
    }
    return focusParams;
  }
  /**
   * 构建查询字段
   * @returns {{}}
   * @private
   */
  private _buildColumnFilter() {
    const filterParams = {};
    if (this._columnFilterList && this._columnFilterList.length > 0) {
      this._columnFilterList.map((filter) => {
        const valueStr = [];
        filter.value.map((value) => {
          valueStr.push(`'${value}'`);
        });
        filterParams[filter.field] = `in(${valueStr.join(',')})`;
      });
    }
    return filterParams;
  }
  /**
   * 构建查询参数
   */
  public _buildSearch() {}
  // #endregion

  // #region state 状态切换
  private createNewRowData() {
    const newData = {};
    this.config.columns.map((col) => {
      newData[col.field] = null;
    });
    return newData;
  }

  public addRow() {
    // 创建空数据对象
    const newId = CommonUtils.uuID(36);
    const newData = this.createNewRowData();
    newData[this.KEY_ID] = newId;

    // 新增数据加入原始列表,才能够动态新增一行编辑数据
    this.nodes = [newData, ...this.nodes];

    // 组装状态数据
    this.mapOfDataState[newId] = {
      data: newData,
      originData: { ...newData },
      disabled: false,
      checked: true, // index === 0 ? true : false,
      selected: false, // index === 0 ? true : false,
      state: 'new',
      actions: this.getRowActions('new'),
    };

    this.NODES_ADDED = [newData, ...this.NODES_ADDED];

    // 更新状态
  }

  private removeEditRow(item) {
    this.NODES_EDITED = this.NODES_EDITED.filter((r) => r[this.KEY_ID] !== item[this.KEY_ID]);
  }

  private addEditRows(item) {
    const index = this.NODES_EDITED.findIndex((r) => r[this.KEY_ID] === item[this.KEY_ID]);
    if (index < 0) {
      this.NODES_EDITED = [item, ...this.NODES_EDITED];
    }
  }

  public editRows(option) {
    // this.NODES_CHECKED.map(
    //     item => {
    //         this.addEditRows(item);
    //         const trigger = new ButtonOperationResolver(this.componentService, this.config, this.mapOfDataState[item[this.KEY_ID]]);
    //         trigger.sendBtnMessage(option.btnCfg, { triggerType: BSN_TRIGGER_TYPE.STATE, trigger: BSN_TREE_TRIGGER.EDIT_ROW }, this.config.id);
    //     }
    // )
  }

  public editRow(option) {
    if (option.data) {
      this.addEditRows(option.data.data);
    }
    return true;
  }

  // 取消添加的新行 数据
  public cancelNewRow(option) {
    if (option.data) {
      this.removeNewRow(option.data.data);
    }
  }

  public cancelNewRows(option) {
    // this.NODES_ADDED.map(
    //     item => {
    //         this.removeNewRow(item);
    //         const trigger = new ButtonOperationResolver(this.componentService, this.config, this.mapOfDataState[item[this.KEY_ID]]);
    //         trigger.sendBtnMessage(option.btnCfg, { triggerType: BSN_TRIGGER_TYPE.STATE, trigger: BSN_TREE_TRIGGER.CANCEL_EDIT_ROW }, this.config.id);

    //     }
    // )
    return true;
  }

  private removeNewRow(item) {
    this.nodes = this.nodes.filter((r) => r[this.KEY_ID] !== item[this.KEY_ID]);
    this.NODES_ADDED = this.NODES_ADDED.filter((r) => r[this.KEY_ID] !== item[this.KEY_ID]);
    delete this.mapOfDataState[item[this.KEY_ID]];
  }

  public cancelEditRows(option) {
    // this.NODES_CHECKED.map(
    //     item => {
    //         this.removeEditRow(item);
    //         const trigger = new ButtonOperationResolver(this.componentService, this.config, this.mapOfDataState[item[this.KEY_ID]]);
    //         trigger.sendBtnMessage(option.btnCfg, { triggerType: BSN_TRIGGER_TYPE.STATE, trigger: BSN_TREE_TRIGGER.CANCEL_EDIT_ROW }, this.config.id);

    //     }
    // )
    return true;
  }

  public cancelEditRow(option) {
    if (option.data) {
      const itemId = option.data.data[this.KEY_ID];
      if (itemId) {
        this.NODES_EDITED = this.NODES_EDITED.filter((r) => r[this.KEY_ID] !== itemId);
      }
    }

    // 调用方法之前,判断传递的验证配置,解析后是否能够继续进行后续操作
    // return true 表示通过验证, return false 表示未通过,无法继续后续操作

    return true;
  }

  public changeAddedRowsToText(option) {
    // 通过服务器端的临时ID与执行数据的ID匹配取得数据
    // if (option && Array.isArray(option)) {
    //     option.map(opt => {
    //         if (this.mapOfDataState[opt[this.KEY_ID]]) {
    //             this.NODES_ADDED = this.NODES_ADDED.filter(r => r[this.KEY_ID] !== opt[this.KEY_ID]);
    //             this.mapOfDataState[opt[this.KEY_ID]]['originData'] = { ...this.mapOfDataState[opt[this.KEY_ID]]['data'] };
    //             this.mapOfDataState[opt[this.KEY_ID]]['actions'] = [...this.config.rowActions.filter(action => action.state === 'text')];
    //             const trigger = new ButtonOperationResolver(this.componentService, this.config, this.mapOfDataState[opt[this.KEY_ID]]);
    //             trigger.sendBtnMessage({}, { triggerType: BSN_TRIGGER_TYPE.STATE, trigger: BSN_TREE_TRIGGER.CANCEL_EDIT_ROW }, this.config.id);
    //         }
    //     })
    // } else if (option) {
    //     // this.mapOfDataState[option[this.KEY_ID]].state = 'text';
    //     this.NODES_ADDED = this.NODES_ADDED.filter(r => r[this.KEY_ID] !== option[this.KEY_ID]);
    //     this.mapOfDataState[option[this.KEY_ID]]['originData'] = { ...this.mapOfDataState[option[this.KEY_ID]]['data'] };
    //     this.mapOfDataState[option[this.KEY_ID]]['actions'] = [...this.config.rowActions.filter(action => action.state === 'text')];
    //     const trigger = new ButtonOperationResolver(this.componentService, this.config, this.mapOfDataState[option[this.KEY_ID]]);
    //     trigger.sendBtnMessage({}, { triggerType: BSN_TRIGGER_TYPE.STATE, trigger: BSN_TREE_TRIGGER.CANCEL_EDIT_ROW }, this.config.id);
    // }
  }

  public changeEditedRowsToText(option) {
    console.log('changeEditedRowsToText', option);
    // 通过服务器端的临时ID与执行数据的ID匹配取得数据
    // if (option && Array.isArray(option)) {
    //     option.map(opt => {
    //         if (this.mapOfDataState[opt[this.KEY_ID]]) {
    //             this.mapOfDataState[opt[this.KEY_ID]]['originData'] = { ...this.mapOfDataState[opt[this.KEY_ID]]['data'] };
    //             const trigger = new ButtonOperationResolver(this.componentService, this.config, this.mapOfDataState[opt[this.KEY_ID]]);
    //             trigger.sendBtnMessage({}, { triggerType: BSN_TRIGGER_TYPE.STATE, trigger: BSN_TREE_TRIGGER.CANCEL_EDIT_ROW }, this.config.id);
    //         }
    //     })
    // } else if (option) {
    //     // this.mapOfDataState[option[this.KEY_ID]].state = 'text';
    //     this.mapOfDataState[option[this.KEY_ID]]['originData'] = { ...this.mapOfDataState[option[this.KEY_ID]]['data'] };
    //     const trigger = new ButtonOperationResolver(this.componentService, this.config, this.mapOfDataState[option[this.KEY_ID]]);
    //     trigger.sendBtnMessage({}, { triggerType: BSN_TRIGGER_TYPE.STATE, trigger: BSN_TREE_TRIGGER.CANCEL_EDIT_ROW }, this.config.id);
    // }
  }

  // #endregion

  // #region operation 数据操作
  private _getComponentValueByHttpMethod(method): any[] {
    switch (method) {
      case 'post':
        return this.NODES_ADDED;
      case 'put':
        return this.NODES_EDITED;
      case 'proc':
        return [...this.NODES_ADDED, ...this.NODES_EDITED];
    }
  }

  public executeHttpRequest(url, method, paramData, logInfo?: any) {
    let _header = {};
    if (logInfo) {
      const logInfoStr = JSON.stringify(logInfo);
      const dd = encodeURI(logInfoStr);
      _header = new HttpHeaders({
        _log: dd,
      });
    }
    switch (method) {
      case 'get':
        return this.componentService.apiService[method](url, paramData, { headers: _header });
      case 'delete':
        return this.componentService.apiService[method](url, paramData, { headers: _header });
      default:
        return this.componentService.apiService[method](url, paramData, {}, { headers: _header });
    }
  }

  public async deleteCurrentRow(option) {
    console.log(this.config.id + '-------------executeSelectRow', option);

    // const url = option.ajaxConfig.url;
    // const method = option.ajaxConfig.ajaxType ? option.ajaxConfig.ajaxType : 'delete';
    // const ajaxParams = option.ajaxConfig.params ? option.ajaxConfig.params : []
    // let paramData;
    // if (option.data) {
    //     paramData = ParameterResolver.resolve({
    //         params: ajaxParams,
    //         item: option.data.data,
    //         tempValue: this.tempValue,
    //         initValue: this.initValue,
    //         cacheValue: this.cacheValue
    //     });
    // }
    // const response = await this.executeHttpRequest(url, method, paramData);
    // if (response) {
    //     this.load();
    // }
  }

  public deleteCheckedNodes(option) {
    console.log('deletecheckecNodes', option);
    if (option.ids) {
      const arr_id = option.ids.split(',');
      if (arr_id && arr_id.length > 0) {
        arr_id.map((arr) => {
          this.deleteSelectedNode({ ID: arr, id: arr });
        });
      }
    }
  }

  public deleteSelectedNode(option) {
    if (option[this.KEY_ID]) {
      const deletedNode = this.treeObj.getTreeNodeByKey(option[this.KEY_ID]);
      if (deletedNode) {
        // 判断删除的Node节点是否存在父节点
        const parentNode = deletedNode.getParentNode();
        if (parentNode) {
          // 删除子节点
          deletedNode.remove();
          // 判断当前父节点是否存在子节点集合
          if (parentNode.getChildren().length === 0) {
            parentNode.isSelected = true;
            parentNode.isExpanded = false;
            parentNode.isLeaf = true;
            this.ACTIVED_NODE = parentNode;
          } else {
            const firstNode = parentNode.getChildren()[0];
            firstNode.isSelected = true;
            this.ACTIVED_NODE = firstNode;
          }
        } else {
          // 删除根节点
          this.nodes = this.nodes.filter((node) => node.key !== option[this.KEY_ID]);
          this.nodes[0].isSelected = true;
          this.ACTIVED_NODE = this.nodes[0];
        }

        this.NODE_SELECTED = this.ACTIVED_NODE.origin;
      }
    }
  }

  /**
   *
   * @param option
   * @returns
   * logging finish
   */
  public async executeSelectedNode(option) {
    let response: any;
    if (option.ajaxConfig['enableAjaxMore']) {
      if (option['data'] && option['data']['data']) {
        response = await this.executeHttpMore(option.ajaxConfig, option['data']['data'], 'buildParameters', null);
      } else {
        response = await this.executeHttpMore(option.ajaxConfig, {}, 'buildParameters', null);
      }
    } else {
      const url = option.ajaxConfig.url;
      const method = option.ajaxConfig.ajaxType;
      const ajaxParams = option.ajaxConfig.params ? option.ajaxConfig.params : [];
      let paramData;
      if (option.data) {
        paramData = ParameterResolver.resolve({
          params: ajaxParams,
          item: this.ACTIVED_NODE.origin,
          tempValue: this.tempValue,
          initValue: this.initValue,
          cacheValue: this.cacheValue,
          userValue: this.userValue,
        });
      }
      response = await this.executeHttpRequest(url, method, paramData, option.logInfo ? option.logInfo : {}).toPromise();
    }
    // 批量对象数据,返回结果都将以对象的形式返回,如果对应结果没有值则返回 {}
    this._sendDataSuccessMessage(response, option.ajaxConfig.result);

    // 处理validation结果
    const validationResult = this._sendDataValidationMessage(response, option.ajaxConfig.result);

    // 处理error结果
    const errorResult = this._sendDataErrorMessage(response, option.ajaxConfig.result);

    return validationResult && errorResult;
  }

  /**
   *
   * @param option
   * @returns
   * logging finish
   */
  public async executeCurrentRow(option) {
    const url = option.ajaxConfig.url;
    const method = option.ajaxConfig.ajaxType;
    const ajaxParams = option.ajaxConfig.params ? option.ajaxConfig.params : [];
    let paramData;
    if (option.data) {
      paramData = ParameterResolver.resolve({
        params: ajaxParams,
        item: option.data.data,
        tempValue: this.tempValue,
        initValue: this.initValue,
        cacheValue: this.cacheValue,
        userValue: this.userValue,
      });
    }
    const response: any = await this.executeHttpRequest(url, method, paramData, option.logInfo ? option.logInfo : {}).toPromise();
    // 批量对象数据,返回结果都将以对象的形式返回,如果对应结果没有值则返回 {}
    this._sendDataSuccessMessage(response, option.ajaxConfig.result);

    // 处理validation结果
    const validationResult = this._sendDataValidationMessage(response, option.ajaxConfig.result);

    // 处理error结果
    const errorResult = this._sendDataErrorMessage(response, option.ajaxConfig.result);

    return validationResult && errorResult;
  }

  public async executeCheckedNodes(option) {
    console.log('execute checked nodes', option);
  }

  /**
   *
   * @param option
   * @returns
   * logging finish
   */
  public async executeDeleteCheckedNodesByID(option) {
    console.log('execute checked nodes', option);
    const url = option.ajaxConfig.url;
    const method = option.ajaxConfig.ajaxType;
    const ajaxParams = option.ajaxConfig.params ? option.ajaxConfig.params : [];
    // const data = this.treeObj.getCheckedNodeList();
    const data = this.getData();
    const parameterResult = [];
    data.map((d) => {
      const param = ParameterResolver.resolve({
        params: ajaxParams,
        tempValue: this.tempValue,
        checkedItem: d.origin,
        initValue: this.initValue,
        cacheValue: this.cacheValue,
        userValue: this.userValue,
      });
      parameterResult.push(param);
    });
    if (parameterResult) {
      const ids = [];
      parameterResult.map((p) => {
        const pData = p[this.KEY_ID];
        if (pData && !ids.includes(pData)) {
          ids.push(pData);
        }
      });
      const response = await this.executeHttpRequest(url, method, { ids: ids.join(',') }, option.logInfo ? option.logInfo : {}).toPromise();
      // 批量对象数据,返回结果都将以对象的形式返回,如果对应结果没有值则返回 {}
      this._sendDataSuccessMessage(response, option.ajaxConfig.result);

      // 处理validation结果
      const validationResult = this._sendDataValidationMessage(response, option.ajaxConfig.result);

      // 处理error结果
      const errorResult = this._sendDataErrorMessage(response, option.ajaxConfig.result);

      return validationResult && errorResult;
    } else {
      return false;
    }
  }

  /**
   *
   * @param option
   * @returns
   * loggin finish
   */
  public async executeCheckedNodesByID(option) {
    console.log('execute checked nodes', option);
    const url = option.ajaxConfig.url;
    const method = option.ajaxConfig.ajaxType;
    const ajaxParams = option.ajaxConfig.params ? option.ajaxConfig.params : [];

    // const data =this.treeObj.getTreeNodes().filter(r=>{if(r.isChecked) return r});
    // const data = [...this.treeObj.getCheckedNodeList(), ...this.treeObj.getHalfCheckedNodeList()];
    const data = this.getData();
    const parameterResult = [];
    data.map((d) => {
      const param = ParameterResolver.resolve({
        params: [{ name: this.KEY_ID, type: 'item', valueName: this.KEY_ID }],
        tempValue: this.tempValue,
        item: d.origin,
        initValue: this.initValue,
        cacheValue: this.cacheValue,
        userValue: this.userValue,
      });
      parameterResult.push(param);
    });
    if (parameterResult) {
      const ids = [];
      parameterResult.map((p) => {
        const pData = p[this.KEY_ID];
        if (pData && !ids.includes(pData)) {
          ids.push(pData);
        }
      });
      let paramData;
      paramData = ParameterResolver.resolve({
        params: ajaxParams,
        item: { ids: ids.join(',') },
        checkedItem: { ids: ids.join(',') },
        tempValue: this.tempValue,
        initValue: this.initValue,
        cacheValue: this.cacheValue,
        userValue: this.userValue,
      });
      const response = await this.executeHttpRequest(url, method, paramData, option.logInfo ? option.logInfo : {}).toPromise();
      // 批量对象数据,返回结果都将以对象的形式返回,如果对应结果没有值则返回 {}
      this._sendDataSuccessMessage(response, option.ajaxConfig.result);

      // 处理validation结果
      const validationResult = this._sendDataValidationMessage(response, option.ajaxConfig.result);

      // 处理error结果
      const errorResult = this._sendDataErrorMessage(response, option.ajaxConfig.result);

      return validationResult && errorResult;
    } else {
      return false;
    }
  }

  private _sendDataSuccessMessage(response, resultCfg): boolean {
    let result = false;
    if (Array.isArray(response.data) && response.data.length <= 0) {
      return result;
    }
    if (response && response.data) {
      const successCfg = resultCfg.find((res) => res.name === 'data');
      // 弹出提示框
      if (successCfg) {
        new RelationResolver(this).resolveInnerSender(successCfg, response.data, Array.isArray(response.data));
      }
      result = true;
    }

    return result;
  }

  private _sendDataValidationMessage(response, resultCfg) {
    let result = true;
    if (response && Array.isArray(response.validation) && response.validation.length <= 0) {
      return result;
    }
    if (response && response.validation) {
      const validationCfg = resultCfg.find((res) => res.name === 'validation');
      if (validationCfg) {
        new RelationResolver(this).resolverDataValidationSender(validationCfg, response.validation);
      }
      result = false;
    }
    return result;
  }

  private _sendDataErrorMessage(response, resultCfg) {
    let result = true;
    if (response && Array.isArray(response.error) && response.error.length <= 0) {
      return result;
    }
    if (response && response.error) {
      const errorCfg = resultCfg.find((res) => res.name === 'error');
      if (errorCfg) {
        new RelationResolver(this).resolverDataErrorSender(errorCfg, response.error);
      }
      result = false;
    }
    return result;
  }

  public async saveRow(option) {
    const ajaxConfig = option.ajaxConfig;
    const rowData = option.data.data;
    const url = ajaxConfig.url;
    const method = ajaxConfig.ajaxType;
    const paramData = ParameterResolver.resolve({
      params: ajaxConfig.params,
      tempValue: this.tempValue,
      componentValue: rowData,
      item: this.NODE_SELECTED,
      initValue: this.initValue,
      cacheValue: this.cacheValue,
      router: this.routerValue,
      userValue: this.userValue,
    });

    const response = await this.executeHttpRequest(url, method, paramData, option.logInfo ? option.logInfo : {}).tpPromise();

    // 批量对象数据,返回结果都将以对象的形式返回,如果对应结果没有值则返回 {}
    this._sendDataSuccessMessage(response, ajaxConfig.result);

    // 处理validation结果
    const validationResult = this._sendDataValidationMessage(response, ajaxConfig.result);

    // 处理error结果
    const errorResult = this._sendDataErrorMessage(response, ajaxConfig.result);

    // 返回true可以发送后续操作, 返回false终止发送,之前定义的后续操作将无法执行
    return validationResult && errorResult;
  }

  /**
   * 保存编辑行
   * @param options ajaxConfig
   */
  public async saveRows(option) {
    const ajaxConfig = option.ajaxConfig;
    // 构建业务对象
    // 执行异步操作
    const url = ajaxConfig.url;
    this.COMPONENT_VALUE = this._getComponentValueByHttpMethod(ajaxConfig.ajaxType);
    const paramsData = this.buildParameters(ajaxConfig.params, this.COMPONENT_VALUE, true);
    // const response = await this.componentService.apiService[ajaxConfig.ajaxType](url, paramsData).toPromise();
    const response = await this.executeHttpRequest(url, ajaxConfig.ajaxType, paramsData, option.logInfo ? option.logInfo : {}).toPromise();
    // 批量提交数据,返回结果都将以数组的形式返回,如果对应结果没有值则返回 {}
    this._sendDataSuccessMessage(response, ajaxConfig.result);

    // 处理validation结果
    const validationResult = this._sendDataValidationMessage(response, ajaxConfig.result);

    // 处理error结果
    const errorResult = this._sendDataErrorMessage(response, ajaxConfig.result);

    // 返回true可以发送后续操作, 返回false终止发送,之前定义的后续操作将无法执行
    return validationResult && errorResult;
  }

  public setSelectedNode() {}

  public setSelectRow(rowData?, $event?) {
    if (!rowData) {
      return false;
    }
    if ($event) {
      const src = $event.srcElement || $event.target;
      if (src.type !== undefined) {
        return false;
      }
      $event.stopPropagation();
      $event.preventDefault();
    }

    this.NODE_SELECTED = rowData;

    // 选中当前行
    this.nodes.map((row) => {
      this.mapOfDataState[row[this.KEY_ID]].selected = false;
    });

    this.mapOfDataState[rowData[this.KEY_ID]].selected = true;

    // 勾选/取消当前行勾选状态
    this.mapOfDataState[rowData[this.KEY_ID]].checked = !this.mapOfDataState[rowData[this.KEY_ID]].checked;
    this.dataCheckedStatusChange();
    return true;
  }

  public selectRow(rowData) {
    console.log(this.config.id + '-----------' + rowData, arguments);
    // this.ROW_SELECTED = rowData;
  }

  // #endregion

  // #region action

  private _setChildrenSelectedNode(currentSelectedNode) {
    currentSelectedNode.isSelected = false;

    const sNode = currentSelectedNode.getChildren();
    sNode[0].isSelected = true;

    // that.activedNode.isSelected = false;
    // that.activedNode = null;

    this.ACTIVED_NODE = sNode[0];
    // that.selectedItem = that.activedNode.origin;
    // that.tempValue['_selectedNode'] = that.selectedItem;
  }

  private _setRootSelectedNode(currentSelectedNode) {
    if (currentSelectedNode) {
      currentSelectedNode.isSelected = true;
    }
    // const sNode = this.treeObj.getTreeNodes();
    // sNode[0].isSelected = true;
    // this.ACTIVED_NODE = sNode[0];
  }

  public async appendChildToRootNode(option) {
    let appendNodeData: any = {};
    if (this.config.loadingItemConfig) {
      option = await this.loadItem(option);
    }

    this.config.columns.map((col) => {
      appendNodeData[col.type] = option[col.field];
    });

    const addRootNode = new NzTreeNode({
      key: appendNodeData.key,
      title: appendNodeData.title,
      selected: true,
      parentId: null,
      origin: { ...option, ...appendNodeData },
      ...option,
    });
    addRootNode.isLeaf = true;
    this.nodes = this.treeObj.getTreeNodes();
    this.nodes = [addRootNode, ...this.nodes];
    this.ACTIVED_NODE = addRootNode;
    this.NODE_SELECTED = addRootNode.origin;
    // const currentSelectedNode = this.treeObj.getTreeNodeByKey(this.ACTIVED_NODE.key);
    this._setRootSelectedNode(addRootNode);
  }

  public async appendChildToSelectedNode(option) {
    // let appendNode: NzTreeNode;
    let appendNodeData: any = {};
    if (this.config.loadingItemConfig) {
      option = await this.loadItem(option);
    }

    this.config.columns.map((col) => {
      appendNodeData[col.type] = option[col.field];
    });

    appendNodeData.isLeaf = true;
    appendNodeData.origin = { ...option, ...appendNodeData };
    // const addChildNode = new NzTreeNode({
    //     key: appendNodeData['key'],
    //     title: appendNodeData['title'],
    //     selected: true,
    //     parentId: appendNodeData['parentId'],
    //     origin: appendNodeData
    // });
    // console.log('appendChildToSelectedNode');

    const currentSelectedNode = this.treeObj.getTreeNodeByKey(this.ACTIVED_NODE.key);
    if (currentSelectedNode.isLeaf) {
      currentSelectedNode.isLeaf = false;
    }
    if (!currentSelectedNode.isExpanded) {
      currentSelectedNode.isExpanded = true;
      if (!this.config.async) {
        currentSelectedNode.addChildren([{ ...option, ...appendNodeData }]);
      } else {
        this.expandNode(currentSelectedNode);
      }

      // this._setChildrenSelectedNode(currentSelectedNode);
    } else {
      // 节点已经打开,直接在节点下添加子节点
      currentSelectedNode.addChildren([{ ...option, ...appendNodeData }]);
      // this._setChildrenSelectedNode(currentSelectedNode);
    }
  }

  // 批量添加多个节点
  public async appendChildsToSelectedNode(option) {
    // let appendNode: NzTreeNode;

    const currentSelectedNode = this.treeObj.getTreeNodeByKey(this.ACTIVED_NODE.key);
    if (currentSelectedNode.isLeaf) {
      currentSelectedNode.isLeaf = false;
    }
    if (!currentSelectedNode.isExpanded) {
      currentSelectedNode.isExpanded = true;
      if (!this.config.async) {
      } else {
        this.expandNode(currentSelectedNode);
      }
      // this._setChildrenSelectedNode(currentSelectedNode);
    } else {
      // 节点已经打开,直接在节点下添加子节点
      this.expandNode(currentSelectedNode);
      // this._setChildrenSelectedNode(currentSelectedNode);
    }
  }

  // 刷新选中节点的父节点
  public async refreshDataToSelectedParentNode(option) {
    // let appendNode: NzTreeNode;

    if (this.ACTIVED_NODE.parentNode) {
      const currentSelectedNode = this.treeObj.getTreeNodeByKey(this.ACTIVED_NODE.parentNode.key);
      if (currentSelectedNode.isLeaf) {
        currentSelectedNode.isLeaf = false;
      }
      if (!currentSelectedNode.isExpanded) {
        currentSelectedNode.isExpanded = true;
        if (!this.config.async) {
        } else {
          this.expandNode(currentSelectedNode);
        }
        // this._setChildrenSelectedNode(currentSelectedNode);
      } else {
        // 节点已经打开,直接在节点下添加子节点
        this.expandNode(currentSelectedNode);
        // this._setChildrenSelectedNode(currentSelectedNode);
      }
    } else {
      this.load(); // 全刷新
    }
  }

  // 向上移动节点
  public moveToUpSelectedNode(option?) {
    this.moveToSelectedNode('up');
    return true;
  }

  // 向下移动节点
  public moveToDownSelectedNode(option?) {
    this.moveToSelectedNode('down');
    return true;
  }

  // 移动节点
  private moveToSelectedNode(option?) {
    // let appendNode: NzTreeNode;
    console.log('树节点', this.ACTIVED_NODE, this.nodes);

    if (this.ACTIVED_NODE.parentNode) {
      const currentSelectedNode1 = this.treeObj.getTreeNodeByKey(this.ACTIVED_NODE.parentNode.key);
      if (currentSelectedNode1['origin']['children']) {
        const aa = currentSelectedNode1['origin']['children'];
        // currentSelectedNode1['origin']['children'] = aa.reverse();
        currentSelectedNode1.clearChildren();
        //currentSelectedNode1.addChildren(aa.reverse());
        currentSelectedNode1.addChildren(this.sortNodes(aa, option, this.ACTIVED_NODE.key));
      }
      console.log('树节点dddd', currentSelectedNode1);
    } else {
      // 是根节点操作
      this.nodes = this.treeObj.getTreeNodes();
      const currentSelectedNode = this.treeObj.getTreeNodeByKey(this.ACTIVED_NODE.key);
      const _nodes = this.sortNodes(this.nodes, option, this.ACTIVED_NODE.key);
      this.nodes = [..._nodes];
      console.log('树根节点dddd', this.nodes);
    }
    return true;
  }

  // 节点排序
  private sortNodes(list?, sortType?, value?) {
    // 数组，排序类型（up、down），进度（1）
    const index = list.findIndex((item) => item.key === value);
    return this[sortType](index, list);
  }
  // 向上移动
  private up(index, list) {
    if (index === 0) {
      return list;
    }
    //在上一项插入该项
    list.splice(index - 1, 0, list[index]);
    //删除后一项
    list.splice(index + 1, 1);
    return list;
  }
  // 向下移动
  private down(index, list) {
    if (index === list.length - 1) {
      return list;
    }
    // 在下一项插入该项
    list.splice(index + 2, 0, list[index]);
    // 删除前一项
    list.splice(index, 1);
    return list;
  }

  public async loadItem(data?) {
    // 【参数不全是否阻止加载！】
    // 对后续业务判断有影响
    //  console.log('===select 自加载====>load');
    const url = this.config.loadingItemConfig.url;
    const method = this.config.loadingItemConfig.ajaxType ? this.config.loadingItemConfig.ajaxType : this.config.loadingItemConfig.method;
    const params = {
      ...this.Item_buildParameters(this.config.loadingItemConfig.params, data),
    };
    // 考虑满足 get 对象，集合，存储过程【指定dataset 来接收数据】，加载错误的信息提示

    const response = await this.componentService.apiService.getRequest(url, method, { params }).toPromise();
    // console.log('--da---' + this.config.field, response);
    let data_form;
    if (Array.isArray(response.data)) {
      if (response.data && response.data.length > 0) {
        data_form = response.data[0];
      }
    } else {
      if (response.data) {
        data_form = response.data;
      }
    }

    if (!data_form) {
      data_form = data;
    }
    return data_form;
  }

  public Item_buildParameters(paramsCfg, data?) {
    return ParameterResolver.resolve({
      params: paramsCfg,
      tempValue: this.tempValue,
      item: data,
      componentValue: data, //  组件值？返回值？级联值，需要三值参数
      initValue: this.initValue,
      cacheValue: this.cacheValue,
      router: this.routerValue,
      cascadeValue: this.cascadeValue,
      userValue: this.userValue,
    });
  }

  public async updateSelectedNode(option) {
    let appendNodeData: any = {};
    if (this.config.loadingItemConfig) {
      option = await this.loadItem(option);
    }

    this.config.columns.map((col) => {
      appendNodeData[col.type] = option[col.field];
    });

    const node = this.treeObj.getTreeNodeByKey(appendNodeData.key);
    if (node) {
      node.title = appendNodeData.title;
      node.origin = { ...option, ...appendNodeData };
      this.ACTIVED_NODE = node;
      this.NODE_SELECTED = this.ACTIVED_NODE.origin;
    }
  }

  public refreshData(loadNewData) {
    if (loadNewData && Array.isArray(loadNewData)) {
      loadNewData.map((newData) => {
        const index = this.nodes.findIndex((d) => d[this.KEY_ID] === newData[this.KEY_ID]);
        if (index > -1) {
          this.nodes.splice(index, 1, newData);
          this.nodes = [...this.nodes];
        } else {
          this.nodes = [loadNewData[index], ...this.nodes];
        }
        const mapData = this.mapOfDataState[newData[this.KEY_ID]];
        if (mapData) {
          mapData.data = newData;
          mapData.originData = { ...newData };
        } else {
          // 组装状态数据
          this.mapOfDataState[newData[this.KEY_ID]] = {
            data: newData,
            originData: { ...newData },
            disabled: false,
            checked: true, // index === 0 ? true : false,
            selected: false, // index === 0 ? true : false,
            state: 'new',
            actions: this.getRowActions('new'),
          };
        }
      });
    }
    // 刷新nodes
    // 刷新mapOfDataState
  }

  public showInvalidateAddedRows(option) {
    if (option && Array.isArray(option)) {
      option.map((opt) => {
        const rowData = opt.data;
        this.mapOfDataState[rowData[this.KEY_ID]].validation = false;
      });
    } else if (option) {
      const rowData = option.data;
      this.mapOfDataState[rowData[this.KEY_ID]].validation = false;
    }
  }

  public showInvalidateEditedRows(option) {
    console.log(option);
    if (option && Array.isArray(option)) {
      option.map((opt) => {
        const rowData = opt.data;
        this.mapOfDataState[rowData[this.KEY_ID]].validation = false;
      });
    } else if (option) {
      const rowData = option.data;
      this.mapOfDataState[rowData[this.KEY_ID]].validation = false;
    }
  }

  public checkedRows() {
    console.log('-------------checked rows');
    // this._sender_source$.subscribe(res => {
    //     console.log('send message', res);
    // });
  }

  public buildParameters(paramsCfg, data?, isArray = false) {
    let parameterResult: any | any[];
    if (!isArray && !data) {
      parameterResult = ParameterResolver.resolve({
        params: paramsCfg,
        tempValue: this.tempValue,
        componentValue: this.COMPONENT_VALUE,
        item: this.ACTIVED_NODE ? (this.ACTIVED_NODE.origin ? this.ACTIVED_NODE.origin : null) : null,
        initValue: this.initValue,
        cacheValue: this.cacheValue,
        router: this.routerValue,
        addedRows: this.NODES_ADDED,
        editedRows: this.NODES_EDITED,
        userValue: this.userValue,
        returnValue: data,
      });
    } else if (!isArray && data) {
      // liu 2020 0521 存储过程返回
      if (data._procedure_resultset_1) {
        data = data._procedure_resultset_1[0];
      }
      parameterResult = ParameterResolver.resolve({
        params: paramsCfg,
        tempValue: this.tempValue,
        componentValue: this.COMPONENT_VALUE,
        item: this.ACTIVED_NODE ? (this.ACTIVED_NODE.origin ? this.ACTIVED_NODE.origin : null) : null,
        initValue: this.initValue,
        cacheValue: this.cacheValue,
        router: this.routerValue,
        addedRows: data,
        editedRows: data,
        validation: data,
        returnValue: data,
        userValue: this.userValue,
      });
    } else if (isArray && data && Array.isArray(data)) {
      parameterResult = [];
      data.map((d) => {
        const param = ParameterResolver.resolve({
          params: paramsCfg,
          tempValue: this.tempValue,
          componentValue: d,
          item: this.ACTIVED_NODE ? (this.ACTIVED_NODE.origin ? this.ACTIVED_NODE.origin : null) : null,
          checkedItem: d,
          initValue: this.initValue,
          cacheValue: this.cacheValue,
          router: this.routerValue,
          addedRows: d,
          editedRows: d,
          validation: d,
          userValue: this.userValue,
          returnValue: data,
        });
        parameterResult.push(param);
      });
    }
    return parameterResult;
  }

  public getCurrentComponentId() {
    return this.config.id;
  }

  // public executeSelectRow() {
  //     console.log(this.config.id + '-------------executeSelectRow');
  // }

  // public executeCheckedRows() {
  //     console.log(this.config.id + '-------------executeCheckedRows');
  // }

  // public executeCheckedRowsIds() {
  //     console.log(this.config.id + '-------------executeCheckedRowsIds');
  // }

  // public searchRow() {
  //     console.log(this.config.id + '-------------searchRow');
  // }

  // public cancelSearchRow() {
  //     console.log(this.config.id + '-------------cancelSearchRow');
  // }

  public export() {}

  public import() {}

  public download() {}

  /**
   * 显示确认对话框
   * @param option 确认参数
   */
  public showConfirm(option: any) {
    this.confirm(option.dialog, () => {
      this.executeSelectedNode(option);
    });
  }

  /**
   * 显示表单对话框
   * @param option 配置参数
   * dialog
   * changeValue
   * ajaxConfig
   */
  public showDialog(option: any) {
    let dialog;
    // 根据按钮类型初始化表单状态
    const dialogCfg = option.dialog;
    dialogCfg.form.state = option.btnCfg.state ? option.btnCfg.state : 'text';

    // const isEditForm = dialogCfg.form.state === 'edit' ? true : false;
    // if(isEditForm) {

    // }
    // debugger;
    if (option.changeValue) {
      const d = ParameterResolver.resolve({
        params: option.changeValue.params,
        tempValue: this.tempValue,
        // componentValue: cmptValue,
        item: this.ACTIVED_NODE ? (this.ACTIVED_NODE.origin ? this.ACTIVED_NODE.origin : null) : null,
        initValue: this.initValue,
        cacheValue: this.cacheValue,
        router: this.routerValue,
        userValue: this.userValue,
      });
      option.changeValue.params.map((param) => {
        if (param.type === 'value') {
          // 类型为value是不需要进行任何值的解析和变化
        } else {
          if (d[param.name] || d[param.name] === 0) {
            param.value = d[param.name];
          }
        }
      });
    }

    const dialogOptional = {
      nzTitle: dialogCfg.title ? dialogCfg.title : '',
      nzWidth: dialogCfg.width ? dialogCfg.width : '600px',
      nzStyle: dialogCfg.style ? dialogCfg.style : null,
      nzMaskClosable: dialogCfg.hasOwnProperty('maskClosable') ? dialogCfg.maskClosable : false,
      nzContent: CnDataFormComponent,
      nzComponentParams: {
        config: dialogCfg.form,
        changeValue: option.changeValue ? option.changeValue.params : [],
      },
      nzFooter: [
        {
          label: dialogCfg.cancelText ? dialogCfg.cancelText : 'cancel',
          onClick: (componentInstance) => {
            dialog.close();
          },
        },
        {
          label: dialogCfg.okText ? dialogCfg.okText : 'OK',
          onClick: (componentInstance) => {
            (async () => {
              const response = await componentInstance.executeModal(option);
              if (response) {
                this._sendDataSuccessMessage(response, option.ajaxConfig.result);

                // 处理validation结果
                this._sendDataValidationMessage(response, option.ajaxConfig.result) &&
                  this._sendDataErrorMessage(response, option.ajaxConfig.result) &&
                  dialog.close();
              }
            })();
          },
        },
      ],
    };
    dialog = this.componentService.modalService.create(dialogOptional);
  }

  public showWindow(option: any) {
    let dialog;
    // 根据按钮类型初始化表单状态
    const dialogCfg = option.window;
    // dialogCfg.form.state = option.btnCfg.state ? option.btnCfg.state : 'text';

    // const isEditForm = dialogCfg.form.state === 'edit' ? true : false;
    // if(isEditForm) {

    // }
    if (option.changeValue) {
      const d = ParameterResolver.resolve({
        params: option.changeValue.params,
        tempValue: this.tempValue,
        // componentValue: cmptValue,
        item: this.ACTIVED_NODE.origin,
        initValue: this.initValue,
        cacheValue: this.cacheValue,
        router: this.routerValue,
        userValue: this.userValue,
      });
      option.changeValue.params.map((param) => {
        if (param.type === 'value') {
          // 类型为value是不需要进行任何值的解析和变化
        } else {
          if (d[param.name]) {
            param.value = d[param.name];
          }
        }
      });
    }

    const dialogOptional = {
      nzTitle: dialogCfg.title ? dialogCfg.title : '',
      nzWidth: dialogCfg.width ? dialogCfg.width : '600px',
      nzStyle: dialogCfg.style ? dialogCfg.style : null, // style{top:'1px'},
      nzMaskClosable: dialogCfg.hasOwnProperty('maskClosable') ? dialogCfg.maskClosable : false,
      nzContent: CnPageComponent,
      nzComponentParams: {
        config: {},
        customPageId: dialogCfg.layoutName, // "0MwdEVnpL0PPFnGISDWYdkovXiQ2cIOG",
        // initData:this.initData
        changeValue: option.changeValue ? option.changeValue.params : [],
      },
      nzFooter: [
        {
          label: dialogCfg.cancelText ? dialogCfg.cancelText : 'cancel',
          onClick: (componentInstance) => {
            dialog.close();
          },
        },
        {
          label: dialogCfg.okText ? dialogCfg.okText : 'OK',
          onClick: (componentInstance) => {
            // (async () => {
            //     const response = await componentInstance.executeModal(option);
            //     this._sendDataSuccessMessage(response, option.ajaxConfig.result);
            //     // 处理validation结果
            //     this._sendDataValidationMessage(response, option.ajaxConfig.result)
            //         &&
            //         this._sendDataErrorMessage(response, option.ajaxConfig.result)
            //         && dialog.close();
            // })();
          },
        },
      ],
    };
    // 自定义 操作按钮
    if (dialogCfg.footerButton && dialogCfg.footerButton.length > 0) {
      dialogOptional.nzFooter = [];

      dialogCfg.footerButton.forEach((_button) => {
        dialogOptional.nzFooter.push({
          label: _button.text,
          onClick: (componentInstance) => {
            // dialog.close();
            // customAction
            let customAction;
            if (dialogCfg.customAction && dialogCfg.customAction.length > 0) {
              const customActionList = dialogCfg.customAction.filter((item) => item.id === _button.customActionId);
              if (customActionList && customActionList.length > 0) {
                customAction = customActionList[0];
              }
            }

            this.execCustomAction(customAction, dialog, componentInstance);
          },
        });
      });
    }

    dialog = this.componentService.modalService.create(dialogOptional);
    this.windowDialog = dialog;
  }

  // 执行弹出页的按钮事件
  public execCustomAction(customAction?, dialog?, componentInstance?) {
    console.log('execCustomAction');

    customAction.execute.forEach((item) => {
      if (item.type === 'relation') {
        new RelationResolver(this).resolveInnerSender(item.sender, {}, Array.isArray({}));
      } else if (item.type === 'action') {
        this.windowDialog.close();
      }
    });

    // new RelationResolver(this). resolveSender();

    return true;
  }

  /**
   * 执行关闭，通过消息等将当前弹出关闭
   * @param option
   */
  executePopupClose(option?) {
    console.log('关闭弹出executeShowClose', option);
    // 参数传递 更加传递类型关闭，若传递类型不配置，则将当前存在的示例关闭 popup

    if (this.windowDialog) {
      this.windowDialog.close(); // 关闭弹出
      this.windowDialog = null;
    }

    return true;
  }

  public showUpload() {}

  public showBatchDialog() {}

  /**
   * 显示消息框
   */
  public showMessage(option) {
    const message: { type: string; message: string; field: string } = { type: '', message: '', field: '' };
    if (option && Array.isArray(option)) {
      message.message = option[0].code;
      message.type = option[0].type;
      message.field = option[0].field;
    } else if (option) {
      message.message = option.code ? option.code : option.message ? option.message : '';
      message.type = option.type;
      message.field = option.field ? option.field : '';
    }

    option && this.componentService.msgService.create(message.type, `${message.field}: ${message.message}`);
  }

  /**
   * 全选
   */
  public checkAll($value: boolean): void {
    //
    this.nodes
      .filter((item) => !this.mapOfDataState[item[this.KEY_ID]]['dislabled'])
      .map((item) => (this.mapOfDataState[item[this.KEY_ID]].checked = $value));
    this.dataCheckedStatusChange();
  }

  /**
   * 更新数据选中状态的CheckBox
   */
  public dataCheckedStatusChange() {
    this.isAllChecked = this.nodes
      .filter((item) => !this.mapOfDataState[item[this.KEY_ID]]['dislabled'])
      .every((item) => this.mapOfDataState[item[this.KEY_ID]].checked);

    this.indeterminate =
      this.nodes
        .filter((item) => !this.mapOfDataState[item[this.KEY_ID]]['dislabled'])
        .some((item) => this.mapOfDataState[item[this.KEY_ID]].checked) && !this.isAllChecked;

    this.checkedNumber = this.nodes.filter((item) => this.mapOfDataState[item[this.KEY_ID]].checked).length;

    // 更新当前选中数据集合
    this.NODES_CHECKED = this.nodes
      .filter((item) => !this.mapOfDataState[item[this.KEY_ID]]['dislabled'])
      .filter((item) => this.mapOfDataState[item[this.KEY_ID]].checked);
  }

  /**
   * 列排序
   * @param $sort {key:string, value: string}
   */
  sort($sort: { key: string; value: string }): void {
    this._sortName = $sort.key;
    this._sortValue = $sort.value;
    this.load();
  }

  searchData(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
    }
    this.isAllChecked = false;
    this.indeterminate = false;
    this.load();
  }

  //#endregion

  /**
   *
   * @param actionCfg 当前操作按钮的配置
   * @param rowData 当前数据行
   * @param $event
   */
  rowAction(actionCfg, rowData, $event?) {
    const dataOfState = this.mapOfDataState[rowData[this.KEY_ID]];
    $event && $event.stopPropagation();
    const trigger = new ButtonOperationResolver(this.componentService, this.config, dataOfState);
    trigger.toolbarAction(actionCfg, this.config.id);
    $event && $event.preventDefault();
  }

  getRowActions(state): any[] {
    const orginAction = this.tableColumns.find((c) => c.type === 'action');
    const copyAction = [];
    if (orginAction) {
      const actions = JSON.parse(
        JSON.stringify(this.tableColumns.find((c) => c.type === 'action').action.filter((c) => c.state === state)),
      );
      copyAction.push(...actions);
    }
    return copyAction;
  }

  nzEvent(event: NzFormatEmitEvent): void {
    console.log(event);
  }
  public searchTargetString(objtext) {
    // 查找处理
    const searchtext = this.searchValue;
    const reg = new RegExp(searchtext, 'g');
    const back = ['', '', ''];
    if (!reg.test(objtext)) {
      // 没找到
      return back;
    } else {
      // 找到
      const index = objtext.indexOf(searchtext);
      if (index > 0) {
        back[0] = objtext.substring(0, index);
      }
      back[1] = searchtext;
      const indexEnd = index + searchtext.length;
      back[2] = objtext.substring(indexEnd);
      return back;
    }
  }
  public transferValue(option?) {
    console.log('将接受传递的值');
  }

  // 1. 记录树加载刷新后，操作节点变化，记录每次变化的值
  // 2. 每次状态更改，则走库完善
  // 3. 点击按钮时，读取当前页面设置新状态（同步树）

  public iconStateValueChange(data?) {
    console.log('IconStateValueChange', data);
  }

  public applicationNode(v?) {
    if (this.config.checkStrictly) {
      const arr = this.treeObj.getCheckedNodeList();
      console.log('****勾选节点信息*****', arr);
      arr.forEach((item) => {
        // item['_title'] =item['_title']+'_[设置]';
        item.origin.ICON_STATE = v;
      });
    } else {
      console.log('****勾选节点信息ban*****', this.treeObj.getHalfCheckedNodeList());
      console.log('****勾选节点信息que*****', this.treeObj.getCheckedNodeList());

      const dataCheck = this.getCheckedNodeListByCustom(this.treeObj.getCheckedNodeList());
      const datahalfCheck = this.treeObj.getHalfCheckedNodeList();
      const data = [...dataCheck, ...datahalfCheck];
      console.log('****勾选节点信息que*****', data);
      data.forEach((item) => {
        // item['_title'] =item['_title']+'_[设置]';
        item.origin.ICON_STATE = v;
      });
    }
  }

  /**
   * 更改节点状态数据
   * @param option
   */
  public changeCheckedNodeData(option?) {
    if (!option) {
      return true;
    }
    if (this.config.checkStrictly) {
      const arr = this.treeObj.getCheckedNodeList();
      console.log('****勾选节点信息*****', arr);
      arr.forEach((item) => {
        // item['_title'] =item['_title']+'_[设置]';
        for (const key in option) {
          item.origin[key] = option[key];
        }
      });
    } else {
      const dataCheck = this.getCheckedNodeListByCustom(this.treeObj.getCheckedNodeList());
      const datahalfCheck = this.treeObj.getHalfCheckedNodeList();
      const data = [...dataCheck, ...datahalfCheck];
      console.log('****勾选节点信息que*****', data);
      data.forEach((item) => {
        // item['_title'] =item['_title']+'_[设置]';
        for (const key in option) {
          item.origin[key] = option[key];
        }
      });
    }
    return true;
  }

  /**
   * 获取当前勾选节点信息
   * @param NODE
   */
  public getCheckedNodeListByCustom(NODE?) {
    const arr = [];
    NODE.forEach((element) => {
      if (element._isChecked) {
        // 当前为选中状态有效
        arr.push(element);
        if (element._children && element._children.length > 0) {
          const arrchild = this.getCheckedNodeListByCustom(element._children);
          arr.push(...arrchild);
        }
      }
    });
    return arr;
  }

  /**
   * 默认 false
   */
  public treeMode(option?) {
    if (option) {
    } else {
      this.config.checkStrictly = !this.config.checkStrictly;
    }
  }

  /**
   * 获取当前树节点所有数据
   * @param option
   * @param checked
   */
  public getDataByFilter(option?, checked?) {
    // option=[
    //     {
    //         name:'id',
    //         type:'node',
    //         valueName:'ID'
    //     }
    // ];
    let arrall = [];
    if (checked) {
      arrall = this.getData();
    } else {
      const arr = this.treeObj.getTreeNodes();
      arrall = this.getCheckedNodeListByCustom(arr);
    }

    const arrback = [];

    arrall.forEach((item) => {
      let node_obj = {};
      if (option) {
        option.forEach((element) => {
          node_obj[element.name] = item.origin[element.valueName];
        });
      } else {
        node_obj = item.origin;
      }

      arrback.push(node_obj);
    });

    console.log('获取当前树节点数据', arrback);
    return arrback;
  }

  // 获取当前勾选属性
  public getData(): any {
    let treeNodeList = [];
    if (this.config.checkStrictly) {
      treeNodeList = this.treeObj.getCheckedNodeList();
    } else {
      const dataCheck = this.getCheckedNodeListByCustom(this.treeObj.getCheckedNodeList());
      let datahalfCheck = this.treeObj.getHalfCheckedNodeList();
      if (!datahalfCheck) {
        datahalfCheck = [];
      }
      if (datahalfCheck.length > 0) {
        treeNodeList = [...datahalfCheck, ...dataCheck];
      } else {
        treeNodeList = [...dataCheck];
      }

      // treeNodeList = Array.from(new Set(treeNodeList));
    }
    console.log('获取当前树节点数据', treeNodeList);
    return treeNodeList;
  }

  // 将当前树数据转为 大数组
  public async executeTreeDataByString(option) {
    console.log('execute checked nodes', option);
    const url = option.ajaxConfig.url;
    const method = option.ajaxConfig.ajaxType;
    const ajaxParams = option.ajaxConfig.params ? option.ajaxConfig.params : [];
    const parameterResult = [];

    const FilterData = this.getDataByFilter();
    let paramData;
    paramData = ParameterResolver.resolve({
      params: ajaxParams,
      item: { treeData: JSON.stringify(FilterData) },
      checkedItem: { treeData: JSON.stringify(FilterData) },
      tempValue: this.tempValue,
      initValue: this.initValue,
      cacheValue: this.cacheValue,
      userValue: this.userValue,
    });
    const response = await this.executeHttpRequest(url, method, paramData).toPromise();
    // 批量对象数据,返回结果都将以对象的形式返回,如果对应结果没有值则返回 {}
    this._sendDataSuccessMessage(response, option.ajaxConfig.result);

    // 处理validation结果
    const validationResult = this._sendDataValidationMessage(response, option.ajaxConfig.result);

    // 处理error结果
    const errorResult = this._sendDataErrorMessage(response, option.ajaxConfig.result);

    return validationResult && errorResult;
  }

  // 将当前树数据转为 大数组
  public async executeCheckedTreeDataByString(option) {
    console.log('execute checked nodes', option);
    const url = option.ajaxConfig.url;
    const method = option.ajaxConfig.ajaxType;
    const ajaxParams = option.ajaxConfig.params ? option.ajaxConfig.params : [];
    const parameterResult = [];

    const FilterData = this.getDataByFilter();
    let paramData;
    paramData = ParameterResolver.resolve({
      params: ajaxParams,
      item: { treeData: JSON.stringify(FilterData) },
      checkedItem: { treeData: JSON.stringify(FilterData) },
      tempValue: this.tempValue,
      initValue: this.initValue,
      cacheValue: this.cacheValue,
      userValue: this.userValue,
    });
    const response = await this.executeHttpRequest(url, method, paramData).toPromise();
    // 批量对象数据,返回结果都将以对象的形式返回,如果对应结果没有值则返回 {}
    this._sendDataSuccessMessage(response, option.ajaxConfig.result);

    // 处理validation结果
    const validationResult = this._sendDataValidationMessage(response, option.ajaxConfig.result);

    // 处理error结果
    const errorResult = this._sendDataErrorMessage(response, option.ajaxConfig.result);

    return validationResult && errorResult;
  }

  // 解析内置事件
  public analysisBuiltin(v?) {
    if (v.hasOwnProperty('builtinConfig')) {
      if (v.builtinConfig.event) {
        if (v.builtinConfig.content && v.builtinConfig.content.enableParams) {
          const params = {
            ...this.buildParameters(v.builtinConfig.content.Params),
          };
          this[v.builtinConfig.event](params);
        } else {
          this[v.builtinConfig.event]();
        }
      }
    }
  }
}
