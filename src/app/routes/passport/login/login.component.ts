import { MenuService, SettingsService, _HttpClient } from '@delon/theme';
import { Component, OnDestroy, Inject, Optional, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SocialService, SocialOpenType, ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { environment } from '@env/environment';
import { StartupService } from '@core';
import { HttpClient } from '@angular/common/http';
import { CacheService } from '@delon/cache';
import { Md5 } from 'ts-md5/dist/md5';
import { ReuseTabService } from '@delon/abc/reuse-tab';
@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [SocialService],
})
export class UserLoginComponent implements OnDestroy, OnInit {
  constructor(
    fb: FormBuilder,
    modalSrv: NzModalService,
    private router: Router,
    private settingsService: SettingsService,
    private socialService: SocialService,
    private menuService: MenuService,
    public httpClient: HttpClient,
    private _cacheService: CacheService,
    @Optional()
    @Inject(ReuseTabService)
    private reuseTabService: ReuseTabService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private startupSrv: StartupService,
    public http: _HttpClient,
    public msg: NzMessageService,
  ) {
    this.form = fb.group({
      userName: [null, [Validators.required, Validators.minLength(4)]],
      password: [null, Validators.required],
      mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      captcha: [null, [Validators.required]],
      remember: [true],
    });
    modalSrv.closeAll();
  }
  ngOnInit(): void {
    this._cacheService.set('login_info', "/passport/login");
  }

  // #region fields

  get userName() {
    return this.form.controls.userName;
  }
  get password() {
    return this.form.controls.password;
  }
  get mobile() {
    return this.form.controls.mobile;
  }
  get captcha() {
    return this.form.controls.captcha;
  }
  form: FormGroup;
  error = '';
  type = 0;

  // #region get captcha

  count = 0;
  interval$: any;

  // #endregion

  switch(ret: any) {
    this.type = ret.index;
  }

  getCaptcha() {
    if (this.mobile.invalid) {
      this.mobile.markAsDirty({ onlySelf: true });
      this.mobile.updateValueAndValidity({ onlySelf: true });
      return;
    }
    this.count = 59;
    this.interval$ = setInterval(() => {
      this.count -= 1;
      if (this.count <= 0) {
        clearInterval(this.interval$);
      }
    }, 1000);
  }

  // #endregion

  async submit_bf(): Promise<any> {
    this.error = '';
    if (this.type === 0) {
      this.userName.markAsDirty();
      this.userName.updateValueAndValidity();
      this.password.markAsDirty();
      this.password.updateValueAndValidity();
      if (this.userName.invalid || this.password.invalid) {
        return;
      }
    } else {
      this.mobile.markAsDirty();
      this.mobile.updateValueAndValidity();
      this.captcha.markAsDirty();
      this.captcha.updateValueAndValidity();
      if (this.mobile.invalid || this.captcha.invalid) {
        return;
      }
    }

    // 默认配置中对所有HTTP请求都会强制 [校验](https://ng-alain.com/auth/getting-started) 用户 Token
    // 然一般来说登录请求不需要校验，因此可以在请求URL加上：`/login?_allow_anonymous=true` 表示不触发用户 Token 校验
    // this.http
    //   .post('/login/account?_allow_anonymous=true', {
    //     type: this.type,
    //     userName: this.userName.value,
    //     password: this.password.value,
    //   })
    //   .subscribe((res: any) => {
    //     if (res.msg !== 'ok') {
    //       this.error = res.msg;
    //       return;
    //     }
    //     // 清空路由复用信息
    //     this.reuseTabService.clear();
    //     // 设置用户Token信息
    //     this.tokenService.set(res.user);
    //     // 重新获取 StartupService 内容，我们始终认为应用信息一般都会受当前用户授权范围而影响
    //     this.startupSrv.load().then(() => {
    //       let url = this.tokenService.referrer!.url || '/';
    //       if (url.includes('/passport')) {
    //         url = '/';
    //       }
    //       this.router.navigateByUrl(url);
    //     });
    //   });
    let userLogin: any;
    let moduleList: any;
    let userModule: any;
    this.tokenService.set({ key: `123`, token: '123' });

    if (environment.SYSTEM_CONFIG) {
      if (environment.SYSTEM_CONFIG.login.login_enabled) {
        userLogin = environment.SYSTEM_CONFIG.login.login_url;
        userModule = environment.SYSTEM_CONFIG.login.login_premission_url;
      }
      if (environment.SYSTEM_CONFIG.module_list.module_list_enabled) {
        moduleList = environment.SYSTEM_CONFIG.module_list.module_list_url;
      }
    } else {
      userLogin = 'GET_LOGIN_RESULT';
      userModule = 'GET_USER_MODULE';
      moduleList = 'GET_MODULE_LIST';
    }
    const result = await this.http
      .get(`resource/` + userLogin + `/query?_mapToObject=true&login_name=` + this.userName.value + `&login_pwd=` + this.password.value)
      .toPromise();
    let menu: any;
    menu = await this.http.get(`resource/` + moduleList + `/query?_mapToObject=true&_sort=sortcode asc`).toPromise();
    if (this.userName.value === 'admin') {
      const currentMenu = this.buildServerRes(menu);
      this.menuService.add(currentMenu.menu);
    } else if (result.data.length > 0 && this.userName.value !== 'admin') {
      const permissionMenu: any = await this.http
        .get(`resource/` + userModule + `/query?_mapToObject=true&login_name=` + this.userName.value)
        .toPromise();
      if (permissionMenu.data.length > 0) {
        menu.data = menu.data.filter((e) => permissionMenu.data.findIndex((p) => p.moduleId === e.id) > -1);
      }
      const currentMenu = this.buildServerRes(menu);
      this.menuService.add(currentMenu.menu);
    }

    // 清空路由复用信息
    this.reuseTabService.clear();
    // 设置用户Token信息
    this.tokenService.set({ key: `123`, token: '123' });
    // 重新获取 StartupService 内容，我们始终认为应用信息一般都会受当前用户授权范围而影响
    this.startupSrv.load().then(() => {
      let url = this.tokenService.referrer!.url || '/';
      if (url.includes('/passport')) {
        url = '/';
      }
      this.router.navigateByUrl(url);
    });
    // this.router.navigateByUrl('/');
  }

  async submit(): Promise<any> {
    this.error = '';
    if (this.type === 0) {
      this.userName.markAsDirty();
      this.userName.updateValueAndValidity();
      this.password.markAsDirty();
      this.password.updateValueAndValidity();
      if (this.userName.invalid || this.password.invalid) {
        return;
      }
    } else {
      this.mobile.markAsDirty();
      this.mobile.updateValueAndValidity();
      this.captcha.markAsDirty();
      this.captcha.updateValueAndValidity();
      if (this.mobile.invalid || this.captcha.invalid) {
        return;
      }
    }

    this.tokenService.set({ key: `123`, token: '123' });

    if (environment.systemSettings && environment.systemSettings.enableLogin) {
      // 启用登录
      // 判断是否启用例外登录
      if (environment.systemSettings.enableExceptionLogin) {
        // 启用例外用户，例外用户可登录当前系统
        const exceptionUserList = environment.systemSettings.exceptionLoginInfo.userList;
        const userIndex = exceptionUserList.findIndex((item) => item.userName === this.userName.value);
        if (userIndex > -1) {
          const exceptionUser = exceptionUserList[userIndex];
          if (exceptionUser.passWord === this.password.value || !environment.systemSettings.exceptionLoginInfo.enablepassword) {
            this._cacheService.set('userInfo', exceptionUser);

            this.settingsService.user.name = exceptionUser.userName;
            this.reuseTabService.clear();
            this.startupSrv.load().then(() => {
              let url = this.tokenService.referrer!.url || '/';
              if (url.includes('/passport')) {
                url = '/';
              }
              this.router.navigateByUrl(url);
            });
            return;
          } else {
            this.error = '密码错误';
            return;
          }
        }
      }

      if (environment.systemSettings.loginInfo) {
        // 用户信息，将解析登录信息
        // 解析登录信息
        const loginAjaxConfig = environment.systemSettings.loginInfo.loginAjaxConfig;
        const url = loginAjaxConfig.url;
        const params = this.buildParametersByLogin(loginAjaxConfig.params);
        const r_data = await this.http[loginAjaxConfig.ajaxType](url, params).toPromise();

        const _userInfo: any = environment.systemSettings.loginInfo.userInfo;
        const userInfo: any = this.buildUserInfo(r_data, _userInfo);

        console.log('登录返回', userInfo);
        // 将当前用户信息写入缓存
        if (userInfo.result === 'success') {
          this._cacheService.set('userInfo', userInfo);

          this.reuseTabService.clear();
          this.startupSrv.load().then(() => {
            let url = this.tokenService.referrer!.url || '/';
            if (url.includes('/passport')) {
              url = '/';
            }
            this.router.navigateByUrl(url);
          });
        } else {
          this.error = userInfo.validationMessage;
        }
      }
    } else {
      // 不启用登录  直接进系统
      this.reuseTabService.clear();
      this.startupSrv.load().then(() => {
        let url = this.tokenService.referrer!.url || '/';
        if (url.includes('/passport')) {
          url = '/';
        }
        this.router.navigateByUrl(url);
      });
    }
  }

  public buildUserInfo(data?, userConfig?) {
    const userInfo = {};
    userConfig.forEach((item) => {
      let valueItem: any;
      if (item.type === 'returnValue') {
        // str=”jpg|bmp|gif|ico|png”; arr=str.split(”|”);
        let strs: any[]; // 定义一数组
        let _data: any = data;
        let _isPass = true;
        strs = item.path.split('\\');
        for (let _index = 0; _index < strs.length; _index++) {
          if (_isPass) {
            const _indexStr = strs[_index];
            if (_indexStr.indexOf('$') > -1) {
              const arry_index = _indexStr.split('$');
              if (arry_index.length < 2) {
                _isPass = false;
              }
              const _arr_index = parseInt(arry_index[1]);
              if (_data[arry_index[0]] && _data[arry_index[0]].length > _arr_index) {
                _data = _data[arry_index[0]][_arr_index];
              } else {
                _isPass = false;
              }
            } else {
              // 对象
              if (_indexStr === 'root') {
                _data = _data;
              } else {
                _data = _data[_indexStr];
              }
            }
          }
        }
        if (_isPass) {
          valueItem = _data[item.valueName];
        } else {
          valueItem = null;
        }
      } else {
        valueItem = item.value;
      }
      userInfo[item.name] = valueItem;
    });

    return userInfo;
  }

  // 定义结构
  public dy_st() {

    const d = {

      name: 'root',
      dataProperties: { // 当前数据属性描述
        dataType: "object"
      },
      enableGetValue: false,
      getValueConfig: {
        path: '{}root/:shux/$0/[]d',
        enableReplace: false, // 是否启用替代方案
        replace: {
          //1.描述当前值为什么情况时，可替换
          //2.
        } // 当当前方案不满足时，替代方案
      },
      defalutValue: [], // 当不启用赋值时当前值
      enableFormart: false,
      formartConfig: {  // 数据格式话

      },
      objectProperties: {  // 对象的属性构成
        setProperties: [  // 加入当前对象属性【于大结构构成循环】
          {
            // 循环当前结构
          }

        ],   // 
        removeProperties: [ // 移除当前对象内属性
          {
            name: "" // 移除的属性名称
          }
        ]
      },
      arrayProperties: [  // 数组内对象描述

      ],


    }

    const d1 = {

      name: 'root',
      dataProperties: { // 当前数据属性描述
        dataType: "array"
      },
      enableGetValue: false,
      getValueConfig: {
        path: '',
        children: [  // 数组不详细取数据了，太过复杂

        ],
        enableReplace: false, // 是否启用替代方案
        replace: {
          //1.描述当前值为什么情况时，可替换
          //2.
        } // 当当前方案不满足时，替代方案
      },
      defalutValue: [], // 当不启用赋值时当前值
      enableFormart: false,
      formartConfig: {  // 数据格式话

      }
    }

  }


  public ceshi_shuju() {

    let data = {
      "data": {
        "count": 1, "firstPage": true, "lastPage": true, "pageCount": 1, "pageNum": 1, "pageSize": 20,
        "resultDatas": [
          { "FIGURE_NUMBER": "HBb3-0", "PRIORITYID": "lqTenkF1wDKjbc1BXc63gcqU7JfV8UYi" }
        ]
      },
      "error": null,
      "exception": null, "success": 1, "validation": null, "warn": null
    }
    let path = '~/:data/:resultDatas/$0/:FIGURE_NUMBER';

    let result = {

      name: 'root',
      dataProperties: { // 当前数据属性描述
        dataType: "object"
      },
      enableGetValue: true,
      getValueConfig: {
        path: '~/:data',
        enableReplace: false, // 是否启用替代方案
        replace: {
          //1.描述当前值为什么情况时，可替换
          //2.
        } // 当当前方案不满足时，替代方案
      },
      defalutValue: {}, // 当不启用赋值时当前值
      enableFormart: false,
      formartConfig: {  // 数据格式话

      },
      objectProperties: {  // 对象的属性构成
        setProperties: [  // 加入当前对象属性【于大结构构成循环】
          {
            name: 'ceshiziduan',
            dataProperties: { // 当前数据属性描述
              dataType: "value"
            },
            enableGetValue: true,
            getValueConfig: {
              path: '~/:data/:resultDatas/$0/:FIGURE_NUMBER',
              enableReplace: false, // 是否启用替代方案
              replace: {
                //1.描述当前值为什么情况时，可替换
                //2.
              } // 当当前方案不满足时，替代方案
            },
            defalutValue: null, // 当不启用赋值时当前值
            enableFormart: false,
            formartConfig: {  // 数据格式话

            },
            objectProperties: {  // 对象的属性构成
              setProperties: [  // 加入当前对象属性【于大结构构成循环】
              ],   // 
              removeProperties: [ // 移除当前对象内属性
              ]
            },
            arrayProperties: [  // 数组内对象描述

            ],

          }

        ],   // 
        removeProperties: [ // 移除当前对象内属性
          {
            name: "firstPage" // 移除的属性名称
          },
          {
            name: "lastPage" // 移除的属性名称
          }
        ]
      },
      arrayProperties: [  // 数组内对象描述

      ],


    }

    let dd = this.analysis_Data(data, result);

    console.log('映射格式', result);
    console.log('原始数据', data);
    console.log('映射结果', dd);
    console.log('最终解析结构', dd, data, eval("(" + "null" + ")"), eval("(" + "{}" + ")"));


  }
  public analysis_Data(param_data?, result?) {

    let data = JSON.parse(JSON.stringify(param_data));
    let backInfo: any;

    // 解析出当前数据
    if (result['dataProperties']) {
      switch (result['dataProperties']['dataType']) {
        case 'OBJECT':
          // 执行代码块 1
          backInfo = {};
          break;
        case 'ARRAY':
          // 执行代码块 1
          backInfo = [];
          break;
        case 'VALUE':
          // 执行代码块 1
          break;
      }
    }

    // 是否启用赋值
    if (result['enableGetValue']) {
      if (result.hasOwnProperty('getValueConfig')) {
        // path: '{}root/:shux/$0/[]d',
        backInfo = this.analysis_path(param_data, result['getValueConfig']['path'])
        // 执行替换方案【当值不满足条件时】
      }

    } else {
      if (result.hasOwnProperty('defalutValue')) {

        // 可将字符串对象、数组转为值
        // var test = '{ colkey: "col", colsinfo: "NameList" }'
        // var obj2 = eval("(" + test + ")");
        backInfo = result['defalutValue'];

      }
    }

    if (result.hasOwnProperty('objectProperties')) {

      let objectProperties = result['objectProperties'];
      objectProperties['setProperties'].forEach(element => {
        backInfo[element['name']] = this.analysis_Data(data, element);
      });
      objectProperties['removeProperties'].forEach(element => {
        if (backInfo && backInfo.hasOwnProperty(element['name'])) {
          delete backInfo[element['name']];
        }
      });

    }

    return backInfo;
  }

  public analysis_path(param_data?, path?) {
    let data = JSON.parse(JSON.stringify(param_data));
    let path_strs: any[]; // 定义一数组
    path_strs = path.split('/');
    // 依照层级解析

    let _data: any;
    let _isPass = true;
    for (let _index = 0; _index < path_strs.length; _index++) {
      if (!_isPass) {
        break;
      }
      const _indexStr = path_strs[_index];
      if (_indexStr.indexOf('~') > -1) { // 根
        _data = data;
      }
      if (_indexStr.indexOf('{}') > -1) { // 对象

        const obj_str = _indexStr.split('{}');
        if (obj_str.length < 2) {
          _isPass = false;
        }
        if (_isPass) {
          let object_name = obj_str[1];
          _data = _data[object_name];
        }


      }
      if (_indexStr.indexOf('[]') > -1) { // 数组

        const arry_str = _indexStr.split('[]');
        if (arry_str.length < 2) {
          _isPass = false;
        }
        if (_isPass) {
          let arry_name = arry_str[1];
          _data = _data[arry_name];
        }

      }
      if (_indexStr.indexOf(':') > -1) { // 属性

        const attr_str = _indexStr.split(':');
        if (attr_str.length < 2) {
          _isPass = false;
        }
        if (_isPass) {
          let attr_name = attr_str[1];
          _data = _data[attr_name];
        }

      }
      if (_indexStr.indexOf('$') > -1) { // 索引
        const index_str = _indexStr.split('$');
        if (index_str.length < 2) {
          _isPass = false;
        }
        const _arr_index = parseInt(index_str[1]);
        if (_data && _data.length > _arr_index) {
          _data = _data[_arr_index];
        } else {
          _isPass = false;
        }
      }
      if (_indexStr.indexOf('..') > -1) { // 当前位置的上一级【目前不实现】

      }

    }
    console.log('原始数据:', param_data, '地址:', path, '最终解析出:', _data);

    return _data;

  }

  public buildParametersByLogin(params?) {
    const paramsData = {};
    params.forEach((element) => {
      let valueItem: any;
      if (element.type === 'componentValue') {
        valueItem = this.form.value[element.valueName];
      } else {
        valueItem = element.value;
      }

      if (element.transform) {
        if (element.transform === 'MD5') {
          valueItem = Md5.hashStr(valueItem);
        }
      }
      if (element.dataType) {
        if (element.dataType === 'MD5') {
          valueItem = Md5.hashStr(valueItem);
        }
      }
      paramsData[element.name] = valueItem;
    });
    return paramsData;
  }

  private buildServerRes(serverData) {
    const data: any = {};
    if (serverData.data) {
      const s = this.buildServerMenu(serverData);
      data.menu = [...s];
      return data;
    } else {
      return data;
    }
  }
  private buildServerMenu(serverData) {
    const menu_level_1 = serverData.data.filter((d) => d.nodetype === 1);
    const menu_level_2 = serverData.data.filter((d) => d.nodetype === 2);
    const menu_level_3 = serverData.data.filter((d) => d.nodetype === 3);

    if (menu_level_3) {
      for (const l2 of menu_level_2) {
        l2.children = [];
        for (const l3 of menu_level_3) {
          if (l3.parentId === l2.id) {
            l2.children.push(l3);
          }
        }
      }
    }
    if (menu_level_2) {
      menu_level_1.map((l1) => {
        l1.children = [];
        menu_level_2.map((l2) => {
          if (l2.parentId === l1.id) {
            l1.children.push(l2);
          }
        });
      });
    }

    return menu_level_1;
  }

  // #region social

  open(type: string, openType: SocialOpenType = 'href') {
    let url = ``;
    let callback = ``;
    // tslint:disable-next-line: prefer-conditional-expression
    if (environment.production) {
      callback = 'https://ng-alain.github.io/ng-alain/#/callback/' + type;
    } else {
      callback = 'http://localhost:4200/#/callback/' + type;
    }
    switch (type) {
      case 'auth0':
        url = `//cipchk.auth0.com/login?client=8gcNydIDzGBYxzqV0Vm1CX_RXH-wsWo5&redirect_uri=${decodeURIComponent(callback)}`;
        break;
      case 'github':
        url = `//github.com/login/oauth/authorize?client_id=9d6baae4b04a23fcafa2&response_type=code&redirect_uri=${decodeURIComponent(
          callback,
        )}`;
        break;
      case 'weibo':
        url = `https://api.weibo.com/oauth2/authorize?client_id=1239507802&response_type=code&redirect_uri=${decodeURIComponent(callback)}`;
        break;
    }
    if (openType === 'window') {
      this.socialService
        .login(url, '/', {
          type: 'window',
        })
        .subscribe((res) => {
          if (res) {
            this.settingsService.setUser(res);
            this.router.navigateByUrl('/');
          }
        });
    } else {
      this.socialService.login(url, '/', {
        type: 'href',
      });
    }
  }

  // #endregion

  ngOnDestroy(): void {
    if (this.interval$) {
      clearInterval(this.interval$);
    }
  }




}
