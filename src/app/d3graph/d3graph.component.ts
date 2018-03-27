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
  svg: any;
  width: number = 500;
  height: number = 500;

  constructor(
    element: ElementRef,
    private ngZone: NgZone,
    d3Service: D3Service,
    private http: HttpClient
  ) {
    this.d3 = d3Service.getD3();
    console.log('this d3', this.d3)
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
      this.setSVG()
      this.getAgesBuildCircles();
      this.appendRect()
    }

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
      //let o = res.json();
      console.log('data', res)
      this.data = res;
      this.data.forEach(d => {
        d.age = +d.age;
      })
      this.buildCircles();
    },error =>{console.log('Error')});
  }

  setSVG() {
    this.svg = this.d3.select(this.parentNativeElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
  }

  buildCircles() {
    var circles = this.svg.selectAll('circle')
      .data(this.data);


    circles.enter()
      .append('circle')
      .attr('cx', (d, i) => {
        console.log('item'+ d, 'index:' + i)
        return 50 + i * 50;
      })
      .attr('cy', 100)
      .attr('r', (d) => {
        console.log('item ' + d);
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
