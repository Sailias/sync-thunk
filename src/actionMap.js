let actionMap = {};

export default function(userMapping) {
  if(userMapping) {
    actionMap = { ...userMapping };
    return actionMap;
  }
  else
    return actionMap;
}