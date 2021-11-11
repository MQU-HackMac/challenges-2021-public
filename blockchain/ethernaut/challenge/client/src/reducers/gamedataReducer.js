import * as actions from '../actions';

const initialState = {
  hackmacAddress: undefined,
  activeLevel: undefined,
  levels: []
}

const gameDataReducer = function(state = initialState, action) {
  switch(action.type) {

    case actions.LOAD_GAME_DATA:
      return {
        ...state,
        levels: action.levels,
        hackmacAddress: action.hackmacAddress
      }

    case actions.ACTIVATE_LEVEL:
      return {
        ...state,
        activeLevel: action.activeLevel
      }

    case actions.DEACTIVATE_LEVEL:
      return {
        ...state,
        activeLevel: undefined
      }

    default:
      return state
  }
}

export default gameDataReducer