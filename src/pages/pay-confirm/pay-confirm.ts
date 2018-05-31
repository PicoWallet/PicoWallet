import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NemProvider } from '../../providers/nem/nem';
import { UtilProvider } from '../../providers/util/util';


@IonicPage()
@Component({
    selector: 'page-pay-confirm',
    templateUrl: 'pay-confirm.html',
})
export class PayConfirmPage {
    qr:any = null;
    msg:string = "";
    fee:number = 0;
    sum:number = 0;
    mosaics:any = [];
    block:boolean = false;
    items:any;

    constructor(
        public navCtrl: NavController,
        public nem: NemProvider,
        public util: UtilProvider,
        public navParams: NavParams
    ) {
        this.qr = this.navParams.data.qr;
        if(this.qr){
            this.setup();
        }
    }
    setup(){
        let address = this.qr.data["addr"];
        let amount = this.nem.convAmountToDiv(this.qr.data["amount"]);
        this.msg = this.qr.data["msg"];
        this.mosaics = this.qr.data["mosaics"];
        this.items=[
            {l:'PAY__SEND_ADDRESS',t:address},
            {l:'PAY__AMOUNT',t:amount},
        ];
        if(this.mosaics){
            this.attachMosaic(this.mosaics);
        }else{
            this.updateFee();
        }
    }

    async attachMosaic(mosaics){
        for(let i=0;i<mosaics.length;i++){
            let m = mosaics[i];
            try{
                await this.nem.addMosaicMetaData(m.name);
                m.amount = await this.nem.calcMosaicAmount(m.name, m.amount);
            }catch(e){
                console.log(e);
            }
        }
        this.updateFee();
    }
    updateFee(){
        let entity = this.nem.prepareTransaction(this.qr.data["amount"],this.qr.data["addr"] , this.qr.data["msg"], this.mosaics);
        this.sum = this.nem.convAmountToDiv(this.qr.data["amount"] + entity.fee);
        this.fee = this.nem.convAmountToDiv(entity.fee);
    }
    async send(){
        if(this.block){
            return;
        }
        this.block = true;
        let entity = this.nem.prepareTransaction(this.qr.data["amount"],this.qr.data["addr"] , this.qr.data["msg"], this.qr.data["mosaics"]);
        try{
            let res = await this.nem.send(entity).toPromise();
            if(res["code"] == 1){
                let buttons = {
                    text: 'OK',
                    handler: data => {
                        this.navCtrl.popToRoot();
                    }
                }
                let success = await this.util.getTransalte("PAY__SUCCESS");
                this.util.basicAlert(success, "", buttons);
            }else{
                let f = await this.util.getTransalte("GENERAL__FAILED");
                this.util.basicAlert(f);
            }
        }catch(e){
            let f = await this.util.getTransalte("GENERAL__FAILED");
            this.util.basicAlert(f);
            this.block = false;
        }
    }
}
