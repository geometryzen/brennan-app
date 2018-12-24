import { Component, OnInit } from '@angular/core';
import { BrennanSearchItem } from 'src/app/services/brennan/brennan-search-item';
import { BrennanService } from 'src/app/services/brennan/brennan.service';
import { BrowseService } from 'src/app/services/browse/browse.service';
import { BrowseAlbum } from 'src/app/services/browse/browse-album';
import { BrowseArtist } from 'src/app/services/browse/browse-artists';
import { BrennanAlbum } from 'src/app/services/brennan/brennan-album';

const NULL_ARTIST: BrowseArtist = { id: -1, name: "None" };

@Component({
  selector: 'brennan-artist-panel',
  templateUrl: './artist-panel.component.html',
  styleUrls: ['./artist-panel.component.scss']
})
export class ArtistPanelComponent implements OnInit {

  artist: BrowseArtist = NULL_ARTIST;
  albums: BrennanAlbum[] = [];
  selectedResult: BrowseAlbum;

  constructor(private browseService: BrowseService, private brennanService: BrennanService) {
  }

  ngOnInit() {
    this.browseService.currentArtist.subscribe((artist) => {
      if (artist) {
        if (this.artist) {
          if (this.artist.id !== artist.id) {
            this.brennanService.albums(artist.id).subscribe((albums) => {
              this.albums = albums
              if (albums && albums.length > 0) {
                this.browseService.selectAlbum(albums[0])
              }
            })
            this.artist = artist;
          }
        }
        else {
          this.artist = artist
        }
      }
      else {
        this.artist = NULL_ARTIST;
      }
    })
  }

  onPlay(album: BrowseAlbum) {
    this.brennanService.playID(album.id).subscribe(() => { })
  }

  onSelect(album: BrowseAlbum) {
    this.browseService.selectAlbum(album);
  }

  onRename(album: BrowseAlbum) {
    console.log(`onRename(${album.name})`)
  }

  onOptions(album: BrowseAlbum) {
    console.log(`onOptions(${album.name})`)
  }
}
