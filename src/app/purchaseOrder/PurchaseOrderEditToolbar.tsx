import {SaveButton, Toolbar} from "react-admin";
import {FC} from "react";
import {ToolbarProps} from "ra-ui-materialui/src/form/Toolbar";

interface PurchaseOrderEditToolbarProps extends ToolbarProps {
    saveEnabled: boolean
}

export const PurchaseOrderEditToolbar: FC<PurchaseOrderEditToolbarProps> = (props) => {
    const {saveEnabled} = props;
    return (
        <Toolbar>
            {saveEnabled && <SaveButton/>}
        </Toolbar>
    );
};