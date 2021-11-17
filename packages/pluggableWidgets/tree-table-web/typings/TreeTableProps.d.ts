/**
 * This file was generated from TreeTable.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { ComponentType, CSSProperties } from "react";
import { DynamicValue, ListValue, ListAttributeValue, ListWidgetValue, WebIcon } from "mendix";
import { Big } from "big.js";

export type ShowContentAsEnum = "attribute";

export type WidthEnum = "autoFill" | "autoFit" | "manual";

export type AlignmentEnum = "left" | "center" | "right";

export interface ColumnsType {
    showContentAs: ShowContentAsEnum;
    attribute?: ListAttributeValue<string | Big | boolean | Date>;
    header?: DynamicValue<string>;
    width: WidthEnum;
    size: number;
    alignment: AlignmentEnum;
}

export type ShowIconEnum = "left" | "right" | "no";

export interface ColumnsPreviewType {
    showContentAs: ShowContentAsEnum;
    attribute: string;
    header: string;
    width: WidthEnum;
    size: number | null;
    alignment: AlignmentEnum;
}

export interface TreeTableContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    advancedMode: boolean;
    datasource: ListValue;
    hasChildren: boolean;
    startExpanded: boolean;
    children?: ListWidgetValue;
    animate: boolean;
    columns: ColumnsType[];
    showIcon: ShowIconEnum;
    expandedIcon?: DynamicValue<WebIcon>;
    collapsedIcon?: DynamicValue<WebIcon>;
    animateIcon: boolean;
}

export interface TreeTablePreviewProps {
    class: string;
    style: string;
    advancedMode: boolean;
    datasource: {} | { type: string } | null;
    hasChildren: boolean;
    startExpanded: boolean;
    children: { widgetCount: number; renderer: ComponentType<{ caption?: string }> };
    animate: boolean;
    columns: ColumnsPreviewType[];
    showIcon: ShowIconEnum;
    expandedIcon: { type: "glyph"; iconClass: string } | { type: "image"; imageUrl: string } | null;
    collapsedIcon: { type: "glyph"; iconClass: string } | { type: "image"; imageUrl: string } | null;
    animateIcon: boolean;
}
