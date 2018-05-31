import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactionPage } from './transaction';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        TransactionPage,
    ],
    imports: [
        IonicPageModule.forChild(TransactionPage),
        TranslateModule.forChild()
    ],
})
export class TransactionPageModule {}
