import { Component } from '@angular/core';
import { Router, RouterOutlet } from "@angular/router";
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {

constructor(private router: Router) {}

getFileUrl(path: string) {
  return `${environment.apiUrl}${path}`;
}

logout() {
  sessionStorage.removeItem('token');
  this.router.navigate(['/login']);
}

}
