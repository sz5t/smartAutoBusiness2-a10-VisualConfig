import { Component, Input, OnInit, OnChanges, SimpleChanges, DoCheck } from '@angular/core';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';

@Component({
  selector: 'app-cfg-l-form-attr-style-col',
  templateUrl: './cfg-l-form-attr-style-col.component.html',
  styles: [
  ],
  providers: [configFormDataServerService]
})
export class CfgLFormAttrStyleColComponent implements OnInit, OnChanges, DoCheck {
  @Input() public selectedItem: any;
  constructor(public fromDataService: configFormDataServerService) { }
  public attribute_config =
    {
      span: 12,
      size: {
        ngXl: 12,
        nzLg: 12,
        nzMd: 12,
        nzSm: 12,
        nzXXl: 12,
        nzXs: 12
      }

    }

  public attribute_style = {
    "width": '',
    "height": '',
    'max-width': '',
    "min-width": '',
    'max-height': '',
    'min-height': '',
    "overflow-x": '',  //visible|hidden|scroll|auto|no-display|no-content;
    "overflow-y": '',
    "margin-top": '0',
    "margin-right": '0',
    "margin-bottom": '0',
    "margin-left": '0'
  }

  ngOnInit(): void {

    this.attribute_config = this.selectedItem;

  }
  ngDoCheck() {
    // console.log('ngDoCheck', this.selectedItem);
    if (this.selectedItem['active'] === 'col') {
      // console.log('ngDoCheck', this.selectedItem);
    }
  }
  ngOnChanges(changes: SimpleChanges) {

    console.log('ngOnChanges', this.selectedItem);
    if (changes.hasOwnProperty('selectedItem')) {
      if (!changes.selectedItem.firstChange) {
        // 处理后续变化，初始变化不处理
        if (this.selectedItem['active'] === "col") {
          this.attribute_config = this.selectedItem['item'];
        }
      }
    }
  }

  PreviewLayout() {
    console.log(this.selectedItem);
    if (this.selectedItem['active'] === "col") {
      this.attribute_config = this.selectedItem['item'];
    }
    this.fromDataService['data'] = [{ "id": 'col' }];
    console.log(this.fromDataService);
    this.fromDataService.setComponentValue('002', '003');
  }


}
