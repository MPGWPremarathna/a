import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {Chart} from 'chart.js';
import {Router} from '@angular/router';
import {SideBarComponent} from '../side-bar/side-bar.component';
import { forEach } from '@angular/router/src/utils/collection';
import { Options } from 'selenium-webdriver/ie';
// import { Options } from 'selenium-webdriver/ie';
import { emptyScheduled } from 'rxjs/internal/observable/empty';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],

})
export class DashboardComponent implements OnInit {

  companyId = 2;
  // varibles regard to the autofill form
  searchNameForm  = new FormControl();
  options: string[] = [];
  employeeInfo: object[]=[];
  filteredOptions: Observable<string[]>;
  nameSel: String;
  dateSel: String;

  //  varibles regard to  maps
  markers  = [];
  lati: number = 7.093543;
  long: number = 79.9915147;

  constructor(private  apiService: ApiService) { }

  ngOnInit() {
    this.getAllEmployees();
    this.filteredOptions = this.searchNameForm.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filter(value))
      );

    // this.getEmployeeLoc('953280086v'); 
  }
  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
   
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
   
   }
   

  public mapClicked(event) {
    console.log(event);
  }

  

  private getEmployeeLoc(nic){
    this.apiService.getUrl(`loc/${nic}/${this.companyId.toString()}`)
    .subscribe((locations: Array<object>) => {
      locations.forEach((loc) => {
        const time = loc['timestamp'].toString().substring(11,19);
        console.log(time);
        const marker = {
          lati: loc['latitude'],
          long: loc['logitude'],
          time: time
        };
        this.markers.push(marker);
      });
      console.log(this.markers);
    });
  }

  public onFindBtnClicked() {
    // alert(this.nameSel + this.dateSel);
    // console.log(this.nameSel);
    
    var nic: String;
    this.employeeInfo.forEach((emp) => {
      console.log(emp);
      if(this.nameSel ==  emp['name']){
        nic = emp['nic'];
       
        
      }     
    });
    this.getEmployeeLoc(nic);
    console.log(nic);
  }

  private getAllEmployees(){
    this.apiService.getUrl(`emp/${this.companyId.toString()}`)
    .subscribe((employees: Array<object>) => {
      employees.forEach((emp) => {
        
        console.log(emp);
        this.options.push(emp['firstName'] + ' ' + emp['lastName']);
        const empInfo = {
          nic: emp['NIC'],
          name: emp['firstName'] + ' ' + emp['lastName']
          
        };
        this.employeeInfo.push(empInfo);
      });
      console.log(this.employeeInfo);
    });
  }

}
