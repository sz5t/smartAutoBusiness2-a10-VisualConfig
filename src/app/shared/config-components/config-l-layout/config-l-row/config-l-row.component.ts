import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';

@Component({
  selector: 'app-config-l-row',
  templateUrl: './config-l-row.component.html',
  styles: [
  ]
})
export class ConfigLRowComponent implements OnInit {
  @Input() public l_config;
  @Input() public showLayout: any;
  @Input() public selectedItem: any;
  @Input() public cmptState: any;
  @Input() public fromDataService: configFormDataServerService;
  @Output() public layoutOptions = new EventEmitter();
  constructor() { }

  optionState = false;
  ngOnInit(): void {
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
        this.optionState = true;
        this.is_move = true;
      }, 300);


  }
  mouseout(e?) {

    // console.log('鼠标移出');
    e.stopPropagation();
    // if (this.is_move)
    setTimeout(() => {
      this.optionState = false;
      this.is_move = false;
    }, 300);


  }

  click(e?) {
    console.log('hang', this.selectedItem)
  }


}
