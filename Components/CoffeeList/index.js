import React, { Component } from "react";
import { ImageBackground, View, TouchableOpacity } from "react-native";
import { connect } from "react-redux";

import * as actionCreators from "../../store/actions/authActions";

// NativeBase Components
import {
  List,
  ListItem,
  Card,
  CardItem,
  Button,
  Thumbnail,
  Text,
  Left,
  Content,
  Icon,
  Footer,
  FooterTab
} from "native-base";

// Style
import styles from "./styles";

// Actions
import { quantityCounter } from "../../utilities/quantityCounter";

class CoffeeList extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Coffee List",
    headerLeft: null,
    headerRight: (
      <Button
        light
        transparent
        onPress={() => navigation.navigate("CoffeeCart")}
      >
        <Text>
          {navigation.getParam("quantity", 0)}{" "}
          <Icon
            type="FontAwesome"
            name="coffee"
            style={{ color: "white", fontSize: 15 }}
          />
        </Text>
      </Button>
    )
  });

  constructor(props) {
    super(props);
    this.logoutUser = this.logoutUser.bind(this);
  }

  componenDidMount() {
    this.props.navigation.setParams({
      quantity: this.props.quantity
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.quantity != this.props.quantity) {
      this.props.navigation.setParams({ quantity: this.props.quantity });
    }
  }

  handlePress(shop) {
    this.props.navigation.navigate("CoffeeDetail", {
      shop: shop,
      quantity: this.props.quantity
    });
  }

  logoutUser() {
    this.props.logout();
    this.props.navigation.replace("Login");
  }

  renderItem(shop) {
    return (
      <TouchableOpacity key={shop.id} onPress={() => this.handlePress(shop)}>
        <ImageBackground
          source={{ uri: shop.background }}
          style={styles.background}
        >
          <View style={styles.overlay} />
          <ListItem style={styles.transparent}>
            <Card style={styles.transparent}>
              <CardItem style={styles.transparent}>
                <Left>
                  <Thumbnail
                    bordered
                    source={{ uri: shop.img }}
                    style={styles.thumbnail}
                  />
                  <Text style={styles.text}>{shop.name}</Text>
                  <Text note style={styles.text}>
                    {shop.distance}
                  </Text>
                </Left>
              </CardItem>
            </Card>
          </ListItem>
        </ImageBackground>
      </TouchableOpacity>
    );
  }
  render() {
    const { coffeeshops } = this.props.coffee;
    let ListItems;
    if (coffeeshops) {
      ListItems = coffeeshops.map(shop => this.renderItem(shop));
    }
    return (
      <Content>
        <List>{ListItems}</List>
        <Footer>
          <FooterTab>
            <Button onPress={() => this.logoutUser()}>
              <Text>Logout</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Content>
    );
  }
}

const mapStateToProps = state => ({
  coffee: state.coffee,
  quantity: quantityCounter(state.cart.list)
});
const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(actionCreators.logout())
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoffeeList);
