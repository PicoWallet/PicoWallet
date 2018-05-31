import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PayConfirmPage } from './pay-confirm';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        PayConfirmPage,
    ],
    imports: [
        IonicPageModule.forChild(PayConfirmPage),
        TranslateModule.forChild()
    ],
})
export class PayConfirmPageModule {}
