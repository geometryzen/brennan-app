import { Component } from '@angular/core';
import { BrowseAlbum } from 'src/app/services/browse/browse-album';
import { BrennanTrack } from 'src/app/services/brennan/brennan-track';
import { BrowseService } from 'src/app/services/browse/browse.service';
import { BrennanService } from 'src/app/services/brennan/brennan.service';

const NULL_ALBUM: BrowseAlbum = { id: -1, name: "None" };

@Component({
  selector: 'brennan-albums-panel',
  templateUrl: './albums-panel.component.html',
  styleUrls: ['./albums-panel.component.scss']
})
export class AlbumsPanelComponent {

  album: BrowseAlbum = NULL_ALBUM;
  tracks: BrennanTrack[] = [];
  selectedTrack: BrowseAlbum;

  constructor(private browseService: BrowseService, private brennanService: BrennanService) {
  }

  ngOnInit() {
    this.browseService.currentAlbum.subscribe((album) => {
      if (album) {
        if (this.album) {
          if (this.album.id !== album.id) {
            this.brennanService.tracks(album.id).subscribe((tracks) => {
              this.tracks = tracks
            })
            this.album = album;
          }
        }
        else {
          this.album = album
        }
      }
      else {
        this.album = NULL_ALBUM;
      }
    })
  }

  onPlay(track: BrennanTrack) {
    this.brennanService.playID(track.id).subscribe(() => { })
  }

  onSelect(track: BrennanTrack) {
    this.browseService.selectTrack(track);
  }

  onRename(track: BrennanTrack) {
    console.log(`onRename(${track.name})`)
  }

  onOptions(track: BrennanTrack) {
    console.log(`onOptions(${track.name})`)
  }

}
