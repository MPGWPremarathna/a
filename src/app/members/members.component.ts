import { Component, OnInit } from '@angular/core';
import {SideBarComponent} from '../side-bar/side-bar.component';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {map, startWith} from 'rxjs/operators';
import {ApiService} from '../api.service';
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
  teamMemId: string;


  searchNicForm = new FormControl(); // declaration of the form control
  options: string[] = []; // options list
  filteredOptions: Observable<string[]>; // set of filtered options
  // member details
  name: String = 'Dinith';
  leaderName: String = 'leader01';
  teamName: String = 'team01';
  centerName: String = 'Gampaha';
  loanAmount: Number = 0.0;
  shouldPay: Number = 12500.00;
  paid: Number = 12000.00;
  attedencePercent: Number = 95.0;
  nic: String = 'nic01';
  birtdate: String = '';
  address: String = '';
  status: String = '';
  gender: String = '';


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
  // getting the filtered list of options for give characters
  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));

  }
   public onNameEnter(nameStr: string) {
    console.log(nameStr);
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
          });
      }
    });
  }

  private getTeamData(data) {
    let teamId: string;
    this.apiService.getUrl(`tmem/${this.nic}/${this.companyId}`)
      .subscribe((result) => {
        console.log(result);
        teamId = result['teamId'];
        this.teamMemId = result['idteamMember'];
        this.getAttendence(); // attedence can be obtained only after team member id
        this.apiService.getUrl(`team/${teamId}`)
          .subscribe((teamInfo) => {
            console.log(teamInfo);
          });
      });
  }
  // getting the currentactive loan cycle
  private getAttendence() {
    let preserntCount: Number = 0;
    let absentCount: Number = 0;
    this.apiService.getUrl(`att/${this.teamMemId}/1`)
      .subscribe((count) => {
        preserntCount = Number.parseInt(count['count']);
        console.log('present:' + preserntCount);
        this.apiService.getUrl(`att/${this.teamMemId}/0`)
          .subscribe((countNew) => {
            absentCount = Number.parseInt(countNew['count']);
            console.log('absemt:' + absentCount);
            this.attedencePercent = preserntCount / (preserntCount + absentCount) * 100;
          });
    });
  }

  private getLoanData() {
    this.apiService.getUrl(`lc/${this.nic}/${this.companyId}/1`)
      .subscribe((result) => {
        console.log(result);
        this.loanAmount = result['amount'];
        this.apiService.getUrl(`pmt/sum/${result['idLoanCycle']}`)
          .subscribe((amount) => {
            console.log(amount);
            this.paid = Number.parseInt(amount['sum(payment.amount)'].toString());
            this.shouldPay = this.loanAmount - this.paid;
          });
      });
  }

  personalDetEdit() {
    alert('edit clicked');
  }
  assetsEdit() {
    alert('ass..edit');
  }
  centerEdit() {
    alert('center...edit');
  }
  loanCycleEdit() {
    alert('loan..... edit');
  }
}
