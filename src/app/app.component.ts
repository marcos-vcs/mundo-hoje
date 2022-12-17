/* eslint-disable no-var */
import { Component } from '@angular/core';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private animationCtrl: AnimationController) {}

  customTransition = (baseEl: any, opts?: any) => {
    const anim1 = this.animationCtrl
      .create()
      .addElement(opts.leavingEl)
      .duration(300)
      .iterations(1)
      .easing('ease-out')
      .fromTo('opacity', '1', '0.0');
    var anim2 = this.animationCtrl
      .create()
      .addElement(opts.enteringEl)
      .duration(300)
      .iterations(1)
      .easing('ease-out')
      .fromTo('opacity', '0.0', '1');
    var anim2 = this.animationCtrl
      .create()
      .duration(300)
      .iterations(1)
      .addAnimation([anim1, anim2]);
    return anim2;
  };
}
