import {Pipe, PipeTransform} from '@angular/core';
import * as _ from 'lodash';

@Pipe({
    name: 'search'
})

export class SearchPipe implements PipeTransform {

    transform(value: any, args?: any): any {

        // console.log(args);

        if (args) {

            // console.log(value);

            return _.filter(value, d => _.find(_.valuesIn(d), v =>
                _.toLower(v).indexOf(_.toLower(args)) !== -1));
        }

        return value;
    }
}
