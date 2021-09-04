import { Pipe, PipeTransform } from '@angular/core';
import { CallModel } from '@core/models/call.model';

@Pipe({
  name: 'filterByField',
})
export class FilterByFieldPipe implements PipeTransform {
  transform(
    value: any[],
    filterField: string,
    filterValue: any | null
  ): CallModel[] {
    if (filterValue) {
      return value.filter(
        (el) => el[filterField] === filterValue
      ) as CallModel[];
    }
    return value;
  }
}
