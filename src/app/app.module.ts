import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { OverlayComponent } from './overlay/overlay.component';
import { SearchComponent } from './search/search.component';
import { RoutesSettingComponent } from './routes-setting/routes-setting.component';
import { HttpClientModule } from '@angular/common/http';
import { LayermenuBoxComponent } from './layermenu-box/layermenu-box.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BottomDrawerComponent } from './bottom-drawer/bottom-drawer.component';

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    OverlayComponent,
    SearchComponent,
    RoutesSettingComponent,
    LayermenuBoxComponent,
    BottomDrawerComponent,
  ],
  imports: [BrowserModule, HttpClientModule, NoopAnimationsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
