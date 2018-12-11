import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap'

import { AppComponent } from './app.component';
import { NowPlayingComponent } from './now-playing/now-playing.component';

import { SearchPanelComponent } from './search/search-panel.component';
import { SearchHardDriveComponent } from './search/search-hdd.component';
import { VTunerComponent } from './vtuner/vtuner.component';
import { YouTubeComponent } from './youtube/youtube.component';
import { USBComponent } from './usb/usb.component';
import { AlbumsPanelComponent } from './albums/albums-panel.component';
import { ArtistPanelComponent } from './artists/artist-panel.component';

import { ActionsComponent } from './actions/actions.component';
import { PlaylistPanelComponent } from './playlists/playlist-panel.component';
import { DiscComponent } from './disc/disc.component';
import { PresetsComponent } from './presets/presets.component';
import { UploadComponent } from './upload/upload.component';

@NgModule({
  declarations: [
    AppComponent,
    NowPlayingComponent,

    SearchPanelComponent,
    SearchHardDriveComponent,
    VTunerComponent,
    YouTubeComponent,
    USBComponent,
    AlbumsPanelComponent,
    ArtistPanelComponent,

    ActionsComponent,
    PlaylistPanelComponent,
    DiscComponent,
    PresetsComponent,
    UploadComponent
  ],
  imports: [
    BrowserModule,
    NgbTabsetModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
