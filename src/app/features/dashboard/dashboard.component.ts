// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common'; // required for *ngIf
// import { Route, Router } from '@angular/router';

// @Component({
//   selector: 'app-dashboard',
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.scss'],
//   standalone: true,
//   imports: [CommonModule],
// })
// export class DashboardComponent {
//   sidebarActive = false;
//   selected = 'dashboard';

//   constructor(private router : Router){}

//   toggleSidebar() {
//     this.sidebarActive = !this.sidebarActive;
//   }

//   select(menu: string) {
//     this.selected = menu;
//     this.sidebarActive = false;
//     console.log('mune', menu)
//     this.router.navigate(['/'+menu])
//   }
// }
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardViewComponent } from './dashboard-view/dashboard-view.component';
import { CustomerManagementComponent } from './customer-management/customer-management.component';
import { CommonService } from '../../shared/shared/common.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, DashboardViewComponent, CustomerManagementComponent],
})
export class DashboardComponent {
  sidebarActive = false;
  selected: 'dashboard' | 'customer' | 'policies' | 'commissions' = 'dashboard';

  constructor(public common: CommonService){}

  toggleSidebar() {
    this.sidebarActive = !this.sidebarActive;
  }

  select(menu: 'dashboard' | 'customer' | 'policies' | 'commissions') {
    this.selected = menu;
    this.sidebarActive = false;
  }
}
