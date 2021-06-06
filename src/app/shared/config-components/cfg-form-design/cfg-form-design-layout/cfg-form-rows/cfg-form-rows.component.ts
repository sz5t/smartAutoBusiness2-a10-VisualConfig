import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cfg-form-rows',
  templateUrl: './cfg-form-rows.component.html',
  styles: [
  ]
})
export class CfgFormRowsComponent implements OnInit {

  @Input() public l_config: any;
  @Input() public showLayout: any;
  @Input() public selectedItem: any;
  @Input() public cmptState: any;
  @Input() public fromDataService;
  constructor() { }

  ngOnInit(): void {
    console.log(this.l_config);
  }


  public f_ondrop(e?, d?, i?) {
    e.preventDefault();
    console.log('拖动行ondrop', e, d);
    const ss = e.dataTransfer.getData('test');
    console.log('拖动行ondrop临时值', ss);
    let dropData = JSON.parse(ss);

    if (dropData['dropName'] === 'row') {
      let node = this.fromDataService.l_createRow(this.l_config['id']);
      this.l_config.children.splice(i, 0, node);
      this.fromDataService.layoutTreeInstance.addChildrenNode(this.l_config['id'], node, i);
    }
    e.stopPropagation();

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
    // console.log('++++++++++++++++', data)
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
