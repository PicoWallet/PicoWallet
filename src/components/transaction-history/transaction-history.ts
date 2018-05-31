import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../store/index';
import { NemProvider } from '../../providers/nem/nem';

@Component({
    selector: 'transaction-history',
    templateUrl: 'transaction-history.html'
})
export class TransactionHistoryComponent {
    unconfirms:any = [];
    confirms:any = [];
        
    constructor(public navCtrl: NavController,public nem: NemProvider, private store: Store<any>) {
        this.store.select(fromRoot.getAccountTransactions).subscribe((res)=>{
            if(res){
                this.confirms = res;
            }
        });
        this.store.select(fromRoot.getAccountUnconfirmsObj).subscribe((res)=>{
            if(res){
                this.unconfirms = res;
            }
        });
    }
    doInfinite(infiniteScroll){
        this.nem.addTransactions(this.confirms[this.confirms.length-1].meta.id);
        setTimeout(() => {
            infiniteScroll.complete();
        }, 50);
    }
    detail(t){
        this.navCtrl.push('TransactionPage', {t});
    }
}
