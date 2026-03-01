import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
// import { environment } from '../environments/environment'; // path may vary

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public login(data: any) {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  public addCustomer(data: any) {
    return this.http.post(`${this.baseUrl}/customers`, data);
  }
  public getAllCustomer() {
    return this.http.get(`${this.baseUrl}/customers`);
  }
  public getIdCustomer(id: number) {
    return this.http.get(`${this.baseUrl}/customers/${id}`);
  }
  public updateIdCustomer(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/customers/${id}`, data);
  }
  public deleteIdCustomer(id: any) {
    return this.http.delete(`${this.baseUrl}/customers/${id}`);
  }
  public downloadAll(id: any) {
    return this.http.get(`${this.baseUrl}/customers/${id}/download-all`, { responseType: 'blob',observe: 'response' });
  }
  public exportAll(details:any) {
    return this.http.post(`${this.baseUrl}/customers/export/send-email`, details)
  }


}
