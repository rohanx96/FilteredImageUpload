import { connect } from "react-redux";
import { setCustomer } from "../common/actions/PersistAction";
import SignInComponent from "./SignInComponent";
import { getCustomers } from "./SignInActions";

const mapStateToProps = state => ({
  customers: state.signIn.customers,
  selectedCustomer: state.persist.customer
});

const mapDispatchToProps = dispatch => ({
  getCustomers: () => dispatch(getCustomers()),
  setCustomer: customer => dispatch(setCustomer(customer))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignInComponent);
