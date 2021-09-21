import * as React from "react";

import "../styles/App.scss";

import * as reducers from "../helpers/reducers"
import * as constants from '../helpers/constants';
import * as hooks from '../helpers/hooks';

import { Departure } from './Departure';
import { Header } from './Header';
import { Selector } from './Selector';
import { CurrentTime, CurrentDate } from "./DateTime";

export type SelectedStation = typeof constants.STATION_NORTH | typeof constants.STATION_SOUTH;

export const App = () => {

  let [selectedStation, setSelectedStation] = React.useState<SelectedStation>(constants.STATION_NORTH);

  const routes = hooks.useRoutes();
  const schedules = hooks.useSchedules(routes);
  const predictions = hooks.usePredictions(schedules, selectedStation);
  const now = hooks.useIntervalMoment(10);

  const departures = reducers.mapDeparturesByRouteId(schedules);

  return (
    <div className="App">
      <div className="title">
        <CurrentDate now={now}/>
        <div>
          <h2>{selectedStation} Train Information</h2>
          <Selector<SelectedStation>
            options={[constants.STATION_SOUTH, constants.STATION_NORTH]}
            defaultValue={selectedStation} 
            onChange={setSelectedStation}/>
        </div>
        <CurrentTime now={now}/>
      </div>
      <Header/>
      {routes
        .filter(r => r.attributes.direction_destinations.includes(selectedStation))
        .map(route => {
          if (route.id in departures) {
            const schedule = departures[route.id];
            const tripId = schedule.relationships.trip.data.id
            const status = (tripId in predictions) ? predictions[tripId].attributes.status : 'On time';
            return <Departure key={route.id} schedule={schedule} route={route} status={status}/>
          }
          return null;
        })
      }
    </div>
  );
};

export default App;
