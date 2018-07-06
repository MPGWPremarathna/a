import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { MembersComponent } from './members/members.component';
import { ReportsComponent } from './reports/reports.component';
import { LoansComponent } from './loans/loans.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {
  MatButtonModule ,
  MatCheckboxModule ,
  MatSidenavModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatAutocompleteModule,
  MatGridListModule,
  MatDividerModule,
  MatExpansionModule,
  MatIconModule,
  MatListModule,


} from '@angular/material';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    SideBarComponent,
    MembersComponent,
    ReportsComponent,
    LoansComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatOptionModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatGridListModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatExpansionModule,
    MatIconModule,
    MatListModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
