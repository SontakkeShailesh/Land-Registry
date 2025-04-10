import {
  ContractData, LoadingContainer
} from '@drizzle/react-components';
import { DrizzleProvider } from '@drizzle/react-plugin';
import React, { Component } from 'react';
import { Spinner } from 'react-bootstrap';
// reactstrap components
import {
  Card, CardBody, CardHeader, CardTitle, Col, Row, Table
} from "reactstrap";
import Land from "../artifacts/Land.json";
import getWeb3 from "../getWeb3";




const drizzleOptions = {
  contracts: [Land]
}


var verified;
var row = [];


class OwnedLands extends Component {
  constructor(props) {
    super(props)

    this.state = {
      LandInstance: undefined,
      account: null,
      web3: null,
      flag: null,
      verified: '',
      registered: '',
      count: 0,
      id: '',
    }
  }

  viewImage = (landId) => {
    alert(landId);
    this.props.history.push({
      pathname: '/viewImage',
    })
  }

  componentDidMount = async () => {
    //For refreshing page only once
    if (!window.location.hash) {
      window.location = window.location + '#loaded';
      window.location.reload();
    }

    try {
      //Get network provider and web3 instance
      const web3 = await getWeb3();

      const accounts = await web3.eth.getAccounts();

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Land.networks[networkId];
      const instance = new web3.eth.Contract(
        Land.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const currentAddress = await web3.currentProvider.selectedAddress;
      console.log(currentAddress);
      this.setState({ LandInstance: instance, web3: web3, account: accounts[0] });
      verified = await this.state.LandInstance.methods.isVerified(currentAddress).call();
      console.log(verified);
      this.setState({ verified: verified });
      var registered = await this.state.LandInstance.methods.isBuyer(currentAddress).call();
      console.log(registered);
      this.setState({ registered: registered });

      var count = await this.state.LandInstance.methods.getLandsCount().call();
      count = parseInt(count);
      console.log(typeof (count));
      console.log(count);
      //this.setState({count:count});

      var rowsArea = [];
      var rowsCity = [];
      var rowsState = [];
      var rowsPrice = [];
      var rowsPID = [];
      var rowsSurvey = [];
      var rowsIpfs = []


      for (var i = 1; i < count + 1; i++) {
        rowsArea.push(<ContractData contract="Land" method="getArea" methodArgs={[i, { from: "0x113bcBEE8254c6C44a1bb1F3A338315128cdD6Fe" }]} />);
        rowsCity.push(<ContractData contract="Land" method="getCity" methodArgs={[i, { from: "0x113bcBEE8254c6C44a1bb1F3A338315128cdD6Fe" }]} />);
        rowsState.push(<ContractData contract="Land" method="getState" methodArgs={[i, { from: "0x113bcBEE8254c6C44a1bb1F3A338315128cdD6Fe" }]} />);
        rowsPrice.push(<ContractData contract="Land" method="getPrice" methodArgs={[i, { from: "0x113bcBEE8254c6C44a1bb1F3A338315128cdD6Fe" }]} />);
        rowsPID.push(<ContractData contract="Land" method="getPID" methodArgs={[i, { from: "0x113bcBEE8254c6C44a1bb1F3A338315128cdD6Fe" }]} />);
        rowsSurvey.push(<ContractData contract="Land" method="getSurveyNumber" methodArgs={[i, { from: "0x113bcBEE8254c6C44a1bb1F3A338315128cdD6Fe" }]} />);
      }


      for (var i = 0; i < count; i++) {
        var owner = await this.state.LandInstance.methods.getLandOwner(i + 1).call();
        console.log(owner.toLowerCase());
        console.log(currentAddress);
        if (owner.toLowerCase() == currentAddress) {
          row.push(<tr><td>{i + 1}</td><td>{rowsArea[i]}</td><td>{rowsCity[i]}</td><td>{rowsState[i]}</td><td>{rowsPrice[i]}</td><td>{rowsPID[i]}</td><td>{rowsSurvey[i]}</td>
          </tr>)
        }
      }
      console.log(row);

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return (
        <div>
          <div>
            <h1>
              <Spinner animation="border" variant="primary" />
            </h1>
          </div>

        </div>
      );
    }

    if (!this.state.registered) {
      return (
        <div className="content">
          <div>
            <Row>
              <Col xs="6">
                <Card className="card-chart">
                  <CardBody>
                    <h1>
                      You are not verified to view this page
                    </h1>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>

        </div>
      );
    }


    return (
      <>
        <div className="content">
          <DrizzleProvider options={drizzleOptions}>
            <LoadingContainer>
              <Row>
                <Col lg="12" md="12">
                  <Card>
                    <CardHeader>
                      <CardTitle tag="h4">Owned Lands
                      </CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Table className="tablesorter" responsive color="black">
                        <thead className="text-primary">
                          <tr>
                            <th>#</th>
                            <th>Area</th>
                            <th>City</th>
                            <th>State</th>
                            <th>Price</th>
                            <th>Property PID</th>
                            <th>Survey Number</th>
                          </tr>
                        </thead>
                        <tbody>
                          {row}
                        </tbody>
                      </Table>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </LoadingContainer>
          </DrizzleProvider>
        </div>
      </>

    );

  }
}

export default OwnedLands;