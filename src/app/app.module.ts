import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';

import { AngularMaterialModule } from './angular-material.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { AppMessagesComponent } from './appMessages/appMessages.component';
import { PostModule } from './posts/post.module';
import { SongModule } from './songs/song.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { StaticModule } from './static/static.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AppMessagesComponent,
  ],
  imports: [
  BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    AngularMaterialModule,
    PostModule,
    SongModule,
    StaticModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},

  ],
  bootstrap: [AppComponent],
  entryComponents: [AppMessagesComponent]
})
export class AppModule {}

