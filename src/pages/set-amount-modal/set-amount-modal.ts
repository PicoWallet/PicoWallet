import { Component, ViewChild } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';
import { NemProvider } from '../../providers/nem/nem';


@IonicPage()
@Component({
    selector: 'page-set-amount-modal',
    templateUrl: 'set-amount-modal.html',
})
export class SetAmountModalPage {
    @ViewChild('inputToFocus') input;
    qr:any;
    amount:number;
    show:boolean = false;
    moreFlg:boolean = false;
    constructor(
        public viewCtrl: ViewController,
        public nem: NemProvider,
        public navParams: NavParams
    ) {
        this.qr = this.navParams.data.qr;
        this.amount = this.nem.convAmountToDiv(this.qr.data.amount);
    }

    ionViewDidLoad() {
        setTimeout(()=>{
            this.input.setFocus();
        },500);
    }
    setAmount(){
        let amount = this.amount;
        if(0 <= amount&& amount<= 99999999999999999){
            let valid = String(amount);
            let split = valid.split(".");
            if(split.length >= 2){
                if(split[1].length > 6){
                    let d = split[1].substr(0, 6);
                    amount = Number(split[0] + "." + d);
                }
            }
            this.show = false;
            this.qr.data.amount = this.nem.convDivToAmount(amount);
            this.viewCtrl.dismiss(this.qr);
        }
    }
    dismiss(){
        this.viewCtrl.dismiss();
    }
    more(){
        this.moreFlg = true;
    }
}
