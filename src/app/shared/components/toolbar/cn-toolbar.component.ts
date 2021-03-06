import { CnComponentBase } from '../cn-component.base';
import { Component, OnInit, OnDestroy, Inject, Input } from '@angular/core';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { Subject, Subscription } from 'rxjs';
import { CN_TOOLBAR_METHOD } from 'src/app/core/relations/bsn-methods';
import { RelationResolver } from '../../resolver/relation/relation.resolver';
import { environment } from '@env/environment';
import { ButtonOperationResolver } from '../../resolver/buttonOperation/buttonOperation.resolver';
import { ParameterResolver } from '../../resolver/parameter/parameter.resolver';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'cn-toolbar',
  // encapsulation: ViewEncapsulation.None,
  templateUrl: './cn-toolbar.component.html',
  styles: [
    `
      .table-operations {
        padding-top: 3px;
        padding-bottom: 3px;
      }

      .table-operations .ant-btn-group {
        margin-right: 4px;
        margin-bottom: 2px;
        font-weight: 600;
      }

      .toolbarGroup {
        margin-right: 8px;
      }
    `,
  ],
})
export class CnToolbarComponent extends CnComponentBase implements OnInit, OnDestroy {
  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) {
    super(componentService);
  }
  @Input()
  public config;
  @Input()
  public size;
  @Input()
  public permissions = [];
  @Input()
  public viewId;
  public toolbarConfig = [];
  public model;
  public _cascadeState;
  public toolbars;
  public toolbarsIsLoading = [];

  private _sender_source$: Subject<any>;
  private _receiver_source$: Subject<any>;
  private _trigger_source$: Subject<any>;

  private _receiver_subscription$: Subscription;
  private _sender_subscription$: Subscription;
  private _trigger_receiver_subscription$: Subscription;

  public COMPONENT_METHODS = CN_TOOLBAR_METHOD;
  // public COMPONENT_PROPERTIES =

  public isApproval: any;

  public type: any;

  public OPREATION_DATA: any | any[];

  button_list = [];

  public ngOnInit() {
    this._initInnerValue();

    this.isApproval = this.config.isApproval ? this.config.isApproval : false;
    this.type = this['tempData'] && this['tempData'].hasOwnProperty('$_processType') ? true : false;
    this.toolbarConfig = this.config.toolbar;
    // ????????????????????????????????????????????????this.toolbarConfig
    if (this.config.cascade && this.config.cascade.messageReceiver) {
      // ????????????????????????,???????????????????????????
      // this._receiver_source$ = new RelationResolver(this).resolveReceiver(this.config);
      // this._receiver_source$.subscribe();
      new RelationResolver(this).resolveReceiver(this.config);
    }
    // this.getBttonList();
    this.getPermissions();

    // const componentPermission =  this.getMenuComponentPermissionConfigById(this.config.id);
    // console.log('????????????',componentPermission);

    // ??????
    // componentPermission['permission']
    // id: "qbh1yxWLSP0BpJ3BLFBrMMDKQMeCJLeBGDP3"
    // type: " toolbar"
    this.initLog();
  }

  private _initInnerValue() {
    this.tempValue = {};
    this.initValue = {};
  }

  public getPermissions() {
    let componentPermission: any;
    if (this.config.id) {
      componentPermission = this.getMenuComponentPermissionConfigById(this.config.id);
    }
    let enableToolbarPermission = false;
    if (environment.systemSettings && environment.systemSettings.systemMode === 'work') {
      if (environment.systemSettings && environment.systemSettings.permissionInfo) {
        if (environment.systemSettings.enablePermission) {
          enableToolbarPermission = environment.systemSettings.permissionInfo.enableToolbarPermission;
        }
      }
    }
    if (this.config.exceptionPermission) {
      enableToolbarPermission = false;
    }

    console.log('????????????', componentPermission);
    const permissionMap = new Map();
    if (componentPermission && componentPermission.permission) {
      componentPermission &&
        componentPermission.permission.forEach((item) => {
          permissionMap.set(item.id, item);
        });
    }

    // try {

    //     throw new Error()
    // } catch (e) {
    //     // console.log(e)
    // }
    // "targetViewId": "tree_page",
    const _button_list = [];
    if (this.isApproval && this.type) {
      const ApprovalToolbar: any[] = this.componentService.cacheService.getNone('ApprovalToolBar')
        ? this.componentService.cacheService.getNone('ApprovalToolBar')
        : [];
      if (ApprovalToolbar.length > 0) {
        if (this.toolbarConfig[0]) {
          this.toolbarConfig[0]['exceptionPermission'] = true;
        }
        if (this.toolbarConfig[0]['group']) {
          this.toolbarConfig[0]['group'] = [...this.toolbarConfig[0]['group'], ...ApprovalToolbar[0]['group']];
        }
      }
    }
    if (this.toolbarConfig && Array.isArray(this.toolbarConfig)) {
      this.toolbarConfig.forEach((item) => {
        if (item.group) {
          if (
            !enableToolbarPermission ||
            !item.hasOwnProperty('id') ||
            item['exceptionPermission'] ||
            (enableToolbarPermission && item.id && permissionMap.has(item.id))
          ) {
            item.permission = true;
          }
          const targetViewId = item.targetViewId;
          item.group.forEach((g) => {
            if (g.dropdown) {
              g.dropdown.forEach((b) => {
                b.targetViewId = targetViewId;
                if (
                  !enableToolbarPermission ||
                  !b.hasOwnProperty('id') ||
                  b['exceptionPermission'] ||
                  (enableToolbarPermission && b.id && permissionMap.has(b.id))
                ) {
                  b.permission = true;
                }
                _button_list.push(b);
              });
            } else {
              g.targetViewId = targetViewId;
              if (
                !enableToolbarPermission ||
                !g.hasOwnProperty('id') ||
                g['exceptionPermission'] ||
                (enableToolbarPermission && g.id && permissionMap.has(g.id))
              ) {
                g.permission = true;
              }
              _button_list.push(g);
            }
          });
        } else if (item.dropdown) {
          if (
            !enableToolbarPermission ||
            !item.hasOwnProperty('id') ||
            item['exceptionPermission'] ||
            (enableToolbarPermission && item.id && permissionMap.has(item.id))
          ) {
            item.permission = true;
          }
          const targetViewId = item.targetViewId;
          item.dropdown.forEach((b) => {
            b.targetViewId = targetViewId;
            if (
              !enableToolbarPermission ||
              !b.hasOwnProperty('id') ||
              b['exceptionPermission'] ||
              (enableToolbarPermission && b.id && permissionMap.has(b.id))
            ) {
              b.permission = true;
            }
            _button_list.push(b);
          });
        }
      });
    }
    this.button_list = _button_list;
    // console.log('????????????', _button_list);
  }

  private checkComponentProperty(btn) {
    const checkResult = [];
    const allCheckResult = [];
    for (const exps of btn.beforeExecute) {
      const valueName = exps.valueName;
      for (const exp of exps.expression) {
        switch (exp.type) {
          case 'property':
            const valueCompareObj = this.buildMatchObject(this.OPREATION_DATA[valueName], exp);
            const valueMatchResult = this.matchResolve(valueCompareObj, exp.match);
            allCheckResult.push(valueMatchResult);
            break;
          case 'element':
            const elementResult = [];
            for (const element of this.OPREATION_DATA[valueName]) {
              const elementCompareObj = this.buildMatchObject(element, exp);
              elementResult.push(this.matchResolve(elementCompareObj, exp.match));
            }
            const elementMatchResult = elementResult.findIndex((res) => !res) < 0;
            allCheckResult.push(elementMatchResult);
        }
      }
      checkResult.push(allCheckResult.findIndex((res) => !res) < 0);
    }
    return checkResult.findIndex((res) => !res) < 0;
  }

  public action(btn, targetViewId) {
    // console.log('????????????',btn);
    setTimeout((_) => {
      this.toolbarsIsLoading[btn.id] = false;
    }, 150);
    if (Array.isArray(btn.beforeExecute) && btn.beforeExecute.length > 0) {
      const res = this.checkComponentProperty(btn);
      if (!res) {
        return false;
      }
    }
    // ????????????????????????,????????????????????????????????????
    // isHandleData??????????????????????????????????????????????????????
    // if (btn.isHandleData && Array.isArray(btn.execute.params) && btn.execute.params.length > 0) {

    //     // ??????initValue??????tempValue????????????,??????????????????????????????????????????????????????
    //     // ??????????????????????????????,????????????????????????????????????
    //     btn.execute.params.forEach(param => {
    //         const paramObj = this.tempValue[param['name']];
    //         if (paramObj && Array.isArray(paramObj) && paramObj.length === 0) {
    //             isContinue = false;
    //         } else if (!paramObj) {
    //             isContinue = false;
    //         }
    //     });
    //     if (!isContinue) {
    //         return false;
    //     }
    // }

    if (!this.toolbarsIsLoading[btn.id]) {
      // ?????????????????????????????????????????????????????????
      // const btn_source$ = from(btn.execute);
      // btn_source$.pipe(map(exeCfg => this.sendBtnMessage(exeCfg, targetViewId))).subscribe().unsubscribe();
      const actions = this.toolbarConfig.find((t) => t.targetViewId === targetViewId);
      const dataOfState = { state: btn.state, actions: actions.group };
      let _toggleType = true;
      if (btn.toggle && btn.toggle.toggleType) {
        if (btn.toggle.toggleType === 'relation') {
          _toggleType = false;
        }
      }
      if (btn.toggle && btn.toggle.type && _toggleType) {
        switch (btn.toggle.type) {
          case 'state':
            const stateValue = dataOfState[btn.toggle.type];
            if (btn.toggle.values) {
              const valueObj = btn.toggle.values.find((val) => val.name === stateValue);
              valueObj && (btn[btn.toggle.toggleProperty] = valueObj.value);
            }
            if (actions) {
              if (actions.group) {
                actions.group.forEach((element) => {
                  if (element.toggle && element.toggle.values) {
                    const _valueObj = element.toggle.values.find((val) => val.name === stateValue);
                    _valueObj && (element[element.toggle.toggleProperty] = _valueObj.value);
                  }
                });
              }
              if (actions.dropdown) {
                actions.dropdown.forEach((element) => {
                  if (element.toggle && element.toggle.values) {
                    const _valueObj = element.toggle.values.find((val) => val.name === stateValue);
                    _valueObj && (element[element.toggle.toggleProperty] = _valueObj.value);
                  }
                });
              }
            }

            break;
          case '...':
            break;
        }
      }
      const state = '';
      if (!_toggleType) {
        dataOfState.state = '';
      }
      const btnResolver = new ButtonOperationResolver(this.componentService, this.config, dataOfState);
      const logInfo = this.getLogInfo(this, [btn]);
      if (logInfo) {
        btn.logInfo = logInfo;
      }
      btnResolver.toolbarAction(btn, targetViewId);
      this.toolbarsIsLoading[btn.id] = true;
    }
  }

  public setOperationData(option) {
    console.log('toolbar -setOperation tempValue', this.tempValue, option);
    this.OPREATION_DATA = option;
  }

  public stateToText(option) {
    const actions = this.toolbarConfig.find((t) => t.targetViewId === option.targetViewId);
    const dataOfState = { state: 'text', actions: actions.group };
    const btnResolver = new ButtonOperationResolver(this.componentService, this.config, dataOfState);
    const btn = { execute: [{ trigger: 'EXECUTE_NONE', triggerType: 'STATE' }] };
    btnResolver.toolbarAction(btn, option.targetViewId);
  }

  public stateToEdit(option) {
    const actions = this.toolbarConfig.find((t) => t.targetViewId === option.targetViewId);
    const dataOfState = { state: 'edit', actions: actions.group };
    const btnResolver = new ButtonOperationResolver(this.componentService, this.config, dataOfState);
    const btn = { execute: [{ trigger: 'EXECUTE_NONE_EDIT', triggerType: 'STATE' }] };
    btnResolver.toolbarAction(btn, option.targetViewId);
  }

  public executeNone() {}

  public executeNoneEdit() {}

  public ngOnDestroy() {
    // ??????????????????
    this.unsubscribeRelation();
    // ????????????????????????
    if (this._receiver_subscription$) {
      this._receiver_subscription$.unsubscribe();
    }

    if (this._sender_subscription$) {
      this._sender_subscription$.unsubscribe();
    }

    // ?????????????????????
    if (this._trigger_receiver_subscription$) {
      this._trigger_receiver_subscription$.unsubscribe();
    }
  }

  private buildMatchObject(componentValue, expCfg) {
    let value;
    if (expCfg.name) {
      value = componentValue[expCfg.name];
    } else {
      // ??????????????????
      value = componentValue;
    }
    const matchValue = expCfg.matchValue;
    const matchValueFrom = expCfg.matchValueFrom;
    const matchValueTo = expCfg.matchValueTo;
    return {
      value: value,
      matchValue: matchValue,
      matchValueFrom: matchValueFrom,
      matchValueTo: matchValueTo,
    };
  }

  private matchResolve(compareValue, expression) {
    switch (expression) {
      case 'eq': // =
        return compareValue.value === compareValue.matchValue;
      case 'neq': // !=
        return compareValue.value !== compareValue.matchValue;
      case 'ctn': // like
        return compareValue.matchValue.indexOf(compareValue.value) > 0;
      case 'nctn': // not like
        return compareValue.matchValue.indexOf(compareValue.value) <= 0;
      case 'in': // in  ?????????input ??????????????????????????????????????????
        let in_result = true;
        if (Array.isArray(compareValue.matchValue) && compareValue.matchValue.length > 0) {
          in_result = compareValue.matchValue.findIndex(compareValue.value) > 0;
        }
        return in_result;
      case 'nin': // not in  ?????????input ??????????????????????????????????????????
        let nin_result = true;
        if (Array.isArray(compareValue.matchValue) && compareValue.matchValue.length > 0) {
          nin_result = compareValue.matchValue.findIndex(compareValue.value) <= 0;
        }
        return nin_result;
      case 'btn': // between
        return compareValue.matchValueFrom <= compareValue.value && compareValue.matchValueTo >= compareValue.value;
      case 'ge': // >=
        return compareValue.value >= compareValue.matchValue;
      case 'gt': // >
        return compareValue.value > compareValue.matchValue;
      case 'le': // <=
        return compareValue.value <= compareValue.matchValue;
      case 'lt': // <
        return compareValue.value < compareValue.matchValue;
      case 'notNull': // ?????????null
        return !!compareValue.value;
      default:
      case 'regexp': // ?????????????????????
        const regexp = new RegExp(compareValue.matchValue);
        return regexp.test(compareValue.value);
    }
  }

  /**
   * ???????????????????????? EXECUTE_ACTION
   * ???????????????????????? ??????btn ?????????tagViewId
   * @param option
   */
  private executeAction(option?) {
    const id = option.toolbarId;
    console.log('executeAction', option);
    const btn = this.getBtn(id);
    if (btn) {
      this.action(btn, btn.targetViewId);
      return true;
    } else {
      return false;
    }

    // ????????????id ?????????btn?????? ??????
  }

  public getBtn(id?) {
    const _button = this.button_list.filter((item) => item.id === id);
    if (_button && _button.length > 0) {
      return _button[0];
    } else {
      return null;
    }
  }
  public getBttonList() {
    // "targetViewId": "tree_page",
    const _button_list = [];
    if (this.toolbarConfig && Array.isArray(this.toolbarConfig)) {
      this.toolbarConfig.forEach((item) => {
        if (item.group) {
          const targetViewId = item.targetViewId;
          item.group.forEach((g) => {
            if (g.dropdown) {
              g.dropdown.forEach((b) => {
                b.targetViewId = targetViewId;
                _button_list.push(b);
              });
            } else {
              g.targetViewId = targetViewId;
              _button_list.push(g);
            }
          });
        } else if (item.dropdown) {
          const targetViewId = item.targetViewId;
          item.dropdown.forEach((b) => {
            b.targetViewId = targetViewId;
            _button_list.push(b);
          });
        }
      });
    }
    this.button_list = _button_list;
    // console.log('????????????', _button_list);
  }

  // ?????? ????????????
  public permissionsMerge(SourceData?, Permissions?): any {
    const _toolBar = [];
  }

  // ??????????????????????????????????????????????????????????????????
  public buttonStateSwitch(option?): any {
    const id = option.toolbarId;
    console.log('buttonStateSwitch', option);
    const btn = this.getBtn(id);
    if (btn) {
      // ???????????????toolbarId,targetViewId???
      const targetViewId = btn.targetViewId;
      const actions = this.toolbarConfig.find((t) => t.targetViewId === targetViewId);
      const dataOfState = { state: btn.state, actions: actions.group };
      let _toggleType = false;
      if (btn.toggle && btn.toggle.toggleType) {
        if (btn.toggle.toggleType === 'relation') {
          _toggleType = true;
        }
      }
      if (btn.toggle && btn.toggle.type && _toggleType) {
        switch (btn.toggle.type) {
          case 'state':
            const stateValue = dataOfState[btn.toggle.type];
            if (btn.toggle.values) {
              const valueObj = btn.toggle.values.find((val) => val.name === stateValue);
              valueObj && (btn[btn.toggle.toggleProperty] = valueObj.value);
            }
            if (actions) {
              actions.group.forEach((element) => {
                if (element.toggle && element.toggle.values) {
                  const _valueObj = element.toggle.values.find((val) => val.name === stateValue);
                  _valueObj && (element[element.toggle.toggleProperty] = _valueObj.value);
                }
              });
            }

            break;
          case '...':
            break;
        }
      }
      return true;
    } else {
      return false;
    }
  }

  public buildParameters(paramsCfg, returnData?, itemData?) {
    return ParameterResolver.resolve({
      params: paramsCfg,
      tempValue: this.tempValue,
      initValue: this.initValue,
      cacheValue: this.cacheValue,
      router: this.routerValue,
      returnValue: returnData ? returnData : {},
      item: itemData ? itemData : {},
      userValue: this.userValue,
      menuValue: this.componentService.cacheService.getNone('activeMenu') ? this.componentService.cacheService.getNone('activeMenu') : {},
    });
  }

  /**
   * ?????????
   * @param Description ????????????
   * @param itemData ??????????????????
   */
  public async writeLog(Description?, itemData?, btnOption?) {
    const text = btnOption.btnCfg.text;
    let componentId;
    if (btnOption.btnCfg.targetViewId) {
      componentId = btnOption.btnCfg.targetViewId;
    } else {
      componentId = this.config.id;
    }
    console.log('????????????', text, '????????????', componentId);
    // ???????????? targetViewId ?????? targetViewId ??????????????????????????????
    console.log('??????????????????', Description, itemData, btnOption);
    // ????????????
    // ???????????????????????????????????????

    // ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
    // ??????toolbar ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
    // ????????????????????? ????????????????????????????????????????????????????????????????????????????????????
    // ???????????????????????????aop
    // ????????????????????????????????????????????????????????????????????????????????????????????????????????????
  }

  private getLogInfo(that?, arguments1?): any {
    const btnOption = arguments1[0];
    let componentId;
    if (btnOption.targetViewId) {
      componentId = btnOption.targetViewId;
    } else {
      componentId = that.config.id;
    }

    // ?????? ??????????????????????????????????????????

    let btnData;
    btnData = {
      componentId: that.config.id, // ????????????
      targetViewId: componentId, // ??????????????????
      btnId: btnOption.id,
      btnText: btnOption.text,
      description: '[?????? ]???' + (btnOption.description ? btnOption.description : btnOption.text),
    };

    console.log('????????????', btnOption.text, '????????????', componentId, btnData);
    return btnData;
  }

  async writeLogInfo(that?, arguments1?) {
    console.log('ap===>', arguments1);
    let logConfig;
    const btnData: any = that.getLogInfo(that, arguments1);

    if (btnData && environment.systemSettings.enableLog) {
      if (environment.systemSettings && environment.systemSettings.logInfo) {
        logConfig = environment.systemSettings.logInfo.logAjaxConfig;
      }
      if (logConfig) {
        const url = logConfig.url;
        const method = logConfig.ajaxType;
        const params = that.buildParameters(logConfig.params, null, btnData);
        const response = await that.componentService.apiService[method](url, params).toPromise();
        console.log('???????????????', response);
      }
    }
    return true;
  }

  public initLog() {
    if (environment.systemSettings.enableLog) {
      this.beforeLog(this, 'action', this.writeLogInfo);
    }
    // this.before(this, 'action', this.writeLogInfo);
  }
}
