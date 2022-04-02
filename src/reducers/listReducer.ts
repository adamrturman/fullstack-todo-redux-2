import { StoreState, TodoAction } from "../interfaces";

const initialState: StoreState = {list: []};

export const listReducer = (state: StoreState = initialState, action: TodoAction) => {
  switch (action.type) {
    case 'SET_LIST':
      return {list: action.payload};
    default:
      return state;
  }
};
