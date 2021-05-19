import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';

@Component({
  selector: 'app-cfg-property-form',
  templateUrl: './cfg-property-form.component.html',
  styles: [
  ]
})
export class CfgPropertyFormComponent implements OnInit {

  @Input() public config;
  @Input() public sourceData;
  @Input() public configData;
  @Input() public staticData;
  @Output() public updateValue = new EventEmitter<any>(true);
  @Input() public fromDataService: configFormDataServerService;
  // @Input() public fromDataService: configFormDataServerService;
  constructor() { }

  ngOnInit(): void {
    console.log('PopBase_init:', this.staticData)
  }

  valueChange(v) {
    console.log('PopBase', v);
    this.updateValue.emit(v);
  }

}
