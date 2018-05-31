import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { NemProvider } from '../../providers/nem/nem';
import { UtilProvider } from '../../providers/util/util';

import {TESTNET_V, MAINNET_V} from '../../config';
import {MAINNET_NODE_LIST, TESTNET_NODE_LIST, NODE} from '../../nodelist';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../store/index';
import * as Action from '../../store/actions/account';
import { HomePage } from '../home/home';

import {TranslateService} from '@ngx-translate/core';

@IonicPage()
@Component({
    selector: 'page-account',
    templateUrl: 'account.html',
})
export class AccountPage {
    amount:number=0;
    address:string="";
    v:number=0;
    node:NODE;
    host:string="";
    lang:string="";
    nodelist:NODE[];
    connecting:boolean = false;
    save_password:boolean = false;
    mosaic:any = [];

    constructor(
        public alertCtrl: AlertController,
        public navCtrl: NavController,
        public navParams: NavParams,
        public nem: NemProvider,
        public util: UtilProvider,
        public translate: TranslateService,
        private store: Store<any>
    ) {
    }
    ionViewDidLoad() {
        this.lang = localStorage.getItem("lang");
        this.store.select(fromRoot.getAccountAmount).subscribe((res)=>{
            this.amount = this.nem.convAmountToDiv(res);
        });
        this.store.select(fromRoot.getAccountAddress).subscribe((res)=>{
            this.address = res;
        });
        this.store.select(fromRoot.getAccountMosaic).subscribe((res)=>{
            if(res){
                this.mosaic = res;
            }
        });
        this.store.select(fromRoot.getAccountNetwork).subscribe((res)=>{
            this.v = res;
            if(this.v == TESTNET_V){
                this.nodelist = TESTNET_NODE_LIST;
            }else if(this.v == MAINNET_V){
                this.nodelist = MAINNET_NODE_LIST;
            }
        });
        this.store.select(fromRoot.getAccountNode).subscribe((res)=>{
            if(res){
                this.node = res;
                this.host = this.node.host;
            }
        });
        this.store.select(fromRoot.getAccountWSConnecting).subscribe((res)=>{
            this.connecting = res;
        });
        this.store.select(fromRoot.getAccountSavePassword).subscribe((res)=>{
            this.save_password = res;
        });
    }
    copyAddress(){
        this.util.copy(this.address);
    }
    goToMosaicPage(){
        this.navCtrl.push('MosaicPage');
    }
    chgNode(host: string){
        let n = this.nodelist.find(n => n.host === host);
        this.store.dispatch(new Action.SetNode(n));
        this.nem.reconnector(this.address);
    }
    chgLanguage(lang: string){
        this.util.setTransalte(lang);
    }
    async deleteAccount(){
        let title = await this.util.getTransalte("ACCOUNT__DELETE_ACCOUNT");
        let msg = await this.util.getTransalte("ACCOUNT__DELETE_CONFIRM_MSG");
        let okHandler = (data) => {
            this.nem.disconnect();
            this.store.dispatch(new Action.Delete());
            this.navCtrl.setRoot(HomePage);
        };
        this.util.promptAlert(title, msg, [], okHandler);
    }

    async updateSavePassword(){
        if(this.save_password){
            let title = await this.util.getTransalte("ACCOUNT__CAREFUL");
            let msg = await this.util.getTransalte("ACCOUNT__AUTOLOGIN_DESCIPTION");
            let ok_text = await this.util.getTransalte("GENERAL__OK");
            let cancel_text = await this.util.getTransalte("GENERAL__CANCEL");
            let ok= {
                    text: ok_text,
                    handler: (data) => {
                        this.store.dispatch(new Action.SetSavePassword(this.save_password));
                    }
            };
            let cancel= {
                text: cancel_text,
                handler: () => {
                    this.save_password = false;
                }
            };
            this.util.confirmAlert(title, msg, ok, cancel);
        }else{
            this.store.dispatch(new Action.SetSavePassword(this.save_password));
        }
    }
}
