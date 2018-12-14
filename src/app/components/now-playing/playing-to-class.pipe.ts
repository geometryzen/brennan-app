import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'playingToClass' })
export class PlayingToClassPipe implements PipeTransform {
    transform(playing: number): string {
        if (playing == 0) {
            return "glyphicon glyphicon-play";
        }
        else if (playing == 1) {
            return "glyphicon glyphicon-pause";
        }
        else {
            return "";
        }
    }
}