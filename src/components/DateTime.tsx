import * as React from 'react';
import moment from 'moment';

export const CurrentTime = ({now}: {now: moment.Moment}) => (
  <div className="datetime">
      CURRENT TIME
      <div>{now.format('LT')}</div>
    </div>
);

export const CurrentDate = ({now}: {now: moment.Moment}) => (
  <div className="datetime">
    <div>{now.format('dddd')}</div>
    <div>{now.format('MM-DD-YYYY')}</div>
</div>
)