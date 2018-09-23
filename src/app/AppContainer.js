//@flow
import { connect } from "react-redux";
import AppComponent from "./AppComponent";
import { closeBottomSheet } from "./AppAction";

const mapStateToProps = state => ({
  isBSOpen: state.app.isBSOpen,
  isBSBackClose: state.app.isBSBackClose,
  isBSTouchoutsideClose: state.app.isBSTouchoutsideClose,
  renderBottomsheet: state.app.renderBottomsheet,
  isRehydrated: state.app.isRehydrated
});

const mapDispatchToProps = dispatch => ({
  closeBottomSheet: () => dispatch(closeBottomSheet())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppComponent);
