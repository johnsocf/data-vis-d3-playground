import { Component, OnInit, ElementRef, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  D3Service,
  D3,
  Axis,
  BrushBehavior,
  BrushSelection,
  D3BrushEvent,
  ScaleLinear,
  ScaleOrdinal,
  Selection,
  Transition
} from 'd3-ng2-service';
import * as _ from 'lodash';

const data = [
  {name: 'A', yVal: 1},
  {name: 'B', yVal: 2},
  {name: 'C', yVal: 3},
  {name: 'D', yVal: 4}
]

const newData = [25, 20, 10, 12, 15];

@Component({
  selector: 'app-d3graph',
  template: '<div id="canvas" width="400" height="60"></div>'
})
export class D3graphComponent implements OnInit {
  private d3: D3;
  private parentNativeElement: any;
  private d3Svg: Selection<SVGSVGElement, any, null, undefined>;
  data: any;
  rectData: any;
  svg: any;
  width: number = 400;
  height: number = 400;
  y: any;
  x: any;
  color: any;
  countryDomain = ["Africa", "N.America", "Europe",
    "S. America", "Asia", "Australia"];

  constructor(
    element: ElementRef,
    private ngZone: NgZone,
    d3Service: D3Service,
    private http: HttpClient
  ) {
    this.d3 = d3Service.getD3();
    this.parentNativeElement = element.nativeElement;
  }

  ngOnInit() {
    let self = this;
    let name: string;
    let vVal: number;
    let colors: any = [];
    let data: {name: string, yVal: number}[] = [];
    let padding: number = 25;

    let xScale: any;
    let yScale: any;
    let xColor: any;
    let xAxis: any;
    let yAxis: any;

    if (this.parentNativeElement !== null) {
      this.setSVG();
      this.setOrdinalScale();
      this.buildScales();
      //this.scaleBand();

      //this.appendRect();
      this.getBuildingsBuildRectangles();
      this.getAgesBuildCircles();

    }

  }

  scaleBand() {
    this.x = this.d3.scaleBand()
      .domain(this.countryDomain)
      .range([0, 400])
      .paddingInner(0.3)
      .paddingOuter(0.3)
  }

  setOrdinalScale() {
    this.color = this.d3.scaleOrdinal()
      .domain(this.countryDomain)
      .range(this.d3.schemeCategory10);

  }

  buildScales() {
    this.y = this.d3.scaleLinear()
      .domain([0, 828])
      .range([0, 400])

  }

  appendRect() {
    var rect = this.svg.append('rect')
      .attr('x', 25)
      .attr('y', 0)
      .attr('width', 150)
      .attr('height', 60)
      .attr('fill', 'blue')
  }

  getAgesBuildCircles() {
    this.http.get<any[]>('../assets/data/ages.json').subscribe(res =>{
      this.data = res;
      this.data.forEach(d => {
        d.age = +d.age;
      })
      this.buildCircles();
    },error =>{console.log('Error')});
  }

  getBuildingsBuildRectangles() {
    this.http.get<any[]>('../assets/data/buildings.json').subscribe(res =>{
      this.rectData = res;
      this.rectData.forEach(d => {
        d.height = +d.height;
      })
      this.countryDomain = _.map(this.rectData, 'name');
      this.scaleBand();
      console.log('country domain', this.countryDomain);
      this.buildRectangles();
    },error =>{console.log('Error')});
  }

  setSVG() {
    this.svg = this.d3.select(this.parentNativeElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
  }

  buildRectangles() {
    var rectangles = this.svg.selectAll('rect')
      .data(this.rectData);

    rectangles.enter()
      .append('rect')
      .attr('x', (d, i) =>{
        console.log('this x', this.x(d.name))
        return this.x(d.name);
      })
      .attr('y', 0)
      .attr('width', this.x.bandwidth)
      .attr('height', d => {
        return this.y(d.height);
      })
      .attr('fill', 'blue')

  }

  buildCircles() {
    var circles = this.svg.selectAll('circle')
      .data(this.data);


    circles.enter()
      .append('circle')
      .attr('cx', (d, i) => {
        return 50 + i * 50;
      })
      .attr('cy', 100)
      .attr('r', (d) => {
        return d.age * 2;
      })
      .attr('fill', d =>{
        if (d.name == 'Tony') {
          return 'blue'
        } else {
          return 'pink'
        }
      })
  }


}
