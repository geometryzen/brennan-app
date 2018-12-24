import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'toggleEnabled' })
export class ToggleEnabledPipe implements PipeTransform {
    transform(enabled: boolean): string {
        if (enabled === true) {
            return "brennan-toggle-on";
        }
        else if (enabled === false) {
            return "brennan-toggle-off";
        }
        else {
            return "brennan-toggle-undefined";
        }
    }
}