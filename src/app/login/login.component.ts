import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userName: String = '';
  password: String = '';
  res: String = 'test';
  constructor(private router: Router ) { } // in the constructor following declaratin should be made

  ngOnInit() {
  }

  onClick() {
    console.log(this.userName + "  " + this.password);
    if (this.password.match('12') && this.userName.match('dj')) {
      alert('login succesful');
      this.router.navigate(['dashboard']);
    } else {
      alert('incorrect Username or password ');
    }
  }

}
