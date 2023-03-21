import {Edit, SimpleForm, TextInput} from "react-admin";
import {PurchaseOrderEditToolbar} from "./PurchaseOrderEditToolbar";

export const PurchaseOrderEdit = (props: any) => {
    return (
        <Edit {...props}>
            <SimpleForm toolbar={<PurchaseOrderEditToolbar saveEnabled={false}/>}>
                <TextInput source="id" name={'id'}/>
                <TextInput source="poDate" name={'poDate'}/>
                <TextInput source="terms" name={'terms'}/>
            </SimpleForm>
        </Edit>
    );
};