import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-pay-edit',
    templateUrl: 'pay-edit.html',
})
export class PayEditPage {
    qr:any = null;

    constructor(
        public navParams: NavParams
    ) {
        this.qr = this.navParams.data.qr;
    }
}
