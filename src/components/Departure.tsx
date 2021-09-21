import * as React from 'react';
import moment from 'moment';

import { Schedule, Route } from '../helpers/types';

const formatTrip = (trip:string) => trip.split('-')[2];

export const Departure = ({schedule, route, status}: {schedule: Schedule, route:Route, status: string}) => (
  <div className="departure">
    <div>{moment(schedule.attributes.departure_time).format('hh:mmA')}</div>
    <div>{route.attributes.long_name}</div>
    <div>{formatTrip(schedule.relationships.trip.data.id)}</div>
    <div>{status}</div>
  </div>
)