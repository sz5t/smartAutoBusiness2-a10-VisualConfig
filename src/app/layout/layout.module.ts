import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';

import { LayoutDefaultComponent } from './default/default.component';
import { LayoutFullScreenComponent } from './fullscreen/fullscreen.component';
import { HeaderComponent } from './default/header/header.component';
import { SidebarComponent } from './default/sidebar/sidebar.component';
import { HeaderSearchComponent } from './default/header/components/search.component';
import { HeaderNotifyComponent } from './default/header/components/notify.component';
import { HeaderTaskComponent } from './default/header/components/task.component';
import { HeaderIconComponent } from './default/header/components/icon.component';
import { HeaderFullScreenComponent } from './default/header/components/fullscreen.component';
import { HeaderI18nComponent } from './default/header/components/i18n.component';
import { HeaderStorageComponent } from './default/header/components/storage.component';
import { HeaderUserComponent } from './default/header/components/user.component';

import { SettingDrawerComponent } from './default/setting-drawer/setting-drawer.component';
import { SettingDrawerItemComponent } from './default/setting-drawer/setting-drawer-item.component';
import { NavComponent } from './default/sidebar/nav.component';
import { LayoutPassportComponent } from './passport/passport.component';
import { VcLayoutDefaultComponent } from './vc_default/vc_default.component';
import { VcHeaderFullScreenComponent } from './vc_default/vc_header/vc_components/vc_fullscreen.component';
import { VcHeaderI18nComponent } from './vc_default/vc_header/vc_components/vc_i18n.component';
import { VcHeaderIconComponent } from './vc_default/vc_header/vc_components/vc_icon.component';
import { VcHeaderNotifyComponent } from './vc_default/vc_header/vc_components/vc_notify.component';
import { VcHeaderSearchComponent } from './vc_default/vc_header/vc_components/vc_search.component';
import { VcHeaderStorageComponent } from './vc_default/vc_header/vc_components/vc_storage.component';
import { VcHeaderTaskComponent } from './vc_default/vc_header/vc_components/vc_task.component';
import { VcHeaderUserComponent } from './vc_default/vc_header/vc_components/vc_user.component';
import { VcHeaderComponent } from './vc_default/vc_header/vc_header.component';
import { VcSettingDrawerItemComponent } from './vc_default/vc_setting-drawer/vc_setting-drawer-item.component';
import { VcSettingDrawerComponent } from './vc_default/vc_setting-drawer/vc_setting-drawer.component';
import { VcNavComponent } from './vc_default/vc_sidebar/vc_nav.component';
import { VcSidebarComponent } from './vc_default/vc_sidebar/vc_sidebar.component';

const SETTINGDRAWER = [SettingDrawerComponent, SettingDrawerItemComponent, VcSettingDrawerComponent, VcSettingDrawerItemComponent];
const COMPONENTS = [
  LayoutDefaultComponent,
  LayoutFullScreenComponent,
  HeaderComponent,
  SidebarComponent,
  NavComponent,
  VcLayoutDefaultComponent,
  VcHeaderComponent,
  VcSidebarComponent,
  VcNavComponent,
  ...SETTINGDRAWER,
];

const HEADERCOMPONENTS = [
  HeaderSearchComponent,
  HeaderNotifyComponent,
  HeaderTaskComponent,
  HeaderIconComponent,
  HeaderFullScreenComponent,
  HeaderI18nComponent,
  HeaderStorageComponent,
  HeaderUserComponent,
  VcHeaderSearchComponent,
  VcHeaderNotifyComponent,
  VcHeaderTaskComponent,
  VcHeaderIconComponent,
  VcHeaderFullScreenComponent,
  VcHeaderI18nComponent,
  VcHeaderStorageComponent,
  VcHeaderUserComponent,
];

// passport

const PASSPORT = [LayoutPassportComponent];

@NgModule({
  imports: [SharedModule],
  entryComponents: SETTINGDRAWER,
  declarations: [...COMPONENTS, ...HEADERCOMPONENTS, ...PASSPORT],
  exports: [...COMPONENTS, ...PASSPORT],
})
export class LayoutModule {}
