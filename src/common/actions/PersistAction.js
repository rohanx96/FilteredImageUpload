//@flow weak
export const ACTION_TYPE = {
  setPrimaryFilter: "SET_PRIMARY_FILTER",
  setCustomer: "SET_CUSTOMER"
};

export function setPrimaryFilter(data) {
  return {
    type: ACTION_TYPE.setPrimaryFilter,
    payload: data
  };
}

export function setCustomer(data) {
  return {
    type: ACTION_TYPE.setCustomer,
    payload: data
  };
}
