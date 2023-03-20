import React from "react";
import {Admin, Resource} from 'react-admin';
import DataProvider from "./dataProvider/jsonApiDataProvider";
import {PurchaseOrderList} from "./purchaseOrder/PurchaseOrderList";
import './App.css'

const App = () => {
    let apiUrl = 'http://localhost:5000/api/v1';
    const jsonapiDataProvider = DataProvider(apiUrl);
    return (
        <Admin dataProvider={jsonapiDataProvider}>
            <Resource
                name="purchaseorders"
                list={PurchaseOrderList}
            />
        </Admin>
    );
};

export default App
