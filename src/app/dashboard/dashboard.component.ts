import { Component, OnInit } from '@angular/core';
import {Chart} from 'chart.js';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {SideBarComponent} from '../side-bar/side-bar.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],

})
export class DashboardComponent implements OnInit {

  // maps location data
  locations = [
    {
      lati: 7.093543,
      long: 79.9915147,
    },
    {
      lati: 7.079243,
      long: 80.023646
    }
  ];
  lati: number = 7.093543;
  long: number = 79.9915147;
  constructor() { }

  ngOnInit() {
  }

  public mapClicked(event) {
    console.log(event);
  }

}
