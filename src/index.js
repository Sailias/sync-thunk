import actionMap from './actionMap';
import sync from './bulkActionResolver';
import getReducerMap from './reducerMap';

export default {
  setActionMap: actionMap,
  sync,
  getReducerMap
}