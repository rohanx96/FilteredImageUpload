//@flow
import { connect } from "react-redux";
import TakePicture from "./TakePictureComponent";
import { getHubs, getDealers } from "./TakePictureAction";
import { setPrimaryFilter } from "./../common/actions/PersistAction";
import { closeBottomSheet, openBottomSheet } from "./../app/AppAction";

const mapStateToProps = state => ({
  selectedPrimaryFilter: state.persist.selectedPrimaryFilter,
  hubs: state.takePicture.hubs,
  dealers: state.takePicture.dealers
});

const mapDispatchToProps = dispatch => ({
  openBottomSheet: (renderBottomsheet, isBSBackClose) =>
    dispatch(openBottomSheet(renderBottomsheet, isBSBackClose)),
  closeBottomSheet: () => dispatch(closeBottomSheet()),
  getHubs: customer => dispatch(getHubs(customer)),
  getDealers: (customer, hub) => dispatch(getDealers(customer, hub)),
  setPrimaryFilter: selectedPrimaryFilter =>
    dispatch(setPrimaryFilter(selectedPrimaryFilter))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TakePicture);
