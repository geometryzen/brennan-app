import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NowPlayingComponent } from './now-playing/now-playing.component';

import { SearchComponent } from './search/search.component';
import { VTunerComponent } from './vtuner/vtuner.component';
import { YouTubeComponent } from './youtube/youtube.component';
import { USBComponent } from './usb/usb.component';
import { AlbumsPanelComponent } from './albums/albums-panel.component';
import { ArtistPanelComponent } from './artists/artist-panel.component';

import { PlaylistPanelComponent } from './playlists/playlist-panel.component';
import { DiscComponent } from './disc/disc.component';
import { PresetsComponent } from './presets/presets.component';
import { UploadComponent } from './upload/upload.component';

@NgModule({
  declarations: [
    AppComponent,
    NowPlayingComponent,
    SearchComponent,
    VTunerComponent,
    YouTubeComponent,
    USBComponent,
    AlbumsPanelComponent,
    ArtistPanelComponent,
    PlaylistPanelComponent,
    DiscComponent,
    PresetsComponent,
    UploadComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
