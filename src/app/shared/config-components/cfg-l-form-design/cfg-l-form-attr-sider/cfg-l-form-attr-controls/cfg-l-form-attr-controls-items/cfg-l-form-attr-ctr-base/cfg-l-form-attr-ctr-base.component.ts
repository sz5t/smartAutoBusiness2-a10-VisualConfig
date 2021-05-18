import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-cfg-l-form-attr-ctr-base',
  templateUrl: './cfg-l-form-attr-ctr-base.component.html',
  styles: [
  ]
})
export class CfgLFormAttrCtrBaseComponent implements OnInit {
  @Input() public config;
  @Input() public configData;
  @Output() public updateValue = new EventEmitter<any>(true);

  constructor() { }

  ngOnInit(): void {
  }

  valueChange(v) {
    console.log('AttrProperty', v);
    this.updateValue.emit(v);
  }

}
