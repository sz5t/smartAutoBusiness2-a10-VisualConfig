import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';

@Component({
  selector: 'app-cfg-l-form-attr-property-type',
  templateUrl: './cfg-l-form-attr-property-type.component.html',
  styles: [
  ]
})
export class CfgLFormAttrPropertyTypeComponent implements OnInit, OnChanges {
  @Input() public config;
  @Input() public configData;
  @Input() public fromDataService: configFormDataServerService;
  @Output() public updateValue = new EventEmitter<any>(true);
  constructor() { }

  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges): void {
    // throw new Error('Method not implemented.');
    if (changes.hasOwnProperty('configData')) {
      if (!changes.configData.firstChange) {
        // 处理后续变化，初始变化不处理
        this.config = this.config.filter(d => d !== '');
        console.log('ngOnChanges_AttrPropertyType');
      }
    }
  }
  setting(v?) {

  }

  valueChange(v) {
    console.log('AttrProperty', v);
    this.updateValue.emit(v);
  }


}
