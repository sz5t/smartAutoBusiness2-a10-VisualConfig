import { Component, Input, OnInit } from '@angular/core';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';
import { CommonUtils } from 'src/app/core/utils/common-utils';

@Component({
  selector: 'app-cfg-page-rows',
  templateUrl: './cfg-page-rows.component.html',
  styles: [
  ]
})
export class CfgPageRowsComponent implements OnInit {

  @Input() public l_config: any;
  @Input() public showLayout: any;
  @Input() public selectedItem: any;
  @Input() public cmptState: any;
  @Input() public fromDataService: configFormDataServerService;
  constructor() { }

  ngOnInit(): void {
  }


  public f_ondrop(e?, d?, i?) {
    e.preventDefault();
    console.log('拖动行ondrop', e, d);
    const ss = e.dataTransfer.getData('test');
    console.log('拖动行ondrop临时值', ss);
    //let dropData = JSON.stringify(ss);
    // console.log('拖拽JSON', dropData);
    let c = {
      "cols": [
        {
          "id": CommonUtils.uuID(30),
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
            "id": CommonUtils.uuID(30),
            "type": "form",
            "title": "",
            "container": "form"
          }
        }
      ],
      "id": CommonUtils.uuID(30),
      "type": "row",
      "title": "【新增】行",
      "container": "cols"
    }

    if (ss === 'row') {
      let node = this.fromDataService.l_createRow(this.l_config['id']);
      this.l_config.children.splice(i, 0, node);
      this.fromDataService.layoutTreeInstance.addChildrenNode(this.l_config['id'], node, i);
    }

  }
  public f_ondragleave(e, d) {
    console.log('离开当前领地++++');
    //  this.l_config[d]['style'] = null;
  }
  public f_ondragenter(e, d?) {
    console.log('***进入当前领地****', e);
    // this.l_config[d]['style'] = { 'backgroundColor': 'red' }
    /*  const ss = e.dataTransfer.getData('test');
     console.log(ss); */
  }
  public f_ondragover(e?, d?) {
    // 进入，就设置可以拖放进来（设置不执行默认：【默认的是不可以拖动进来】）
    //if (this.is_drag)
    var data = e.dataTransfer.getData("test");
    console.log('++++++++++++++++', data)
    // e.target.style.color = 'blue';
    e.preventDefault();
    // --05--设置具体效果copy
    e.dataTransfer.dropEffect = 'copy';
    // if (this.is_dragj) {
    //   this.is_dragj = false;
    //   window.setTimeout(() => { this.setState(); }, 500);
    // }


  }
  exec_options(v?) {
    if (v) {
      if (v['type'] === 'del') {
        // this.l_config = this.l_config.filter(d => d !== v['data']);
        const index = this.l_config['children'].findIndex((item) => item === v['data']);
        if (index > -1) {
          this.l_config['children'].splice(index, 1);
          this.fromDataService.layoutTreeInstance.delChildrenNode(this.l_config['id'], {}, index);
        }
      }
    }

  }

}
