import { Pipe, PipeTransform } from '@angular/core';
import nem from "nem-sdk";

@Pipe({
  name: 'fmtNemDate',
})
export class FmtNemDatePipe implements PipeTransform {
  transform(data: any) {
    return nem.utils.format.nemDate(data);
  }
}
