import actionMapLoader from './actionMap';

export default function() {
  const actionMap = actionMapLoader();

  let obj = {};
  
  Object.keys(actionMap).forEach(key => {
    obj[key] = actionMap[key].reducer
  });

  return obj;
}