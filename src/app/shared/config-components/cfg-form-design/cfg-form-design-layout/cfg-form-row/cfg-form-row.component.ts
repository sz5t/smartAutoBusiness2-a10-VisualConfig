import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-cfg-form-row',
  templateUrl: './cfg-form-row.component.html',
  styles: [
  ]
})
export class CfgFormRowComponent implements OnInit {

  @Input() public l_config;
  @Input() public showLayout: any;
  @Input() public selectedItem: any;
  @Input() public cmptState: any;
  @Input() public fromDataService;
  @Output() public layoutOptions = new EventEmitter();
  constructor() { }

  public config: any;
  optionState = false;
  body_style: any = { 'padding': '1px 2px' }
  body_style_selected: any = { 'padding': '1px 2px', 'border': "3px dashed red" }
  ngOnInit(): void {

    this.load();
    this.fromDataService.layoutStructInstance[this.l_config['id']] = this;
  }

  load() {
    this.config = this.fromDataService.layoutSourceData[this.l_config['id']];
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
    this.selectedItem['active'] = 'row';
    this.fromDataService.layoutNodeSelected(this.l_config);
    console.log('选中当前行', this.selectedItem);

  }


}
