import { Component } from '@angular/core';
import { toastController } from '@ionic/core';
import { AlertService } from '../components/tools/alert.service';
import { ToastService } from '../components/tools/toast.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private toast: ToastService) {}

}
