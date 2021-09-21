export type Route = {
  id:string;
  attributes:{
    desription:string;
    long_name:string;
    color:string;
    direction_destinations:string[];
  }
}
export type Schedule = {
  id:string;
  attributes:{
    departure_time:string;
  };
  relationships: {
    route: {
      data: {
        id: string;
        type: 'route';
      }
    },
    stop: {
      data: {
        id: string;
        type: 'stop'
      }
    },
    trip: {
      data: {
        id: string;
        type: 'trip';
      }
    }
  }
}
export type Departures = {
  [routeId: string]: Schedule;
}
export type Prediction = {
  attributes: {
    status: "On time";
  };
  id: string;
  type: "prediction";
  relationships: {
    route: {
      data: {
        id: string;
        type: "route";
      };
    };
    stop: {
      data: {
        id: string;
        type: "stop";
      };
    };
    trip: {
      data: {
        id: string;
        type: "trip";
      };
    };
    schedule: {
      data: {
        id: string;
        type: 'schedule';
      };
    };
  };
}
export type Predictions = {
  [tripId:string]:Prediction;
}