import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CollectPage } from './collect';
import { QRCodeModule } from 'angularx-qrcode';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        CollectPage,
    ],
    imports: [
        QRCodeModule,
        ComponentsModule,
        IonicPageModule.forChild(CollectPage),
        TranslateModule.forChild()
    ],
})
export class CollectPageModule {}
