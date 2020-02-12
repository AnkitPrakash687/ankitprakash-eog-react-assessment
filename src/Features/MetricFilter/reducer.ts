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
    setFilter: (state, action: PayloadAction<{filters:string[]}>) => {
        state.filters = action.payload.filters
    },
    filterApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const filterReducer = filterSlice.reducer;
export const filterActions = filterSlice.actions;

