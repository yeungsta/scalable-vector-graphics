import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import SleepUtils, { SleepPhase } from './sleepUtils';
import DrawUtils from './drawUtils';
import { PaperScope, Project, Point, Color, Path, Item, Rectangle, Group } from 'paper';

@Component({
  selector: 'app-sleepart',
  templateUrl: './sleepart.component.html',
  styleUrls: ['./sleepart.component.css']
})
export class SleepartComponent implements OnInit {
  @ViewChild('canvasElement') canvasElement: ElementRef;
  scope: PaperScope;
  project: Project;

  constructor() { }

  ngOnInit() {
    //Adjustable Attributes
    //controls how staggered every other row looks
    let widthShiftSize = 25;
    //controls how crowded each sleep night is to its neighbors
    let crowdedOffsetSize = 40;
    //controls if we want to visualize results that don't measure the full sleep stages: light, deep, wake, rem; Simplified
    //results look flat
    let skipSimplifiedSleepResults = true;

    //paperjs init
    this.scope = new PaperScope();
    this.project = new Project(this.canvasElement.nativeElement);
    // DrawUtils.drawViewCorners(this.project.view.bounds, 'red');

    let sleepSessions = SleepUtils.getSleepSessions(skipSimplifiedSleepResults);
    // console.log("sleepSessions.length",sleepSessions.length);

    let cellSize = Math.sqrt((this.project.view.bounds.size.width * this.project.view.bounds.size.height) / sleepSessions.length);
    console.log("cellSize",cellSize);
    let numCols = Math.ceil(this.project.view.bounds.size.width / cellSize);    
    console.log("numCols",numCols);
    let numRows = Math.ceil(this.project.view.bounds.size.height / cellSize);
    console.log("numRows",numRows);
    
    let halfCellSize = cellSize/2;
    let width = halfCellSize - widthShiftSize;
    let height = halfCellSize;
    let sleepSessionIdx = 0;

    for (var j = 0; j < numRows; j++) {
      for (var i = 0; i < numCols; i++) {
        let drawPoint = new Point(width, height);
        let topLeftPoint = new Point(width-halfCellSize-crowdedOffsetSize, height-halfCellSize-crowdedOffsetSize);
        let bottomRightPoint = new Point(width+halfCellSize+crowdedOffsetSize, height+halfCellSize+crowdedOffsetSize);

        let extrudeComposition = this.composeExtrude(SleepUtils.getSleepPhases(sleepSessions[sleepSessionIdx]), drawPoint);

        //now scale the composition to fit the bounds
        extrudeComposition.fitBounds(new Rectangle(topLeftPoint, bottomRightPoint));

        width += cellSize;
        sleepSessionIdx++;
        if (sleepSessionIdx >= sleepSessions.length) {
          console.log("reached the last session:",sleepSessionIdx);
          return;
        }
      }

      height += cellSize;

      //stagger the look of every other row
      if ((j % 2) === 0) {
        width = (cellSize/2) + widthShiftSize;
      } else {
        width = (cellSize/2) - widthShiftSize;
      }
    }

    //fit within view bounds (but doesn't rescale)
    // this.project.activeLayer.fitBounds(this.project.view.bounds);
  }

  getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  //Composition #1: Extrude
  composeExtrude(sleepPhases: SleepPhase[], initialPoint: Point): Item {
    //Adjustable Visual Attributes
    //random shapes+colors vs. uniform shapes/colors for sleep phases
    let colorScheme = 0;
    //controls how skewed the components look
    let skewPoint = new Point(-5, -15);
    //controls how far out the peripheral components are drawn from center component
    let circlePaddingFactor: number = 1.5;
    //thickness of each polygon; effects how high each extrusion looks
    let polygonThickness = 4.0;

    let circle: Path;
    let drawPoints: Point[] = new Array();
    let peripheralComp = new Array();
    let circSectionStart;
    let numPeripheralComp;
    let circSectionSize;
    let components = new Array();

    for (let i = 0; i < sleepPhases.length; i++) {
      let sleepPhase = sleepPhases[i];

      //after displaying first/largest, display the rest on a random point on a circle
      if (i === 0) {
        //create imaginary boundary circle (orbit) around first element
        circle = new Path.Circle({
          center: initialPoint,
          radius: DrawUtils.calcRadius(sleepPhase) * circlePaddingFactor,
          visible: false,
          strokeColor: 'black'
        });

        circle.skew(skewPoint);
        components.push(circle);

        let component = this.drawExtrudeComponent(sleepPhase, initialPoint, skewPoint, polygonThickness, colorScheme);
        components.push(component);

        circSectionStart = circle.length/2;
        // console.log("circSectionStart", circSectionStart);
        numPeripheralComp = sleepPhases.length-1;
        // console.log("numPeripheralComp", numPeripheralComp);
        //size of each section of the bottom half circle that will contain a component
        circSectionSize = circSectionStart / numPeripheralComp;
        // console.log("circSectionSize", circSectionSize);
      } else {
        //place randomly in current circle section (of bottom half of circle's circumference)
        // console.log("random range:", circSectionStart, circSectionStart + circSectionSize);
        let drawPoint = circle.getPointAt(this.getRandomInRange(circSectionStart, circSectionStart + circSectionSize));

        //advance start position for next component
        circSectionStart += circSectionSize;

        //store for sorting and displaying
        drawPoints.push(drawPoint);
        peripheralComp.push(sleepPhase);
      }
    }

    //now we sort in order of farthest perspective (y-axis)
    //sort by largest minutes
    function compareYaxis(a: Point, b: Point) {
      if (a.y < b.y)
        return -1;
      if (a.y > b.y)
        return 1;
      return 0;
    }

    drawPoints.sort(compareYaxis);

    //finally, draw sleep phases by sorted draw point
    let that = this;
    drawPoints.forEach(function(drawPoint) {
      let component = that.drawExtrudeComponent(peripheralComp.pop(), drawPoint, skewPoint, polygonThickness, colorScheme);
      components.push(component);
    })

    //return one group of items/components
    return new Group(components);
  }

  drawExtrudeComponent(sleepPhase: SleepPhase, center, skewPoint, thickness, colorScheme): Item {
    //console.log(sleepPhase);
    let rotAngle = Math.floor(this.getRandomInRange(0, 360));
    let numSides;
    let color; 
    let fillColor = 'white'; 
    let colorTopPolygon = true;

    switch (colorScheme) {
      //random
      case 0:
        numSides = Math.floor(this.getRandomInRange(5, 10));
        color = new Color(Math.random(), Math.random(), Math.random());
        break;
      //miami vice
      case 1:
        switch (sleepPhase.phase) {
          case 'light':
          case 'asleep':
            numSides = 5;
            color = 'darkturquoise';
            break;
          case 'wake':
          case 'awake':
          case 'restless':
            numSides = 3;
            color = 'hotpink';
            break;      
          case 'deep':
            numSides = 6;
            color = 'lightgreen';
            break;
          case 'rem':
            numSides = 7;
            color = 'yellow';
            break;                 
        }
        break;
      case 2:
        switch (sleepPhase.phase) {
          case 'light':
          case 'asleep':
            numSides = 5;
            color = 'blue';
            break;
          case 'wake':
          case 'awake':
          case 'restless':
            numSides = 3;
            color = 'red';
            break;      
          case 'deep':
            numSides = 6;
            color = 'white';
            fillColor = 'black';
            break;
          case 'rem':
            numSides = 7;
            color = 'green';
            break;                 
        }
        break;
    } 

    return DrawUtils.drawPolygonStack(sleepPhase, center, numSides,
      color, fillColor, colorTopPolygon, rotAngle, skewPoint, thickness);
  }

  //TODO: Composition #2: compose one night's rest, as full data

  //TODO: Composition #3: compose using vector geometry: http://paperjs.org/tutorials/geometry/vector-geometry/
}
