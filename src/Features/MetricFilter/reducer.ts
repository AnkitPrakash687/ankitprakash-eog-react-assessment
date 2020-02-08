import { createSlice, PayloadAction } from 'redux-starter-kit';

export type SelectedFilter = {
  selectedFilter: string;
};
export type ApiErrorAction = {
  error: string;
};
export type FilterInput = {
  filterInput: string;
};
export type OpenMetricList = {
  openMetricList: boolean;
};

export type ResultFilterList = {
  resultFilterList: string[];
};

const initialState = {
  filters: {
    filters: [''],
  },
  filterInput: {
    filterInput: '',
  },
  openMetricList: {
    openMetricList: false,
  },
  resultFilterList: {
    resultFilterList: [''],
  },
};

const filterSlice = createSlice({
  name: 'filter',
  initialState: initialState.filters,
  reducers: {
    addFilter: (state, action: PayloadAction<SelectedFilter>) => {
      const { selectedFilter } = action.payload;
      state.filters.push(selectedFilter);
    },
    removeFilter: (state, action: PayloadAction<SelectedFilter>) => {
      const { selectedFilter } = action.payload;
      state.filters = state.filters.filter(filter => {
        if (filter !== selectedFilter) return true;
        return false;
      });
    },
    clearAll: (state, action: PayloadAction<SelectedFilter>) => {
      state.filters = [];
    },
    filterApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

const filterInputSlice = createSlice({
  name: 'filterInput',
  initialState: initialState.filterInput,
  reducers: {
    filterInput: (state, action: PayloadAction<FilterInput>) => {
      const { filterInput } = action.payload;
      state.filterInput = filterInput;
    },
  },
});

const openMetricListSlice = createSlice({
  name: 'openMetricList',
  initialState: initialState.openMetricList,
  reducers: {
    openMetricList: (state, action: PayloadAction<OpenMetricList>) => {
      const { openMetricList } = action.payload;
      state.openMetricList = openMetricList;
    },
  },
});

const resultFilterListSlice = createSlice({
  name: 'resultFilterList',
  initialState: initialState.resultFilterList,
  reducers: {
    resultFilterList: (state, action: PayloadAction<ResultFilterList>) => {
      const { resultFilterList } = action.payload;
      state.resultFilterList = resultFilterList;
    },
  },
});

export const filterReducer = filterSlice.reducer;
export const filterActions = filterSlice.actions;

export const filterInputReducer = filterInputSlice.reducer;
export const filterInputActions = filterInputSlice.actions;

export const openMetricListReducer = openMetricListSlice.reducer;
export const openMetricListActions = openMetricListSlice.actions;

export const resultFilterListReducer = resultFilterListSlice.reducer;
export const resultFilterListActions = resultFilterListSlice.actions;
