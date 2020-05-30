import { Point, Group } from "paper";
import { SleepPhase } from "./sleepUtils";
import PaperUtils from "../svgsketch/paperUtils";

export default class DrawUtils {
    constructor() {
    }
      static calcRadius(summaryPhase : SleepPhase) : number {
        return Math.sqrt(summaryPhase.minutes) * 5;
      }

      static drawPolygonStack(sleepPhase: SleepPhase, centerPoint, sides, strokeColor, fillColor, colorTopPolygon, rotAngle, skewPoint, thickness) : Group {
        if (sleepPhase.minutes === 0) {
            //if no minutes then don't draw this stack
            return null;
        }

        //use square root because radius grows by squaring; we want to keep the overall size more relative
        let radius = this.calcRadius(sleepPhase);
        //sometimes in simplified summaries, the count can be 0 even though the minutes are non-zero. Use 2 in that case so it doesn't look completely flat.
        let height = (sleepPhase.count === 0) ? 2 : sleepPhase.count;
        let drawPoint = new Point(centerPoint);
        let label = undefined;
       
        let polygons = new Array();

        for (let i = 0; i < height; i++) {
            //check for last one
            if (i === height-1) {
                fillColor = colorTopPolygon ? strokeColor : fillColor;
                label = sleepPhase.phase + "\n" + sleepPhase.minutes + " min\n" + sleepPhase.count + " times\n" + sleepPhase.date;
            }

            let polygon = PaperUtils.drawPolygon(drawPoint, sides, radius, strokeColor, fillColor, rotAngle, skewPoint, label);
            polygons.push(polygon);

            //thickness of each polygon
            drawPoint.y -= thickness;
        }

/*
        //draw two polygons
        let polygon = this.drawPolygon(drawPoint, sides, radius, strokeColor, fillColor, rotAngle, skewPoint, label);
        polygons.push(polygon);
        //thickness of each polygon
        drawPoint.y -= height/2;
        fillColor = colorTopPolygon ? strokeColor : fillColor;
        label = sleepPhase.phase + "\n" + sleepPhase.minutes + " min\n" + sleepPhase.count + " times\n" + sleepPhase.date;
        polygon = this.drawPolygon(drawPoint, sides, radius, strokeColor, fillColor, rotAngle, skewPoint, label);
        polygons.push(polygon);
*/
        //return one group of items/polygons
        return new Group(polygons);
      }
}