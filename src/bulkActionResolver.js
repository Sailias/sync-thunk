// The action map should look like:
// {
//   asyncStatus: { action: actions.setAsyncStatus, reducer: asyncStatusReducer }
// }
// asyncStatus = state.key
// action: action that is called that populates that state
// reducer: the reducer that is used to reduce that state

import actionMapLoader from './actionMap';

// Empty action to dispatch so that we can add more calls on top of this to resolve
// All actions are dispatched sequentially, so we need one to start with
function emptyAction() {
  return function(dispatch) {
    return Promise.resolve(1);
  }
}

function shouldCallAction(dep, stateVal) {
  return dep.reload || !stateVal || Object.keys(stateVal).length === 0;
}

export default function(dispatch, getState, dependencies) {

  const actionMap = actionMapLoader();

  // If we're already resolving a bunch of dependencies, don't do this again
  if(getState().asyncStatus)
    return;

  if(actionMap.asyncStatus) {
    // Set the dispatch to show we're resolving a bunch of actions
    dispatch(actionMap.asyncStatus.action(true));
  }

  // Create a list of all the required actions.
  // If they need to be reloaded, then add them to the call stack
  // If they are already in the state, then don't add them
  let requiredActions = [];

  dependencies.forEach(dep => {
    const stateVal = getState()[dep.state];

    if(shouldCallAction(dep, stateVal))
      requiredActions.push({action: actionMap[dep.state].action, params: dep.params});
  });

  // Load all calls sequentially
  // Some future calls rely on the response and setting in the store of previous ones
  return requiredActions.reduce((sequence, actionObj) => {
    return sequence.then(() => dispatch(actionObj.action(actionObj.params)))
  }, dispatch(emptyAction()));


}