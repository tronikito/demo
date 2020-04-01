import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { routing, appRoutingProviders } from './app.routing';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { HomeComponent } from '../home/home.component';
import { CartaComponent } from '../memory/carta/carta.component';
import { FormComponent } from '../memory/form/form.component';
import { MemoryComponent } from '../memory/memory.component';
import { MemoryService } from '../memory/memory.service';
import { StylesService } from './styles.service';
import { CrucigramaComponent } from '../crucigrama/crucigrama.component';
import { SopaletrasComponent } from '../sopaletras/sopaletras.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    CartaComponent,
    FormComponent,
    MemoryComponent,
    CrucigramaComponent,
    SopaletrasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    routing,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [appRoutingProviders,MemoryService,StylesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
