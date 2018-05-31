import { Component, ViewChild } from '@angular/core';
import { NavController, Content } from 'ionic-angular';
import { NemProvider } from '../../providers/nem/nem';
import { UtilProvider } from '../../providers/util/util';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../store/index';
import * as AccountAction from '../../store/actions/account';
import {INVOICE_QR, WALLET_QR, TESTNET_V, VER, DEMO_WALLET} from '../../config';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    @ViewChild(Content) content: Content;
    created:boolean = false;
    autoLogin:boolean = false;
    version:string = "";
    password:string = "";
    lang:string="";
    WALLET_QR=WALLET_QR;
    hitems = [
        {n:"qr-scanner", l:'GENERAL__SCAN', f:()=>this.goToOtherPage('QrcodePage',{type:INVOICE_QR})},
        {n:"md-logo-yen", l:'GENERAL__COLLECT', f:()=>this.goToOtherPage('CollectPage')},
        {n:"apps", l:'GENERAL__MOSAIC', f:()=>this.goToOtherPage('MosaicPage')},
        {n:"person", l:'GENERAL__ACCOUNT', f:()=>this.goToOtherPage('AccountPage')},
    ];

    constructor(
        public store: Store<any>,
        public nem: NemProvider,
        public util: UtilProvider,
        public navCtrl: NavController
    ) {
        this.version = VER;
    }

    ionViewDidEnter(){
        this.lang = localStorage.getItem("lang");
    }
    ionViewDidLoad(){
        this.store.select(fromRoot.getAccountCreated).subscribe((res)=>{
            this.created = res;
        });
        this.store.select(fromRoot.getAccountPassword).subscribe((res)=>{
            if(res != ""){
                this.autoLogin = true;
            }
        });
    }
    goToOtherPage(name, obj:any = null){
        this.navCtrl.push(name, obj);
    }
    goToDemo(){
        let w = DEMO_WALLET;
        this.nem.createAccount(w.accounts[0].address, "picodemo", w, TESTNET_V);
        this.navCtrl.setRoot(HomePage);
    }
    chgLanguage(lang: string){
        this.util.setTransalte(lang);
    }
    async login(){
        let r = this.nem.loginCheck(this.password);
        if(r){
            this.store.dispatch(new AccountAction.SetPassword(this.password));
            this.password = "";
            this.navCtrl.setRoot(HomePage);
        }else{
            let title = await this.util.getTransalte("GENERAL__FAILED");
            let msg = await this.util.getTransalte("QR__FAILED_MSG");
            this.util.basicAlert(title, msg);
        }
    }
}
