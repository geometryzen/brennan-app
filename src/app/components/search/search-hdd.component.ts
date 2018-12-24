import { Component, Output, EventEmitter } from '@angular/core';
import { Category, SearchHardDiskService } from 'src/app/services/search-hdd/search-hdd.service';

@Component({
  selector: 'brennan-search-hdd',
  templateUrl: './search-hdd.component.html',
  styleUrls: ['./search-hdd.component.scss']
})
export class SearchHardDriveComponent {

  constructor(private searchHardDriveService: SearchHardDiskService) {

  }

  // It would make more sense to simply state which is enabled?
  // But that would be harder for the UI?
  artistsEnabled: boolean = false
  albumsEnabled: boolean = false
  tracksEnabled: boolean = false
  radioEnabled: boolean = false
  videoEnabled: boolean = false
  sortEnabled: boolean = true

  category: Category = 'artists';

  onArtistToggle(): void {
    this.artistsEnabled = true
    this.albumsEnabled = false
    this.tracksEnabled = false
    this.radioEnabled = false
    this.videoEnabled = false
    this.category = 'artists'
    this.searchHardDriveService.changeCategory('artists')
  }
  onAlbumToggle(): void {
    this.artistsEnabled = false
    this.albumsEnabled = true
    this.tracksEnabled = false
    this.radioEnabled = false
    this.videoEnabled = false
    this.category = 'albums'
    this.searchHardDriveService.changeCategory('albums')
  }
  onTrackToggle(): void {
    this.artistsEnabled = false
    this.albumsEnabled = false
    this.tracksEnabled = true
    this.radioEnabled = false
    this.videoEnabled = false
    this.category = 'tracks'
    this.searchHardDriveService.changeCategory('tracks')
  }
  onRadioToggle(): void {
    this.artistsEnabled = false
    this.albumsEnabled = false
    this.tracksEnabled = false
    this.radioEnabled = true
    this.videoEnabled = false
    this.category = 'radio'
    this.searchHardDriveService.changeCategory('radio')
  }
  onVideoToggle(): void {
    this.artistsEnabled = false
    this.albumsEnabled = false
    this.tracksEnabled = false
    this.radioEnabled = false
    this.videoEnabled = true
    this.category = 'video'
    this.searchHardDriveService.changeCategory('video')
  }
  onAlphaToggle(): void {
    this.sortEnabled = !this.sortEnabled
  }
  onScopeToggle(): void {
    console.log("onScopeToggle()")
  }
}
