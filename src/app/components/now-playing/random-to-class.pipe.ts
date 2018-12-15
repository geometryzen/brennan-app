import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'randomToClass' })
export class RandomToClassPipe implements PipeTransform {
    transform(random: boolean): string {
        if (!random) {
            return "glyphicon glyphicon-random myGrey";
        }
        else if (random) {
            return "glyphicon glyphicon-random";
        }
        else {
            return "";
        }
    }
}