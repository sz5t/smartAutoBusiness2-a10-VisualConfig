import { LocationStrategy, DOCUMENT } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  Input,
  Output,
  Renderer2,
  ChangeDetectorRef,
  Inject,
  ElementRef,
  EventEmitter,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Menu, MenuService, SettingsService } from '@delon/theme';
import { environment } from '@env/environment';
import { pageConfigCache } from '@env/page-config-cache';
import { filter } from 'rxjs/operators';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';

@Component({
  selector: 'layout-nav',
  templateUrl: './nav.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavComponent implements OnInit, OnDestroy {
  @Input()
  layoutCollapsed;
  @Input()
  public autoCloseUnderPad;
  @Output()
  public select;
  // @HostListener('onClick')
  // public onClick;
  public list: Menu[];
  public rootEl;
  public bodyEl;

  public menuList = [];
  public menuMode = 'normal';
  route$;
  change$;

  floatingEl;
  SHOWCLS = 'ad-nav__floating-show';
  FLOATINGCLS = 'ad-nav__floating';
  public menus = [];
  constructor(
    private _menuService: MenuService,
    private _settings: SettingsService,
    private _router: Router,
    private _locationStrategy: LocationStrategy,
    private _render: Renderer2,
    private _cd: ChangeDetectorRef,
    @Inject(DOCUMENT)
    private _doc,
    private _el: ElementRef,
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) {
    this.list = [];
    this.autoCloseUnderPad = true;
    this.select = new EventEmitter<any>(true);
    this.rootEl = this._el.nativeElement;
  }

  ngOnInit() {
    const setting = environment.systemSettings.menuInfo.menuMode;
    if (setting) {
      this.menuMode = setting;
    }
    // this.bodyEl = this._doc.querySelector('body');
    this._menuService.openedByUrl(this._router.url);
    // this.genFloatingContainer();
    this.change$ = this._menuService.change.subscribe((res) => {
      console.log(res);
      this.list = res;
      this._cd.detectChanges();
    });
    this.installUnderPad();
  }

  onClick(menu) {
    console.log('====menu=====', menu);
    const activeMenu = {
      id: menu.ID,
      jsonId: menu.PAGE_CODE,
      text: menu.text,
      mainPageId: menu.PAGE_CODE,
    };
    this.componentService.cacheService.set('activeMenu', activeMenu);

    // liu 20.11.12 只缓存5个页面数据
    const index = this.menuList.findIndex((item) => item.PAGE_CODE === menu.PAGE_CODE);
    if (index < 0) {
      this.menuList = [activeMenu, ...this.menuList];
    }
    if (this.menuList.length > 5) {
      this.menuList = this.menuList.slice(0, 5);
    }
    for (const key in pageConfigCache) {
      const index = this.menuList.findIndex((item) => item.PAGE_CODE === key);
      if (index < 0) {
        pageConfigCache[key] = { pageConfig: {}, permissionConfig: {} };
      }
    }
    debugger;
    // console.log('缓存信息',this.menuList);
    pageConfigCache[menu.PAGE_CODE] = { pageConfig: {}, permissionConfig: {} };
    if (!menu.link) {
      if (menu.PAGE_CODE) {
        menu.link = '/template/smt-dynamic/' + menu.PAGE_CODE;
      }
    }
    this._router.navigateByUrl(menu.link);
    // this.hideAll();
  }

  ngOnDestroy() {
    this.change$.unsubscribe();
    if (this.route$) {
      this.route$.unsubscribe();
    }
    // this.clearFloatingContainer();
  }

  installUnderPad() {
    if (!this.autoCloseUnderPad) {
      return;
    }
    this.route$ = this._router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((s) => this.underPad());
    this.underPad();
  }

  underPad() {
    if (window.innerWidth < 992 && !this._settings.layout.collapsed) {
      console.log('underPad');
      setTimeout(() => this._settings.setLayout('collapsed', true));
    }
  }
}
