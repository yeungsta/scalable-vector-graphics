import { Component, ElementRef, OnInit, ViewChild, NgZone, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Color, CompoundPath, Item, PaperScope, Path, Point, Project, Rectangle } from 'paper';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import PaperUtils from './paperUtils';

class SvgFile {
  fileName: string;
  scale: number;

  constructor(fileName: string, scale: number) { 
    this.fileName = fileName;
    this.scale = scale;
  }
}

export interface DialogData {
  name: string;
}

@Component({
  selector: 'sketch-popup-dialog',
  templateUrl: 'sketch-popup-dialog.html',
  styleUrls: ['sketch-popup-dialog.css']
})
export class SketchPopupDialog implements OnInit, OnDestroy {
  @ViewChild('canvasElementPopup') canvasElementPopup: ElementRef;
  scope: PaperScope;
  project: Project;
  image: string;
  currentSvg: Item[];

  constructor(public dialogRef: MatDialogRef<SketchPopupDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.image = data.name;
      // console.log("contructor", this.image);
  }

  ngOnDestroy(): void {
    //console.log("SketchPopupDialog destroyed");
  }

  ngOnInit() {
    this.scope = new PaperScope();
    this.project = new Project(this.canvasElementPopup.nativeElement);
    this.currentSvg = new Array();

    // this.drawViewCorners();

    let color = new Color(Math.random(), Math.random(), Math.random());
    // let color = 'black';
    
    this.draw(this.image, this.project.view.bounds, true, color, this.project.view.bounds.center);
    
    //handle animation
    let that = this;
    let animationCount = 0;
    this.project.view.onFrame = function onFrame(event) {
      if (event.count % 8 === 0) {
        if (that.currentSvg[0] !== undefined) {
          //make one path segment visible
          let childrenArray = (that.currentSvg[0] as Item).children;
          let compoundPath = childrenArray[1] as CompoundPath;
          let pathArray = compoundPath.children as Path[];

          if (animationCount < pathArray.length) {
            //there's a weird bug where sometimes index 0 doesn't get drawn because of some timing issue. So the 
            //hack here is to double-check that 0 is first written whenever we encounter 1.
            if (animationCount === 1) {
              pathArray[0].visible = true;
            }

            pathArray[animationCount].visible = true;
          }

          animationCount++;
        }
      }
    }
  }

  drawViewCorners(): void {      
    var path = this.getDot(this.project.view.bounds.topLeft, 'red');
    var path = this.getDot(this.project.view.bounds.topRight, 'red');
    var path = this.getDot(this.project.view.bounds.bottomLeft, 'red');
    var path = this.getDot(this.project.view.bounds.bottomRight, 'red');
  }

  getDot(centerPoint, color): Path.Circle {
    return new Path.Circle({
      center: centerPoint,
      radius: 5,
      fillColor: color
    });
  }

  draw(image, boundary, animate, color, centerPoint) {
    let that = this;

    that.project.activeLayer.importSVG(image, {expandShapes: true, insert: true, onLoad: function(item) {
      that.currentSvg.push(item);

      //position item
      item.position = centerPoint;

      let childrenArray = (item as Item).children;
      let compoundPath = childrenArray[1] as CompoundPath;

      compoundPath.fillColor = color;
      compoundPath.fitBounds(boundary);

      if (animate) {
        let pathArray = compoundPath.children as Path[];

        //set to invisible first
        pathArray.forEach(function(item) {
          item.visible=false;
        });
      }
    }});
  }
}

@Component({
  selector: 'app-svgsketch',
  templateUrl: './svgsketch.component.html',
  styleUrls: ['./svgsketch.component.css']
})

export class SvgsketchComponent implements OnInit {
    @ViewChild('canvasElement') canvasElement: ElementRef;
    scope: PaperScope;
    project: Project;
    projectPopup: Project;
    fileList: SvgFile[];
    svgList: Item[];
    boundaryList: Item[];
    animationCount: number;
    fileIdxCount: number = 0;
    svgFilePath: String = '/assets/svg/';
    gradientColors: Color[];

    //for pull-down option
    image: string = 'airtechchallenge';
    style: string = 'draw';

    constructor(public dialog: MatDialog, private route: ActivatedRoute, private ngZone: NgZone) { }

    ngOnInit() {      
        this.scope = new PaperScope();
        this.project = new Project(this.canvasElement.nativeElement);
        this.fileList = new Array();
        this.svgList = new Array();
        this.boundaryList = new Array();
        this.animationCount = 0;
        this.gradientColors = new Array();

        //TODO: over-sized scale (1.0) displays really neat!

        this.fileList.push(new SvgFile('airtechchallenge', 0.18));
        this.fileList.push(new SvgFile('pentagon', 0.2));
        this.fileList.push(new SvgFile('lantern', 0.16));
        this.fileList.push(new SvgFile('burj', 0.22));
        this.fileList.push(new SvgFile('chattering_teeth', 0.24));
        this.fileList.push(new SvgFile('coffee_dude', 0.18));
        this.fileList.push(new SvgFile('hipster', 0.22));
        this.fileList.push(new SvgFile('hawaiian_flower', 0.22));
        this.fileList.push(new SvgFile('jambox', 0.16));
        this.fileList.push(new SvgFile('kickapoo', 0.18));
        this.fileList.push(new SvgFile('jack_purcell', 0.24));
        this.fileList.push(new SvgFile('scout_mug', 0.16));
        this.fileList.push(new SvgFile('ulu', 0.16));
        this.fileList.push(new SvgFile('marmot', 0.22));
        this.fileList.push(new SvgFile('caltech_submillimeter', 0.2));
        this.fileList.push(new SvgFile('mauna_lani_chair', 0.2));
        this.fileList.push(new SvgFile('baseball_guy', 0.24));
        this.fileList.push(new SvgFile('forties_trio', 0.26));
        this.fileList.push(new SvgFile('tokyo_trainstop2', 0.2));
        this.fileList.push(new SvgFile('hijab', 0.18));
        this.fileList.push(new SvgFile('cocktail', 0.15));
        this.fileList.push(new SvgFile('hydro_flask', 0.18));

        //violet-blue
        this.gradientColors.push(new Color('#A311E4'));
        this.gradientColors.push(new Color('#8926E5'));
        this.gradientColors.push(new Color('#703CE7'));
        this.gradientColors.push(new Color('#5752E8'));
        this.gradientColors.push(new Color('#3E67EA'));
        this.gradientColors.push(new Color('#257DEB'));
        this.gradientColors.push(new Color('#0C93ED'));

        //this.drawViewCorners();
        // this.drawCellBoundaries();
        this.drawSvgs();
        
        //this.handleResize();
        //this.handleAnimation();

        this.handlePopup();
    }

    handlePopup(): void {
      let that = this;

      that.project.view.onClick = function(event){
        let hitPoint = event.point;
        //console.log(hitPoint);

        that.svgList.forEach(function(item) {
          let childrenArray = (item as Item).children;
          let compoundPath = childrenArray[1] as CompoundPath;
          
          if (compoundPath.bounds.contains(hitPoint)) {
            // console.log("hit!", item.name, that.svgList.length);
            that.openPopup(item.name);
            return;
          }
        });
      }
    }

    openPopup(name): void {
      // console.log(name);
      let file = '/assets/svg/' + name + '.svg';

      this.ngZone.run(() => {
        const dialogRef = this.dialog.open(SketchPopupDialog, {
          data: {name: file}
        });

        dialogRef.afterClosed().subscribe(result => {
        });
      });
    }

    handleResize(): void {
      let that = this;

      this.project.view.onResize = function(){
        that.clearSvgs();
        that.project.activeLayer.remove();
        that.project.clear();        
        that.animationCount = 0;

        // that.drawViewCorners();
        // that.drawCellBoundaries();
        that.drawSvgs();
        //that.handleAnimation();
      }
    }

    handleAnimation(): void {
      let that = this;

      //handle animation of all SVGs
      that.project.view.onFrame = function onFrame(event) {
        if (event.count % 8 === 0) {
          //for each SVG, make one path segment visible
          that.svgList.forEach(function(item) {
            let childrenArray = (item as Item).children;
            let compoundPath = childrenArray[1] as CompoundPath;
            let pathArray = compoundPath.children as Path[];

            if (that.animationCount < pathArray.length) {
              //there's a weird bug where sometimes index 0 doesn't get drawn because of some timing issue. So the 
              //hack here is to double-check that 0 is first written whenever we encounter 1.
              if (that.animationCount === 1) {
                pathArray[0].visible = true;
              }

              pathArray[that.animationCount].visible = true;
            }
          })

          that.animationCount++;
        }
      }
    }

    drawSvgs(): void { 
        //console.log(this.project.view.bounds.size);
        //restrict max size
        let cellSize = Math.min(this.project.view.bounds.size.width * 190/1000, 190);
        //restrict min size
        cellSize = Math.max(cellSize, 100);
        //console.log("cellSize",cellSize);

        //controls how crowded each sleep night is to its neighbors
        //restrict max size
        let crowdedOffsetSize  = Math.min(this.project.view.bounds.size.width * 25/1000, 25);
        //restrict min size
        crowdedOffsetSize = Math.max(crowdedOffsetSize, 15);

        let numCellsInRow = Math.ceil(this.project.view.bounds.size.height / cellSize);
        console.log("rows",numCellsInRow);
        let numCellsInColumn = Math.ceil(this.project.view.bounds.size.width / cellSize);
        console.log("columns",numCellsInColumn);
  
        // let width = cellSize/2;
        // let height = cellSize/2;
        let halfCellSize = cellSize/2;
        let width = halfCellSize;
        let height = halfCellSize;
  
        for (var j = 0; j < numCellsInRow; j++) {
          for (var i = 0; i < numCellsInColumn; i++) {
            let drawPoint = new Point(width, height);
            let topLeftPoint = new Point(width-halfCellSize+crowdedOffsetSize, height-halfCellSize+crowdedOffsetSize);
            let bottomRightPoint = new Point(width+halfCellSize-crowdedOffsetSize, height+halfCellSize-crowdedOffsetSize);

            //return to first sketch to keep filling
            if (this.fileIdxCount === this.fileList.length) {
              this.fileIdxCount = 0;
            } 

            let imagePath = '/assets/svg/' + this.fileList[this.fileIdxCount].fileName + '.svg';

            //random
            // let color = new Color(Math.random(), Math.random(), Math.random());
            
            //let color = 'black';

            //gradient
            let color = this.gradientColors[i];

            // this.draw(this.fileList[this.fileIdxCount].fileName, imagePath, this.fileList[this.fileIdxCount].scale, false, color, new Point(width, height));
            //draw and fit the sketch within bounds
            PaperUtils.drawWithinBounds(this.fileList[this.fileIdxCount].fileName, imagePath, 
              new Rectangle(topLeftPoint, bottomRightPoint), false, false, color, drawPoint,
              this.project.activeLayer, this.svgList);

            this.fileIdxCount++;
            width += cellSize;
          }
  
          height += cellSize;
          width = cellSize/2;
        }
    }

    clearSvgs(): void {
      this.svgList.forEach(function(item) {
        item.remove();
      });

      this.svgList = new Array();
    }

    recenterSvgs(centerPoint): void {
      this.svgList.forEach(function(item) {
        //position item
        item.position = centerPoint;
      })
    }

    drawViewCorners(): void {      
      var path = PaperUtils.getDot(this.project.view.bounds.topLeft, 'red');
      this.boundaryList.push(path);

      var path = PaperUtils.getDot(this.project.view.bounds.topRight, 'red');
      this.boundaryList.push(path);

      var path = PaperUtils.getDot(this.project.view.bounds.bottomLeft, 'red');
      this.boundaryList.push(path);

      var path = PaperUtils.getDot(this.project.view.bounds.bottomRight, 'red');
      this.boundaryList.push(path);
    }

    clearDots(): void {
      this.boundaryList.forEach(function(item) {
        item.remove();
      })
    }

    drawCellBoundaries(cellSize): void {      
      let numCellsInRow = Math.floor(this.project.view.bounds.size.width / cellSize);
      // console.log(numCellsInRow);
      let numCellsInColumn = Math.floor(this.project.view.bounds.size.height / cellSize) + 1;
      // console.log(numCellsInColumn);

      let width = 0;
      let height = 0;

      for (var j = 0; j < numCellsInColumn; j++) {
        for (var i = 0; i < numCellsInRow; i++) {
          let dot = PaperUtils.getDot(new Point(width += cellSize, height), 'blue');
          this.boundaryList.push(dot);
        }

        height += cellSize;
        width = 0;
      }
    }

    onSubmit() { 
      this.project.clear();

      console.log(this.image);
      console.log(this.style);

      let imagePath = '/assets/svg/' + this.image + '.svg';

      this.animationCount = 0;

      //execute drawing
      switch (this.style) {
        // case 'wallpaper':
        //   PaperUtils.wallpaper(imagePath, this.project.view, this.project.activeLayer);
        //   break;
        case 'draw':
          PaperUtils.draw(this.image, imagePath, 1.0, true, true, this.project.view.bounds.center, this.project.activeLayer);
          break;
        case 'zoom':
          PaperUtils.zoom(imagePath, 1, this.project.view.bounds, this.project.view.bounds.center,
            this.project.view, this.project.activeLayer);
          break;     
        case 'wavey':
          PaperUtils.wavey(imagePath, 1, this.project.view.bounds, this.project.view.bounds.center,
            this.project.view, this.project.activeLayer);
          break;  
        case 'bounce':
          PaperUtils.bounce(imagePath, 1, this.project.view.bounds, this.project.view.bounds.center, 
            this.project.view, this.project.activeLayer);
          break;
        case 'bounceout':
          PaperUtils.bounceOut(imagePath, 1, this.project.view.bounds, this.project.view.bounds.center,
            this.project.view, this.project.activeLayer);
          break;     
        case 'disintegrate':
          PaperUtils.disintegrate(imagePath, 1, this.project.view.bounds, this.project.view.bounds.center,
            this.project.view, this.project.activeLayer);
          break;     
        case 'growingHair':
          PaperUtils.growingHair(imagePath, this.project.view, this.project.activeLayer);
          break;     
        case 'rotatePieces':
          PaperUtils.rotatePieces(imagePath, 1, this.project.view.bounds, false,this.project.view.bounds.center, 
            this.project.view, this.project.activeLayer);
          break;                                  
      }
     }
}