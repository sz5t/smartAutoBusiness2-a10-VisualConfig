import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NoticeItem, NoticeIconList } from '@delon/abc/notice-icon';
import { CacheService } from '@delon/cache';
import { environment } from '@env/environment';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { ParameterResolver } from 'src/app/shared/resolver/parameter/parameter.resolver';

/**
 * 菜单通知
 */
@Component({
  selector: 'header-notify',
  template: `
    <notice-icon
      [data]="data"
      [count]="count"
      [loading]="loading"
      btnClass="alain-default__nav-item"
      btnIconClass="alain-default__nav-item-icon"
      (select)="select($event)"
      (clear)="clear($event)"
      (popoverVisibleChange)="loadData()"
    ></notice-icon>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderNotifyComponent implements OnInit, OnDestroy {
  data: NoticeItem[] = [
    // {
    //   title: '通知',
    //   list: [],
    //   emptyText: '你已查看所有通知',
    //   emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg',
    //   clearText: '清空通知',
    // },
    // {
    //   title: '消息',
    //   list: [],
    //   emptyText: '您已读完所有消息',
    //   emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg',
    //   clearText: '清空消息',
    // },
    {
      title: '待办',
      list: [],
      emptyText: '你已完成所有待办',
      emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg',
      clearText: '清空待办',
    },
  ];
  public NoticeConfig = {
    url: 'resource/getNoticeData/query',
    ajaxType: 'get',
    params: [
      {
        'name': '_mapToObject',
        "type": 'value',
        "value": true
      },
      {
        'name': 'reciverId',
        'type': 'userValue',
        'valueName': 'userId'
      },
      {
        'name': 'taskState',
        'type': 'value',
        'value': 1
      },
      {
        "name": "instanceState",
        "type": "value",
        "value": 1
      }
    ]
  }
  count = 0;
  loading = false;
  enablenotice = false;
  intervalTime = 10000;
  linkUrl = "";
  linkMenu = {};

  constructor(@Inject(BSN_COMPONENT_SERVICES)
  public componentService: ComponentServiceProvider,
    private msg: NzMessageService, private cdr: ChangeDetectorRef,
    private router: Router,
  ) { }

  private updateNoticeData_old(notices: NoticeIconList[]): NoticeItem[] {
    const data = this.data.slice();
    data.forEach((i) => (i.list = []));

    notices.forEach((item) => {
      const newItem = { ...item };
      // if (newItem.datetime) {
      //   newItem.datetime = formatDistanceToNow(new Date(item.datetime), {
      //     locale: (window as any).__locale__,
      //   });

      // }
      if (newItem.extra && newItem.status) {
        newItem.color = {
          todo: undefined,
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newItem.status];
      }
      data.find((w) => w.title === newItem.type)!.list.push(newItem);
    });
    return data;
  }

  public updateNoticeData(notices: NoticeIconList[]): NoticeItem[] {
    const data = this.data.slice();
    data.forEach(i => i.list = []);

    notices && notices.forEach(item => {
      const newItem = { ...item };
      // if (newItem.datetime)
      //   newItem.datetime = distanceInWordsToNow(item.datetime, { locale: (window as any).__locale__ });
      if (newItem.extra && newItem.state) {
        newItem.color = ({
          todo: undefined,
          1: 'blue',
          2: 'red',
          3: 'gold',
        })[newItem.state];
      }
      data.find(w => w.title === newItem.type).list.push(newItem);
    });
    return data;
  }

  loadData_old() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    setTimeout(() => {
      this.data = this.updateNoticeData([
        {
          id: '000000001',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
          title: '你收到了 14 份新周报',
          datetime: '2017-08-09',
          type: '通知',
        },
        {
          id: '000000002',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
          title: '你推荐的 曲妮妮 已通过第三轮面试',
          datetime: '2017-08-08',
          type: '通知',
        },
        {
          id: '000000003',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png',
          title: '这种模板可以区分多种通知类型',
          datetime: '2017-08-07',
          read: true,
          type: '通知',
        },
        {
          id: '000000004',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
          title: '左侧图标用于区分不同的类型',
          datetime: '2017-08-07',
          type: '通知',
        },
        {
          id: '000000005',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
          title: '内容不要超过两行字，超出时自动截断',
          datetime: '2017-08-07',
          type: '通知',
        },
        {
          id: '000000006',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
          title: '曲丽丽 评论了你',
          description: '描述信息描述信息描述信息',
          datetime: '2017-08-07',
          type: '消息',
        },
        {
          id: '000000007',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
          title: '朱偏右 回复了你',
          description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
          datetime: '2017-08-07',
          type: '消息',
        },
        {
          id: '000000008',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
          title: '标题',
          description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
          datetime: '2017-08-07',
          type: '消息',
        },
        {
          id: '000000009',
          title: '任务名称',
          description: '任务需要在 2017-01-12 20:00 前启动',
          extra: '未开始',
          status: 'todo',
          type: '待办',
        },
        {
          id: '000000010',
          title: '第三方紧急代码变更',
          description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
          extra: '马上到期',
          status: 'urgent',
          type: '待办',
        },
        {
          id: '000000011',
          title: '信息安全考试',
          description: '指派竹尔于 2017-01-09 前完成更新并发布',
          extra: '已耗时 8 天',
          status: 'doing',
          type: '待办',
        },
        {
          id: '000000012',
          title: 'ABCD 版本发布',
          description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
          extra: '进行中',
          status: 'processing',
          type: '待办',
        },
      ]);
      this.loading = false;
      this.cdr.detectChanges();
    }, 1000);

    let userInfo = this.componentService.cacheService.getNone('userInfo');
    this.openMessagePushService(userInfo);
  }

  public Interval: any;
  public ngOnInit() {



    if (environment.systemSettings && environment.systemSettings.enablenotice) {
      this.enablenotice = true;
      if (environment.systemSettings.noticeInfo) {
        this.intervalTime = environment.systemSettings.noticeInfo['intervalTime'];
        this.linkUrl = environment.systemSettings.noticeInfo['linkUrl'];

        this.linkMenu = environment.systemSettings.noticeInfo['linkMenu'];

        if (environment.systemSettings.noticeInfo['noticeAjaxConfig']) {
          this.NoticeConfig = environment.systemSettings.noticeInfo['noticeAjaxConfig'];
        }
      }
    } else {
      this.enablenotice = false;
    }
    let userInfo = this.componentService.cacheService.getNone('userInfo');
    // liu 21/01/28
    // this.openMessagePushService(userInfo);
    if (this.enablenotice) {
      this.load();
      var that = this;
      that.Interval = setInterval(function () {
        that.load()
      }, this.intervalTime);
    }






  }

  public loadData() {
    if (!this.enablenotice) {
      return;
    }
    if (this.loading) return;
    this.loading = true;
    setTimeout(() => {

      this.data = this.updateNoticeData(this.noticeArray);
      this.loading = false;
      this.cdr.detectChanges();
    }, 0);
  }

  clear(type: string) {
    this.msg.success('请处理待办任务');
    // this.msg.success(`清空了 ${type}`);
  }

  select(res: any) {
    //this.msg.success(`点击了 ${res.title} 的 ${res.item.title}`);
    let url: any;
    url = '/template/dynamic/vwzxewXqHDrxa7AsPKgrfQbo2AuJp6dGr3oW';
    if (url) {

      this.componentService.cacheService.set('activeMenu', this.linkMenu);


      res['item']['extra'] = "处理中";
      const params: any = { 'processType': res['item']['processtype'] }
      this.componentService.router.navigate([url], { queryParams: { ...params } });
      // this.router.navigateByUrl(url, { queryParams: { ...params } });
    }

  }


  public ws: any;
  public noticeArray = [];
  public MessageArray = [];

  /**
 * openMessagePushService 建立消息推送
 */
  public openMessagePushService(cache) {
    const that = this;
    if (!environment.MSG_SERVER_URL) {
      return;
    }
    const wsString = environment.MSG_SERVER_URL + cache['userId'];
    // console.log('wsString', wsString);
    this.ws = new WebSocket(wsString);
    this.ws.onopen = function () {
      // Web Socket 已连接上，使用 send() 方法发送数据
      // 连接服务端socket
      that.ws.send('客户端以上线');
      console.log('数据发送中...');
    };
    this.ws.onmessage = function (evt) {
      let received_msg = evt.data;
      received_msg = JSON.parse(received_msg);
      console.log('数据已接收...', received_msg);
      if (received_msg !== '1') {
        if (received_msg.type === 1) {
          that.getNotcieData(that.NoticeConfig).then(data => {
            if (data.success) {
              if (data.data) {
                console.log(data.data);
                // data.data.forEach(e => {
                //   that.MessageArray.push({toUserId: e['receiverId'], message: e['descs']})
                // });
                that.count = data.data.length;
                that.noticeArray = [];
                data.data.forEach(d => {
                  that.noticeArray.push(
                    {
                      id: d.Id,
                      type: '待办',
                      title: d.title,
                      description: d.descs,
                      datatime: d.createDate,
                      state: d.taskType,
                      extra: d.taskTypeText,
                      processtype: d.processType
                    }
                  )
                })
              } else {
                that.count = 0
              }
            }
          });
        } else if (received_msg.type === 2) {
          const num = parseInt(received_msg.message, 10)
          that.count = num;
          that.getNotcieData(that.NoticeConfig).then(data => {
            if (data.success) {
              if (data.data) {
                that.noticeArray = [];
                data.data.forEach(d => {
                  that.noticeArray.push(
                    {
                      id: d.Id,
                      type: '待办',
                      title: d.title,
                      description: d.descs,
                      datatime: d.createDate,
                      state: d.taskType,
                      extra: d.taskTypeText,
                      processtype: d.processType
                    }
                  )
                })
              }
            }
          });
        }
      }
    };
    this.ws.onclose = function () {
      // 关闭 websocket
      console.log('连接已关闭...');
    };
  }

  public async getNotcieData(config) {
    const params = this.buildParameters(config.params, null);

    const ajaxData = await this.componentService.apiService
      .get(
        config.url,
        // 'get',
        params
      ).toPromise();
    return ajaxData;
  }

  public buildParameters_old(params?, data?): any {
    const userInfo = this.componentService.cacheService.getNone('userInfo');
    const activeMenu = this.componentService.cacheService.getNone('activeMenu');
    const paramsData = {};
    params.forEach((element) => {
      let valueItem: any;
      if (element.type === 'userValue') {
        valueItem = userInfo[element.valueName];
      }
      if (element.type === 'item') {
        valueItem = data[element.valueName];
      }
      if (element.type === 'activeMenu') {
        valueItem = activeMenu[element.valueName];
      }
      if (element.type === 'value') {
        valueItem = element.value;
      }

      if (!valueItem && valueItem !== 0) {
        valueItem = element.value;
      }

      paramsData[element.name] = valueItem;
    });
    return paramsData;
  }


  public buildParameters(paramsCfg, data?, isArray = false) {
    let parameterResult: any | any[];
    const userInfo = this.componentService.cacheService.getNone('userInfo');
    const activeMenu = this.componentService.cacheService.getNone('activeMenu');
    parameterResult = ParameterResolver.resolve({
      params: paramsCfg,
      //tempValue: this.tempValue,
      componentValue: data,
      item: data,
      // initValue: this.initValue,
      // cacheValue: this.cacheValue,
      // router: this.routerValue,
      outputValue: data,
      returnValue: data,

      userValue: userInfo,
      menuValue: this.componentService.cacheService.getNone('activeMenu') ? this.componentService.cacheService.getNone('activeMenu') : {},
    });
    return parameterResult;
  }

  public async load() {
    // this.MessageArray = [];
    // this.noticeArray = [];
    await this.loadNoticeArray();
    this.cdr.detectChanges();
    //console.log('==================', this.noticeArray);
  }

  public async loadNoticeArray() {
    this.noticeArray = [];
    this.MessageArray = [];
    this.getNotcieData(this.NoticeConfig).then(data => {
      if (data.success) {
        if (data.data) {
          // console.log(data.data);
          data.data.forEach(e => {
            this.MessageArray.push({ toUserId: e['receiverId'], message: e['descs'] })
          });
          this.count = data.data.length;
          this.startMessagePush(this.MessageArray);
          data.data.forEach(d => {
            this.noticeArray.push(
              {
                id: d.Id,
                type: '待办',
                title: d.title,
                description: d.descs,
                datatime: d.createDate,
                state: d.taskState,
                extra: d.taskStateText,
                processtype: d.processType
              }
            )
          })
        } else {
          this.count = 0
        }
      }
    });
  }

  /**
 * startMessagePush 消息初始化的时候，调用推送消息接口
 */
  public startMessagePush(MsgArray) {
    // console.log(userId, MsgArray);
    // const url = 'api.push.message/common/message/batch_individuality/push'
    // this.componentService.apiService.post(url, MsgArray).toPromise();
  }



  public ngOnDestroy() {
    if (this.ws) {
      this.ws.close();
    }

    if (this.Interval) {
      clearInterval(this.Interval);
    }

  }

}
