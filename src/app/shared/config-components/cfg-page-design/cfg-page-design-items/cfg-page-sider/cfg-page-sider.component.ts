import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NzTreeComponent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';
import { CommonUtils } from 'src/app/core/utils/common-utils';

@Component({
  selector: 'app-cfg-page-sider',
  templateUrl: './cfg-page-sider.component.html',
  styles: [
  ]
})
export class CfgPageSiderComponent implements OnInit {

  @Input() public layout_nodes: NzTreeNodeOptions[];
  @Input() public selectedItem: any;
  @Input() public fromDataService: configFormDataServerService;
  @Input() public layoutTree = [];
  @ViewChild('nzLayoutTreeComponent', { static: false }) nzLayoutTreeComponent!: NzTreeComponent;

  defaultSelectedKeys = [];
  is_drag = true;
  //  layoutTree = [];
  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {

    this.fromDataService.layoutTreeInstance = this;
    this.load();

  }
  async load() {
    // 加载 侧边栏
    this.left_panels = await this.load_sider('vc/componentInit/page-sider.json');
  }

  gridStyle = {
    width: '50%',
    textAlign: 'center'
  };
  left_panels = [
    {
      active: true,
      disabled: false,
      name: '布局组件',
      children: [
        {
          "id": "001",
          "type": "layout",
          "dropType": "page",
          "dropName": "row",
          "icon": "insert-row-above",
          "title": "行"
        },
        {
          "id": "002",
          "type": "layout",
          "dropType": "page",
          "dropName": "col",
          "icon": "column-width",
          "title": "列"
        },
        {
          "id": "003",
          "type": "layout",
          "dropType": "page",
          "dropName": "tabs",
          "icon": "column-width",
          "title": "页签"
        }
      ]
    },
    {
      active: true,
      name: '数据组件',
      disabled: false,
      children: [
        {
          "id": "001",
          "type": "component",
          "dropType": "page",
          "dropName": "cnForm",
          "icon": "edit",
          "title": "表单"
        },
        {
          "id": "002",
          "type": "component",
          "dropType": "page",
          "dropName": "cnTree",
          "icon": "select",
          "title": "树"
        },
        {
          "id": "003",
          "type": "component",
          "dropType": "page",
          "dropName": "cnTable",
          "icon": "field-time",
          "title": "表格"
        },
        {
          "id": "004",
          "type": "component",
          "dropType": "page",
          "dropName": "cnTreeTable",
          "icon": "check-square",
          "title": "树表"
        },
        {
          "id": "005",
          "type": "component",
          "dropType": "page",
          "dropName": "cnToolbar",
          "icon": "check-square",
          "title": "按钮组"
        },
        {
          "id": "006",
          "type": "component",
          "dropType": "page",
          "dropName": "cnRowToolbar",
          "icon": "check-square",
          "title": "行内按钮"
        }



      ]
    }
  ];

  public f_ondragstart(e?, d?) {
    // this.d_row = d;
    d = JSON.stringify(d);
    e.dataTransfer.setData('test', d);
    console.log('拖动行', e, d);
    const ss = e.dataTransfer.getData('test');
    console.log('拖动行临时值', ss);
  }


  addChildrenNode(id, node, index) {

    console.log('add====>', node)
    let _node = this.nzLayoutTreeComponent.getTreeNodeByKey(id);
    _node.addChildren([node], index);


  }
  delChildrenNode(id, node, index) {

    let _node = this.nzLayoutTreeComponent.getTreeNodeByKey(id);
    _node['children'].splice(index, 1);
  }
  clearChildrenByNode(id) {
    let _node = this.nzLayoutTreeComponent.getTreeNodeByKey(id);
    // _node.clearChildren();
    _node['children'] = [];
  }

  updateNode(id?, data?) {
    let _node = this.nzLayoutTreeComponent.getTreeNodeByKey(id);
    _node['title'] = data['title'];
    _node['origin']['title'] = data['title'];
    _node.update();
  }

  public nzEvent(v?) {

    let selectNode = this.nzLayoutTreeComponent.getSelectedNodeList()
    console.log('树节点选中', v, this.layout_nodes, this.selectedItem, '=select::=', selectNode);
    if (v.node['origin']['type']) {
      this.selectedItem['item'] = { id: v.node['key'] };
      this.selectedItem['active'] = v.node['origin']['type'];
    }

    this.fromDataService.treeNodeSelected(selectNode);




  }


  async load_sider(cmpt?) {

    let backData = null;
    const timestamp = new Date().getTime();
    const data = await this.httpClient.get(`assets/${cmpt}?${timestamp}`).toPromise();
    backData = data;
    console.log('加载配置', data);
    backData[1]['children'].forEach(async d => {
      if (d['path']) {
        d['data'] = await this.load_component_default_value(d['path']);
      }
    });

    return backData;
  }
  async load_component_default_value(cmpt?) {

    let backData = null;
    const timestamp = new Date().getTime();
    const data = await this.httpClient.get(`assets/${cmpt}?${timestamp}`).toPromise();
    console.log('加载配置', data);
    if (data)
      backData = this.createDefault(data['default']);
    return backData;
  }


  createDefault(d1) {

    let defaultValue: any;
    defaultValue = this.jx_object(d1['properties'], d1['data']);
    console.log('默认值', defaultValue);
    return defaultValue;

  }


  jx_object(d_config, data?) {
    let v = {};
    d_config.forEach(element => {

      let formType = "value";

      if (element['formType']) {
        formType = element['formType']
      }
      if (formType === 'object') {
        v[element['name']] = this.jx_object(element['properties'], data[element['name']]);
      }
      if (formType === 'array') {
        v[element['name']] = this.jx_array(element['properties'], data[element['name']]);
      }
      if (formType === 'value') {
        v[element['name']] = this.jx_value(element, data);
      }

    });
    v = { ...data, ...v }
    return v;
  }

  jx_array(d_config, data) {

    let v = [];
    if (data) {
      data.forEach(element => {
        let obj = this.jx_object(d_config, element);
        obj = { ...element, ...obj }
        v.push(obj);
      });
    }
    return v;
  }

  jx_value(d_config, data) {

    let v: any;
    if (d_config['defaultType'] === 'custom') {
      v = this.jx_coustomValue(d_config['customValue']);

    } else {
      v = data[d_config['name']];
    }
    return v;
  }
  jx_coustomValue(d_config) {
    let v: any;
    if (d_config['type'] === 'value') {
      v = d_config['value'];
    }
    if (d_config['type'] === 'GUID') {
      v = CommonUtils.uuID(36)
    }
    return v;
  }


}
