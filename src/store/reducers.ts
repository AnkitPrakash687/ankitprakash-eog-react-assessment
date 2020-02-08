import { reducer as weatherReducer } from '../Features/Weather/reducer';
import { filterReducer, filterInputReducer, openMetricListReducer, 
  resultFilterListReducer } from '../Features/MetricFilter/reducer';

export default {
  weather: weatherReducer,
  filter: filterReducer,
  filterInput: filterInputReducer,
  openMetricList: openMetricListReducer,
  resultFilterList: resultFilterListReducer
};
