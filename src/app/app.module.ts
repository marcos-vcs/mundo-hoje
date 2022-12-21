import { FavoritesQuantityService } from './services/favorites-quantity.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IbgeNoticeApiService } from './services/ibge-notice-api.service';
import { DatePipe } from '@angular/common';
import { NewsDetailComponent } from './components/news-detail/news-detail.component';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { AboutComponent } from './components/about/about.component';

@NgModule({
  declarations: [AppComponent, NewsDetailComponent, AboutComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    SocialSharing,
    DatePipe,
    HttpClient,
    IbgeNoticeApiService,
    FavoritesQuantityService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
