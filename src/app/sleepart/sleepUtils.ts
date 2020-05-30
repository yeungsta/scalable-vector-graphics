import SleepData from '../../assets/sleep/sleep-2018-12-10.json';

export class SleepPhase {
    date: string;
    phase: string;
    minutes: number;
    count: number;
    
    constructor(date: string, phase: string, minutes: number, count: number) {
        this.date = date;
        this.phase = phase;
        this.minutes = minutes;
        this.count = count;
    }
}

export default class SleepUtils {
    constructor() {
        //console.log(SleepData);
    }

    //returns all sleep sessions available from files
    static getSleepSessions(skipSimplified: boolean): string[] { 
        let sleepSessions = new Array();

        SleepData.forEach(function(item) {
            if (!((skipSimplified) && ((item.levels.summary.restless !== undefined) || 
            (item.levels.summary.awake !== undefined) || (item.levels.summary.asleep !== undefined)))) {
                sleepSessions.push(item);
            }
          });

        console.log("before length", sleepSessions.length);
        sleepSessions = sleepSessions.concat(sleepSessions);
        console.log("after length", sleepSessions.length);
        // sleepSessions = sleepSessions.concat(sleepSessions);
        // console.log("after length 2", sleepSessions.length);

        //pass reverse into chronological order
        return sleepSessions.reverse();
    }

    static getSleepSession(dateOfSleep: string): string { 
        let sleepSession = undefined;

        console.log('getSleepSession called for:', dateOfSleep);
        //console.log(SleepData);
        
        SleepData.forEach(function(item) {
            if (item.dateOfSleep === dateOfSleep) {
                //console.log('found: ', item.dateOfSleep);
                // console.log('summary: ', item.levels.summary);
                sleepSession = item;
            }
          });

        return sleepSession;
    }

    static getSleepPhases(sleepSession): SleepPhase[] { 
        let sleepPhaseArray = new Array();

        //gather sleep phases
        for (let phase in sleepSession.levels.summary) {
            // console.log("SleepPhase", phase);
            // console.log(sleepSession.levels.summary[phase]);
            sleepPhaseArray.push(new SleepPhase(sleepSession.dateOfSleep, phase, 
                sleepSession.levels.summary[phase].minutes, sleepSession.levels.summary[phase].count));
        };

        //sort by descending minutes
        function comparePhases(a,b) {
            if (a.minutes < b.minutes)
            return 1;
            if (a.minutes > b.minutes)
            return -1;
            return 0;
        }
  
        sleepPhaseArray.sort(comparePhases);

        return sleepPhaseArray;
    }
}