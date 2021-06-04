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
  selector: 'vc-passport-login',
  templateUrl: './vc-login.component.html',
  styleUrls: ['./vc-login.component.less'],
  providers: [SocialService],
})
export class VcUserLoginComponent implements OnDestroy, OnInit {
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
    this._cacheService.set('login_info', '/passport/vclogin');
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

  switch(ret: any) {
    this.type = ret.index;
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
        //this.tokenService.set({ key: `123`, token: '123' });
      }

      if (environment.systemSettings.loginInfo) {
        // 用户信息，将解析登录信息
        // 解析登录信息
        this.tokenService.set({ key: `token`, token: 'login' });
        const loginAjaxConfig = environment.systemSettings.loginInfo.loginAjaxConfig;
        const url = loginAjaxConfig.url;
        const params = this.buildParametersByLogin(loginAjaxConfig.params);
        const userInfo = await this.http[loginAjaxConfig.ajaxType](url, params).toPromise();

        //const userInfo: any = environment.systemSettings.loginInfo.userInfo;
        //const _userInfo: any = this.buildUserInfo(r_data, _userInfo);

        console.log('登录返回', userInfo);
        // 将当前用户信息写入缓存
        if (userInfo.state === 1) {
          this.tokenService.set({ key: `token`, token: userInfo.data.value });
          this._cacheService.set('userInfo', userInfo.data);

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
    }
    // else {
    //   // 不启用登录  直接进系统
    //   this.reuseTabService.clear();
    //   this.startupSrv.load().then(() => {
    //     let url = this.tokenService.referrer!.url || '/';
    //     if (url.includes('/passport')) {
    //       url = '/';
    //     }
    //     this.router.navigateByUrl(url);
    //   });
    // }
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
        backInfo = this.analysis_path(param_data, result['getValueConfig']['path']);
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
      objectProperties['setProperties'].forEach((element) => {
        backInfo[element['name']] = this.analysis_Data(data, element);
      });
      objectProperties['removeProperties'].forEach((element) => {
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
      if (_indexStr.indexOf('~') > -1) {
        // 根
        _data = data;
      }
      if (_indexStr.indexOf('{}') > -1) {
        // 对象

        const obj_str = _indexStr.split('{}');
        if (obj_str.length < 2) {
          _isPass = false;
        }
        if (_isPass) {
          let object_name = obj_str[1];
          _data = _data[object_name];
        }
      }
      if (_indexStr.indexOf('[]') > -1) {
        // 数组

        const arry_str = _indexStr.split('[]');
        if (arry_str.length < 2) {
          _isPass = false;
        }
        if (_isPass) {
          let arry_name = arry_str[1];
          _data = _data[arry_name];
        }
      }
      if (_indexStr.indexOf(':') > -1) {
        // 属性

        const attr_str = _indexStr.split(':');
        if (attr_str.length < 2) {
          _isPass = false;
        }
        if (_isPass) {
          let attr_name = attr_str[1];
          _data = _data[attr_name];
        }
      }
      if (_indexStr.indexOf('$') > -1) {
        // 索引
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
      if (_indexStr.indexOf('..') > -1) {
        // 当前位置的上一级【目前不实现】
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

  ngOnDestroy(): void {}
}
