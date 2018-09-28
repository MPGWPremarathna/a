import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {Chart} from 'chart.js';
import * as moment from 'moment';



// import {Router} from '@angular/router';
// import {SideBarComponent} from '../side-bar/side-bar.component';


// import { Options } from 'selenium-webdriver/ie';




@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [
  ]

})
export class DashboardComponent implements OnInit {

  companyId = 2;

  // varibles regard to the autofill form
  searchNameForm = new FormControl();
  options: string[] = [];
  employeeInfo: object[] = [];
  filteredOptions: Observable<string[]>;
  nameSel: String;
  dateSel: object;
  // date = new FormControl(moment().format('L'));

  //  varibles regard to  maps
  markers = [];
  lati: Number = 7.093543;
  long: Number = 79.9915147;

  // variables related to creating of emp collection chart
  begofWeek: String;
  LineChart = [];
  endofWeek: String;
  payments: string[] = [];
  days: string[] = [];

  // varibles related to emplyeee centerwise collection chart in a month
  centerAmounts: string[] = [];
  centerNames: string[] = [];
  CenterChart = [];

  // varibles related to loans granted chart
  grantedAmounts: string[] = [];
  weeklist: string[] = [];

  constructor(private  apiService: ApiService) {
  }

  ngOnInit() {
    this.getAllEmployees();
    this.filteredOptions = this.searchNameForm.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filter(value))
      );
    this.getWeeklyLoansGrantedInfo();

    // this.getEmployeeLoc('953280086v');
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));

  }


  public mapClicked(event) {
    console.log(event);
  }


  private getEmployeeLoc(nic) {
    const momentDate = moment(this.dateSel).format('YYYY-MM-DD'); // the input date is given as this.dateSel
    console.log(momentDate);
    // var date = this.dateSel.
    this.apiService.getUrl(`loc/${nic}/${momentDate}`)
      .subscribe((locations: Array<object>) => {
        locations.forEach((loc) => {
          const time = loc['timestamp'].toString().substring(11, 19);
          // console.log(time);
          const marker = {
            lati: loc['latitude'],
            long: loc['logitude'],
            time: time
          };
          this.markers.push(marker);
        });
        // console.log(this.markers);
      });
  }

  public onFindBtnClicked() {
    // alert(this.nameSel + this.dateSel);
    // console.log(this.nameSel);

    let nic: String;
    this.employeeInfo.forEach((emp) => {
      console.log(emp);
      if (this.nameSel === emp['name']) {
        nic = emp['nic'];
        this.getEmployeeLoc(nic);
        this.getEmployeeChartData(nic);
        this.getCenterwiseCollectionData(nic);
      }
    });

    // console.log(nic);
  }

  private getAllEmployees() {
    this.apiService.getUrl(`emp/${this.companyId.toString()}`)
      .subscribe((employees: Array<object>) => {
        employees.forEach((emp) => {

          // console.log();

          this.options.push(emp['firstName'] + ' ' + emp['lastName']);
          const empInfo = {
            nic: emp['NIC'],
            name: emp['firstName'] + ' ' + emp['lastName']

          };
          this.employeeInfo.push(empInfo);
        });
        // console.log(this.employeeInfo);
      });
  }


// chart cretion functions
  private  getCenterwiseCollectionData(nic) {
    const month = moment(this.dateSel).format('YYYY-MM');
    // console.log(month);
    this.apiService.getUrl(`cen`)
      .subscribe((centers: Array<object>) => {
          let i = 0;
         centers.forEach((cen) => {
           // console.log(cen);

           this.apiService.getUrl(`pmt/${cen['idcenter']}/${nic}/${month}`)
             .subscribe((pmtDet) => {
               console.log(pmtDet);
               i++;
               if (pmtDet['total']) {
                 this.centerAmounts.push(pmtDet['total'].toString());
                 this.centerNames.push(pmtDet['centerName'].toString());
               }
               // console.log(this.centerTotal);
               // console.log(this.centerNames);
               if (i === centers.length) {
                 this.createCenterwiseCollectionChart();
                 // this.createCenterwiseCollectionChart();
                 console.log(this.centerAmounts);
                 console.log(this.centerNames);
               }
             });

           // console.log(centers.length);


         });
         });


  }

  private getWeeklyLoansGrantedInfo() {
    const todaysDate = moment();
    const firstDay = todaysDate.startOf('week').format('YYYY-MM-DD'); // get the first day of the week
    const lastDay = todaysDate.endOf('week').format('YYYY-MM-DD'); // the last day of the week
    // console.log(firstDay);
    // console.log(lastDay);
    let dtStart = firstDay;
    let dtEnd = lastDay;
    let j = 8; // j is used to check whther all the asynchrounous calls were recived
    for (let i = 8 ; i > 0; i--) {
      console.log(dtStart + ' ' + dtEnd);
      this.apiService.getUrl(`loan/${dtStart}/${dtEnd}`)
        .subscribe((amtGranted) => {
          console.log(amtGranted);
          j--;
          this.grantedAmounts.push(amtGranted['total']);
          if ( j === 1 ) {
            this.createWeeklyLoansGrantedChart();
            console.log(this.grantedAmounts);
            console.log(this.weeklist);
          }
        });
      this.weeklist.push(`${dtStart.substring(5, 10)} - ${dtEnd.substring(5, 10)}`);
      dtStart = moment(dtStart).subtract(1, 'week').format('YYYY-MM-DD'); // substract 7 days from the current date
      // console.log(dtStart);
      dtEnd = moment(dtEnd).subtract(1, 'week').format('YYYY-MM-DD');
      // console.log(dtEnd);


    }

  }

  private getEmployeeChartData(nic) {
    this.endofWeek = moment(this.dateSel).endOf('week').format('YYYY-MM-DD');
    this.begofWeek = moment(this.dateSel).startOf('week');
    let day = this.begofWeek;
    for (let i = 0; i < 7; i++) {
      this.apiService.getUrl(`pmt/${nic}/${day}`)
        .subscribe((payment) => {
          console.log(payment['pmnt']);

          if (payment['pmnt']) {
            this.payments.push(payment['pmnt'].toString());
          } else {
            this.payments.push('0.00');
          }
          if (i === 6) {
            this.createCollectionChart();
          }

        });
      this.days.push(day.toString());
      day = moment(day).add(1, 'day').format('YYYY-MM-DD');
      // console.log(day);
    }


    // console.log(this.endofWeek);
    // console.log(this.begofWeek);
  }

  private createCollectionChart() {
    // creating the new chart
    this.LineChart = new Chart('LineChartCollections',
      {
        type: 'bar',
        data: {
          labels: this.days,
          datasets: [{
            label: 'Amount collected',
            data: this.payments,
            fill: false,
            lineTension: 0.2,
            borderColor: 'black',
            borderWidth: 1,
            backgroundColor: [
              '#ff6384',
              '#36a2eb',
              '#cc65fe',
              '#ffce56',
              '#5aff21',
              '#4155ff',
              '#ff34d9',

            ]
          }],
        },
        options: {
          title: {
            text: 'Collections amount by each day',
            display: true
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
              }
            }],
            xAxes: [{
              type: 'time',
              time: {
                unit: 'day',
                // min: this.begofWeek,
                // max: this.endofWeek,
              }
            }]
          }
        },

      });
  }

  private createCenterwiseCollectionChart() {
    this.CenterChart = new Chart('CenterwiseCollectionsChart',
      {
        type: 'pie',
        data: {
          labels: this.centerNames,
          datasets: [{
            label: 'amount paid',
            data: this.centerAmounts,
            fill: false,
            lineTension: 0.2,
            borderColor: 'black',
            borderWidth: 1,
            backgroundColor: [
              '#ff6384',
              '#36a2eb',
              '#cc65fe',
              '#ffce56'
              ]
          }],
        },
        options: {
          title: {
            text: 'Current month collection centerwise Destribution',
            display: true
          },
          responsive: true,
        },

      });
  }

  private createWeeklyLoansGrantedChart() {
    this.LineChart = new Chart('WeeklyLoanGrantedChart',
      {
        type: 'bar',
        data: {
          labels: this.weeklist,
          datasets: [{
            label: 'amount paid',
            data: this.grantedAmounts,
            fill: false,
            lineTension: 0.2,
            borderColor: 'black',
            borderWidth: 1,
            backgroundColor: [
              '#ff6384',
              '#36a2eb',
              '#cc65fe',
              '#ffce56',
              '#5aff21',
              '#4155ff',
              '#ff34d9',

            ]
          }],
        },
        options: {
          title: {
            text: 'Loan Granted Amount Timewise Analysis',
            display: true
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
              }
            }],
            xAxes: [{
              // type: 'time',
              // time: {
              //   unit: 'day',
              //   // min: this.begofWeek,
              //   // max: this.endofWeek,
              // }
            }]
          }
        },

      });
  }
}
