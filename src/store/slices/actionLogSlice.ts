import { createSlice, UnknownAction } from '@reduxjs/toolkit';

export interface LogEntry {
  id: number;
  type: string;
  payload: string;
}

export interface ActionLogState {
  entries: LogEntry[]; // La más reciente primero
  counter: number;
}

const MAX_ENTRIES = 20;

const initialState: ActionLogState = {
  entries: [],
  counter: 0,
};

type TrackedAction = UnknownAction & { payload?: unknown };

// Matcher: captura cualquier acción de los slices stats/ e inventory/
// sin que esos slices sepan que existe un log (bajo acoplamiento).
const isTrackedAction = (action: UnknownAction): action is TrackedAction =>
  action.type.startsWith('stats/') || action.type.startsWith('inventory/');

const formatPayload = (payload: unknown): string =>
  payload === undefined ? '—' : typeof payload === 'string' ? payload : JSON.stringify(payload);

const actionLogSlice = createSlice({
  name: 'actionLog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(isTrackedAction, (state, action) => {
      state.counter += 1;
      state.entries.unshift({
        id: state.counter,
        type: action.type,
        payload: formatPayload(action.payload),
      });
      if (state.entries.length > MAX_ENTRIES) {
        state.entries.length = MAX_ENTRIES;
      }
    });
  },
});

export default actionLogSlice.reducer;
