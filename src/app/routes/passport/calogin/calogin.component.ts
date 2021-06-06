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
  selector: 'passport-calogin',
  templateUrl: './calogin.component.html',
  styleUrls: ['./calogin.component.less'],
  providers: [SocialService],
})
export class CALoginComponent implements OnDestroy, OnInit {
  ws: WebSocket;
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
    this.calogin();

    this._cacheService.set('login_info', '/passport/calogin');
    // this.submit({ ca: 'exception', userName: 'admin', password: '1' });
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
  // #endregion

  public async calogin() {
    const that = this;
    const clientIp = '';
    clientIp;
    const wsString = environment.systemSettings.loginInfo.CAWebSocket;

    let url = wsString['url'];
    const Params = this.buildParametersByWS(wsString['pathParam'], {});
    for (let key in Params) {
      url = url.replace(new RegExp('\\{' + key + '\\}', 'g'), Params[key]);
    }

    that.ws = new WebSocket(url);
    that.ws.onopen = function () {
      that.ws.send('客户端已上线');
      console.log('数据发送中...');
    };
    that.ws.onmessage = function (evt) {
      const caName = evt.data;
      console.log('数据已经接受到');
      that.submit({ ca: 'ca', userName: caName, password: '' });
    };
  }

  async submit(caObj?: any): Promise<any> {
    this.error = '';
    // if (this.type === 0) {
    //   this.userName.markAsDirty();
    //   this.userName.updateValueAndValidity();
    //   this.password.markAsDirty();
    //   this.password.updateValueAndValidity();
    //   if (this.userName.invalid || this.password.invalid) {
    //     return;
    //   }
    // } else {
    //   this.mobile.markAsDirty();
    //   this.mobile.updateValueAndValidity();
    //   this.captcha.markAsDirty();
    //   this.captcha.updateValueAndValidity();
    //   if (this.mobile.invalid || this.captcha.invalid) {
    //     return;
    //   }
    // }

    //this.tokenService.set({ key: `123`, token: '123' });
    // this.tokenService

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
        const params = this.buildParametersByLogin(loginAjaxConfig.params, caObj);
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

  public buildParametersByLogin(params, caObj) {
    if (!caObj) {
      caObj = {};
    }
    const paramsData = {};
    params.forEach((element) => {
      let valueItem: any;
      if (element.type === 'componentValue') {
        valueItem = caObj[element.valueName];
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

  public buildParametersByWS(params, caObj) {
    if (!caObj) {
      caObj = {};
    }
    const paramsData = {};
    params.forEach((element) => {
      let valueItem: any;
      if (element.type === 'componentValue') {
        valueItem = caObj[element.valueName];
      }
      if (element.type === 'cacheValue') {
        valueItem = this._cacheService.getNone(element.valueName);
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

  // #region social

  // #endregion

  ngOnDestroy(): void {
    if (this.interval$) {
      clearInterval(this.interval$);
    }
  }
}
