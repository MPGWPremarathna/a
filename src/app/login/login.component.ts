import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ApiService} from '../api.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userName: String = '';
  password: String = '';
  // res: String = 'test';

  constructor(private router: Router, private apiservice: ApiService) {
  } // in the constructor following declaratin should be made

  ngOnInit() {
  }

  onClick() {
    const para = {
      'un': `${this.userName}`,
      'pw': `${this.password}`
    };
    // const jsonObj = JSON.stringify(para);
    this.apiservice.postUrl('login/validate', para)
      .subscribe((data: Array<object>) => {
        console.log(data['result']);
        const status = data['result'];
        if (!status.localeCompare('valid')) {
          alert('login succesful');
          this.router.navigate(['dashboard']);
        } else {
          alert('incorrect Username or password ');
        }
        // console.log(JSON.parse(data));
      });
  }
}
