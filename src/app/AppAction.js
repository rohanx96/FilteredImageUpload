//@flow weak
export const ACTION_TYPE = {
  openBottomSheet: "OPEN_BOTTOMSHEET",
  closeBottomSheet: "CLOSE_BOTTOMSHEET",
};

export function openBottomSheet(
  renderBottomsheet,
  isBackClose,
  isTouchoutsideClose
) {
  return {
    type: ACTION_TYPE.openBottomSheet,
    payload: {
      renderBottomsheet: renderBottomsheet,
      isBackClose: isBackClose,
      isTouchoutsideClose: isTouchoutsideClose
    }
  };
}

export function closeBottomSheet() {
  return {
    type: ACTION_TYPE.closeBottomSheet,
    payload: () => {}
  };
}
