import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SimpleGuard } from '@delon/auth';
import { environment } from '@env/environment';
// layout
import { LayoutDefaultComponent } from '../layout/default/default.component';
import { LayoutFullScreenComponent } from '../layout/fullscreen/fullscreen.component';
import { LayoutPassportComponent } from '../layout/passport/passport.component';
// dashboard pages
import { DashboardV1Component } from './dashboard/v1/v1.component';
import { DashboardAnalysisComponent } from './dashboard/analysis/analysis.component';
import { DashboardMonitorComponent } from './dashboard/monitor/monitor.component';
import { DashboardWorkplaceComponent } from './dashboard/workplace/workplace.component';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterComponent } from './passport/register/register.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
// single pages
import { CallbackComponent } from './callback/callback.component';
import { UserLockComponent } from './passport/lock/lock.component';
import { CALoginComponent } from './passport/calogin/calogin.component';

const _routes: Routes = [
  {
    path: '',
    component: LayoutDefaultComponent,
    canActivate: [SimpleGuard],
    canActivateChild: [SimpleGuard],
    children: [
      { path: '', redirectTo: 'dashboard/v1', pathMatch: 'full' },
      { path: 'template', loadChildren: () => import('./template/template.module').then(m => m.TemplateModule) }
    ]
  },
  {
    path: 'passport',
    component: LayoutPassportComponent,
    children: []
  }
];

const routes: Routes = [
  {
    path: '',
    component: LayoutDefaultComponent,
    canActivate: [SimpleGuard],
    canActivateChild: [SimpleGuard],
    children: [
      { path: '', redirectTo: 'dashboard/v1', pathMatch: 'full' },
      { path: 'dashboard', redirectTo: 'dashboard/v1', pathMatch: 'full' },
      { path: 'dashboard/v1', component: DashboardV1Component },
      { path: 'dashboard/analysis', component: DashboardAnalysisComponent },
      { path: 'dashboard/monitor', component: DashboardMonitorComponent },
      { path: 'dashboard/workplace', component: DashboardWorkplaceComponent },
      {
        path: 'widgets',
        loadChildren: () => import('./widgets/widgets.module').then(m => m.WidgetsModule),
      },
      { path: 'style', loadChildren: () => import('./style/style.module').then(m => m.StyleModule) },
      { path: 'delon', loadChildren: () => import('./delon/delon.module').then(m => m.DelonModule) },
      { path: 'extras', loadChildren: () => import('./extras/extras.module').then(m => m.ExtrasModule) },
      { path: 'pro', loadChildren: () => import('./pro/pro.module').then(m => m.ProModule) },
      { path: 'configure', loadChildren: () => import('./../configure/configure.module').then(m => m.ConfigureModule) },
      // Exception
      { path: 'exception', loadChildren: () => import('./exception/exception.module').then(m => m.ExceptionModule) },
      { path: 'template', loadChildren: () => import('./template/template.module').then(m => m.TemplateModule) }
    ]
  },
  // ????????????
  // {
  //   path: 'data-v',
  //   component: LayoutFullScreenComponent,
  //   children: [{ path: '', loadChildren: () => import('./data-v/data-v.module').then(m => m.DataVModule) }],
  // },

  // passport
  {
    path: 'passport',
    component: LayoutPassportComponent,
    children: [
      environment.routeInfo.enableLogin === true ? {
        path: 'login',
        component: UserLoginComponent,
        data: { title: '??????', titleI18n: 'app.login.login' }
      } : { path: 'login', redirectTo: 'calogin' },
      environment.routeInfo.enableCalogin === true ? {
        path: 'calogin',
        component: CALoginComponent,
        data: { title: '??????', titleI18n: 'app.login.login' },
      } : { path: 'calogin', redirectTo: 'login' }
    ]
  },
  // ???????????????Layout
  { path: 'callback/:type', component: CallbackComponent },
  { path: '**', redirectTo: 'exception/404' }
];

function geturl(): string {
  return 'login';
}

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: environment.useHash,
      // NOTICE: If you use `reuse-tab` component and turn on keepingScroll you can set to `disabled`
      // Pls refer to https://ng-alain.com/components/reuse-tab
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class RouteRoutingModule { }
