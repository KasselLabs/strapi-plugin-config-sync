/**
 *
 * Main reducer
 *
 */

import { fromJS, Map } from 'immutable';
import { SET_DATABASE_CONFIG_IN_STATE, SET_FILE_CONFIG_IN_STATE } from '../../actions/Config';

const initialState = fromJS({
  databaseConfig: Map({}),
  fileConfig: Map({})
});

export default function configReducer(state = initialState, action) {
  switch (action.type) {
    case SET_DATABASE_CONFIG_IN_STATE:
      return state
        .update('databaseConfig', () => fromJS(action.config))
    case SET_FILE_CONFIG_IN_STATE:
      return state
        .update('fileConfig', () => fromJS(action.config))
    default:
      return state;
  }
}