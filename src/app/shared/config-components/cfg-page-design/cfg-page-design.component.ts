import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';

@Component({
  selector: 'app-cfg-page-design',
  templateUrl: './cfg-page-design.component.html',
  styles: [
  ],
  providers: [configFormDataServerService]
})
export class CfgPageDesignComponent implements OnInit {
  @Input() public config;
  selectedItem: any = { item: null, active: null };
  layout_nodes: NzTreeNodeOptions[];
  showLayout = true;
  constructor(public fromDataService: configFormDataServerService, private httpClient: HttpClient,) { }
  ngOnInit(): void {


  }

}
