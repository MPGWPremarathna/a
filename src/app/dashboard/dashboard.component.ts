import { Component, OnInit } from '@angular/core';
import {Chart} from 'chart';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  chart = []; // declare chart as array
  weeks = ['week1' , 'week2' , 'week3'];
  earnings_cum = [1000, 2000 , 3000];
  constructor() { }

  ngOnInit() {
    this.chart = new chart ('canvas', {
      type: 'line',
      data: {
        labels: this.weeks,
        datasets: [
          {
            data: this.earnings_cum,
            bordercolor: '#3cba9f',
            fill: false
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes:[{
            display: true
          }]
        }
      }
    });
  }



}
