import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { TransactionHistoryComponent } from './transaction-history/transaction-history';
import { PipesModule } from '../pipes/pipes.module';

import { TranslateModule } from '@ngx-translate/core';
import { PayEditComponent } from './pay-edit/pay-edit';

@NgModule({
	declarations: [ TransactionHistoryComponent, PayEditComponent],
	imports: [IonicModule, PipesModule, TranslateModule.forChild()],
	exports: [ TransactionHistoryComponent, PayEditComponent]
})
export class ComponentsModule {}
