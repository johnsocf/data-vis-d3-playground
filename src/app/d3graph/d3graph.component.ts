import { Component, OnInit, ElementRef, NgZone } from '@angular/core';
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

@Component({
  selector: 'app-d3graph',
  template: '<svg id="canvas" width="400" height="60"></svg>'
})
export class D3graphComponent implements OnInit {
  private d3: D3;
  private parentNativeElement: any;
  private d3Svg: Selection<SVGSVGElement, any, null, undefined>;

  constructor(
    element: ElementRef,
    private ngZone: NgZone,
    d3Service: D3Service
  ) {
    this.d3 = d3Service.getD3();
    console.log('this d3', this.d3)
    this.parentNativeElement = element.nativeElement;
  }

  ngOnInit() {
    let self = this;
    let d3 = this.d3;
    let svg: any;
    let name: string;
    let vVal: number;
    let colors: any = [];
    let data: {name: string, yVal: number}[] = [];
    let padding: number = 25;
    let width: number = 500;
    let height: number = 150;
    let xScale: any;
    let yScale: any;
    let xColor: any;
    let xAxis: any;
    let yAxis: any;

    if (this.parentNativeElement !== null) {
      svg = d3.select(this.parentNativeElement)
        .append('svg')
        .attr('width', width)
        .attr('height', height)

      var rect = svg.append('rect')
        .attr('x', 25)
        .attr('y', 0)
        .attr('width', 150)
        .attr('height', 60)
        .attr('fill', 'blue')
    }

  }

}
