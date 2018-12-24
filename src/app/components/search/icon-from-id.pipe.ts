import { Pipe, PipeTransform } from '@angular/core';
import { isArtist, isAlbum, isTrack, isRadio, isVideo } from 'src/app/services/brennan/brennan.service';

@Pipe({ name: 'iconFromId' })
export class IconFromIdPipe implements PipeTransform {
    transform(id: number): string {
        if (isArtist(id)) {
            return "glyphicon-user";
        }
        else if (isAlbum(id)) {
            return "glyphicon-cd";
        }
        else if (isTrack(id)) {
            return "glyphicon-music";
        }
        else if (isRadio(id)) {
            return "icon-radioMast";
        }
        else if (isVideo(id)) {
            return "glyphicon-facetime-video";
        }
        else {
            return "";
        }
    }
}