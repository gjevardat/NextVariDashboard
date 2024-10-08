import { run, source } from "../types";

export type dataselection = {
    selectedRun: run | null,
    selectedSources: bigint[]
}


type State = {
    dataselection: dataselection,
    selectedTags: string[]
    pageIndex: number;
    availableRuns: run[];
    gridSize: { x: number; y: number };
};

type Action =
    | { type: 'SET_SELECTED_RUN'; payload: run|null  }
    | { type: 'SET_SELECTED_SOURCES'; payload: bigint[] }
    | { type: 'SET_DATA_SELECTION'; payload: dataselection  }
    | { type: 'SET_PAGE_INDEX'; payload: number }
    | { type: 'SET_AVAILABLE_RUNS'; payload: run[] }
    | { type: 'SET_GRID_SIZE'; payload: { x: number; y: number } }
    | { type: 'SET_TS_TAGS'; payload:  string[] }
;

export const InitialTimeSeriesBrowseState: State = {
    dataselection:{selectedRun:null, selectedSources:[]},
    selectedTags: [],
    pageIndex: 0,
    availableRuns: [],
    gridSize: { x: 1, y: 1 },
  };


  export const TimeSeriesBrowseStateReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_SELECTED_RUN':
            return {
                ...state,
                dataselection: {
                    ...state.dataselection, 
                    selectedRun: action.payload,
                },
            };
        case 'SET_SELECTED_SOURCES':
            return {
                ...state,
                dataselection: {
                    ...state.dataselection, 
                    selectedSources: action.payload, 
                },
            };
        case 'SET_DATA_SELECTION':
            return { 
                ...state, 
                dataselection: action.payload, 
            };
        case 'SET_PAGE_INDEX':
            return { ...state, pageIndex: action.payload };
        case 'SET_AVAILABLE_RUNS':
            return { ...state, availableRuns: action.payload };
        case 'SET_GRID_SIZE':
            return { ...state, gridSize: action.payload };
        default:
            return state;
    }
};