import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';
import { CommonUtils } from 'src/app/core/utils/common-utils';

@Component({
  selector: 'cfg-form-layout',
  templateUrl: './cfg-form-layout.component.html',
  styleUrls: ['./cfg-form-layout.component.css']
})
export class CfgFormLayoutComponent implements OnInit {

  @Input() public showLayout;
  @Input() public cmptState;
  @Input() public selectedItem: any;

  @Input() public fromDataService: configFormDataServerService;

  l_config: any;
  constructor() { }

  public ngOnInit() {

    this.l_config = this.layoutTree[0];
    this.fromDataService.treeInstance.layoutTree = this.layoutTree;

  }



  /**
   * form_StateChange
   */
  public form_StateChange(v?) {

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
            "container": "component",
            "span": '24',
            "size": {
              "nzXs": 24,
              "nzSm": 24,
              "nzMd": 24,
              "nzLg": 24,
              "ngXl": 24,
              "nzXXl": 24
            }
          }
        ]
      },
      {
        "key": '001002',
        "parentId": '001',
        "id": "001002",
        "title": "行2",
        "type": "row",
        "children": [
          {
            "key": '001001002',
            "parentId": '001001',
            "id": "001001002",
            "title": "列1",
            "type": "col",
            "container": "component",
            "span": '24',
            "size": {
              "nzXs": 24,
              "nzSm": 24,
              "nzMd": 24,
              "nzLg": 24,
              "ngXl": 24,
              "nzXXl": 24
            }
          }
        ]
      }

    ]
  }]


  l_config1 = {
    "id": "PAGES_layout",
    "type": "layout",
    "title": "布局",
    "container": "rows",
    "rows": [
      {
        "cols": [
          {
            "id": "PAGES_clos_1",
            "col": "cc",
            "type": "col",
            "titlestate": 1,
            "title": "",
            "span": 24,
            "container": "component",
            "size": {
              "nzXs": 24,
              "nzSm": 24,
              "nzMd": 24,
              "nzLg": 24,
              "ngXl": 24,
              "nzXXl": 24
            },
            "component": {
              "id": "view_business_search",
              "type": "form",
              "title": "",
              "container": "form"
            }
          },
          {
            "id": "PAGES_clos_2",
            "col": "cc",
            "type": "col",
            "titlestate": 1,
            "title": "",
            "span": 24,
            "container": "component",
            "size": {
              "nzXs": 24,
              "nzSm": 24,
              "nzMd": 24,
              "nzLg": 24,
              "ngXl": 24,
              "nzXXl": 24
            },
            "bodyStyle": {
              "min-height": "650px"
            },
            "header": {
              "title": "日志记录",
              "icon": "",
              "id": "button_01"
            },
            "component": {
              "id": "table_01",
              "type": "cnDataTable",
              "title": "",
              "container": "cnDataTable"
            }
          }
        ],
        "id": "PAGES_rows",
        "type": "row",
        "title": "行",
        "showTitle": true,
        "container": "cols"
      },
      {
        "cols": [
          {
            "id": "PAGES_clos_11",
            "col": "cc",
            "type": "col",
            "titlestate": 1,
            "title": "",
            "span": 24,
            "container": "component",
            "size": {
              "nzXs": 24,
              "nzSm": 24,
              "nzMd": 24,
              "nzLg": 24,
              "ngXl": 24,
              "nzXXl": 24
            },
            "component": {
              "id": "view_business_search",
              "type": "form",
              "title": "",
              "container": "form"
            }
          },
          {
            "id": "PAGES_clos_21",
            "col": "cc",
            "type": "col",
            "titlestate": 1,
            "title": "",
            "span": 24,
            "container": "component",
            "size": {
              "nzXs": 24,
              "nzSm": 24,
              "nzMd": 24,
              "nzLg": 24,
              "ngXl": 24,
              "nzXXl": 24
            },
            "bodyStyle": {
              "min-height": "650px"
            },
            "header": {
              "title": "日志记录",
              "icon": "",
              "id": "button_01"
            },
            "component": {
              "id": "table_01",
              "type": "cnDataTable",
              "title": "",
              "container": "cnDataTable"
            }
          }
        ],
        "id": "PAGES_rows1",
        "type": "row",
        "title": "行",
        "showTitle": false,
        "container": "cols"
      }
    ]
  }





  listOfData = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    }
  ];

  /*   drop(event: CdkDragDrop<string[]>): void {
      moveItemInArray(this.listOfData, event.previousIndex, event.currentIndex);
    }
   */

  is_drag = true;
  public f_ondragstart(e?, d?) {
    // this.d_row = d;
    e.dataTransfer.setData('test', d);
    console.log('拖动行', e, d);
    const ss = e.dataTransfer.getData('test');
    console.log('拖动行临时值', ss);
  }

  PreviewLayout() {

    this.components = [];
    this.nodes = [];
    this.jxlayout_components(this.l_config, 'NULL');
    this.layout_nodes = this.listToTree(this.nodes);
    console.log('=布局json=', this.l_config);
    console.log('=布局结构树=', this.nodes);
    console.log('=组件集合=', this.components);
  }

  layout_row = 4;
  layout_col = 2;
  layout_col_size = 12;

  layoutSourceData = {};

  CreateLayout() {

    let layout_id = CommonUtils.uuID(30);
    let layout_obj = {
      "id": layout_id,
      "key": layout_id,
      "type": "layout",
      "title": "【表单主对象】布局",
      "container": "rows",
      "expanded": true,
      "parentId": 'null'
    }
    this.layoutSourceData[layout_id] = layout_obj;

    this.l_config = {
      ...layout_obj,
      "children": this.CreateLayout_row(this.layout_row, layout_id)
    }

    this.fromDataService.layoutSourceData = this.layoutSourceData;
    this.fromDataService.treeInstance.layoutTree = [];
    this.fromDataService.treeInstance.layoutTree = [this.l_config];


  }

  CreateLayout_row(count?, pid?) {

    let rows = [];
    for (let i = 0; i < count; i++) {
      let row_id = CommonUtils.uuID(30);
      let row_obj = {
        "id": row_id,
        "key": row_id,
        "type": "row",
        "title": "行",
        "parentId": pid,
        "expanded": true,
        "showTitle": false,
        "container": "cols"
      }
      let r = {
        ...row_obj,
        "children": this.CreateLayout_col(this.layout_col, row_id),
      }
      this.layoutSourceData[row_id] = row_obj;
      rows.push(r);
    }
    return rows;

  }

  CreateLayout_col(count?, pid?) {
    let cols = [];
    for (let i = 0; i < count; i++) {

      let col_id = CommonUtils.uuID(30);
      let cmpt_obj = this.CreateLayout_component(col_id);
      let col_obj = {
        "id": col_id,
        "key": col_id,
        "type": "col",
        "title": "列",
        "parentId": pid,
        "expanded": true,
        "span": this.layout_col_size,
        "size": this.CreateLayout_col_size(this.layout_col_size),
        "container": "component",
        "component": cmpt_obj
      }
      let c = {
        ...col_obj,
        "children": [cmpt_obj]
      }
      this.layoutSourceData[col_id] = col_obj;
      cols.push(c);
    }
    return cols;
  }
  CreateLayout_component(pid?) {
    let cmpt_id = CommonUtils.uuID(30);
    let cmpt_obj = {
      "id": cmpt_id,
      "key": cmpt_id,
      "type": "form",
      "title": "明细项",
      "parentId": pid,
      "expanded": true
    }

    this.layoutSourceData[cmpt_id] = cmpt_obj;
    return cmpt_obj;


  }

  CreateLayout_col_size(size?) {

    let sizeObj = {
      "nzXs": size,
      "nzSm": size,
      "nzMd": size,
      "nzLg": size,
      "ngXl": size,
      "nzXXl": size
    }
    return sizeObj;

  }

  nodes = [];
  components = [];
  layout_nodes: NzTreeNodeOptions[];
  public jxlayout_components(layoutconfig?, parentid?) {
    // console.log('xxx:',layoutconfig);
    if (layoutconfig instanceof Array) {
      // 数组
      layoutconfig.forEach((item) => {
        if (item.hasOwnProperty('container')) {
          const d_item: NzTreeNodeOptions = { key: item.id, id: item.id, type: item.type, title: item.title, parentId: parentid, container: item.container };
          this.nodes.push(d_item); //{ id: item.id, type: item.type, title: item.title, parentId: parentid, container: item.container });
          if (item.container !== '') {
            this.jxlayout_components(item[item.container], item.id);
          }
          if (item['container'] === 'component') {
            this.components.push(item['component']);
          }
        }
      });
    } else {
      // 第一步判断是否存在container
      if (layoutconfig.hasOwnProperty('container')) {
        // 下一层布局
        const d_item_c: NzTreeNodeOptions = {
          key: layoutconfig.id,
          id: layoutconfig.id,
          type: layoutconfig.type,
          title: layoutconfig.title,
          parentId: parentid,
          container: layoutconfig.container,
        }
        this.nodes.push(d_item_c);
        if (layoutconfig.container !== '' && layoutconfig[layoutconfig.container]) {
          this.jxlayout_components(layoutconfig[layoutconfig.container], layoutconfig.id);
        }

        if (layoutconfig['container'] === 'component') {
          console.log('....=>', layoutconfig['component']);
          this.components.push(layoutconfig['component']);
        }
      }
    }
  }

  listToTree(oldArr) {
    oldArr.forEach(element => {
      element['expanded'] = true;
      element['selected'] = false;
      let parentId = element.parentId;
      if (parentId !== 'NULL') {
        oldArr.forEach(ele => {
          if (ele.id == parentId) { //当内层循环的ID== 外层循环的parendId时，（说明有children），需要往该内层id里建个children并push对应的数组；
            if (!ele.children) {
              ele.children = [];
            }
            ele.children.push(element);
          }
        });
      }
    });
    console.log(oldArr) //此时的数组是在原基础上补充了children;
    oldArr = oldArr.filter(ele => ele.parentId === 'NULL'); //这一步是过滤，按树展开，将多余的数组剔除；
    console.log(oldArr)
    return oldArr;
  }



}
