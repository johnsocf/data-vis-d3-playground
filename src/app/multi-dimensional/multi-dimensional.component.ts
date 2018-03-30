import { Component, OnInit, ElementRef, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  D3Service,
  D3,
  Selection
} from 'd3-ng2-service';
import * as _ from 'lodash';
import d3Tip from 'd3-tip';


@Component({
  selector: 'app-multi-dimensional',
  templateUrl: './multi-dimensional.component.html',
  styleUrls: ['./multi-dimensional.component.css']
})

export class MultiDimensionalComponent implements OnInit {

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
  area: any;
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
  timeLabel: any;
  flag: boolean = true;
  valueType: string;
  t: any;
  newData: any;
  filteredData: any;
  time: number = 0;
  legend: any;
  tip: any;
  interval: any;
  buttonText: string = 'Play';
  selectedAttribute: string = 'all';
  minSlider: any;
  maxSlider: any;

  constructor(
    element: ElementRef,
    private ngZone: NgZone,
    d3Service: D3Service,
    private http: HttpClient,
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

  onInputChange(sliderEvent) {
    let sliderValue = sliderEvent.value
    console.log('value', sliderValue);
    this.time = sliderValue;
    this.update();
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
    this.x = this.d3.scaleLog()
      .range([0, this.width])
      .base(10);
  }

  buildScaleBandDomain() {
    this.x.domain([142, 150000]);
  }

  setOrdinalScale() {
    this.color = this.d3.scaleOrdinal(this.d3.schemeCategory10);

  }

  buildScales() {
    this.y = this.d3.scaleLinear()
      .range([this.height, 0]);
  }

  buildScaleDomain() {
    this.y.domain([0, 90]);
  }


  getRevenuesBuildRectangles() {
    this.http.get<any[]>('../assets/data/data.json').subscribe(res =>{
      this.rectData = res;
      this.newData = this.formatData();
      this.buildScales();
      this.scaleBand();
      this.areaLinear();
      this.generateAxises();
      this.addLegend();

      this.addSlider();
      this.d3.interval(d => {

        this.flag = !this.flag;
      }, 100);

      this.generateLabels();
      this.resetVis();
      this.resetVis();

    },error =>{console.log('Error')});
  }

  addSlider() {

    this.extent = this.d3.extent(this.rectData, d => {
      return d['year'];
    })
    console.log('this extent', this.extent);
    this.minSlider = this.extent[0];
    this.maxSlider = this.extent[1];
  }

  step() {
    this.time = (this.time < 214) ? this.time+1 : 0
    this.update();
  }

  playVis() {
    let element = this;
    if  (this.buttonText === 'Play') {
      this.interval = setInterval(() => {this.step();}, 100);
    } else {
      clearInterval(this.interval);
    }

    this.buttonText = (this.buttonText === 'Play') ? 'Pause' : 'Play';
  }

  resetVis() {
    this.time = +this.extent[0];
    this.update();
  }

  setAttribute(value) {
      this.selectedAttribute = value;
      this.update();
  }

  addLegend() {
    this.legend = this.g.append('g')
      .attr('transform', 'translate(' + (this.width - 10) + ',' + (this.height - 125) + ')');

    let continents = ['europe', 'asia', 'americas', 'africa'];

    continents.forEach((continent, i) => {
      let legendRow = this.legend.append('g')
        .attr('transform', 'translate(0, ' + (i * 20) + ')');

      legendRow.append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', this.color(continent));

      legendRow.append('text')
        .attr('x', -10)
        .attr('y', 10)
        .attr('text-anchor', 'end')
        .style('text-transform', 'capitalize')
        .text(continent);

    });
  }

  areaLinear() {
    this.area = this.d3.scaleLinear()
      .range([25*Math.PI, 1500*Math.PI])
      .domain([2000, 1400000000]);
  }

  formatData() {
    let thisData =  this.rectData.map(function(year){
      let filteredCountries = year["countries"].filter(function(country){
        return (country.income && country.life_exp);
      }).map(function(country){
        country.income = +country.income;
        country.life_exp = +country.life_exp;
        return country;
      });
      return {
        countries: filteredCountries,
        year: +year['year']
      };
    });
    return thisData;


  }

  update() {
    //this.valueType = this.flag ? 'revenue' : 'profit';
    this.valueType = 'revenue';
    //this.setMinAndMax();
    console.log('update');

    this.buildScaleBandDomain();

    this.generateAxisesCalls();
    this.addTransition();
    this.filterBasedOnSelection();
    this.buildRectangles();
    this.buildScaleDomain();
    this.updateLabelText();
  }

  filterBasedOnSelection() {
    const element = this;
    this.filteredData = _.clone(this.newData)
    let filterSet = _.find(this.filteredData, {year: this.time});
    console.log('filter set', filterSet);
    this.filteredData = filterSet['countries'].filter(d => {
      if (element.selectedAttribute === 'all') {return true;}
      else {
        return d.continent === element.selectedAttribute;
      }
    });

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
      .attr('x', this.width/ 2)
      .attr('y', this.height + 140)
      .attr('font-size', '20px')
      .attr('text-anchor', 'middle')
      .text('Per Capita GDP');

    this.yLabel = this.g.append('text')
      .attr('class', 'y axis-label')
      .attr('x', -(this.height/ 2))
      .attr('y', -60)
      .attr('font-size', '20px')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .text('life expectancy years');

    this.timeLabel = this.g.append('text')
      .attr('x', this.height - 10)
      .attr('y', this.width - 40)
      .attr('font-size', '20px')
      .attr('text-anchor', 'middle')
      .text('1800');
  }

  generateAxises() {
    this.xAxisCall = this.d3.axisBottom(this.x)
      .tickValues([400, 4000, 40000])
      .tickFormat(this.d3.format('$'));

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
      .data(this.filteredData, d => {
        return  d.country;
      });


   //  //exit old elements
    circles.exit()
      .attr('fill', 'red')
      .transition(this.t)
      .attr('cy', this.y(0))
      .remove();

    // enter
    circles.enter()
      .append('circle')
      .attr('class', 'enter')
      .attr('fill', d => {return this.color(d.continent)})
      .merge(circles)
   .transition(this.t)
      .attr('cy', d => {return this.y(d.life_exp)})
      .attr('cx', d => {return this.x(d.income)})
      .attr('r', d => {return Math.sqrt(this.area(d.population)/ Math.PI)})

    this.timeLabel.text(+(this.time));
  }



}

