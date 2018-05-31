import { Pipe, PipeTransform } from '@angular/core';
import nem from "nem-sdk";

@Pipe({
    name: 'fmtHexToUtf8',
})
export class FmtHexToUtf8Pipe implements PipeTransform {
    transform(value: string) {
        return nem.utils.format.hexToUtf8(value);
    }
}
