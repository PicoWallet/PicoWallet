import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QrcodePage } from './qrcode';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        QrcodePage,
    ],
    imports: [
        IonicPageModule.forChild(QrcodePage),
        TranslateModule.forChild()
    ],
})
export class QrcodePageModule {}
