import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cn-grid-down-xlsx,[cn-grid-down-xlsx]',
  templateUrl: './cn-grid-down-xlsx.component.html',
  styles: [
  ]
})
export class CnGridDownXlsxComponent implements OnInit {
  @Input() public config;
  @Input() public valueConfig;
  // @Output() public updateValue = new EventEmitter();
  @Input() public state;


  radioValue = 'page';
  checkOptionsOne = [

  ];
  constructor() { }

  ngOnInit(): void {
    if (!this.config) {
      this.config = {};
      this.config.span = 8;
    }
    console.log(this.valueConfig);
    this.valueConfig.forEach(element => {

      if (element.type === 'field') {
        let _obj: any = {};
        _obj = element;
        _obj['label'] = element['title']
        _obj['value'] = element['field']
        _obj['checked'] = !element['hidden']

        this.checkOptionsOne.push(_obj);
      }

    });
  }

  log(value: object[]): void {
    console.log(value);
  }
  log1(value: object[]): void {
    console.log(value);
    this.checkOptionsOne.forEach(item => {

      let index = value.indexOf(item['value']);
      if (index > -1) {
        item['checked'] = true;
      } else {
        item['checked'] = false;
      }
    })

    console.log(this.checkOptionsOne);
  }



}
