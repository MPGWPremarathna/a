import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
@Component({
  selector: 'app-side-bar', // should have this value
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  constructor(private  router: Router) { }

  ngOnInit() {
  }
  dashClicked() {
    this.router.navigate(['dashboard']);
  }
  memberClicked() {
    this.router.navigate(['members']);
  }
  reportsClicked() {
    this.router.navigate(['reports']);
  }
  loansClicked() {
    this.router.navigate(['loans']);
  }

}
