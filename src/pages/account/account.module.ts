import { NgModule } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { IonicPageModule } from 'ionic-angular';
import { AccountPage } from './account';
import { TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AccountPage,
    ],
    imports: [
        IonicPageModule.forChild(AccountPage),
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        })
    ],
})
export class AccountPageModule {
}
