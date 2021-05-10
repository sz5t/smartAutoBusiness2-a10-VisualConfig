import { Component, Input, OnInit } from '@angular/core';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';

@Component({
  selector: 'app-cfg-l-form-attr-property-type',
  templateUrl: './cfg-l-form-attr-property-type.component.html',
  styles: [
  ]
})
export class CfgLFormAttrPropertyTypeComponent implements OnInit {
  @Input() public config;
  @Input() public configData;
  @Input() public fromDataService: configFormDataServerService;
  constructor() { }

  ngOnInit(): void {

  }
  setting(v?) {

  }


}
