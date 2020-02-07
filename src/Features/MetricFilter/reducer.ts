import { createSlice, PayloadAction } from 'redux-starter-kit';

export type SelectedFilter = {
  selectedFilter: string
}

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  filters: {
    filters: [' ']
  },
}

const filterSlice = createSlice({
  name: 'filter',
  initialState: initialState.filters,
  reducers: {
    addFilter: (state, action: PayloadAction<SelectedFilter>) => {
      const { selectedFilter } = action.payload;
      state.filters.push(selectedFilter)
    },
    removeFilter: (state, action: PayloadAction<SelectedFilter>) => {
      const { selectedFilter } = action.payload;
      state.filters = state.filters
        .filter(filter => { if (filter !== selectedFilter) return true; return false})
    },
    filterApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const filterReducer = filterSlice.reducer;
export const filterActions = filterSlice.actions;