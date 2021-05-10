import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NzFormatEmitEvent, NzTreeComponent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';

@Component({
  selector: 'app-cfg-l-form-sider',
  templateUrl: './cfg-l-form-sider.component.html',
  styles: [
  ]
})
export class CfgLFormSiderComponent implements OnInit {

  @Input() public layout_nodes: NzTreeNodeOptions[];
  @Input() public selectedItem: any;
  @Input() public fromDataService: configFormDataServerService;
  defaultSelectedKeys = [];
  constructor() { }

  ngOnInit(): void {
    this.fromDataService.treeInstance = this;
  }


  //===========================
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
          "dropName": "row",
          "icon": "insert-row-above",
          "title": "行"
        },
        {
          "id": "002",
          "dropName": "col",
          "icon": "column-width",
          "title": "列"
        }
      ]
    },
    {
      active: true,
      name: '表单组件',
      disabled: false,
      children: [
        {
          "id": "001",
          "dropName": "item_input",
          "icon": "edit",
          "title": "输入框"
        },
        {
          "id": "002",
          "dropName": "item_select",
          "icon": "select",
          "title": "下拉"
        },
        {
          "id": "003",
          "dropName": "item_time",
          "icon": "field-time",
          "title": "时间"
        },
        {
          "id": "004",
          "dropName": "item_check",
          "icon": "check-square",
          "title": "勾选"
        }


      ]
    }


  ];

  Flex = "250px";
  test_Flex() {
    if (this.Flex === "60px") {
      this.Flex = "250px";
    } else {
      this.Flex = "60px";
    }

    //  let d = differenceInBusinessDays(new Date('2021-6-30'), new Date());
    //  let d1 = differenceInDays(new Date('2021-6-30'), new Date());

    //  console.log('时间差', d, d1);
  }

  is_drag = true;
  public f_ondragstart(e?, d?) {
    // this.d_row = d;
    e.dataTransfer.setData('test', d);
    console.log('拖动行', e, d);
    const ss = e.dataTransfer.getData('test');
    console.log('拖动行临时值', ss);
  }

  public text_sider() {
    console.log('text_sider');
  }


  public nzEvent(v?) {

    let selectNode = this.nzLayoutTreeComponent.getSelectedNodeList()
    console.log('树节点选中', v, this.layout_nodes, this.selectedItem, '=select::=', selectNode);
    if (v.node['origin']['type'] === 'col') {
      this.selectedItem['item'] = { id: v.node['key'] };
      this.selectedItem['active'] = 'col';
    }
    if (v.node['origin']['type'] === 'form') {
      this.selectedItem['cmptitem'] = { id: v.node['key'] };
      this.selectedItem['active'] = 'cmpt';
    }
    if (v.node['origin']['type'] === 'row') {
      this.selectedItem['rowitem'] = { id: v.node['key'] };
      this.selectedItem['active'] = 'row';
    }



  }
  nzSelect(keys: string[]): void {
    console.log('选。。。。。', keys);
  }
  @ViewChild('nzTreeComponent', { static: false }) nzTreeComponent!: NzTreeComponent;



  nzClick(event: NzFormatEmitEvent): void {
    console.log(event);
  }

  nzCheck(event: NzFormatEmitEvent): void {
    console.log(event);
  }


  layoutTree = [{
    "key": '001',
    "parentId": 'null',
    "id": "001",
    "type": "layout",
    "title": "布局",
    "container": "rows",
    "children": [
      {
        "key": '001001',
        "parentId": '001',
        "id": "001001",
        "title": "行1",
        "type": "row",
        "container": "cols",
        "children": [
          {
            "key": '001001001',
            "parentId": '001001',
            "id": "001001001",
            "title": "列1",
            "type": "col",
            "container": "component"
          }
        ]
      },
      {
        "key": '001002',
        "parentId": '001',
        "id": "001001",
        "title": "行2",
        "type": "row"
      }

    ]
  }]


  @ViewChild('nzLayoutTreeComponent', { static: false }) nzLayoutTreeComponent!: NzTreeComponent;

  addChildrenNode(id, node, index) {

    console.log('add====>', node)
    let _node = this.nzLayoutTreeComponent.getTreeNodeByKey(id);
    _node.addChildren([node], index);


  }
  delChildrenNode(id, node, index) {

    let _node = this.nzLayoutTreeComponent.getTreeNodeByKey(id);
    _node['children'].splice(index, 1);

  }





}
