import { Component, OnInit } from '@angular/core';
import {SideBarComponent} from '../side-bar/side-bar.component';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';



@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
  searchNicForm = new FormControl(); // declaration of the form control
  options: string[] = ['One', 'Two', 'Three']; // options list
  filteredOptions: Observable<string[]>; // set of filtered options
  // member details
  name: String = 'Dinith';
  leaderName: String = 'Chamaka';
  teamName: String = 'team01';
  centerName: String = 'Gampaha';
  loanAmount: Number = 15000.00;
  shouldPay: Number = 12500.00;
  paid: Number = 12000.00;
  attedencePercent: Number = 95.0;
  nic: String = '953280086v';
  age: Number = 20;


  constructor() {
  }

  ngOnInit() {
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
}
