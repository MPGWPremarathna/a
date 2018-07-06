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
