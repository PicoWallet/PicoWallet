import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SetAmountModalPage } from './set-amount-modal';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        SetAmountModalPage,
    ],
    imports: [
        ComponentsModule,
        IonicPageModule.forChild(SetAmountModalPage),
        TranslateModule.forChild()
    ],
})
export class SetAmountModalPageModule {}
