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
  g: any;
  xAxisCall: any;
  yAxisCall: any;

  margin = {top: 20, right: 10, bottom: 150, left: 100};
  width: number = 400;
  height: number = 400;
  y: any;
  x: any;
  color: any;
  countryDomain = ["Africa", "N.America", "Europe",
    "S. America", "Asia", "Australia"];
  min: any;
  max: any;
  extent: any;

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


      //this.appendRect();
      this.getBuildingsBuildRectangles();
      //this.getAgesBuildCircles();

    }

  }

  setMinAndMax() {
    this.min = this.d3.min(this.rectData, d => {
      return d['height'];
    });
    this.max = this.d3.max(this.rectData, d => {
      return d['height'];
    })
    this.extent = this.d3.extent(this.rectData, d => {
      return d['height'];
    })
  }

  scaleBand() {
    let countryDomain = this.rectData.map(d => { return d.name});
    console.log('country domain', countryDomain)
    this.x = this.d3.scaleBand()
      .domain(this.rectData.map(d => { return d.name}))
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
    let extent = this.d3.extent(this.rectData, d => {return d['height']});
    let x = parseInt(extent[0])
    let y = parseInt(extent[1])
    this.y = this.d3.scaleLinear()
      .domain([x, y])
      .range([0, 400])

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

      this.setMinAndMax();
      this.scaleBand();
      this.buildScales();
      this.generateAxises();

      this.buildRectangles();
      this.generateLabels();
    },error =>{console.log('Error')});
  }

  generateLabels() {
    console.log('labels')
    this.g.append("text")
      .attr('class', 'x axis-label')
      .attr('x', this.width/ 2)
      .attr('y', this.height + 140)
      .attr('font-size', '20px')
      .attr('text-anchor', 'middle')
      .text('the worlds tallest buildings');

    this.g.append('text')
      .attr('class', 'y axis-label')
      .attr('x', -(this.height/ 2))
      .attr('y', -60)
      .attr('font-size', '20px')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .text('Height (m)');
  }

  generateAxises() {
    this.xAxisCall = this.d3.axisBottom(this.x);

    this.g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(this.xAxisCall)
      .selectAll("text")
        .attr("y", '10')
        .attr("x", '-5')
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)");

    this.yAxisCall = this.d3.axisLeft(this.y);

    this.g.append('g')
      .attr('class', 'y-axis')
      .call(this.yAxisCall)
  }

  setSVG() {
    this.svg = this.d3.select(this.parentNativeElement)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
    this.g = this.svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
  }

  buildRectangles() {
    var rectangles = this.g.selectAll('rect')
      .data(this.rectData);

    rectangles.enter()
      .append('rect')
      .attr('x', (d, i) =>{
        console.log('this x', this.x(i))
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
    var circles = this.g.selectAll('circle')
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
