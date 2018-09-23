//@flow weak
export const ACTION_TYPE = {
  setPrimaryFilter : 'SET_PRIMARY_FILTER',
}

export function setPrimaryFilter(data){
  return{
    type : ACTION_TYPE.setPrimaryFilter,
    payload : data
  }
}
