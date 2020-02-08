import { spawn } from 'redux-saga/effects';
import weatherSaga from '../Features/Weather/saga';
import filterSaga from '../Features/MetricFilter/saga'

export default function* root() {
  yield spawn(weatherSaga);
  yield spawn(filterSaga)
}
