import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-cfg-form-cols',
  templateUrl: './cfg-form-cols.component.html',
  styles: [
  ]
})
export class CfgFormColsComponent implements OnInit {

  @Input() public l_config;
  @Input() public showLayout: any;
  @Input() public selectedItem: any;
  @Input() public cmptState: any;
  @Input() public fromDataService;
  @Output() public layoutOptions = new EventEmitter();
  constructor() { }

  config: any = null;
  public testCmp;

  ngOnInit(): void {
    this.load();

  }

  load() {

    let newConfig = {}
    this.l_config['children'].forEach(element => {

      newConfig[element['id']] = this.fromDataService.layoutSourceData[element['id']];
    });
    this.config = newConfig;
    console.log('cols 最终配置', this.config)
  }

  public f_ondrop(e?, d?, i?) {
    e.stopPropagation();
    e.preventDefault();
    console.log('拖动行ondrop', e, d);
    const ss = e.dataTransfer.getData('test');
    console.log('拖动行ondrop临时值', ss);
    let dropData = JSON.parse(ss);
    // console.log('拖拽JSON', dropData);

    if (dropData['dropName'] === 'col') {
      let node = this.fromDataService.l_createCol(this.l_config['id']);
      this.fromDataService.layoutTreeInstance.addChildrenNode(this.l_config['id'], node, i);
      this.load();
      // this.l_config['children'].splice(i, 0, node);
      /*       const colId = CommonUtils.uuID(36);
            const cmpId = CommonUtils.uuID(36);
            this.l_config['children'] = [];
            this.l_config['container'] = 'cols';
            this.l_config['children'].push({
              children: [{
                expanded: true,
                id: cmpId,
                key: cmpId,
                parentId: colId,
                title: "明细项",
                type: "form"
              }],
              component: {
                expanded: true,
                id: cmpId,
                key: cmpId,
                parentId: colId,
                title: "明细项",
                type: "form"
              },
              container: "component",
              expanded: true,
              id: colId,
              key: colId,
              parentId: this.l_config['id'],
              size: {},
              span: 24,
              title: "列",
              type: "col"
            }) */
    }

    // if (ss === 'col') {
    //   let node = this.fromDataService.l_createCol(this.l_config['id']);
    //   this.l_config['children'].splice(i, 0, node);
    //   this.fromDataService.layoutTreeInstance.addChildrenNode(this.l_config['id'], node, i);
    // }





  }
  public f_ondragleave(e, d) {
    console.log('离开当前领地++++');
    // this.l_config[d]['style'] = null;
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
    // console.log('++++++++++++++++', data)
    //  e.target.style.color = 'blue';
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
          const node = this.l_config['children'][index];
          this.l_config['children'].splice(index, 1);

          this.fromDataService.layoutTreeInstance.delChildrenNode(this.l_config['id'], {}, index);

          this.fromDataService.deleteLayoutSourceData(node['id']);
        }

      }


    }

  }
}
