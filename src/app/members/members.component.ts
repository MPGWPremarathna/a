import { Component, OnInit  } from '@angular/core';
import {SideBarComponent} from '../side-bar/side-bar.component';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {map, startWith} from 'rxjs/operators';
import {ApiService} from '../api.service';
import {Chart} from 'chart.js';
// import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
// import {forEach} from '@angular/router/src/utils/collection';
// import {faEdit} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
  companyId: Number  = 2;
  // let info = {
  //   'nic': String,
  //   'name': String,
  // };
  memInfo: object[] = [];
  loanCycleInfo: object[] = [];
  teamMemId: string;


  searchNicForm = new FormControl(); // declaration of the form control
  options: string[] = []; // options list
  filteredOptions: Observable<string[]>; // set of filtered options
  // member details
  name: String = 'Dinith';
  leaderName: String = 'leader01';
  teamName: String = 'team01';
  centerName: String = 'Gampaha';
  loanAmount: number = 0.0;
  shouldPay: number = 0.00;
  paid: number = 0.00;
  attedencePercent: Number = 95.0;
  nic: String = 'nic01';
  birtdate: String = '';
  address: String = '';
  status: String = '';
  gender: String = '';

  // chart details and the fields
  LineChart = [];
  paymentDates: string[] = [];
  cumAmountArr: number[] = [];
  grantedDate: string;
  dueDate: string;

  fixedAssetCollection: Object[] = []; // member fixed assets detials
  center = {
    'name' : '',
    'address': '',
    'status': ''
  }; // center details


  constructor(private  router: Router, private  apiService: ApiService) {
  }

  ngOnInit() {
    this.apiService.getUrl('cus/' + this.companyId.toString())
      .subscribe( (data: Array<object>) => {
        data.forEach((item) => {
          console.log(item);
          this.options.push(item['firstName'] + ' ' + item['lastName']);
          const info = {
            'nic': item['NIC'],
            'name': item['firstName'] + ' ' + item['lastName']
          };
          this.memInfo.push(info);
        });
      });
    // adding to the fltered list
    this.filteredOptions = this.searchNicForm.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filter(value))
      );
  }
  // creating the line chart
  private createLineChart() {
    // creating the new chart
    this.LineChart = new Chart('LineChart',
      {
        type: 'line',
        data: {
          labels: this.paymentDates,
          datasets: [{
            label: 'amount paid',
            data: this.cumAmountArr,
            fill: false,
            lineTension: 0.2,
            borderColor: 'red',
            borderWidth: 1,
          }],
        },
        options: {
          title: {
            text: 'Cumulative loan paymnet',
            display: true
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                max: this.loanAmount,
              }
            }],
            xAxes: [{
              type: 'time',
              time: {
                unit: 'month',
                min: this.grantedDate,
                max: this.dueDate,
              }
            }]
          }
        },

      });
  }
  // getting the filtered list of options for give characters
  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));

  }
   public onNameEnter(nameStr: string) {
    console.log(nameStr);
    this.loanCycleInfo.length = 0 ; // clearing the loan cycle array
    this.memInfo.forEach((item) => {
      if (item['name'] === nameStr) {
        // console.log(item['nic']);
        this.apiService.getUrl(`cus/${item['nic']}/${this.companyId.toString()}` )
          .subscribe((data) => {
            // console.log(data);
            this.name = data['firstName'] + ' ' + data['lastName'];
            this.nic = data['NIC'];
            const temp = data['birthdate'];
            this.birtdate = temp.substring(0, 10);
            this.address = data['adress'];
            if (data['status'] === 's') {
              this.status = 'single';
            }
            if (data['status'] === 'm') {
              this.status = 'married';
            }
            // getting the team related data
            this.getTeamData(data);
            this.getLoanData();
            this.getCustomerAsset();
            this.getLoanCycleInfo();
          });
      }
    });
  }
  private getCustomerAsset() {
    this.apiService.getUrl(`cusAs/${this.nic}/${this.companyId}`)
      .subscribe((customerAss: Array<object>) => {
          customerAss.forEach((asset) => {
            const fixedAsset = {
              'name' : asset['name'],
              'value': asset['value'],
              'lifeTime': asset['lifeTime'],
              'description': asset['description']
            };
            this.fixedAssetCollection.push(fixedAsset);
          });
          console.log(this.fixedAssetCollection);
      });
  }

  private getTeamData(data) {
    let teamId: string;
    this.apiService.getUrl(`tmem/${this.nic}/${this.companyId}`)
      .subscribe((result) => {
        // console.log(result);
        teamId = result['teamId'];
        this.teamMemId = result['idteamMember'];
        this.getAttendence(); // attedence can be obtained only after team member id
        this.getCenterData(teamId);
        this.apiService.getUrl(`team/${teamId}`)
          .subscribe((teamInfo) => {
            console.log(teamInfo);
          });
      });
  }
  // getting the center data
  private getCenterData(teamId: string) {
    this.apiService.getUrl(`cen/team/${teamId}`)
      .subscribe((info) => {
      let status: string;
      if (info['status'] === 1) {
        status = 'active';
      } else {
        status = 'inactive';
      }
        this.center = {
          'name' : info['centerName'],
          'address': info['centerAdress'],
          'status': status
        };
      });
  }
  // getting the currentactive loan cycle
  private getAttendence() {
    let preserntCount: number = 0;
    let absentCount: number = 0;
    this.apiService.getUrl(`att/${this.teamMemId}/1`)
      .subscribe((count) => {
        preserntCount = Number.parseInt(count['count']);
        // console.log('present:' + preserntCount);
        this.apiService.getUrl(`att/${this.teamMemId}/0`)
          .subscribe((countNew) => {
            absentCount = Number.parseInt(countNew['count']);
            // console.log('absemt:' + absentCount);
            this.attedencePercent = preserntCount / (preserntCount + absentCount) * 100;
          });
    });
  }

  private getLoanData() {
    this.apiService.getUrl(`lc/${this.nic}/${this.companyId}/1`)
      .subscribe((result) => {
        // console.log(result);
        this.loanAmount = result['amount'];
        this.grantedDate = result['grantedDate'].substring(0, 10);
        this.dueDate = result['dueDate'].substring(0 , 10);

        // getting the sum of the payments
        this.apiService.getUrl(`pmt/sum/${result['idLoanCycle']}`)
          .subscribe((amount) => {
            // console.log(amount);
            this.paid = Number.parseInt(amount['sum(payment.amount)'].toString());
            // this.paid = amount['amount'];
            this.shouldPay = this.loanAmount - this.paid;
          });

            // getting the individual payments amounts for the chart
        this.apiService.getUrl(`pmt/lcid/${result['idLoanCycle']}`)
          .subscribe( (pmnts: Array<object>) => {
            let cumAmount: number = 0;
            pmnts.forEach((pmt) => {
              // console.log(pmt);
                const pmtDate = pmt['dateNtime'].toString().substring(0 , 10);
               cumAmount = cumAmount + pmt['amount'];
              // cumAmount = cumAmount + 200;
              this.paymentDates.push(pmtDate);
              this.cumAmountArr.push(cumAmount);
              // console.log(this.paymentDates);
              // console.log(this.cumAmountArr);
              this.createLineChart();
            });
          });
      });

  }

  private  getLoanCycleInfo() {
    this.apiService.getUrl(`lc/cus/all/${this.nic}/${this.companyId}`)
      .subscribe((loanCycle: Array <object>) => {
      loanCycle.forEach((lc) => {
        let status: string;
        const intRateId = lc['intRateId'];
        if (lc['ststus'] === 1) {
          status = ' active';
        } else {
          status = 'inactive';
        }
        this.apiService.getUrl(`int/${intRateId}`)
          .subscribe((intInfo) => {
            const info = {
              'ref' : lc['loanCycRef'],
              'amount' : lc['amount'],
              'grantedDate' : lc['grantedDate'].substring(0 , 10),
              'dueDate' : lc['dueDate'].substring(0 , 10),
              'status': status,
              'intRate': `${intInfo['amount']}%`,
              'comp': intInfo['compundingPeriod']
            };
            this.loanCycleInfo.push(info);
          });
        // console.log(this.loanCycleInfo);
      });
    });
  }

  public personalDetEdit() {
    alert('edit clicked');
  }
  public assetsEdit() {
    alert('ass..edit');
  }
  public centerEdit() {
    alert('center...edit');
  }
  public loanCycleEdit() {
    alert('loan..... edit');
  }

  openAddLoan() {
    alert('add loan clicked');
    // const addCusForm = this.dialog.open(AddCustomerDialog, {
    //   width: '250px',
    //   data: {'comId': this.companyId}
    // });
  }
}

// crating the add loan form  dialog
// export class AddCustomerDialog {
//   constructor(
//     public dialogRef: MatDialogRef<AddCustomerDialog>,
//     @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
//
// }
