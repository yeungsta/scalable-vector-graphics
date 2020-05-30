import { Item, CompoundPath, Path, Point, Size, Color, PointText, PlacedSymbol } from "paper";

export default class PaperUtils {
    constructor() {
    }

    static drawViewCorners(bounds, color): void {      
        var path = this.getDot(bounds.topLeft, color);

        var path = this.getDot(bounds.topRight, color);
  
        var path = this.getDot(bounds.bottomLeft, color);
  
        var path = this.getDot(bounds.bottomRight, color);
      }

    static getDot(centerPoint, color): Path.Circle {
        return new Path.Circle({
          center: centerPoint,
          radius: 5,
          fillColor: color
        });
      }

      static drawPolygon(centerPoint, sides, radius, strokeColor, fillColor, rotAngle, skewPoint, label) : Item {
        // console.log('centerPoint',centerPoint.y);
        let drawPoint = new Point(centerPoint);
        let polygon = new Path.RegularPolygon(drawPoint, sides, radius);
        polygon.fillColor = fillColor;
        polygon.strokeColor = strokeColor;
        polygon.rotation = rotAngle;
        polygon.skew(skewPoint);
        
        if (label !== undefined) {
            polygon.onMouseDown = function onEvent(event) {
                //console.log("entered!", event);
                let drawPoint = event.point;
                //adjust to side
                drawPoint.x += 15;
                let textItem = new PointText(drawPoint);
                textItem.content = label;
                textItem.strokeColor = 'black';
                textItem.removeOnUp();
            };
        }

        return polygon;
      }

    static getRandomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }
      
    static draw(name, image, scaleFactor, animate, color, centerPoint, activeLayer) {
        activeLayer.importSVG(image, {expandShapes: true, insert: true, onLoad: function(item) {
          item.name = name;

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

      static drawWithinBounds(name, image, boundary, stretch, animate, color, centerPoint, activeLayer, svgList) {
        activeLayer.importSVG(image, {expandShapes: true, insert: true, onLoad: function(item) {
          item.name = name;
          svgList.push(item);
  
          //position item
          item.position = centerPoint;
  
          let childrenArray = (item as Item).children;
          // console.log("children",childrenArray);
          // let shapePath = childrenArray[0] as Shape;
          // shapePath.visible = true;
          // shapePath.strokeColor = 'red';
          // shapePath.fillColor = 'red';
  
          let compoundPath = childrenArray[1] as CompoundPath;
          // compoundPath.strokeColor = color;
          compoundPath.fillColor = color;

          if (stretch) {
            compoundPath.bounds = boundary;
          }
          
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

      static rotatePieces(image, speed, boundary, stretch, centerPoint, view, activeLayer) {
        activeLayer.importSVG(image, {expandShapes: true, insert: true, onLoad: function(item){
            //position item
            item.position = centerPoint;

          let childrenArray = (item as Item).children;
          let compoundPath = childrenArray[1] as CompoundPath;
          if (stretch) {
            compoundPath.bounds = boundary;
          }
          compoundPath.fitBounds(boundary);
          let pathArray = compoundPath.children as Path[];
          // console.log(pathArray);
  
          view.onFrame = function onFrame(event) {
            if (event.count % speed === 0) {
              pathArray.forEach(function(pathItem) {
                pathItem.rotate(3);
              });
            }
          }
        }});
      }
  
      static growingHair(image, view, activeLayer) {
        activeLayer.importSVG(image, {expandShapes: true, insert: true, onLoad: function(item){
          // console.log((item as Item).children);
          let childrenArray = (item as Item).children;
          let compoundPath = childrenArray[1] as CompoundPath;
          let pathArray = compoundPath.children as Path[];
          // console.log(pathArray);
  
          view.onFrame = function onFrame(event) {
            if (event.count % 8 === 0) {
              pathArray.forEach(function(pathItem) {
                let i = 0;
                let alternate = true;
                pathItem.segments.forEach(function(segItem) {
                  if (alternate) {
                    // randomly move the y position of the segment points:
                    segItem.point.y = segItem.point.y + Math.random();
  
                    // randomly move the x position (less) of the segment points:
                    segItem.point.x = segItem.point.x + PaperUtils.getRandomInRange(-1.0, 1.0);                  
                    alternate = !alternate;
                  }
                  i++;
                });
              });
            }
          }
        }});
      }
  
      static disintegrate(image, speed, boundary, centerPoint, view, activeLayer) {
        activeLayer.importSVG(image, {expandShapes: true, insert: true, onLoad: function(item){
        //position item
        item.position = centerPoint;

          let childrenArray = (item as Item).children;
          let compoundPath = childrenArray[1] as CompoundPath;
          compoundPath.fitBounds(boundary);
          let pathArray = compoundPath.children as Path[];
          // console.log(pathArray);
  
          view.onFrame = function onFrame(event) {
            if (event.count % speed === 0) {
              pathArray.forEach(function(pathItem) {
                let i = 0;
                pathItem.segments.forEach(function(segItem) {
                  // randomly move the position of the segment point:
                  segItem.point.x = segItem.point.x + PaperUtils.getRandomInRange(-1.0,1.0);
                  segItem.point.y = segItem.point.y + PaperUtils.getRandomInRange(-1.0,1.0);
                  i++;
                });
              });
            }
          }
        }});
      }
  
      static wavey(image, speed, boundary, centerPoint, view, activeLayer) {
        activeLayer.importSVG(image, {expandShapes: true, insert: true, onLoad: function(item){
            //position item
            item.position = centerPoint;

          let childrenArray = (item as Item).children;
          let compoundPath = childrenArray[1] as CompoundPath;
          compoundPath.fitBounds(boundary);
          let pathArray = compoundPath.children as Path[];
          
          view.onFrame = function onFrame(event) {
            if (event.count % speed === 0) {
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
  
      static bounce(image, speed, boundary, centerPoint, view, activeLayer) {
        activeLayer.importSVG(image, {expandShapes: true, insert: true, onLoad: function(item){
            //position item
            item.position = centerPoint;

          let childrenArray = (item as Item).children;
          let compoundPath = childrenArray[1] as CompoundPath;
          compoundPath.fitBounds(boundary);

          // The maximum height of the wave:
          var height = 10;
  
          view.onFrame = function onFrame(event) {
            if (event.count % speed === 0) {
              // A cylic value between -1 and 1
              var sinus = Math.sin(event.time * 3);
      
              compoundPath.position.y = compoundPath.position.y + sinus * height;
            }
          }
        }});
      }
  
    static bounceOut(image, speed, boundary, centerPoint, view, activeLayer) {
        activeLayer.importSVG(image, {expandShapes: true, insert: true, onLoad: function(item){
            item.position = centerPoint;
          let childrenArray = (item as Item).children;
          let compoundPath = childrenArray[1] as CompoundPath;
          compoundPath.fitBounds(boundary);
          let pathArray = compoundPath.children as Path[];
  
          // The maximum height of the wave:
          var height = 10;
  
          view.onFrame = function onFrame(event) {
            if (event.count % speed === 0) {
              let nowTime = event.time;
              pathArray.forEach(function(pathItem) {
                // A cylic value between -1 and 1
                var sinus = Math.sin(nowTime * 3);
                pathItem.position.x = compoundPath.position.x + sinus * height;
                pathItem.position.y = compoundPath.position.y + sinus * height;
              });
            }
          }
        }});
      }
  /*
      drawWithRandomColors(image) {
        let that = this;
        this.project.activeLayer.importSVG(image, {expandShapes: true, insert: true, onLoad: function(item){
          // console.log((item as Item).children);
          let childrenArray = (item as Item).children;
          let compoundPath = childrenArray[1] as CompoundPath;
          compoundPath.scale(0.75);
          
          // resize the layer to the canvas size
          that.project.activeLayer.fitBounds(that.project.view.bounds);
  
          let randColor = new Color(Math.random(), Math.random(), Math.random());
          compoundPath.fillColor = randColor;
  
          let pathArray = compoundPath.children as Path[];
          console.log(pathArray);
  
          //set to invisible first
          pathArray.forEach(function(item) {
            item.visible=false;
          });
  
          let count = 0;
          that.project.view.onFrame = function onFrame(event) {
            if (event.count % 8 === 0) {
              if (count < pathArray.length) {
              //if (count === 0) {
                //pathArray[count].segments.splice(100, pathArray[count]//.segments.length-1);
                //pathArray[count].clearHandles;
                pathArray[count].visible = true;
                //console.log(pathArray[count]);
                count++;
              }
            }
          }
        }});
      }
  
      draw(image, scaleFactor, animate, randomColor) {
        let that = this;
        let pic = this.project.activeLayer.importSVG(image, {expandShapes: true, insert: true, onLoad: function(item){
          // console.log((item as Item).children);
          let childrenArray = (item as Item).children;
          let compoundPath = childrenArray[1] as CompoundPath;
  
          if (randomColor) {
          let randColor = new Color(Math.random(), Math.random(), Math.random());
          compoundPath.fillColor = randColor;
          }
  
          // resize the layer to the canvas size
          // var point = new Point(this.project.view.center);
          // var size = new Size(10, 10);
          // var myRectangle = new Path.Rectangle(point, size);
  
          that.project.activeLayer.fitBounds(that.project.view.bounds);
          // that.project.activeLayer.fitBounds(myRectangle);
  
          compoundPath.bounds.center = that.project.view.bounds.center;
          compoundPath.scale(scaleFactor);
  
          if (animate) {
            let pathArray = compoundPath.children as Path[];
  
            //set to invisible first
            pathArray.forEach(function(item) {
              item.visible=false;
            });
  
            let count = 0;
            that.project.view.onFrame = function onFrame(event) {
              if (event.count % 16 === 0) {
                if (count < pathArray.length) {
                  //console.log(pathArray[count]);
                  pathArray[count].visible = true;
                  count++;
                }
              }
            }
          }
        }});
  
        // console.log(pic);
      }
  */

    static zoom(image, speed, boundary, centerPoint, view, activeLayer) {
        // var point = new Point(this.project.view.center);
        // var size = new Size(5, 10);
        // var myRectangle = new Path.Rectangle(point, size);
        // myRectangle.strokeColor = 'black';
  
       activeLayer.importSVG(image, {expandShapes: true, insert: true, onLoad: function(item){
            item.position = centerPoint;

          console.log((item as Item).children);
          let childrenArray = (item as Item).children;
          console.log(childrenArray);
          let compoundPath = childrenArray[1] as CompoundPath;
          compoundPath.fitBounds(boundary);
          console.log(compoundPath);
          let pathArray = compoundPath.children as Path[];
          console.log(pathArray);
  
          compoundPath.scale(0.1);
          compoundPath.bounds.center.y = 370;
  
          let scaleFactor = 1;
          let x = 0.01;
          view.onFrame = function onFrame(event) {
            if (event.count % speed === 0) {
                if (compoundPath.bounds.width < 2500) {
                compoundPath.scale(scaleFactor);
                }
                // if (myRectangle.bounds.width < 200) {
                //   myRectangle.scale(scaleFactor);
                // }
                scaleFactor = scaleFactor + (2*x);
            }
          }
        }});
      }
  
      static zoomInRoom(image, view, activeLayer) {
        //view boundaries
        var viewBoundary = new Path.Rectangle(view.bounds);
        // viewBoundary.fillColor = 'powderblue';
  
        //draw door
        let width = 500;
        let height = 200;
        let topLeftPtDoor = new Point(view.center.x - width/2, view.center.y - height/2);
        let bottomRightDoor = new Point(view.center.x + width/2, view.center.y + height/2);
        var door = new Path.Rectangle(topLeftPtDoor, bottomRightDoor);
        door.strokeColor = 'black';
        door.fillColor = 'white';
  
        //door behavior
        let zoomIn = false;
        let fadeOut = false;
        door.onClick = function onClick(event) {
          zoomIn = true;       
        }
  
        //draw lines
        var topLeftLine = new Path.Line(door.bounds.topLeft, viewBoundary.bounds.topLeft);
        topLeftLine.strokeColor = 'black';
  
        var topRightLine = new Path.Line(door.bounds.topRight, viewBoundary.bounds.topRight);
        topRightLine.strokeColor = 'black';
  
        var bottomLeftLine = new Path.Line(door.bounds.bottomLeft, viewBoundary.bounds.bottomLeft);
        bottomLeftLine.strokeColor = 'black';
  
        var bottomRightLine = new Path.Line(door.bounds.bottomRight, viewBoundary.bounds.bottomRight);
        bottomRightLine.strokeColor = 'black';
  
        //draw pic
        let pic = this.draw("zoomImage", image, 0.25, false, false, view.center, activeLayer);
        console.log(pic);
  
        let scaleFactor = 1;
        let x = 0.01;
        view.onFrame = function onFrame(event) {
          if (zoomIn) {
            if (door.bounds.height > viewBoundary.bounds.height) {
              zoomIn = false;
              fadeOut = true;
            } else {
              scaleFactor = scaleFactor + x;
              door.scale(scaleFactor);
              //pic.scale(scaleFactor);
            }
          } 
  
          if (fadeOut) {
            door.opacity = 0.5;
          }
          // else {
          //   door.scale(0.99);
          //   if (door.bounds.width < 5) {
          //     zoomIn = true;
          //   }
          // }
  
          topLeftLine.bounds.bottomRight = door.bounds.topLeft;
          topRightLine.bounds.bottomLeft = door.bounds.topRight;
          bottomLeftLine.bounds.topRight = door.bounds.bottomLeft;
          bottomRightLine.bounds.topLeft = door.bounds.bottomRight;
  
        }
      }
  
      static testShapes() {
        var myBall = new Path.Circle(new Point(70, 70), 50);
        myBall.fillColor = 'tomato';
  
        // The Path.Rectangle constructor can take a Point and a Size object
        var point = new Point(20, 150);
        var size = new Size(100, 50);
        var myRectangle = new Path.Rectangle(point, size);
        myRectangle.fillColor = 'powderblue';
        
        // The Path.Line constructor takes 2 points, defining the start and end of the line.
        var from = new Point(160, 20);
        var to = new Point(200, 80);
        var straightLine = new Path.Line(from, to);
        straightLine.strokeColor = 'black';
        
        // The Path.Arc constructor takes 3 points, var names describing the obvious.
        var from = new Point(170, 120);
        var through = new Point(200, 180);
        var to = new Point(170, 220);
        var curvedPath = new Path.Arc(from, through, to);
        curvedPath.strokeColor = 'black';
  
        //export as SVG to console
        //console.log(this.project.exportSVG({asString: true}));
      }
  
      static rotatingShape(view) {
        // create the shape
        var point = new Point(20, 150);
        var size = new Size(100, 50);
        var myRectangle = new Path.Rectangle(point, size);
        myRectangle.fillColor = 'powderblue';
  
        view.onFrame = function onFrame(event) {
          // On each frame update, rotate the square by 3 degrees:
          myRectangle.rotate(3);
        }
      }
  
      static animatedShapeAndBall(view) {
        var point = new Point(20, 50);
        var size = new Size(100, 50);
        var myRectangle = new Path.Rectangle(point, size);
        myRectangle.fillColor = 'lightBlue';
          
        var myBall = new Path.Circle(new Point(10, 90), 10);
        myBall.fillColor = 'black';
          
        view.onFrame =function onFrame(event) {
          // Normalise the event.count property to a 0-359 scale
          // then apply some trigonometry so we get some smoothed values
          // just like going round the edge of a circle
          var x = (1 + Math.cos((event.count * 2 % 360)
            * (Math.PI / 180))) * 100 + 10
          var y = (Math.abs(Math.sin((event.count * 4 % 360)
            * (Math.PI / 180)))) * 80;
          myRectangle.position.x = x;
          myBall.position.x = x;
          myBall.position.y = 90 - y;
        }
      }
  /*
      static squareSymbolsRotating(view) {
        var squarePath = new Path.Rectangle(new Point(20, 20), new Size(20, 20));
        squarePath.fillColor = 'aquamarine';
        let squareSymbol = Symbol();
        var opacityStep = -0.01;
        squareSymbol.definition.opacity = 1.0;
  
        // lets place some squares using symbols, and rotate each instance slightly
        for (var i = 0; i < 5; i++) {
          var placedSymbol = squareSymbol.place(new Point(20 + (i * 40), 50));
          placedSymbol.rotate(i * 10); // operation on the instance
        }
  
        view.onFrame = function onFrame(event) {
          // Add 1 degree to the hue
          // of the symbol definition's fillColor:
          (squareSymbol.definition.fillColor as Color).hue += 1;
  
          // squareSymbol.definition.opacity += opacityStep;
          // if (squareSymbol.definition.opacity >= 1.0 || 
          //   squareSymbol.definition.opacity <= 0.0) {
          //   opacityStep = opacityStep * -1;
          // }
          
          // rotate
          squareSymbol.definition.rotate(0.2);
        }
      }
  
      static randomStarWallpaper(view) {
        var star = new Path.Star(new Point(0, 0), 6, 5, 13);
        star.style = {
            fillColor: 'powderblue',
            strokeColor: 'black'
        };
  
        this.randomWallpaper(star, view);
      }
  
      static wallpaper(image, view, activeLayer) {
        let that = this;
        activeLayer.importSVG(image, {expandShapes: true, insert: true, onLoad: function(item){
          let childrenArray = (item as Item).children;
          let compoundPath = childrenArray[1] as CompoundPath;
  
          compoundPath.scale(0.5);
  
          let randColor = new Color(Math.random(), Math.random(), Math.random());
  
          compoundPath.fillColor=randColor;
  
          that.randomWallpaper(item, view);
        }});
      }
  
      static randomWallpaper(path, view) {
        // Create a symbol definition from the path:
        var definition = new Symbol(path);
        var opacityStep = 0.01;
        definition.definition.opacity = 1.0;
  
        // Place 100 instances of the symbol definition:
        for (var i = 0; i < 100; i++) {     
            // Place an instance of the symbol definition in the project:
            var instance = definition.place();
  
            // Move the instance to a random position within the view:
            var randPoint = Point.random();
            instance.position.x = randPoint.x * view.viewSize.width;
            instance.position.y = randPoint.y * view.viewSize.height;
            // Rotate the instance by a random amount between
            // 0 and 360 degrees:
            instance.rotate(Math.random() * 360);
  
            // Scale the instance between 0.25 and 1:
            instance.scale(0.25 + Math.random() * 0.75);
        }
  
        // this.project.view.onFrame = function onFrame(event) {
        //   // rotate (this will drive up processing!)
        //   //definition.definition.rotate(0.2);
  
        //   //opacity
        //   // definition.definition.opacity += opacityStep;
        //   // if (definition.definition.opacity >= 1.0 || 
        //   //   definition.definition.opacity <= 0.0) {
        //   //   opacityStep = opacityStep * -1;
        //   // }
  
        //   // Add 1 degree to the hue
        //   // of the symbol definition's fillColor:
        //   (definition.definition.fillColor as Color).hue += 1;
        // }
      }
      */
}