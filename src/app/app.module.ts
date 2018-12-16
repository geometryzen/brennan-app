import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './components/app/app.component';

import { NowPlayingComponent } from './components/now-playing/now-playing.component';
import { PlayingToClassPipe } from './components/now-playing/playing-to-class.pipe';
import { PlayingToTextPipe } from './components/now-playing/playing-to-text.pipe';
import { RandomToClassPipe } from './components/now-playing/random-to-class.pipe';

import { SearchPanelComponent } from './components/search/search-panel.component';
import { SearchResultsComponent } from './components/search/results.component';
import { SearchHardDriveComponent } from './components/search/search-hdd.component';
import { VTunerComponent } from './components/vtuner/vtuner.component';
import { YouTubeComponent } from './components/youtube/youtube.component';
import { USBComponent } from './components/usb/usb.component';
import { AlbumsPanelComponent } from './components/albums/albums-panel.component';
import { ArtistPanelComponent } from './components/artists/artist-panel.component';

import { ActionsComponent } from './components/actions/actions.component';
import { PlaylistPanelComponent } from './components/playlists/playlist-panel.component';
import { DiscComponent } from './components/disc/disc.component';
import { PresetsComponent } from './components/presets/presets.component';
import { UploadComponent } from './components/upload/upload.component';

import { SmoothieDirective } from './components/smoothie/smoothie.directive'

@NgModule({
  declarations: [
    AppComponent,

    NowPlayingComponent,
    PlayingToClassPipe,
    PlayingToTextPipe,
    RandomToClassPipe,

    SearchPanelComponent,
    SearchResultsComponent,
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
    UploadComponent,

    SmoothieDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbTabsetModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
