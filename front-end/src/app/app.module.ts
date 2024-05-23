import { ErrorModule } from './dialogs/error/error.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './auth-interceptor.service';
import { configurationFactory } from './configurationFactory';
import { GlobalService } from './global.service';
import { InitialazerService } from './initialazer.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    ErrorModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    InitialazerService,
    GlobalService,
    {
      provide: APP_INITIALIZER,
      useFactory: configurationFactory,
      deps: [InitialazerService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
