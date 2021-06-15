import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { NzFormatEmitEvent, NzTreeComponent, NzTreeNode } from 'ng-zorro-antd/tree';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { CN_TREE_METHOD } from 'src/app/core/relations/bsn-methods/bsn-tree-methods';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { CommonUtils } from 'src/app/core/utils/common-utils';
import { SmtComponentBase } from '../smt-component.base';

interface ITreeBindProperties {
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
  iconState: boolean;
  leftIconState: any;
  rightIconState: any;
  descField: string;
}

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

  @ViewChild('treeComponentObj', { static: true })
  public treeComponentObj: NzTreeComponent;

  public columns = [
    {
      field: 'ID',
      title: 'ID',
      type: 'key',
    },
    {
      field: 'PARENT_ID',
      title: 'PARENT_ID',
      type: 'parentId',
    },
    {
      field: 'NAME',
      title: 'NAME',
      type: 'name',
    },
  ];
  public treeBindObj: {
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
    iconState: boolean;
    leftIconState: any;
    rightIconState: any;
    descField: string;
  };

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
  };

  public ACTIVED_NODE: any;

  private eventConfig = {
    componentEvent: [
      {
        eventTitle: '',
        eventName: 'clickNode',
        eventContent: [
          {
            tagViewTitle: '',
            tagViewId: 'treeDemo',
            preCondition: [],
            commandType: 'custom',
            command: 'message',
            parameters: [
              {
                name: 'ID',
                type: 'SELECTED_ITEM',
                valueName: 'ID',
              },
              {
                name: 'NAME',
                type: 'SELECTED_ITEM',
                valueName: 'NAME',
              },
            ],
          },
        ],
      },
    ],
  };

  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) {
    super(componentService);
    this.TEMP_VALUE = {};
    this.INIT_VALUE = {};
    this.COMPONENT_METHODS = CN_TREE_METHOD;
    this.dataSourceCfg = {
      loadingOnInit: true,
      expandConfig: {
        id: 'loading',
        urlType: 'inner', // 请求地址，inner 匹配的后台地址
        urlContent: {
          // 适配外部请求
          name: 'system_url',
          title: '权限系统访问地址',
        },
        url: 'smt-app/resource/TEST_TABLE/query',
        headParams: [
          // 头部参数
        ],
        ajaxType: 'get',
        pathParams: [
          // 路径参数
          // {
          //   name: 'pathParam',
          //   type: 'value',
          //   value: 'ddd'
          // }
        ],
        queryParams: [
          // {
          //   name: 'PROJECT_CODE',
          //   type: 'value',
          //   value: 'SMT_VC'
          // }
        ], // 查询参数
        bodyParams: [], // 请求体参数
      },
      loadingItemConfig: {
        id: 'loadingItem',
        urlType: 'inner', // 请求地址，inner 匹配的后台地址
        urlContent: {
          // 适配外部请求
          name: 'system_url',
          title: '权限系统访问地址',
        },
        url: 'smt-app/resource/TEST_TABLE/query',
        headParams: [
          // 头部参数
        ],
        ajaxType: 'get',
        pathParams: [
          // 路径参数
          // {
          //   name: 'pathParam',
          //   type: 'value',
          //   value: 'ddd'
          // }
        ],
        queryParams: [
          // {
          //   name: 'PROJECT_CODE',
          //   type: 'value',
          //   value: 'SMT_VC'
          // }
        ], // 查询参数
        bodyParams: [], // 请求体参数
      },
      loadingConfig: {
        id: 'loading',
        urlType: 'inner', // 请求地址，inner 匹配的后台地址
        urlContent: {
          // 适配外部请求
          name: 'system_url',
          title: '权限系统访问地址',
        },
        url: 'smt-app/resource/TEST_TABLE/query',
        headParams: [
          // 头部参数
        ],
        ajaxType: 'get',
        pathParams: [
          // 路径参数
          // {
          //   name: 'pathParam',
          //   type: 'value',
          //   value: 'ddd'
          // }
        ],
        queryParams: [
          // {
          //   name: 'PROJECT_CODE',
          //   type: 'value',
          //   value: 'SMT_VC'
          // }
        ], // 查询参数
        bodyParams: [], // 请求体参数
      },
      async: false,
    };
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

  /**
   * 未完成
   * @param config
   * @returns
   */
  private setTreeBindObj(config: any): ITreeBindProperties {
    return {
      checkStrictlyShow: config.checkStrictlyShow ? config.checkStrictlyShow : false,
      checkStrictly: config.checkStrictly ? config.checkStrictly : false,
      nodeSelectionConfig: config.nodeSelectionConfig ? config.nodeSelectionConfig : [],
      nodes: [],
      isAllChecked: config.isAllChecked ? config.isAllChecked : false,
      indeterminate: false,
      checkedNumber: 0,
      showSearch: config.showSearch ? config.showSearch : false,
      searchValue: '',
      expandAll: config.expandAll ? config.expandAll : true,
      showCheckBox: config.showCheckBox ? config.showCheckBox : false,
      showLine: config.showLine ? config.showLine : false,
      defaultSelectedKeys: [],
      enableState: config.enableState ? config.enableState : false,
      iconState: config.iconState ? config.iconState : [],
      leftIconState: [],
      rightIconState: [],
      descField: config.descFile ? config.descField : null,
    };
  }

  ngOnInit(): void {
    this._initComponent(this.config);

    this._resolveRelations();

    this.dataSourceCfg.loadingOnInit && this.load();
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

  private _setTreeNode(node: any) {
    this.columns.map((column: any) => {
      node[column.type] = node[column.field];
    });
    this.mapOfDataState[node[this.KEY_ID]] = {
      disabled: false,
      checked: node.checked ? node.checked : false,
      selected: false,
      state: 'text',
      data: node,
      originData: { ...node },
    };

    if (node.children && node.children.length > 0) {
      if (!this.dataSourceCfg.async) {
        node.expanded = this.treeBindObj.expandAll;
        node.children.map((n: any) => {
          this._setTreeNode(n);
        });
      }
      node.isLeaf = false;
    } else {
      node.isLeaf = true;
    }
  }

  public async expandNode($event: NzFormatEmitEvent | NzTreeNode) {
    let node: any;
    let currentNode;
    if ($event instanceof NzTreeNode) {
      currentNode = $event;
    } else {
      currentNode = $event.node;
    }
    if (!this.dataSourceCfg.async) {
      return true;
    }

    node = this.treeComponentObj.getTreeNodeByKey(currentNode.key);

    if (node && node.isExpanded) {
      const response: any = this.executeHttp(this.treeBindObj, node, null);
      if (response && response.data && response.data.length > 0) {
        node.clearChildren();
        response.data.map((d: any) => {
          this._setTreeNode(d);
          if (d.children && d.children.length > 0) {
          }
        });
        node.addChildren(response.data);
      } else {
        node.addChildren([]);
        node.isExpanded = false;
      }
    } else if (node.isExpanded === false) {
      node.clearChildren();
    }
  }

  public preventClickNode($event) {
    const finalResults = [];
    if (this.treeBindObj.nodeSelectionConfig && Array.isArray(this.treeBindObj.nodeSelectionConfig)) {
      if ($event.node.origin) {
        this.treeBindObj.nodeSelectionConfig.forEach((cpm: any) => {
          if (cpm.compare && Array.isArray(cpm.compare)) {
            const results = [];
            cpm.compare.forEach((element: any) => {
              switch (element.type) {
                case 'clickNode':
                  const nodeValue = $event.node.origin[element.valueName];
                  const cValue = element.value;
                  const r = this._compare(nodeValue, cValue, element.compare, element.method, element.prevent);
                  break;
              }
            });
            // 计算并且关系
            const innerResult = results.findIndex((r: boolean) => r === true) > 0;
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

  private _resolveRelations() {
    new SmtComponentEventResolver(this).resolve(this.eventConfig.componentEvent);
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

  clickNode($event?: NzFormatEmitEvent) {
    const prevent = this.preventClickNode($event);
    if (!prevent) {
      return;
    }
    if (this.ACTIVED_NODE) {
      this.ACTIVED_NODE.isSelected = false;
      this.ACTIVED_NODE.selected && (this.ACTIVED_NODE.selected = false);
      this.ACTIVED_NODE = null;
    }
    this.treeComponentObj.getTreeNodeByKey($event.node.key).isSelectable = true;
    this.ACTIVED_NODE = this.ACTIVED_NODE.origin;
    this.SELECTED_ITEM = this.ACTIVED_NODE.origin;

    this.TEMP_VALUE.selectedNode = {
      ...$event.node.origin,
    };

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
    this.IS_LOADING = true;
    const url = this.dataSourceCfg.loadingConfig.url;
    const method = this.dataSourceCfg.loadingConfig.ajaxType;
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
          this.IS_LOADING = false;
        } else {
          this.IS_LOADING = false;
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }

  public refreshData(loadNewData) {
    if (loadNewData && Array.isArray(loadNewData)) {
      loadNewData.map((newData) => {
        const index = this.treeBindObj.nodes.findIndex((d) => d[this.KEY_ID] === newData[this.KEY_ID]);
        if (index > -1) {
          this.treeBindObj.nodes.splice(index, 1, newData);
          this.treeBindObj.nodes = [...this.treeBindObj.nodes];
        } else {
          this.treeBindObj.nodes = [loadNewData[index], ...this.treeBindObj.nodes];
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
            actions: this.getActions('new'),
          };
        }
      });
    }
    // 刷新nodes
    // 刷新mapOfDataState
  }

  private async _getAsyncTreeData(ajaxConfig: any = null, nodeValue: any = null) {
    return await this.executeHttp(ajaxConfig.params, nodeValue, '');
  }

  /**
   * 创建新节点数据结构
   * @returns
   */
  private createNewNodeData() {
    const newData = {};
    this.config.columns.map((col) => {
      newData[col.field] = null;
    });
    return newData;
  }

  /**
   * 添加节点
   */
  public addNode() {
    const newId = CommonUtils.uuID(36);
    const newData = this.createNewNodeData();
    newData[this.KEY_ID] = newId;

    this.treeBindObj.nodes = [newData, ...this.treeBindObj.nodes];

    this.mapOfDataState[newId] = {
      data: newData,
      originData: { ...newData },
      disabled: false,
      checked: true,
      selected: false,
      state: 'new',
      actions: this.getActions('new'),
    };
  }

  getActions(state): any {}

  public deleteCheckedNodes(option) {
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
      const deletedNode = this.treeComponentObj.getTreeNodeByKey(option[this.KEY_ID]);
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
          this.treeBindObj.nodes = this.treeBindObj.nodes.filter((node) => node.key !== option[this.KEY_ID]);
          this.treeBindObj.nodes[0].isSelected = true;
          this.ACTIVED_NODE = this.treeBindObj.nodes[0];
        }

        this.SELECTED_ITEM = this.ACTIVED_NODE.origin;
      }
    }
  }

  /**
   * 未完成
   * @param option
   */
  public async executeSelectNode(option) {
    const response: any = await this.executeHttp(option.ajaxConfig, option['data']['data']);
    if (response && response.state === 1) {
    } else {
    }
  }

  /**
   *
   * @param option
   * @returns
   */
  public async executeCheckedNodesByID(option: any) {
    const data = this.getData();
    const parametersResult = [];
    const paramCfg = [{ name: this.KEY_ID, type: 'item', valueName: this.KEY_ID }];
    data.map((d: any) => {
      const paramValue = this.buildParameters(paramCfg, d, false);
      if (paramValue) {
        parametersResult.push(paramValue);
      }
    });
    if (parametersResult.length > 0) {
      const ids = [];
      parametersResult.map((p) => {
        const pData = p[this.KEY_ID];
        if (pData && !ids.includes(pData)) {
          ids.push(pData);
        }
      });

      const response = await this.executeHttp(option.ajaxConfig, { ids: ids.join(',') }, null);
      //
    } else {
      return false;
    }
  }

  public getData(): any {
    let treeNodeList = [];
    if (this.treeBindObj.checkStrictly) {
      treeNodeList = this.treeComponentObj.getCheckedNodeList();
    } else {
      const dataCheck = this.getCheckedNodeListByCustom(this.treeComponentObj.getCheckedNodeList());
      let datahalfCheck = this.treeComponentObj.getHalfCheckedNodeList();
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

    this.SELECTED_ITEM = rowData;

    // 选中当前行
    this.treeBindObj.nodes.map((row) => {
      this.mapOfDataState[row[this.KEY_ID]].selected = false;
    });

    this.mapOfDataState[rowData[this.KEY_ID]].selected = true;

    // 勾选/取消当前行勾选状态
    this.mapOfDataState[rowData[this.KEY_ID]].checked = !this.mapOfDataState[rowData[this.KEY_ID]].checked;
    this.dataCheckedStatusChange();
    return true;
  }

  /**
   * 全选
   */
  public checkAll($value: boolean): void {
    //
    this.treeBindObj.nodes
      .filter((item) => !this.mapOfDataState[item[this.KEY_ID]]['dislabled'])
      .map((item) => (this.mapOfDataState[item[this.KEY_ID]].checked = $value));
    this.dataCheckedStatusChange();
  }

  /**
   * 更新数据选中状态的CheckBox
   */
  public dataCheckedStatusChange() {
    this.treeBindObj.isAllChecked = this.treeBindObj.nodes
      .filter((item) => !this.mapOfDataState[item[this.KEY_ID]]['dislabled'])
      .every((item) => this.mapOfDataState[item[this.KEY_ID]].checked);

    this.treeBindObj.indeterminate =
      this.treeBindObj.nodes
        .filter((item) => !this.mapOfDataState[item[this.KEY_ID]]['dislabled'])
        .some((item) => this.mapOfDataState[item[this.KEY_ID]].checked) && !this.treeBindObj.isAllChecked;

    this.treeBindObj.checkedNumber = this.treeBindObj.nodes.filter((item) => this.mapOfDataState[item[this.KEY_ID]].checked).length;

    // 更新当前选中数据集合
    this.CHECKED_ITEMS = this.treeBindObj.nodes
      .filter((item) => !this.mapOfDataState[item[this.KEY_ID]]['dislabled'])
      .filter((item) => this.mapOfDataState[item[this.KEY_ID]].checked);
  }

  private _setRootSelectedNode(currentSelectedNode) {
    if (currentSelectedNode) {
      currentSelectedNode.isSelected = true;
    }
  }

  public async appendChildToRootNode(option) {
    let appendNodeData: any = {};
    if (this.dataSourceCfg.loadingItemConfig) {
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
    this.treeBindObj.nodes = this.treeComponentObj.getTreeNodes();
    this.treeBindObj.nodes = [addRootNode, ...this.treeBindObj.nodes];
    this.ACTIVED_NODE = addRootNode;
    this.SELECTED_ITEM = addRootNode.origin;
    // const currentSelectedNode = this.treeObj.getTreeNodeByKey(this.ACTIVED_NODE.key);
    this._setRootSelectedNode(addRootNode);
  }

  public async loadItem(data?) {
    const response = await this.executeHttp(this.dataSourceCfg, data, null);
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

    const currentSelectedNode = this.treeComponentObj.getTreeNodeByKey(this.ACTIVED_NODE.key);
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
    } else {
      // 节点已经打开,直接在节点下添加子节点
      currentSelectedNode.addChildren([{ ...option, ...appendNodeData }]);
    }
  }

  // 批量添加多个节点
  public async appendChildsToSelectedNode(option) {
    // let appendNode: NzTreeNode;

    const currentSelectedNode = this.treeComponentObj.getTreeNodeByKey(this.ACTIVED_NODE.key);
    if (currentSelectedNode.isLeaf) {
      currentSelectedNode.isLeaf = false;
    }
    if (!currentSelectedNode.isExpanded) {
      currentSelectedNode.isExpanded = true;
      if (!this.config.async) {
      } else {
        this.expandNode(currentSelectedNode);
      }
    } else {
      // 节点已经打开,直接在节点下添加子节点
      this.expandNode(currentSelectedNode);
    }
  }

  // 刷新选中节点的父节点
  public async refreshDataToSelectedParentNode(option) {
    // let appendNode: NzTreeNode;

    if (this.ACTIVED_NODE.parentNode) {
      const currentSelectedNode = this.treeComponentObj.getTreeNodeByKey(this.ACTIVED_NODE.parentNode.key);
      if (currentSelectedNode.isLeaf) {
        currentSelectedNode.isLeaf = false;
      }
      if (!currentSelectedNode.isExpanded) {
        currentSelectedNode.isExpanded = true;
        if (!this.config.async) {
        } else {
          this.expandNode(currentSelectedNode);
        }
      } else {
        // 节点已经打开,直接在节点下添加子节点
        this.expandNode(currentSelectedNode);
      }
    } else {
      this.load(); // 全刷新
    }
  }

  public async updateSelectedNode(option) {
    let appendNodeData: any = {};
    if (this.config.loadingItemConfig) {
      option = await this.loadItem(option);
    }

    this.config.columns.map((col) => {
      appendNodeData[col.type] = option[col.field];
    });

    const node = this.treeComponentObj.getTreeNodeByKey(appendNodeData.key);
    if (node) {
      node.title = appendNodeData.title;
      node.origin = { ...option, ...appendNodeData };
      this.ACTIVED_NODE = node;
      this.SELECTED_ITEM = this.ACTIVED_NODE.origin;
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
      const arr = this.treeComponentObj.getCheckedNodeList();
      console.log('****勾选节点信息*****', arr);
      arr.forEach((item) => {
        // item['_title'] =item['_title']+'_[设置]';
        for (const key in option) {
          item.origin[key] = option[key];
        }
      });
    } else {
      const dataCheck = this.getCheckedNodeListByCustom(this.treeComponentObj.getCheckedNodeList());
      const datahalfCheck = this.treeComponentObj.getHalfCheckedNodeList();
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
   * 默认 false
   */
  public treeMode(option?) {
    if (option) {
    } else {
      this.config.checkStrictly = !this.config.checkStrictly;
    }
  }

  /**
   * 获取当前勾选节点信息
   * @param node
   */
  public getCheckedNodeListByCustom(node?) {
    const arr = [];
    node.forEach((element) => {
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

  //#region 移动节点
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
    if (this.ACTIVED_NODE.parentNode) {
      const currentSelectedNode1 = this.treeComponentObj.getTreeNodeByKey(this.ACTIVED_NODE.parentNode.key);
      if (currentSelectedNode1['origin']['children']) {
        const aa = currentSelectedNode1['origin']['children'];
        currentSelectedNode1.clearChildren();
        currentSelectedNode1.addChildren(this.sortNodes(aa, option, this.ACTIVED_NODE.key));
      }
    } else {
      // 是根节点操作
      this.treeBindObj.nodes = this.treeComponentObj.getTreeNodes();
      const currentSelectedNode = this.treeComponentObj.getTreeNodeByKey(this.ACTIVED_NODE.key);
      const _nodes = this.sortNodes(this.treeBindObj.nodes, option, this.ACTIVED_NODE.key);
      this.treeBindObj.nodes = [..._nodes];
    }
    return true;
  }

  private sortNodes(list?, sortType?, value?) {
    // 数组，排序类型（up、down），进度（1）
    const index = list.findIndex((item) => item.key === value);
    return this[sortType](index, list);
  }
  //#endregion

  //#region 对话框内容
  public showConfirm(option: any) {
    this.buildConfirm(option.dialog, () => {
      this.executeSelectNode(option);
    });
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
  //#endregion

  public iconStateValueChange(data?) {
    console.log('IconStateValueChange', data);
  }

  public searchTargetString(objtext) {
    // 查找处理
    const searchtext = this.treeBindObj.searchValue;
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
}

export interface ISenderModel {
  targetViewId: string;
  command: string;
  data: any[];
}

export class SmtComponentEventResolver {
  constructor(private _componentInstance: any) {}
  public resolve(componentEvents: any[]) {
    if (componentEvents && Array.isArray(componentEvents) && componentEvents.length > 0) {
      const source$ = from(componentEvents);
      const subscribe$ = source$.pipe(
        map((evt: any) => {
          this._resolveEventContent(evt.eventName, evt.eventContent);
        }),
      );

      return subscribe$;
    }
  }

  private _resolveEventContent(eventName: string, eventContent: any) {
    // 判断前置条件
    if (eventContent.preCondition) {
      this._resolvePreCondition(eventContent.preCondition);
    }
    if (eventContent.tagViewId && eventContent.command && eventContent.commandType) {
      return new ComponentEventSender(this._componentInstance).sendEvent(eventName, {
        targetViewId: eventContent.targetViewId,
        command: eventContent.command,
        data: this._componentInstance.buildParameter(eventContent.parameters),
      });
    }
  }

  private _resolvePreCondition(condition: any[]) {}
}

export class ComponentEventSender {
  constructor(private _componentInstance: any) {}

  public sendEvent(eventName: string, senderModel: ISenderModel) {
    this._componentInstance['after'](this._componentInstance, this._componentInstance.COMPONENT_METHODS[eventName], () => {
      this._componentInstance.componentService.commonRelationSubject.next(senderModel);
    });
  }
}
