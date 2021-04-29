import { Component, Input, OnInit } from '@angular/core';
// import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragDropModule, CdkDrag, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonUtils } from 'src/app/core/utils/common-utils';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';
// mport {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-config-l-layout',
  templateUrl: './config-l-layout.component.html',
  styles: [
    `
    .example-box {
      width: 200px;
      height: 200px;
      border: solid 1px #ccc;
      color: rgba(0, 0, 0, 0.87);
      cursor: move;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      background: #fff;
      border-radius: 4px;
      margin-right: 25px;
      position: relative;
      z-index: 1;
      transition: box-shadow 200ms cubic-bezier(0, 0, 0.2, 1);
      box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
                  0 2px 2px 0 rgba(0, 0, 0, 0.14),
                  0 1px 5px 0 rgba(0, 0, 0, 0.12);
    }
    
    .example-box:active {
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
                  0 8px 10px 1px rgba(0, 0, 0, 0.14),
                  0 3px 14px 2px rgba(0, 0, 0, 0.12);
    }
    .example-boundary {
      width: 400px;
      height: 400px;
      max-width: 100%;
      border: dotted #ccc 2px;
    }
    ::ng-deep .cdk-drag-preview {
      display: table;
    }

    ::ng-deep .cdk-drag-placeholder {
      opacity: 0;
    }
    `
  ]
})
export class ConfigLLayoutComponent implements OnInit {
  @Input() public showLayout;
  @Input() public cmptState;
  @Input() public selectedItem: any;

  @Input() public fromDataService: configFormDataServerService;
  // selectedItem: any = { item: null, cmptitem: null, active: null };
  // cmptState: any = { initState: 'text' };
  // @Input() public l_config;
  // showLayout = true;
  l_config = {
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

  constructor() { }

  ngOnInit(): void {

  }

  drop1(event: CdkDragDrop<string[]>): void {
    // moveItemInArray(this.listOfData, event.previousIndex, event.currentIndex);
    console.log(event);
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

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.listOfData, event.previousIndex, event.currentIndex);
  }


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
  CreateLayout() {
    this.l_config = {
      "id": CommonUtils.uuID(30),
      "type": "layout",
      "title": "布局",
      "container": "rows",
      "rows": this.CreateLayout_row(this.layout_row)
    }


  }

  CreateLayout_row(count?) {

    let rows = [];
    for (let i = 0; i < count; i++) {
      let r = {
        "cols": this.CreateLayout_col(this.layout_col),
        "id": CommonUtils.uuID(30),
        "type": "row",
        "title": "【新增】行",
        "container": "cols"
      }
      rows.push(r);
    }
    return rows;

  }

  CreateLayout_col(count?) {
    let cols = [];
    for (let i = 0; i < count; i++) {
      let c = {
        "id": CommonUtils.uuID(30),
        "col": "cc",
        "type": "col",
        "titlestate": 1,
        "title": "列",
        "span": this.layout_col_size,
        "container": "component",
        "size": this.CreateLayout_col_size(this.layout_col_size),
        "component": {
          "id": CommonUtils.uuID(30),
          "type": "form",
          "title": "",
          "container": "form"
        }
      }
      cols.push(c);
    }
    return cols;
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
