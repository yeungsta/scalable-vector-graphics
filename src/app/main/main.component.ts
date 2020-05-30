import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PaperScope, Project, Path, Item, CompoundPath, Color } from 'paper';

class SvgFile {
  fileName: string;
  scale: number;

  constructor(fileName: string, scale: number) { 
    this.fileName = fileName;
    this.scale = scale;
  }
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit{
  title = '//experiments in scalable vector graphics';
  menuMap: Map<string, boolean>;

  //paperjs stuff
  @ViewChild('canvasElement') canvasElement: ElementRef;
  scope: PaperScope;
  project: Project;
  fileList: SvgFile[];
  svgFilePath: String = '/assets/svg/';
  svgList: Item[];

  ngOnInit(): void {
    this.menuMap = new Map();

    //paperjs stuff
    this.scope = new PaperScope();
    this.project = new Project(this.canvasElement.nativeElement);
    this.svgList = new Array();
    this.fileList = new Array();

    this.fileList.push(new SvgFile('kickapoo', 1.0));

    //draw
    //this.drawViewCorners();
    this.drawSvg();
    this.handleResize();
  }

  onClick(event) {
    console.log("menu clicked", event);

    //reset all
    this.menuMap.forEach(function(value, key, map) {
      //console.log("value", value);
      map.set(key, false);
    });

    //select
    this.menuMap.set(event, true);

    //move into view; ensures we jump to the "content" anchor
    let x = document.querySelector("#content");
    if (x){
        x.scrollIntoView();
    }
  }

  //paperjs methods
  
  drawViewCorners(): void {      
    var path = this.getDot(this.project.view.bounds.topLeft, 'red');
    //this.boundaryList.push(path);

    var path = this.getDot(this.project.view.bounds.topRight, 'red');
    //this.boundaryList.push(path);

    var path = this.getDot(this.project.view.bounds.bottomLeft, 'red');
    //this.boundaryList.push(path);

    var path = this.getDot(this.project.view.bounds.bottomRight, 'red');
    //this.boundaryList.push(path);
  }

  getDot(centerPoint, color): Path.Circle {
    return new Path.Circle({
      center: centerPoint,
      radius: 5,
      fillColor: color
    });
  }

  drawSvg(): void {
    let imagePath = this.svgFilePath + this.fileList[0].fileName + '.svg';
    let color = new Color(Math.random(), Math.random(), Math.random());
    // let color = 'black';

    //calc how much to scale image
    let scale = this.fileList[0].scale + ((this.project.view.bounds.width - 900)/900);

    //this.draw(this.fileList[0].fileName, imagePath, scale, false, color, this.project.view.center);
    this.wavey(this.fileList[0].fileName, imagePath, scale, color, this.project.view.center);
    //this.rotatePieces(imagePath);
    //this.bounce(imagePath);
  }

  draw(name, image, scaleFactor, animate, color, centerPoint) {
    let that = this;

    that.project.activeLayer.importSVG(image, {expandShapes: true, insert: true, onLoad: function(item){
      item.name = name;
      that.svgList.push(item);

      //position item
      item.position = centerPoint;

      let childrenArray = (item as Item).children;
      let compoundPath = childrenArray[1] as CompoundPath;

      compoundPath.fillColor = color;
      compoundPath.scale(scaleFactor);

      if (animate) {
        let pathArray = compoundPath.children as Path[];

        // console.log(pathArray);

        //set to invisible first
        pathArray.forEach(function(item) {
          item.visible=false;
        });
      }
    }});
  }

  wavey(name, image, scaleFactor, color, centerPoint) {
    let that = this;
    this.project.activeLayer.importSVG(image, {expandShapes: true, insert: true, onLoad: function(item){
      item.name = name;
      that.svgList.push(item);
      //position item
      item.position = centerPoint;

      let childrenArray = (item as Item).children;
      let compoundPath = childrenArray[1] as CompoundPath;

      compoundPath.fillColor = color;
      compoundPath.scale(scaleFactor);

      let pathArray = compoundPath.children as Path[];
      // console.log(pathArray);
      
      that.project.view.onFrame = function onFrame(event) {
        if (event.count % 16 === 0) {
          pathArray.forEach(function(pathItem) {
            let i = 0;
            pathItem.segments.forEach(function(segItem) {
              // A cylic value between -1 and 1
              var sinusy = Math.sin(event.time * 8 + i);
              var sinusx = Math.sin(event.time * 7 + i);
              //console.log(sinus);
              // Change the y position of the segment point:
              segItem.point.x = segItem.point.x + sinusx;
              segItem.point.y = segItem.point.y + sinusy;
              i++;
            });
          });
        }
      }
    }});
  }

  rotatePieces(image) {
    let that = this;
    this.project.activeLayer.importSVG(image, {expandShapes: true, insert: true, onLoad: function(item){
      let childrenArray = (item as Item).children;
      let compoundPath = childrenArray[1] as CompoundPath;
      let pathArray = compoundPath.children as Path[];
      // console.log(pathArray);
      
      function getRandomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      that.project.view.onFrame = function onFrame(event) {
        if (event.count % 1 === 0) {
          pathArray.forEach(function(pathItem) {
            pathItem.rotate(3);
          });
        }
      }
    }});
  }

  bounce(image) {
    let that = this;
    this.project.activeLayer.importSVG(image, {expandShapes: true, insert: true, onLoad: function(item){
      // console.log((item as Item).children);
      let childrenArray = (item as Item).children;
      let compoundPath = childrenArray[1] as CompoundPath;

      // The maximum height of the wave:
      var height = 10;

      that.project.view.onFrame = function onFrame(event) {
        if (event.count % 16 === 0) {
          // A cylic value between -1 and 1
          var sinus = Math.sin(event.time * 3);
  
          compoundPath.position.y = compoundPath.position.y + sinus * height;
        }
      }
    }});
  }

  handleResize(): void {
    let that = this;

    this.project.view.onResize = function(){
      that.clearSvgs();
      that.project.activeLayer.remove();
      that.project.clear();        

      that.drawSvg();
      // that.drawViewCorners();
      // console.log('bounds: ', that.project.view.bounds.width);
      // console.log('layer: ', that.project.activeLayer.view.bounds.width);
    }
  }

  clearSvgs(): void {
    let that = this;

    this.svgList.forEach(function(item) {
      item.remove();
    });

    this.svgList = new Array();
  }
}
