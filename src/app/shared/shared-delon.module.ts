import { ExceptionModule } from '@delon/abc/exception';
import { GlobalFooterModule } from '@delon/abc/global-footer';
import { NoticeIconModule } from '@delon/abc/notice-icon';
import { PageHeaderModule } from '@delon/abc/page-header';
import { ResultModule } from '@delon/abc/result';
// import { ReuseTabModule } from '@delon/abc/reuse-tab';
import { SEModule } from '@delon/abc/se';
import { SidebarNavModule } from '@delon/abc/sidebar-nav';
import { STModule } from '@delon/abc/st';
import { SVModule } from '@delon/abc/sv';
import { FooterToolbarModule } from '@delon/abc/footer-toolbar';
import { EllipsisModule } from '@delon/abc/ellipsis';
import { FullContentModule } from '@delon/abc/full-content';
import { QRModule } from '@delon/abc/qr';
import { TagSelectModule } from '@delon/abc/tag-select';
import { QuickMenuModule } from '@delon/abc/quick-menu';
import { CountDownModule } from '@delon/abc/count-down';
export const SHARED_DELON_MODULES = [
  PageHeaderModule,
  ResultModule,
  ExceptionModule,
  NoticeIconModule,
  SidebarNavModule,
  GlobalFooterModule,
  STModule,
  SEModule,
  SVModule,
  FooterToolbarModule,
  EllipsisModule,
  FullContentModule,
  QRModule,
  TagSelectModule,
  QuickMenuModule,
  // ReuseTabModule,
];
