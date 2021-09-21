import moment  from 'moment';

import * as React from 'react';
import * as types from './types';
import * as constants from './constants';
import * as reducers from './reducers';
import { getJson, isEmpty } from './functions';


export const useRoutes = () => {
  let [routes, setRoutes] = React.useState<types.Route[]>([]);

  React.useEffect(() => {
    // Fetch all CommuterRail Routes
    const url_routes = `${constants.MBTA_HOST}/routes?api_key=${constants.SECRET_KEY}&filter[type]=2`;
    getJson(url_routes, routes => {setRoutes(routes as types.Route[])})
  }, [])

  return routes;
}


export const useSchedules = (routes:types.Route[]) => {
  let [schedules, setSchedules] = React.useState<types.Schedule[]>([]);

  React.useEffect(() => {
    if(isEmpty(routes)){ return; }
    // Fetch starting outbound Schedules for fetched Routes
    const filterRoutes = routes.map(r=>r.id).join(',');
    const filterStops = `${constants.STATION_NORTH_ID},${constants.STATION_SOUTH_ID}`;
    const outbound = '0';

    const urlSchedules = `${constants.MBTA_HOST}/schedules?api_key=${constants.SECRET_KEY}&filter[direction_id]=${outbound}&filter[stop]=${filterStops}&filter[route]=${filterRoutes}`;
    getJson(urlSchedules, schedules => {
      setSchedules(schedules as types.Schedule[]);
    })
  }, [routes])

  return schedules;
}


export const usePredictions = (schedules:types.Schedule[], selectedStation:string) => {
  let [predictions, setPredictions] = React.useState<types.Predictions>({})

  const selectedStationId = React.useCallback(() => {
    return (selectedStation === constants.STATION_NORTH)? constants.STATION_NORTH_ID : constants.STATION_SOUTH_ID
  }, [selectedStation])

  const initPredictions = React.useCallback(()=>{
      return (event:MessageEvent) => {
        const data = JSON.parse(event.data) as types.Prediction[];
        const newPredictions = reducers.mapPredictionByTripId(data);
        setPredictions(newPredictions);
      }
  }, [])
      
  const singlePrediction = React.useCallback(() => {
    return (event:MessageEvent) => {
      const prediction = JSON.parse(event.data) as types.Prediction;
      const newPredictions = {...predictions};
      const tripId = prediction.relationships.trip.data.id;
      newPredictions[tripId] = prediction;
      setPredictions(newPredictions);
    }
  },[predictions])
  
  const removePrediction = React.useCallback(() => {
    return (event:MessageEvent) => {
      const toRemove = JSON.parse(event.data) as {id: string, type:'prediction'};
      const entries = Object.entries(predictions).filter(([tripId,prediction]) => {
        return prediction.id !== toRemove.id;
      })
      const newPredictions = Object.fromEntries(entries);
      setPredictions(newPredictions);
    }
  },[predictions])

  React.useEffect(() => {
    if (isEmpty(schedules)) return;
    const stationId = selectedStationId();
    // reduce to fetch list of tripIds for desired schedule items
    const filterTripIds = reducers.schedulesToTripIds(schedules, stationId).join(',')
    const outbound = '0';

    // open stream to watch for updates and delays.
    const urlPredictions = `${constants.MBTA_HOST}/predictions/?api_key=${constants.SECRET_KEY}&filter[direction_id]=${outbound}&filter[stop]=${stationId}&filter[trip]=${filterTripIds}`;
    const evtSource = new EventSource(urlPredictions);
    evtSource.addEventListener('reset', initPredictions as EventListener);
    evtSource.addEventListener('add', singlePrediction as EventListener);
    evtSource.addEventListener('update', singlePrediction as EventListener);
    evtSource.addEventListener('remove', removePrediction as EventListener);
    
    // effect cleanup
    return () => {
      evtSource.close();
    }
  }, [schedules, selectedStationId, initPredictions, singlePrediction, removePrediction])

  return predictions;
}


export const useIntervalMoment = (seconds: number) => {
  let [time, setTime] = React.useState<moment.Moment>(moment());
  setInterval(() => {setTime(moment())}, seconds * 1000);
  return time;
}