import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {LoginComponent} from './login/login.component';
import {MembersComponent} from './members/members.component';
import {ReportsComponent} from './reports/reports.component';
import {LoansComponent} from './loans/loans.component';
// import {BottomSheetOverviewExampleSheet} from './members/members.component';


const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component : DashboardComponent
  },
  {
    path: 'members',
    component: MembersComponent
  },
  {
    path: 'reports',
    component: ReportsComponent
  },
  {
    path: 'loans',
    component: LoansComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
