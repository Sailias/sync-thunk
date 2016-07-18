## Sync Thunk

Use case:

  * Go to a `react-router` page and you need the following API calls:
    *  GET /user
    *  GET /courses (which uses the user.id)


#### Solutions

Use Relay.  Great.  Done, close the tab viewing this repo now.

What if you're consuming a traditional API?  We can use `Thunks` to do our API calls in our action layer prior to dispatching.  How do we chain `Thunks`?

#### By using `sync-thunk`

I think state, actions and reducers are all related.  We dispatch actions, that make API calls which then dispatch actions to trigger reducers.

I like to think of this structure like:

```
const actionMap = {
  user: { action: actions.loadUser, reducer: userReducer },
  courses: { action: actions.loadCourses, reducer: courseReducer }
}
```

I feel all actions should use `state` to load their required data before making an API call.

#### Implementation


``` reducers/index.js
import { combineReducers } from 'redux';
import syncThunk from 'sync-thunk';
import actions from 'actions';
...

syncThunk.setActionMap(actionMap);
combineReducers(syncThunk.getReducerMap());
```

``` actions/pages/home.js
import syncThunk from 'sync-thunk';

export default function() {
  return (dispatch, getState) => {
    syncThunk.syncMyThunks(dispatch, getState, [
      user,
      courses
    ])
  }
}

```

``` actions/userAction.js
export default function() {
  return (dispatch) => fetch('/user').then(userResponse => 
    dispatch(setUserInStore(userResponse))
  )
}
```

``` actions/courseActions.js
export default function() {
  return (dispatch, getState) => {
    const { user } = getState();
    
    return fetch(`/user/${user.id}/courses`).then(coursesResponse => 
      dispatch(setCoursesInStore(coursesResponse))
    )
  }
}
```


