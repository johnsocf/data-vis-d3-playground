import { Component, OnInit, ElementRef, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  D3Service,
  D3,
  Selection
} from 'd3-ng2-service';

@Component({
  selector: 'app-scatter-plot',
  templateUrl: './scatter-plot.component.html',
  styleUrls: ['./scatter-plot.component.css']
})
export class ScatterPlotComponent implements OnInit {

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
  yAxisGroup: any;
  xAxisGroup: any;
  yLabel: any;
  xLabel: any;
  flag: boolean = true;
  valueType: string;
  t: any;
  newData: any;

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

    if (this.parentNativeElement !== null) {
      this.setSVG();
      this.setOrdinalScale();
      this.getRevenuesBuildRectangles();
    }

  }

  setMinAndMax() {
    this.min = this.d3.min(this.newData, d => {
      return d['height'];
    });
    this.max = this.d3.max(this.newData, d => {
      return d['height'];
    })
    this.extent = this.d3.extent(this.newData, d => {
      return d['height'];
    })
  }

  scaleBand() {
    this.x = this.d3.scaleBand()
      .range([0, 400])
      .paddingInner(0.3)
      .paddingOuter(0.3)
  }

  buildScaleBandDomain() {
    this.x.domain(this.newData.map(d => { return d.month}));
  }

  setOrdinalScale() {
    this.color = this.d3.scaleOrdinal()
      .domain(this.countryDomain)
      .range(this.d3.schemeCategory10);

  }

  buildScales() {
    this.y = this.d3.scaleLinear()
      .range([this.height, 0]);
  }

  buildScaleDomain() {
    let extent = this.d3.extent(this.newData, d => {return d[this.valueType]});
    let x = parseInt(extent[0]);
    let y = parseInt(extent[1]);
    this.y.domain([0, y]);
  }


  getRevenuesBuildRectangles() {
    this.http.get<any[]>('../assets/data/revenues.json').subscribe(res =>{
      this.rectData = res;
      this.rectData.forEach(d => {
        d.revenue = +d.revenue;
        d.profit = +d.profit;
      });
      this.buildScales();
      this.scaleBand();
      this.generateAxises();
      this.d3.interval(d => {
        //this.newData = this.rectData;
        this.newData = this.flag ? this.rectData : this.rectData.slice(1);
        console.log('this.rect data', this.newData)
        this.update();
        this.flag = !this.flag;
      }, 1000);
      this.generateLabels();

    },error =>{console.log('Error')});
  }

  update() {
    //this.valueType = this.flag ? 'revenue' : 'profit';
    this.valueType = 'revenue';
    this.setMinAndMax();

    this.buildScaleBandDomain();
    this.buildScaleDomain();
    this.generateAxisesCalls();
    this.addTransition();
    this.buildRectangles();
    this.updateLabelText();
  }

  updateLabelText() {
    this.yLabel.text(this.valueType);
  }

  addTransition() {
    this.t = this.d3.transition().duration(750);
  }


  generateLabels() {
    this.xLabel = this.g.append("text")
      .attr('class', 'x axis-label')
      .attr('cx', this.width/ 2)
      .attr('cy', this.height + 140)
      .attr('font-size', '20px')
      .attr('text-anchor', 'middle')
      .text(this.valueType);

    this.yLabel = this.g.append('text')
      .attr('class', 'y axis-label')
      .attr('cx', -(this.height/ 2))
      .attr('cy', -60)
      .attr('font-size', '20px')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .text(this.valueType + ' (m)');
  }

  generateAxises() {
    this.xAxisCall = this.d3.axisBottom(this.x);

    this.xAxisGroup = this.g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + this.height + ')')

    this.yAxisCall = this.d3.axisLeft(this.y);
    this.yAxisGroup = this.g.append('g')
      .attr('class', 'y-axis');
  }

  generateAxisesCalls() {
    this.yAxisGroup.transition(this.t).call(this.yAxisCall);
    this.xAxisGroup.transition(this.t).call(this.xAxisCall)
      .selectAll("text")
      .attr("y", '10')
      .attr("x", '-5')
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-40)");
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

    // data join
    var circles = this.g.selectAll('circle')
      .data(this.newData, d => {
        return d.month;
      });

    // exit old elements
    circles.exit()
      .attr('fill', 'red')
    .transition(this.t)
      .attr('cy', this.y(0))
      .remove();

    // enter
    circles.enter()
      .append('circle')
      .attr('cy', d => this.y(0))
      .attr('cx', (d, i) => {return this.x(d.month) + this.x.bandwidth() / 2})
      .attr('r', 5)
      .attr('fill', 'blue')
      .merge(circles)
      .transition(this.t)
      .attr('cy', d => {return this.y(d[this.valueType])})
      .attr('cx', (d, i) => {return this.x(d.month) + this.x.bandwidth() / 2})

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
        if (d.month == 'March') {
          return 'blue'
        } else {
          return 'pink'
        }
      })
  }


}

