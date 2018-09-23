//@flow
import { connect } from "react-redux";
import TakePicture from "./TakePictureComponent";
import { closeBottomSheet, openBottomSheet } from "./../app/AppAction";

const mapStateToProps = state => ({
  selectedPrimaryFilter : state.persist.selectedPrimaryFilter
});

const mapDispatchToProps = dispatch => ({
  openBottomSheet: (renderBottomsheet, isBSBackClose) =>
    dispatch(openBottomSheet(renderBottomsheet, isBSBackClose)),
  closeBottomSheet: () => dispatch(closeBottomSheet())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TakePicture);
