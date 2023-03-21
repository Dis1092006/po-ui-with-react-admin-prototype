import {Datagrid, EditButton, List, TextField} from "react-admin";

export const PurchaseOrderList = (props: any) => {
    return (
        <List {...props} sort={{field: 'id', order: 'DESC'}}>
            <Datagrid>
                <TextField source="id"/>
                <TextField source="poDate"/>
                <TextField source="terms"/>
                <EditButton label={'View'}/>
            </Datagrid>
        </List>
    );
}