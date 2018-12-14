import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'playingToText' })
export class PlayingToTextPipe implements PipeTransform {
    transform(playing: number): string {
        if (playing == 0) {
            return "Paused";
        }
        else if (playing == 1) {
            return "Playing";
        }
        else {
            return "";
        }
    }
}