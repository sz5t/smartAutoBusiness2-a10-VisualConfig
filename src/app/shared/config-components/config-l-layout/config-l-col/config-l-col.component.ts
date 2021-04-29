import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';
import { ColorService } from 'src/app/routes/style/color.service';

@Component({
  selector: 'app-config-l-col',
  templateUrl: './config-l-col.component.html',
  styles: [
  ]
})
export class ConfigLColComponent implements OnInit, OnChanges {
  @Input() public l_config;
  @Input() public showLayout: any;
  @Input() public selectedItem: any;
  @Input() public cmptState: any;
  @Input() public fromDataService: configFormDataServerService;
  @Output() public layoutOptions = new EventEmitter();

  constructor() { }


  draging = false;
  optionState = false;
  body_style: any = { 'padding': '1px 2px' }
  body_style_selected: any = { 'padding': '1px 2px', 'border': "3px dashed red" }
  ngOnInit(): void {
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

  is_move = false;
  mousemove(e?) {

    // console.log('鼠标移入');
    // e.stopPropagation();
    if (!this.is_move)
      setTimeout(() => {
        console.log('鼠标移入');
        this.optionState = true;
        this.is_move = true;
      }, 300);


  }
  mouseout(e?) {

    // console.log('鼠标移出');
    e.stopPropagation();
    // if (this.is_move)
    setTimeout(() => {
      console.log('鼠标移出');
      this.optionState = false;
      this.is_move = false;
    }, 300);


  }

  click(e?) {

    this.optionState = true;
    // 选中
    this.selectedItem['item'] = this.l_config;
    this.selectedItem['active'] = 'col';
    this.fromDataService.layoutNodeSelected(this.l_config);
    console.log('选中当前列', this.selectedItem);

  }






}
