import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  API_URL = "http://localhost:3000";
  constructor(private httpClient : HttpClient) {

   }
   getUrl(path){
    return this.httpClient.get(`${this.API_URL}/api/${path}`);
  }

  postUrl(path,data){
    return this.httpClient.post(`${this.API_URL}/api/${path}`,data);
  }
 
}
