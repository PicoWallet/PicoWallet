import { Input, Output,EventEmitter, OnInit, OnChanges,Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NemProvider } from '../../providers/nem/nem';
import { UtilProvider } from '../../providers/util/util';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../store/index';

@Component({
  selector: 'pay-edit',
  templateUrl: 'pay-edit.html'
})
export class PayEditComponent implements OnInit, OnChanges {
    @Input('qr') qr;
    @Input('mode') mode;
    @Output() conf = new EventEmitter<any>();
    address:string = "";
    TXT_CONFIRM:string = "PAY__PROCEED";
    FAILED:string = "";
    amount:number = 0;
    fee:number = 0;
    msg:string = "";
    mosaics:any = [];
    attachMosaics:any = [];
    items:any=[];

    constructor(
        public navCtrl: NavController,
        public nem: NemProvider,
        public util: UtilProvider,
        public store: Store<any>
    ) {
    }
    ngOnInit() {
        this.store.select(fromRoot.getAccountMosaic).subscribe((res)=>{
            if(res){
                this.mosaics = res;
            }
        });
        this.setup();
    }
    async setup(){
        this.FAILED = await this.util.getTransalte("GENERAL__FAILED");
    }
    ngOnChanges(changes:any) {
        if(changes["qr"]){
            this.qr = changes.qr.currentValue;
            if(this.qr){
                this.amount = this.nem.convAmountToDiv(this.qr.data["amount"]);
                this.address = this.qr.data["addr"];
                this.msg = this.qr.data["msg"];
                this.updateFee();
            }
        }
        if(changes["mode"]){
            this.mode = changes.mode.currentValue;
            if(this.mode == "collect"){
                this.TXT_CONFIRM = "PAY__REFRESH";
            }
        }
    }

    updateFee(){
        let entity = this.nem.prepareTransaction(this.nem.convDivToAmount(this.amount), this.address , this.msg, this.attachMosaics);
        this.fee = this.nem.convAmountToDiv(entity.fee);
    }
    proceed(){
        let obj = JSON.parse(JSON.stringify(this.attachMosaics));
        obj.forEach(async (m) => {
            let d = await this.nem.getMosaicDivisibility(m.name);
            if(d>0){
                let pow = Math.pow(10, d)
                m.amount= pow * m.amount;
            }
        });
        let invoice = this.nem.getSendInvoice(this.address, this.nem.convDivToAmount(this.amount), this.msg, obj);
        if(this.mode == "edit"){
            if(this.nem.validQRCode(invoice)){
                this.navCtrl.push('PayConfirmPage', {qr:invoice});
            }else{
                this.util.toast(this.FAILED);
            }
        }else{
            this.conf.emit(invoice);
        }
    }
    detachMosaic(idx){
        this.attachMosaics.splice(idx,1);
    }
    async showAttachMosaicsCheckbox(){
        if(this.mosaics){
            let inputs = [];
            for(let i=0;i<this.mosaics.length;i++){
                let mosaicId = this.nem.mosaicIdToName(this.mosaics[i].mosaicId);
                if(mosaicId!="nem:xem"){
                    let input = { type: 'checkbox', label: mosaicId, value: mosaicId};
                    for(let j=0;j<this.attachMosaics.length;j++){
                        if(this.attachMosaics[j].name==mosaicId){
                            input["checked"] = true;
                        }
                    }
                    inputs.push(input);
                }
            }
            let title = await this.util.getTransalte("PAY__ATTACH_MOSAIC_CHECKBOX");
            let okHandler = async (res) => {
                if(res.length>0){
                    let tmp = [];
                    for(let i=0;i<res.length;i++){
                        let name = res[i]
                        await this.nem.addMosaicMetaData(name);
                        let m = {name:name, amount:0};
                        for(let j=0;j<this.attachMosaics.length;j++){
                            if(this.attachMosaics[j].name==name){
                                m = this.attachMosaics[j];
                            }
                        }
                        tmp.push(m);
                    }
                    this.attachMosaics = tmp;
                }else if(res.length == 0){
                    this.attachMosaics = [];
                }
            };
            await this.util.showCheckbox(title, inputs, okHandler);
        }
    }
    async getAlias(){
        if (this.address.indexOf("@", 0) !== 0) {
            this.util.toast(this.FAILED);
            return;
        }
        try {
            let a = this.address.substr(1);
            let res = await this.nem.getAliasAddress(a);
            if(res["owner"] != ""){
                this.address = res["owner"];
                let success = await this.util.getTransalte("GENERAL__SUCCESS");
                this.util.toast(success);
            }else{
                this.util.toast(this.FAILED);
            }
        }
        catch(error) {
            this.util.toast(this.FAILED);
            console.log(error);
        }
    }
}
