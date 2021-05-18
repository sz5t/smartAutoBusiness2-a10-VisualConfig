import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';

@Component({
  selector: 'app-cfg-form-container',
  templateUrl: './cfg-form-container.component.html',
  styles: [
  ]
})
export class CfgFormContainerComponent implements OnInit {

  @Input() public l_config;
  @Input() public showLayout: any;
  @Input() public selectedItem: any;
  @Input() public cmptState: any;
  @Input() public fromDataService: configFormDataServerService;
  @Output() public layoutOptions = new EventEmitter();
  constructor() { }
  public editTitleState = false;
  ngOnInit(): void {
    if (this.l_config && !this.l_config['title']) {
      this.l_config['title'] = '明细项'
    }
  }

  public f_ondrop(e?, d?, i?) {
    e.preventDefault();
    e.stopPropagation();
    console.log('拖动行ondrop', e, d);
    const ss = e.dataTransfer.getData('test');
    console.log('拖动行ondrop临时值', ss, this.l_config);
    //let dropData = JSON.stringify(ss);
    // console.log('拖拽JSON', dropData);
    if (!ss) {
      return false;
    }
    if (!this.l_config[this.cmptState['initState']]) {
      this.l_config[this.cmptState['initState']] = {};
    }
    if (ss === 'item_input') {
      this.l_config[this.cmptState['initState']]['type'] = 'input'
    }
    if (ss === 'item_select') {
      this.l_config[this.cmptState['initState']]['type'] = 'select'
    }
    if (ss === 'item_time') {
      this.l_config[this.cmptState['initState']]['type'] = 'time'
    }
    if (ss === 'item_check') {
      this.l_config[this.cmptState['initState']]['type'] = 'check'
    }



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
    e.stopPropagation();
    // if (this.is_dragj) {
    //   this.is_dragj = false;
    //   window.setTimeout(() => { this.setState(); }, 500);
    // }


  }

  public f_ondragstart(e?) {
    // this.d_row = d;
    e.stopPropagation();
    if (this.l_config[this.cmptState['initState']] && this.l_config[this.cmptState['initState']]['type']) {
      let _dropText = 'item_' + this.l_config[this.cmptState['initState']]['type'];
      e.dataTransfer.setData('test', _dropText);
      console.log('拖动行', e);
      const ss = e.dataTransfer.getData('test');
      console.log('拖动行临时值', ss);
    } else {
      e.dataTransfer.setData('test', 'none');
      console.log("没有拖拽内容");

    }

  }

  /**
   * editTitle
   */
  public editTitle(e?) {
    this.editTitleState = true;
  }

  public onblurtitle(e?, type?) {
    this.editTitleState = false;
    event.stopPropagation();
  }
  public onKeyPress(e?, type?) {
    if (e.code === 'Enter') {
      this.editTitleState = false;
    }
  }

  body_style: any = { 'width': '100%', 'height': '50px', 'border': "1px dashed #450868", "margin-bottom": "4px" }
  body_style_selected: any = { 'width': '100%', 'height': '50px', 'border': "3px dashed #54e72f", "margin-bottom": "4px" }


  click(e?) {

    e.stopPropagation();
    this.selectedItem['cmptitem'] = this.l_config;
    this.selectedItem['active'] = 'cmpt';
    console.log('选中当前组件容器', this.selectedItem);

    this.fromDataService.layoutNodeSelected(this.l_config);

  }

}
