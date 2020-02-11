import { reducer as weatherReducer } from '../Features/Weather/reducer';
import { filterReducer } from '../Features/MetricFilter/reducer';

export default {
  weather: weatherReducer,
  filter: filterReducer,
};
