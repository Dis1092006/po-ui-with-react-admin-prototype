import {Datagrid, Edit, ReferenceManyField, SimpleForm, TextField, TextInput} from "react-admin";
import {PurchaseOrderEditToolbar} from "./PurchaseOrderEditToolbar";

export const PurchaseOrderEdit = (props: any) => {
    return (
        <Edit {...props}>
            <SimpleForm toolbar={<PurchaseOrderEditToolbar saveEnabled/>}>
                <TextInput source="id" label={'Purchase order'}/>
                <TextInput source="poDate" label={'PO Date'}/>
                <TextInput source="supplierId" label={'Supplier Id'}/>
                <TextInput source="terms" label={'Terms'}/>
                <ReferenceManyField label="Items" reference="poHistory" target="poNumber">
                    <Datagrid>
                        <TextField source="itemNumber"/>
                        <TextField source="localSku"/>
                        <TextField source="quantity"/>
                        <TextField source="cost"/>
                    </Datagrid>
                </ReferenceManyField>
            </SimpleForm>
        </Edit>
    );
};