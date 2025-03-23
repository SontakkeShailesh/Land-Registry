import {
    ContractData
} from '@drizzle/react-components';
import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Land from './artifacts/Land.json';
import './index.css';


const drizzleOptions = {
    contracts: [Land]
}

var rows = [];
for (var i = 1; i < 5; i++) {
    rows.push(<ContractData contract="Land" method="getArea" methodArgs={[i, { from: "0x113bcBEE8254c6C44a1bb1F3A338315128cdD6Fe" }]} />);
}

function App() {
    return (
        <></>
    );
}
export default App;
