import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CacheService } from '@delon/cache';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject, Subject } from 'rxjs';
import { ApiService } from '../api/api.service';
import { BsnRelativesMessageModel, BSN_RELATION_SUBJECT, BSN_RELATION_TRIGGER } from './../../relations/bsn-relatives';

@Injectable()
export class ComponentServiceProvider {
  public com = [];
  public apiService: ApiService;
  public cacheService: CacheService;
  public msgService: NzMessageService;
  public modalService: NzModalService;
  public activeRoute: ActivatedRoute;
  public router: Router;
  public commonRelationSubject: BehaviorSubject<BsnRelativesMessageModel>;
  public commonRelationTrigger: BehaviorSubject<BsnRelativesMessageModel>;
  public reloadDynamicLayoutSubject: Subject<string> = new Subject();
  constructor(
    private _apiService: ApiService,
    private _cacheService: CacheService,
    private _msgService: NzMessageService,
    private _modalService: NzModalService,
    private _activeRoute: ActivatedRoute,
    private _router: Router,
    @Inject(BSN_RELATION_SUBJECT)
    private _commonRelationSubject: BehaviorSubject<BsnRelativesMessageModel>,
    @Inject(BSN_RELATION_TRIGGER)
    private _commonRelationTrigger: BehaviorSubject<BsnRelativesMessageModel>,
  ) {
    this.apiService = this._apiService;
    this.cacheService = this._cacheService;
    this.msgService = this._msgService;
    this.modalService = this._modalService;
    this.activeRoute = this._activeRoute;
    this.router = this._router;
    this.commonRelationSubject = this._commonRelationSubject;
    this.commonRelationTrigger = this._commonRelationTrigger;
  }
}

@Injectable()
export class DataServerService {
  public data: any = [];
  public componentInstance: any = {};
  constructor() {}
  public setComponentValue(id?: string, value?: any): void {
    console.log(`当前组件${id}值:`, value);
  }

  // 组件实例
  public setComponentInstace(id?: string, instace?: any): void {
    this.componentInstance[id] = instace;
  }

  // 获取组件值
  /**
   *  组件均是自定义，参数均不同，取值和参数构建，可调用当前组件自身的参数构建组装出响应的参数结构
   *  比较难区分组件内部值，与组件自身值的区分内部值一般是对象，自身值数组或者对象
   *
   * @param id 组件标识
   */
  public getComponentValue(id?: string): void {
    const _instance = this.componentInstance[id];
    if (_instance) {
      // 存在实例
      // 参数构建
      _instance.buildParameters();
    }
  }

  /**
   * 获取组件实例
   * @param id 实例标识
   */
  public getInstanceById(id?: string): any {
    const _instance = this.componentInstance[id];
    return _instance;
  }

  /**
   * 获取当前页的实例
   */
  public getInstanceAll(): any {
    return this.componentInstance;
  }

  buildParameters(): any {
    // 新定义参数结构
    const parameters = [
      {
        name: 'name',
        componentId: '', // 所属组件实例   默认值，当前操作所属组件实例
        type: '', // componentValue  innitValue tempValue  。。。
        valueName: '',
        dataType: '',
        value: '',
      },
    ];

    // 新的操作   隐藏操作，通过组件实例直接调用
    const action = [{}];
  }
}
