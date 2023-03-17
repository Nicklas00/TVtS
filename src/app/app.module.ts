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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

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
  imports: [
    BrowserModule,
    HttpClientModule,
    NoopAnimationsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
