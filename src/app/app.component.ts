import { Component } from '@angular/core';
import * as d3 from "d3";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  ngAfterContentInit() {
    d3.select("p").style("color", "green");
    d3.select("h1").style("color", "pink");
  }
}
