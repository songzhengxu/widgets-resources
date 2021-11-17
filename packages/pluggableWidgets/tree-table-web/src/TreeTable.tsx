import { createElement } from "react";
import { TreeTableContainerProps } from "../typings/TreeTableProps";
import { TreeTable as TreeTableComponent, TreeTableObject } from "./components/TreeTable";
import { ObjectItem, ValueStatus } from "mendix";

import "./ui/TreeTable.scss";

function mapDataSourceItemToTreeNodeObject(item: ObjectItem, props: TreeTableContainerProps): TreeTableObject {
    return {
        id: item.id,
        columns: props.columns.map(c => ({ ...c, attribute: c.attribute?.get(item)?.value ?? "" })),
        content: props.children?.get(item)
    };
}

export function TreeTable(props: TreeTableContainerProps) {
    const items =
        props.datasource.status === ValueStatus.Available
            ? props.datasource.items?.map(item => mapDataSourceItemToTreeNodeObject(item, props)) ?? []
            : null;

    const expandedIcon = props.expandedIcon?.status === ValueStatus.Available ? props.expandedIcon.value : null;
    const collapsedIcon = props.collapsedIcon?.status === ValueStatus.Available ? props.collapsedIcon.value : null;

    return (
        <TreeTableComponent
            class={props.class}
            style={props.style}
            items={items}
            columnHeaders={props.columns.map(c => ({
                header: c.header?.value ?? "",
                alignment: c.alignment,
                size: c.size,
                width: c.width
            }))}
            isUserDefinedLeafNode={!props.hasChildren}
            startExpanded={props.startExpanded}
            showCustomIcon={Boolean(props.expandedIcon) || Boolean(props.collapsedIcon)}
            iconPlacement={props.showIcon}
            expandedIcon={expandedIcon}
            collapsedIcon={collapsedIcon}
            tabIndex={props.tabIndex}
            animateIcon={props.animate && props.animateIcon}
            animateTreeTableContent={props.animate}
        />
    );
}
