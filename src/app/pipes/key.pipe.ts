import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'key'
})
export class KeyPipe implements PipeTransform {

    transform(items: any[], key: string): any {
        if (items != null) {
            return items.filter(item => {
                return item.key === key;
            });
        } else {
            return null;
        }
    }
}
