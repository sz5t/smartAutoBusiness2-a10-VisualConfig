import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { zip } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MenuService, SettingsService, TitleService, ALAIN_I18N_TOKEN } from '@delon/theme';
import { ACLService } from '@delon/acl';
import { TranslateService } from '@ngx-translate/core';
import { I18NService } from '../i18n/i18n.service';

import { NzIconService } from 'ng-zorro-antd/icon';
import { ICONS_AUTO } from '../../../style-icons-auto';
import { ICONS } from '../../../style-icons';
import { environment } from '@env/environment';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { CacheService } from '@delon/cache';
import { Router } from '@angular/router';

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
  constructor(
    iconSrv: NzIconService,
    private menuService: MenuService,
    private translate: TranslateService,
    private _cacheService: CacheService,
    private router: Router,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    private settingService: SettingsService,
    //private aclService: ACLService,
    private titleService: TitleService,
    private httpClient: HttpClient,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
    iconSrv.addIcon(...ICONS_AUTO, ...ICONS);
  }
  private userInfo: any = {};

  public async getResourceMappingData() {
    const timestamp = new Date().getTime();
    let data = {};
    if (environment.systemSettings && environment.systemSettings.enableResourceProx) {
      try {
        data = await this.httpClient.get(`assets/tmp/resource_mapping.json?${timestamp}`).toPromise();
      } catch (error) {
        data = {};
      }
    }
    this._cacheService.set('resourceMappingData', data);
  }

  public async getWebConfig() {
    const timestamp = new Date().getTime();
    const data = await this.httpClient.get(`assets/tmp/webConfig.json?${timestamp}`).toPromise();

    if (data) {
      for (const key in data) {
        environment[key] = data[key];
      }
    }
    this.tokenService.set({ key: `123`, token: '123' });

    if (environment.systemSettings && environment.systemSettings['enableClient'] && environment.systemSettings['clientInfo']) {
      const clientInfo = environment.systemSettings['clientInfo'];
      const client_ajaxConfig = clientInfo['clientAjaxConfig'];
      const r_data = await this.httpClient[client_ajaxConfig.ajaxType](client_ajaxConfig['url'], {}).toPromise();
      if (r_data && r_data['success'] === 1) {
        const ip = r_data['data'];
        this._cacheService.set('clientIp', ip);
      }
    }
    // const data1 = await this.httpClient.get(`http://192.168.1.111:8401/page/struct/parse?pageId=m2lSKOiIgmNR5R3JStQg0CYPNzdSd4Fd`).toPromise();
    console.log('+++++++++加载后台服务访问地址++++++++++++', data, environment);
  }

  async load(): Promise<any> {
    await this.getWebConfig();
    await this.getResourceMappingData();

    // const data = await this.httpClient.get(`resource/SMT_SETTING_LAYOUT_BASE/query?_mapToObject=true`).toPromise();
    // console.log('======测试发布地址======',data);
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    let MenuDataList: any[] = [];

    this.userInfo = this._cacheService.getNone('userInfo');
    let menu_url = 'GET_MENU_LIST_WORK';
    if (environment.systemSettings && environment.systemSettings.systemMode === 'work') {
      menu_url = 'GET_MENU_LIST_WORK';
      const workMenuInfo = environment.systemSettings.menuInfo.workMenuInfo;

      if (this.userInfo && this.userInfo.userId) {
        // 登录用户
        const menuAjaxConfig = workMenuInfo.menuAjaxConfig;
        const url = menuAjaxConfig.url;
        const params = this.buildParametersByLogin(menuAjaxConfig.params);
        const _menuInfo = workMenuInfo.menuInfo;
        const r_data = await this.httpClient[menuAjaxConfig.ajaxType](url, params).toPromise();
        const r_data_info: any = this.buildDDataInfo(r_data, _menuInfo);
        // 将结果集转化
        if (workMenuInfo.enableMenuMapping) {
          MenuDataList = this.transformList(r_data_info.menuData, workMenuInfo.menuMapping);
        } else {
          MenuDataList = r_data_info.menuData;
        }
        console.log('加载菜单=====>', MenuDataList);
      }
    } else {
      menu_url = 'GET_MENU_LIST';
    }
    return new Promise(async (resolve) => {
      const langData: any = await this.httpClient.get(`assets/tmp/i18n/${this.i18n.defaultLang}.json`).toPromise();
      const serverlangData: any = []; // await this.httpClient.get(`resource/GET_SYS_I18N_LIST/query?_mapToObject=true&ddicCode=${this.i18n.defaultLang}`).toPromise();
      const appData: any = {
        app: {
          name: 'Alain',
          description: 'Ng-zorro admin panel front-end framework',
        },
        user: {
          name: 'Admin',
          avatar: './assets/tmp/img/avatar.jpg',
          email: 'cipchk@qq.com',
        },
        menu: [],
      }; //await this.httpClient.get(`assets/tmp/app-data.json`).toPromise();
      const serverData: any = await this.httpClient.get(`resource/${menu_url}/query?_mapToObject=true&_sort=menuSort asc`).toPromise();

      if (langData) {
        const lang_data = this.buildI18NServerRes(langData, serverlangData);
        this.translate.setTranslation(this.i18n.defaultLang, lang_data);
        this.translate.setDefaultLang(this.i18n.defaultLang);
      }

      // setting language data

      // application data
      // const res = appData;
      let res: any;
      if (environment.systemSettings && environment.systemSettings.systemMode === 'work') {
        appData.menu = [];
        res = this.buildServerRes(appData, { data: MenuDataList });
      } else {
        res = this.buildServerRes(appData, serverData);
      }
      // const res: any = this.buildServerRes(appData, serverData)// appData;
      // 应用信息：包括站点名、描述、年份
      this.settingService.setApp(res.app);
      // 用户信息：包括姓名、头像、邮箱地址
      if (this.userInfo && this.userInfo.userId) {
        this.settingService.setUser(this.userInfo);
      } else {
        this.settingService.setUser(res.user);
      }
      // ACL：设置权限为全量
      // this.aclService.setFull(true);
      // 初始化菜单
      this.menuService.add(res.menu);
      // 设置页面标题的后缀
      this.titleService.default = '';
      this.titleService.suffix = res.app.name;

      if (this.userInfo && this.userInfo.userId) {
      } else {
        // let url = this.tokenService.referrer!.url || '/';
        // if (url.includes('/passport')) {
        //   url = '/';
        // }
        // 没有登录信息，跳转至登录页面
        let login_url: any = this._cacheService.getNone('login_info');
        if (!login_url) {
          this.router.navigateByUrl(this.tokenService.login_url!);
        } else {
          this.router.navigateByUrl(login_url!);
        }

        // zip(
        //   this.httpClient.get(`assets/tmp/i18n/${this.i18n.defaultLang}.json`),
        //   this.httpClient.get(`resource/GET_SYS_I18N_LIST/query?_mapToObject=true&ddicCode=${this.i18n.defaultLang}`),
        //   this.httpClient.get(`assets/tmp/app-data.json`),
        //   this.httpClient.get(`resource/${menu_url}/query?_mapToObject=true&_sort=menuSort asc`),
        // )
        //   .pipe(
        //     // 接收其他拦截器后产生的异常消息
        //     catchError(([langData, serverlangData, appData, serverData]) => {
        //       //resolve(null);
        //       return [langData, serverlangData, appData, serverData];
        //     }),
        //   )
        //   .subscribe(
        //     ([langData, serverlangData, appData, serverData]) => {
        //       // setting language data
        //       const lang_data = this.buildI18NServerRes(langData, serverlangData);
        //       this.translate.setTranslation(this.i18n.defaultLang, lang_data);
        //       this.translate.setDefaultLang(this.i18n.defaultLang);

        //       // application data
        //       // const res = appData;
        //       let res: any;
        //       if (environment.systemSettings && environment.systemSettings.systemMode === 'work') {
        //         appData.menu = [];
        //         res = this.buildServerRes(appData, { data: MenuDataList });
        //       } else {
        //         res = this.buildServerRes(appData, serverData);
        //       }
        //       // const res: any = this.buildServerRes(appData, serverData)// appData;
        //       // 应用信息：包括站点名、描述、年份
        //       this.settingService.setApp(res.app);
        //       // 用户信息：包括姓名、头像、邮箱地址
        //       if (this.userInfo && this.userInfo.userId) {
        //         this.settingService.setUser(this.userInfo);
        //       } else {
        //         this.settingService.setUser(res.user);
        //       }
        //       // ACL：设置权限为全量
        //       // this.aclService.setFull(true);
        //       // 初始化菜单
        //       this.menuService.add(res.menu);
        //       // 设置页面标题的后缀
        //       this.titleService.default = '';
        //       this.titleService.suffix = res.app.name;

        //       if (this.userInfo && this.userInfo.userId) {
        //       } else {
        //         // let url = this.tokenService.referrer!.url || '/';
        //         // if (url.includes('/passport')) {
        //         //   url = '/';
        //         // }
        //         // 没有登录信息，跳转至登录页面
        //         let login_url: any = this._cacheService.getNone('login_info');
        //         if (!login_url) {
        //           this.router.navigateByUrl(this.tokenService.login_url!);
        //         } else {
        //           this.router.navigateByUrl(login_url!);
        //         }
        //         // this.router.navigateByUrl('/passport/login');
        //       }
        //     },
        //     () => { },
        //     () => {
        //       resolve(null);
        //     },
        //   );
      }
      resolve(null);
    });
  }

  private buildLocalRes(data) {
    return data;
  }

  public buildParametersByLogin(params?) {
    const paramsData = {};
    params.forEach((element) => {
      let valueItem: any;
      if (element.type === 'userValue') {
        valueItem = this.userInfo[element.valueName];
        if (!valueItem || valueItem === 0) {
          valueItem = element.value;
        }
      } else {
        valueItem = element.value;
      }

      paramsData[element.name] = valueItem;
    });
    return paramsData;
  }

  // 解析结果
  public buildDDataInfo(data?, userConfig?) {
    const dataInfo = {};
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
      dataInfo[item.name] = valueItem;
    });

    return dataInfo;
  }

  // 转化结果集
  public transformList(data?, arrConfig?) {
    const b_data = [];
    if (data && data.length > 0) {
      data.forEach((item) => {
        const data_item = {};
        arrConfig.forEach((cfg) => {
          if (cfg.type === 'returnValue') {
            data_item[cfg.name] = item[cfg.valueName];
          } else {
            data_item[cfg.name] = cfg.value;
          }
        });
        b_data.push(data_item);
      });
    }
    return b_data;
  }

  private buildI18NServerRes(data, serverData) {
    if (serverData && serverData.data) {
      const s = {};
      serverData.data.forEach((element) => {
        s[element.i18n] = element.name;
      });
      data = { ...data, ...s };
      return data;
    } else {
      return data;
    }
  }

  private buildServerRes(data?: any, serverData?: any) {
    if (!data) {
      data = {};
      data.menu = [];
    }
    if (serverData && serverData.data) {
      const s = this.buildServerMenu(serverData);
      data.menu = [...s, ...data.menu];
      return data;
    } else {
      return data;
    }
  }
  private buildServerMenu(serverData) {
    const menu_level_1 = serverData.data.filter((d) => (d.menuType === 1 || d.menuType === 999) && d.level === 1);
    const menu_level_2 = serverData.data.filter((d) => (d.menuType === 2 || d.menuType === 999) && d.level === 2);
    const menu_level_3 = serverData.data.filter((d) => (d.menuType === 3 || d.menuType === 999) && d.level === 3);

    if (menu_level_3) {
      for (const l2 of menu_level_2) {
        l2.children = [];
        for (const l3 of menu_level_3) {
          if (l3.menuParentId === l2.id) {
            l2.children.push(l3);
          }
        }
      }
    }

    //   menu_level_3.map(l3 => {
    //     menu_level_2.map(l2 => {
    //       l2['children'] = [];
    //       if (l3.parentId === l2.id) {
    //         l2['children'].push(l3);
    //       }
    //     });
    //   });
    // }
    if (menu_level_2) {
      menu_level_1.map((l1) => {
        l1.children = [];
        menu_level_2.map((l2) => {
          if (l2.menuParentId === l1.id) {
            l1.children.push(l2);
          }
        });
      });
    }

    return menu_level_1;
  }
}
