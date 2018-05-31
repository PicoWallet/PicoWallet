import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PayEditPage } from './pay-edit';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
    declarations: [
        PayEditPage,
    ],
    imports: [
        ComponentsModule,
        IonicPageModule.forChild(PayEditPage),
        TranslateModule.forChild()
    ],
})
export class PayEditPageModule {}
