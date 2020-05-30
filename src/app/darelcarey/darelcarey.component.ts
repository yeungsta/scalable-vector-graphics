import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PaperScope, Project, Item, CompoundPath, Path } from 'paper';
import PaperUtils from '../svgsketch/paperUtils';
import { ActivatedRoute } from '@angular/router';

class SvgFile {
  fileName: string;
  scale: number;

  constructor(fileName: string, scale: number) { 
    this.fileName = fileName;
    this.scale = scale;
  }
}

@Component({
  selector: 'app-darelcarey',
  templateUrl: './darelcarey.component.html',
  styleUrls: ['./darelcarey.component.css']
})
export class DarelcareyComponent implements OnInit {
  @ViewChild('canvasElement') canvasElement: ElementRef;
  scope: PaperScope;
  project: Project;
  fileList: SvgFile[];
  svgList: Item[];
  animationCount: number;
  show: boolean;
  imageIdx: number = 1;
  style: string = 'draw';

  constructor(private route: ActivatedRoute) {
    //set values from http query params
    this.route.queryParams.subscribe(val => {
      if (val['imageIdx'] !== undefined) {
        console.log('imageIdx', val['imageIdx']);
        this.imageIdx = val['imageIdx'];
      }
      if (val['style'] !== undefined) {
        console.log('style', val['style']);
        this.style = val['style'];
      }
    });
    
    this.fileList = new Array();
    this.svgList = new Array();
    this.animationCount = 0;
    this.show = true;
  }

  ngOnInit() {
    //paperjs init
    this.scope = new PaperScope();
    this.project = new Project(this.canvasElement.nativeElement);

    this.fileList.push(new SvgFile('carey1', 1.0));
    this.fileList.push(new SvgFile('carey2', 1.0));
    this.fileList.push(new SvgFile('carey3', 1.0));
    this.fileList.push(new SvgFile('carey4', 1.0));
    this.fileList.push(new SvgFile('carey5', 1.0));

    let imagePath = '/assets/darelcarey/' + this.fileList[this.imageIdx].fileName + '.svg';
    let imageName = this.fileList[this.imageIdx].fileName;


    //random
    // let color = new Color(Math.random(), Math.random(), Math.random());
    let color = 'black';

    switch (this.style) {
      case 'draw':
        //draw & animate and fit the sketch within bounds
        PaperUtils.drawWithinBounds(imageName, imagePath, this.project.view.bounds, true, 
          true, color, this.project.view.bounds.center, this.project.activeLayer, this.svgList);
        break;
      case 'zoom':
        PaperUtils.zoom(imagePath, 4, this.project.view.bounds, this.project.view.bounds.center,
          this.project.view, this.project.activeLayer);
        break;     
      case 'wavey':
      PaperUtils.wavey(imagePath, 4, this.project.view.bounds, this.project.view.bounds.center,
        this.project.view, this.project.activeLayer);
        break;  
      case 'bounce':
      PaperUtils.bounce(imagePath, 4, this.project.view.bounds, this.project.view.bounds.center,
        this.project.view, this.project.activeLayer);
        break; 
      case 'disintegrate':
      PaperUtils.disintegrate(imagePath, 4, this.project.view.bounds, this.project.view.bounds.center, 
        this.project.view, this.project.activeLayer);
        break;     
      case 'growingHair':
        PaperUtils.growingHair(imagePath, this.project.view, this.project.activeLayer);
        break;     
      case 'rotatePieces':
      PaperUtils.rotatePieces(imagePath, 2, this.project.view.bounds, false, this.project.view.bounds.center,
        this.project.view, this.project.activeLayer);
        break;                                  
    }

    this.handleAnimation();
  }

  handleAnimation(): void {
    let that = this;
    
    //handle animation of all SVGs
    that.project.view.onFrame = function onFrame(event) {
      if (event.count % 8 === 0) {
        if (that.show === true) {
          //for each SVG, make one path segment visible
          that.svgList.forEach(function(item) {
            let childrenArray = (item as Item).children;
            let compoundPath = childrenArray[1] as CompoundPath;
            let pathArray = compoundPath.children as Path[];

            // console.log("forward animationCount", that.animationCount);
            if (that.animationCount < pathArray.length) {
              //there's a weird bug where sometimes index 0 doesn't get drawn because of some timing issue. So the 
              //hack here is to double-check that 0 is first written whenever we encounter 1.
              if (that.animationCount === 1) {
                pathArray[0].visible = true;
              }

              pathArray[that.animationCount].visible = true;
              that.animationCount++;
            } else {
              //flip direction
              that.show = !that.show;
              console.log("flipped", that.show);

              //set to last idx
              that.animationCount = pathArray.length-1;
            }
          })
        } else {
          //for each SVG, make one path segment hidden
          that.svgList.forEach(function(item) {
            let childrenArray = (item as Item).children;
            let compoundPath = childrenArray[1] as CompoundPath;
            let pathArray = compoundPath.children as Path[];

            // console.log("backwards animationCount", that.animationCount);
            if (that.animationCount >= 0) {
              pathArray[that.animationCount].visible = false;
              that.animationCount--;
            } else {
              //flip direction
              that.show = !that.show;
              console.log("flipped", that.show);

              //reset
              that.animationCount = 0;
            }
          })
        }
      }
    }
  }
}
