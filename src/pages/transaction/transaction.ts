import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NemProvider } from '../../providers/nem/nem';

@IonicPage()
@Component({
    selector: 'page-transaction',
    templateUrl: 'transaction.html',
})
export class TransactionPage {
    table:any = [];
    constructor(
        public nem: NemProvider,
        public navCtrl: NavController,
        public navParams: NavParams
    ) {
        let t = this.navParams.data.t;
        this.setup(t);
    }
    async setup(t) {
        this.table = [
            {l:"HASH", d:t.meta.hash.data},
            {l:"BLOCK", d:t.meta.height},
            {l:"TIMESTAMP", d:t.transaction.timeStamp},
            {l:"SENDER", d:t.transaction.signerAddress},
        ];

        if(t.transaction.type == this.nem.TRANSFER || t.transaction.type == this.nem.MULTISIGTRANSACTION){
            this.table.push({l:"RECIPIENT", d:t.transaction.recipient});
            this.table.push({l:"AMOUNT", d:t.transaction.amount/1000000});
        }
        if(t.transaction.mosaics){
            let mosaics = t.transaction.mosaics;
            let m = "";
            for(let i=0;i<mosaics.length;i++){
                let name = mosaics[i].mosaicId["namespaceId"] + ":" + mosaics[i].mosaicId["name"];
                let q = await this.nem.calcMosaicAmount(name, mosaics[i].quantity);
                m = m + name +" +"+ q + "<br>";
            }
            this.table.push({l:"MOSAICS", d:m});
        }
        this.table.push({l:"FEE", d:t.transaction.fee/1000000});
        let msg = "";
        if(t.transaction.message){
            if(t.transaction.message["type"]==1){
                msg = this.nem.fmtHexToUtf8Pipe(t.transaction.message["payload"])
            }else if(t.transaction.message["type"]==2){
                msg = await this.nem.decodeMsg(t.transaction.message["payload"], t.transaction.signer, t.transaction.recipient);
                msg  = this.nem.fmtHexToUtf8Pipe(msg);
            }
        }
        if(t.transaction.type == this.nem.TRANSFER || t.transaction.type == this.nem.MULTISIGTRANSACTION){
            this.table.push({l:"MESSAGE", d:msg});
        }else{
            this.table.push({l:"MESSAGE", d:t.transaction.recipient});
        }
    }
}
