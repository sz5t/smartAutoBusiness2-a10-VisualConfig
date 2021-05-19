import { Component, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';

@Component({
  selector: 'app-cfg-page-col',
  templateUrl: './cfg-page-col.component.html',
  styles: [
  ]
})
export class CfgPageColComponent implements OnInit, OnChanges {

  @Input() public l_config;
  @Input() public showLayout: any;
  @Input() public selectedItem: any;
  @Input() public cmptState: any;
  @Input() public fromDataService: configFormDataServerService;
  @Output() public layoutOptions = new EventEmitter();

  public config: any;
  constructor() { }


  draging = false;
  optionState = false;
  body_style: any = { 'padding': '1px 2px' }
  body_style_selected: any = { 'padding': '1px 2px', 'border': "3px dashed red" }
  ngOnInit(): void {
    this.config = this.fromDataService.layoutSourceData[this.l_config['id']];
  }
  ngOnChanges(changes: SimpleChanges) {

    console.log('ngOnChanges', this.selectedItem);
    if (changes.hasOwnProperty('selectedItem')) {
      if (!changes.selectedItem.firstChange) {
        // 处理后续变化，初始变化不处理
        if (this.selectedItem === this.l_config) {
          this.body_style = {
            'padding': '1px 2px',
            'border': "3px solid #54e72f"
          }
        } else {
          this.body_style = { 'padding': '1px 2px' }
        }
      }
    }
  }


  // dragstart->dragenter->dragover->drop->dragend
  public f_ondragstart(e?, d?) {
    // this.d_row = d;
    e.dataTransfer.setData('test', 'new_col');
    //e.dataTransfer.setData('text/plain', JSON.stringify({ 'name': 'col' }));
    console.log('拖动行', e, d);
    const ss = e.dataTransfer.getData('test');
    console.log('拖动行临时值', ss, e);
    // e.target.style.backgroundColor = 'yellow';
    this.draging = true;
    // e.dataTransfer.dropEffect = 'move';
  }

  public f_ondragend(e?) {
    console.log('拖动结束', e);
    const ss = e.dataTransfer.getData('test');
    console.log('拖动结束临时值', ss);
  }


  del() {
    let op = { type: 'del', data: this.l_config };
    this.layoutOptions.emit(op);
  }

  click(e?) {
    e.stopPropagation();
    this.optionState = true;
    // 选中
    this.selectedItem['item'] = this.l_config;
    this.selectedItem['active'] = 'col';
    this.fromDataService.layoutNodeSelected(this.l_config);
    console.log('选中当前列', this.selectedItem);

  }

}
