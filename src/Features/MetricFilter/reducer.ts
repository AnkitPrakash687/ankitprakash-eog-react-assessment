import { createSlice, PayloadAction } from 'redux-starter-kit';

export type MetricFilter = {
  selectedFilter: string;
};
export type ApiErrorAction = {
  error: string;
};
export type Metrics = {
  metrics: string[];
};
export type OpenMetricList = {
  openMetricList: boolean;
};

export type ResultFilterList = {
  resultFilterList: string[];
};

const initialState = {
  filters: [''],
};

const filterSlice = createSlice({
  name: 'filter',
  initialState: initialState,
  reducers: {
    addFilter: (state, action: PayloadAction<MetricFilter>) => {
      const { selectedFilter } = action.payload;
      if(selectedFilter !== ''){
      state.filters.push(selectedFilter);
      }
    },
    removeFilter: (state, action: PayloadAction<MetricFilter>) => {
      const { selectedFilter } = action.payload;
      state.filters = state.filters.filter(filter => {
        if (filter !== selectedFilter) return true;
        return false;
      });
    },

    clearAll: (state) => {
      state.filters = [''];
    },
    filterApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const filterReducer = filterSlice.reducer;
export const filterActions = filterSlice.actions;

