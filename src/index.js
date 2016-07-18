import actionMap from './actionMap';
import syncMyThunks from './bulkActionResolver';
import getReducerMap from './reducerMap';

export default {
  setActionMap: actionMap,
  sync: syncMyThunks,
  getReducerMap
}