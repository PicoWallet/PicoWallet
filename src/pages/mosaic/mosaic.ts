import { Component } from '@angular/core';
import { IonicPage  } from 'ionic-angular';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../store/index';
import { NemProvider } from '../../providers/nem/nem';

@IonicPage()
@Component({
    selector: 'page-mosaic',
    templateUrl: 'mosaic.html',
})
export class MosaicPage {
    mosaic:any = [];
    mosaic$:any;

    constructor(
        public nem: NemProvider,
        public store: Store<any>
    ) {
    }

    ionViewDidLoad() {
        this.mosaic$ = this.store.select(fromRoot.getAccountMosaic).subscribe((res)=>{
            this.setup(res);
        });
    }
    ionViewDidLeave() {
        this.mosaic$.unsubscribe();
    }
    async setup(res){
        if(res){
            this.mosaic = JSON.parse(JSON.stringify(res));
            for(let i=0;i<this.mosaic.length;i++){
                let m = this.mosaic[i];
                let name = m.mosaicId["namespaceId"] + ":" + m.mosaicId["name"];
                let q = await this.nem.calcMosaicAmount(name, m.quantity);
                this.mosaic[i].quantity = q;
                this.mosaic[i].calc = true;
            }
        }
    }

}
