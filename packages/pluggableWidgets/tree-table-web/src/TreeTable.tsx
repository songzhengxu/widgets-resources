import { createElement, useRef, useState, useCallback, useEffect } from "react";
import { TreeTableContainerProps } from "../typings/TreeTableProps";
import { TreeTable as TreeTableComponent } from "./components/TreeTable";
import { ObjectItem, ValueStatus, GUID } from "mendix";
import { equals, attribute, literal } from "mendix/filters/builders";

import "./ui/TreeTable.scss";

export function TreeTable(props: TreeTableContainerProps) {
    const hasCapturedItems = useRef<boolean>(false);
    const [capturedItems, setCapturedItems] = useState<ObjectItem[] | undefined>(undefined);
    const [renderTreeTableFor, setRenderTreeTableFor] = useState<GUID[]>([]);

    useEffect(() => {
        if (!hasCapturedItems.current && props.datasource.status === ValueStatus.Available) {
            setCapturedItems(props.datasource.items);
            hasCapturedItems.current = true;
        }
    }, [props.datasource]);

    const requestChildrenItems = useCallback(
        (item: ObjectItem) => {
            if (props.parentIdAttribute?.id) {
                props.datasource.setFilter(
                    equals(attribute(props.parentIdAttribute?.id), literal(props.currentIdAttribute?.get(item).value))
                );
                setTimeout(
                    () =>
                        setRenderTreeTableFor(currentValue => {
                            if (currentValue.includes(item.id)) {
                                return currentValue;
                            }
                            return [...currentValue, item.id];
                        }),
                    1000
                );
            }
        },
        [props.parentIdAttribute?.id, props.datasource, props.currentIdAttribute]
    );

    const expandedIcon = props.expandedIcon?.status === ValueStatus.Available ? props.expandedIcon.value : null;
    const collapsedIcon = props.collapsedIcon?.status === ValueStatus.Available ? props.collapsedIcon.value : null;

    return (
        <TreeTableComponent
            datasource={props.datasource}
            class={props.class}
            style={props.style}
            items={
                capturedItems?.map(item => ({
                    id: item.id,
                    columns: props.columns.map(c => ({ ...c, attribute: c.attribute?.get(item)?.value ?? "" })),
                    content: renderTreeTableFor.includes(item.id) ? (
                        <TreeTable key={item.id} {...props} name={`${props.name}-${item.id}`} />
                    ) : null,
                    onClick: () => requestChildrenItems(item)
                })) ?? null
            }
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
