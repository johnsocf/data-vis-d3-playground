import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {D3Service} from "d3-ng2-service";
import { D3graphComponent } from './d3graph/d3graph.component';
import { HttpClientModule } from '@angular/common/http';
import { RevBarGraphComponent } from './rev-bar-graph/rev-bar-graph.component';
import { ScatterPlotComponent } from './scatter-plot/scatter-plot.component';


@NgModule({
  declarations: [
    AppComponent,
    D3graphComponent,
    RevBarGraphComponent,
    ScatterPlotComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule
  ],
  providers: [D3Service],
  bootstrap: [AppComponent]
})
export class AppModule { }
