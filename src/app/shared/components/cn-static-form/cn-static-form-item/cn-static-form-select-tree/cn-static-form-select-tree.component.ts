import { Component, OnInit, EventEmitter, Input, Output, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { VcComponentBase } from 'src/app/shared/vc-components/vc-component';

@Component({
  selector: 'app-cn-static-form-select-tree',
  templateUrl: './cn-static-form-select-tree.component.html',
  styles: [
  ]
})
export class CnStaticFormSelectTreeComponent extends VcComponentBase implements OnInit {
  @Input() validateForm: FormGroup;
  @Input() config;
  @Input() public fromDataService;
  @Output() public updateValue = new EventEmitter<any>(true);
  @Output() public cascadeValue = new EventEmitter<any>(true);
  selectValue: any;
  selectOptions: any[];
  nodes = [];
  itemConfig: any = {
    hiddenTitle: false,
    "labelSize": {
      "span": 8,
      "nzXs": {
        "span": 8,
        "offset": 0
      },
      "nzSm": {
        "span": 8,
        "offset": 0
      },
      "nzMd": {
        "span": 8,
        "offset": 0
      },
      "nzLg": {
        "span": 8,
        "offset": 0
      },
      "ngXl": {
        "span": 8,
        "offset": 0
      },
      "nzXXl": {
        "span": 8,
        "offset": 0
      }
    },
    "controlSize": {
      "span": 16,
      "nzXs": 16,
      "nzSm": 16,
      "nzMd": 16,
      "nzLg": 16,
      "ngXl": 16,
      "nzXXl": 16
    }
  };
  constructor(@Inject(BSN_COMPONENT_SERVICES)
  public componentService: ComponentServiceProvider,) {
    super(componentService);
  }

  ngOnInit(): void {
    console.log('select:', this.config);





    if (this.config['componentConfig']) {
      let loadingMode = "";
      if (this.config['componentConfig'].hasOwnProperty('loadingMode')) {
        loadingMode = this.config['componentConfig']['loadingMode'];
      }
      switch (loadingMode) {
        case "ajax":
          this.load();
          break;
        default:
          this.nodes = this.config['componentConfig']['options'];
          break;
      }

      if (!this.config.componentConfig['labelSize']) {
        this.config.componentConfig['labelSize'] = this.itemConfig['labelSize'];
      }
      if (!this.config.componentConfig['controlSize']) {
        this.config.componentConfig['controlSize'] = this.itemConfig['controlSize'];
      }
    }

    if (this.validateForm.controls[this.config['name']]) {
      let d = this.validateForm.controls[this.config['name']].value;
      if (this.config['componentConfig']['casadeValue']) {
        this.text(d);
      }
    }


  }

  log(v?) {
    this.selectValue = v;
    if (this.config['componentConfig']['casadeValue']) {
      this.text(v);
    }
    console.log('选择中：', v);
  }

  public text(v) {

    let back = { name: this.config.name, data: v, cascadeValueObj: this.config['componentConfig']['casadeValue'] }

    this.cascadeValue.emit(back);

  }


  public async load() {
    // 【参数不全是否阻止加载！】
    // 对后续业务判断有影响
    console.log('===select 自加载====>load');

    let response: any;
    if (this.config['componentConfig'].ajaxConfig['enableAjaxMore']) {
      response = await this.executeHttpMore(this.config['componentConfig'].ajaxConfig, {}, 'buildParameters', null);
    } else {
      const url = this.config['componentConfig'].ajaxConfig.url;
      const method = this.config['componentConfig'].ajaxConfig.ajaxType;
      const params = {
        ...this.buildParameters(this.config['componentConfig'].ajaxConfig.params)
      };
      // 考虑满足 get 对象，集合，存储过程【指定dataset 来接收数据】，加载错误的信息提示
      response = await this.componentService.apiService.getRequest(url, method, { params }).toPromise();
    }

    if (response.data && response.data.length > 0) {
      if (response && response.data) {
        response.data.map((d, index) => {
          // 默认选中第一个节点
          if (index === 0) {
            d.selected = true;
            //  this.ACTIVED_NODE = {};
            //  this.ACTIVED_NODE['origin'] = d;
          }
          this._setTreeNode(d);
        });
        this.nodes = response.data;

      }
      const newOptions = [];
      // 下拉选项赋值

      console.log('下拉选择树的最终数据集===》', this.nodes);

    }
    else {
      this.nodes = [];
    }
  }


  private _setTreeNode(node) {
    this.config['componentConfig']['columns'].map((column) => {
      node[column.type] = node[column.field];
    });

    const dd = this.nodes.find((d) => d.isSystem_Add);
    if (dd) {
      if (node.key === dd.key) {
        this.nodes = this.nodes.filter((d) => !d.isSystem_Add);
      }
    }

    if (node.children && node.children.length > 0) {
      if (!this.config['componentConfig']['asyncData']) {
        // 静态
        node.children.map((n) => {
          this._setTreeNode(n);
        });
      } else {
        node.children = [];
        node.expanded = false;
      }
      node.isLeaf = false;

    } else {
      node.isLeaf = true;
    }
  }

  onChange(v?) {
    console.log('树选中值', v);
  }


}
