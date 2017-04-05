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
};
```

I feel all actions should use `state` to load their required data before making an API call.

#### Implementation

reducers/index.js
``` 
import { combineReducers } from 'redux';
import syncThunk from 'sync-thunk';
import actions from 'actions';
...

syncThunk.setActionMap(actionMap);
combineReducers(syncThunk.getReducerMap());
```

actions/pages/home.js
``` 
import syncThunk from 'sync-thunk';

export default function(params = {}) {
  return (dispatch, getState) => {
    syncThunk.sync(dispatch, getState, [
      { state: 'user' },
      { state: 'courses', 
        reload: true,   // reload this state every time even if it's already populated
        params: params.program  // if loaders require additional information from props, pass them as parameters 
      } 
    ])
  }
}

```

actions/userAction.js
``` 
export default function() {
  return (dispatch) => fetch('/user').then(userResponse => 
    dispatch(setUserInStore(userResponse))
  )
}
```

actions/courseActions.js
``` 
export default function() {
  return (dispatch, getState) => {
    const { user } = getState();
    
    return fetch(`/user/${user.id}/courses`).then(coursesResponse => 
      dispatch(setCoursesInStore(coursesResponse))
    )
  }
}
```

#### Using it in your components

SyncThunk will check the value of your state keys to see if the value is already loaded, if it is, it won't make the API call again.  If it's not, it will make the API call then move on to the next required state key.
This allows you to not reload any already loaded data, or reload it all if necessary (Page refresh).

Now all we do is create Thunks that load exactly what they need to set their state, and we create components that specify which states they need loaded!

components/views/Home.js
```
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from 'actions';

class Home extends React.Component {
  componentWillMount() {
    this.props.homeLoader(
      program: {
        id: 5,
      }
    });
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    courses: state.courses,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    homeLoader: actions.homeLoader
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);

```



