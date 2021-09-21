import * as types from './types';
import * as constants from './constants';

export const mapDeparturesByRouteId = (schedules:types.Schedule[]) => {
  // Reduce list of schedules to a map of route.id to the next upcomming schedule.
  return schedules.reduce((accum:{[key: string]: types.Schedule}, sch) => {
    if(sch.relationships.route.data.id in accum) {
      // Already have next upcomming departure.
      return accum;
    }
    const dep:any = new Date(sch.attributes.departure_time);
    const now:any = new Date();
    if (dep - now > 0) {
      accum[sch.relationships.route.data.id] = sch;
    }
    return accum;
  }, {})
}


export type SelectedStationId = typeof constants.STATION_NORTH_ID | typeof constants.STATION_SOUTH_ID;

const reduceSchedulesToTripCounts = (schedules:types.Schedule[], stop:SelectedStationId) => {
  return schedules.reduce<{[tripId:string]:number}>((accum, schedule) => {
    if (stop !== schedule.relationships.stop.data.id){
      // only fetch schedule trips for matching stop
      return accum
    }

    const tripId = schedule.relationships.trip.data.id;
    if (! (tripId in accum) ){
      accum[tripId] = 0;
    }
    accum[tripId]++;
    return accum;
  }, {});
}

export const schedulesToTripIds = (schedules:types.Schedule[], stop:SelectedStationId) => {
  const tripCounts = reduceSchedulesToTripCounts(schedules, stop);
  return Object.keys(tripCounts);
}

export const mapPredictionByTripId = (predictions: types.Prediction[]) => {
  return predictions.reduce<types.Predictions>((accum, prediction)=> {
    accum[prediction.relationships.trip.data.id] = prediction;
    return accum;
  }, {});
}
