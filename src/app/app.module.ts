import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import {HttpClientModule, HttpClient} from '@angular/common/http';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StoreModule } from '@ngrx/store';
import { reducers } from '../store/index';
import { NemProvider } from '../providers/nem/nem';
import { PipesModule } from '../pipes/pipes.module';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { QrcodePageModule } from '../pages/qrcode/qrcode.module';
import { SetAmountModalPageModule } from '../pages/set-amount-modal/set-amount-modal.module';
import { PayConfirmPageModule } from '../pages/pay-confirm/pay-confirm.module';
import { CollectPageModule} from '../pages/collect/collect.module';
import { AccountPageModule} from '../pages/account/account.module';
import { MosaicPageModule} from '../pages/mosaic/mosaic.module';
import { PayEditPageModule} from '../pages/pay-edit/pay-edit.module';
import { ComponentsModule } from '../components/components.module';

import { QRCodeModule } from 'angularx-qrcode';
import { UtilProvider } from '../providers/util/util';

import {TranslateService, TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
    console.log("get start");
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        MyApp,
        HomePage
    ],
    imports: [
        BrowserModule,
        QrcodePageModule,
        SetAmountModalPageModule,
        PayConfirmPageModule,
        CollectPageModule,
        AccountPageModule,
        MosaicPageModule,
        PayEditPageModule,
        QRCodeModule,
        ComponentsModule,
        PipesModule,
        HttpClientModule,
        StoreModule.forRoot(reducers),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        IonicModule.forRoot(MyApp, {
            mode: 'md',
            autocomplete: 'on',
            preloadModules: true
        })
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage
    ],
    providers: [
        NemProvider,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        UtilProvider
    ]
})
export class AppModule {
    constructor(
        public translate: TranslateService,
    ) {
        let lang = localStorage.getItem("lang");
        if(!lang){
            lang = "ja";
            localStorage.setItem("lang", lang);
        }
        this.translate.addLangs(["en", "ja"]);
        this.translate.setDefaultLang(lang);
        this.translate.use(lang);
        console.log("translate start");
    }
}
