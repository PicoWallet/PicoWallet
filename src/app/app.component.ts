import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../store/index';
import * as Action from '../store/actions/account';
import { HomePage } from '../pages/home/home';
import { NemProvider } from '../providers/nem/nem';
import {VER} from '../config';



@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage:any = HomePage;

    constructor(
        public nem: NemProvider,
        private store: Store<any>,
    ) {
        history.replaceState('','','/');
        localStorage.setItem('VER', VER);
        this.initLoad();
    }
    initLoad(){
        this.store.dispatch(new Action.Restore());
        this.store.select(fromRoot.getAccountAddress).subscribe(ad =>{
            this.nem.connect(ad);
        });
    }
}

