import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NzTreeComponent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';

@Component({
  selector: 'app-cfg-form-sider',
  templateUrl: './cfg-form-sider.component.html',
  styles: [
  ]
})
export class CfgFormSiderComponent implements OnInit {

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
    this.left_panels = await this.load_sider('vc/componentInit/form-sider.json');
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
          "dropType": "form",
          "dropName": "row",
          "icon": "insert-row-above",
          "title": "行"
        },
        {
          "id": "002",
          "type": "layout",
          "dropType": "form",
          "dropName": "col",
          "icon": "column-width",
          "title": "列"
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
          "dropType": "form",
          "dropName": "cnFormInput",
          "icon": "edit",
          "title": "输入框",
          "sourceData": {
            "field": "name",
            "type": "input",
            "displayType": "text"
          }
        },
        {
          "id": "002",
          "type": "component",
          "dropType": "form",
          "dropName": "cnFormSelect",
          "icon": "select",
          "title": "下拉"
        },
        {
          "id": "003",
          "type": "component",
          "dropType": "form",
          "dropName": "cnFormTime",
          "icon": "field-time",
          "title": "时间"
        },
        {
          "id": "004",
          "type": "component",
          "dropType": "form",
          "dropName": "cnFormCheck",
          "icon": "check-square",
          "title": "勾选"
        }
      ]
    }


  ];

  public f_ondragstart(e?, d?) {
    // this.d_row = d;
    // let text = { "compt": "dddd" };
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
    /*     backData[1]['children'].forEach(async d => {
          if (d['path']) {
            d['data'] = await this.load_component_default_value(d['path']);
          }
        }); */

    return backData;
  }

}
