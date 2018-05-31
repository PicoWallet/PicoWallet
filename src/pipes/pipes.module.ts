import { NgModule } from '@angular/core';
import { FmtNemDatePipe } from './fmt-nem-date/fmt-nem-date';
import { FmtHexToUtf8Pipe } from './fmt-hex-to-utf8/fmt-hex-to-utf8';
@NgModule({
	declarations: [FmtNemDatePipe,
    FmtHexToUtf8Pipe],
	imports: [],
	exports: [FmtNemDatePipe,
    FmtHexToUtf8Pipe ]
})
export class PipesModule {}
