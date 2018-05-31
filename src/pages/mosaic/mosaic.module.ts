import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MosaicPage } from './mosaic';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        MosaicPage,
    ],
    imports: [
        IonicPageModule.forChild(MosaicPage),
        TranslateModule.forChild()
    ],
})
export class MosaicPageModule {}
