import React from "react";
import Expo, { AppLoading } from "expo";
import { Provider, connect } from "react-redux";

// Store
import store from "./store";
import { checkForExpiredToken } from "./store/actions/authActions";

// Component
import HomePage from "./Components/HomePage";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      fontsAreLoaded: false
    };
  }

  componentWillMount() {
    Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    }).then(() => this.setState({ fontsAreLoaded: true }));
    store.dispatch(checkForExpiredToken());
  }
  render() {
    if (!this.state.fontsAreLoaded) {
      return <AppLoading />;
    }
    return (
      <Provider store={store}>
        <HomePage />
      </Provider>
    );
  }
}
// const mapDispatchToProps = dispatch => ({
//   checkForExpiredToken: () => dispatch(actionCreators.checkForExpiredToken())
// });
//
// export default connect(
//   null,
//   mapDispatchToProps
// )(App);
export default App;
