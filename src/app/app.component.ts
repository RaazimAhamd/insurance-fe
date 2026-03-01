import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonService } from './shared/shared/common.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(protected common: CommonService){}
  title = 'insurance-crm-frontend';
}
