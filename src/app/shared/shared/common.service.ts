import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public loading = false;
  constructor(private router: Router) { }

  getFileUrl(path: string) {
    return `${environment.apiUrl}${path}`;
  }


  public logout() {
    this.router.navigate(['/login']);
    window.localStorage.clear();
    window.sessionStorage.clear();
  }
}
