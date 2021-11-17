import { WebIcon, ObjectItem } from "mendix";
import {
    createElement,
    CSSProperties,
    HTMLAttributes,
    ReactElement,
    ReactEventHandler,
    ReactNode,
    SyntheticEvent,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useRef,
    useState
} from "react";
import classNames from "classnames";
import {
    AlignmentEnum,
    ShowContentAsEnum,
    ShowIconEnum,
    TreeTableContainerProps,
    WidthEnum
} from "../../typings/TreeTableProps";
import {
    TreeTableBranchContextProps,
    TreeTableBranchContext,
    useInformParentContextOfChildNodes
} from "./TreeTableBranchContext";

import { useTreeTableLazyLoading } from "./hooks/lazyLoading";
import { useAnimatedTreeTableContentHeight } from "./hooks/useAnimatedHeight";
import { Big } from "big.js";

export interface ColumnHeader {
    header: string;
    width: WidthEnum;
    size: number;
    alignment: AlignmentEnum;
}

export interface Column {
    showContentAs: ShowContentAsEnum;
    attribute?: string | Big | boolean | Date;
}

export interface TreeTableObject extends ObjectItem {
    columns: Column[];
    content: ReactNode;
}

export interface TreeTableProps extends Pick<TreeTableContainerProps, "tabIndex"> {
    class: string;
    style?: CSSProperties;
    items: TreeTableObject[] | null;
    columnHeaders: ColumnHeader[];
    isUserDefinedLeafNode: TreeTableBranchProps["isUserDefinedLeafNode"];
    startExpanded: TreeTableBranchProps["startExpanded"];
    showCustomIcon: boolean;
    iconPlacement: TreeTableBranchProps["iconPlacement"];
    expandedIcon: WebIcon | null;
    collapsedIcon: WebIcon | null;
    animateIcon: boolean;
    animateTreeTableContent: TreeTableBranchProps["animateTreeTableContent"];
}

export function TreeTable({
    class: className,
    columnHeaders,
    items,
    style,
    isUserDefinedLeafNode,
    startExpanded,
    iconPlacement,
    tabIndex,
    animateTreeTableContent
}: TreeTableProps): ReactElement | null {
    const { level, hasParent } = useContext(TreeTableBranchContext);

    // Combination of useState + useCallback is necessary here over useRef because it needs to trigger an update in useInformParentContextOfChildNodes
    const [treeTableElement, setTreeTableElement] = useState<HTMLDivElement | null>(null);
    const updateTreeTableElement = useCallback(node => {
        if (node) {
            setTreeTableElement(node);
        }
    }, []);

    const isInsideAnotherTreeTable = useCallback(() => {
        return treeTableElement?.parentElement?.className.includes(treeTableBranchUtils.bodyClassName) ?? false;
    }, [treeTableElement]);

    useInformParentContextOfChildNodes(items, isInsideAnotherTreeTable);

    // const changeTreeTableBranchHeaderFocus = useTreeTableFocusChangeHandler();

    if (!items) {
        return null;
    }

    const itemsElement = items.map(({ id, columns, content }) => (
        <TreeTableBranch
            key={id}
            id={id}
            columns={columns}
            isUserDefinedLeafNode={isUserDefinedLeafNode}
            startExpanded={startExpanded}
            iconPlacement={iconPlacement}
            // renderHeaderIcon={renderHeaderIcon}
            // changeFocus={changeTreeTableBranchHeaderFocus}
            animateTreeTableContent={animateTreeTableContent}
        >
            {content}
        </TreeTableBranch>
    ));

    // if (hasParent) {
    //     return <Fragment>{itemsElement}</Fragment>;
    // }

    return (
        <div
            className={classNames("widget-tree-table", className)}
            style={hasParent ? { display: "contents" } : style}
            ref={updateTreeTableElement}
            data-focusindex={tabIndex || 0}
            role={level === 0 ? "tree" : "group"}
        >
            {!hasParent && (
                <div
                    className="widget-tree-table-row-header"
                    style={{
                        gridTemplateColumns: columnHeaders.map(() => "1fr").join(" ")
                    }}
                >
                    {columnHeaders.map((column, index) => (
                        <div key={`column_${index}`} className="widget-tree-table-column-header">
                            {column.header}
                        </div>
                    ))}
                </div>
            )}
            {itemsElement}
        </div>
    );
}
interface TreeTableBranchProps {
    id: TreeTableObject["id"];
    isUserDefinedLeafNode: boolean;
    startExpanded: boolean;
    columns: TreeTableObject["columns"];
    children: TreeTableObject["content"];
    iconPlacement: ShowIconEnum;
    // renderHeaderIcon: (treeTableState: TreeTableState, iconPlacement: Exclude<ShowIconEnum, "no">) => ReactNode;
    // changeFocus: TreeTableFocusChangeHandler;
    animateTreeTableContent: boolean;
}

const treeTableBranchUtils = {
    bodyClassName: "widget-tree-table-body",
    getHeaderId: (id: TreeTableObject["id"]) => `${id}TreeTableBranchHeader`,
    getBodyId: (id: TreeTableObject["id"]) => `${id}TreeTableBranchBody`
};

function getTreeTableAccessibilityProps(isExpanded: boolean): HTMLAttributes<HTMLDivElement> {
    return {
        "aria-expanded": isExpanded,
        role: "treeitem",
        tabIndex: 0
    };
}

export const enum TreeTableState {
    COLLAPSED_WITH_JS = "COLLAPSED_WITH_JS",
    COLLAPSED_WITH_CSS = "COLLAPSED_WITH_CSS",
    EXPANDED = "EXPANDED",
    LOADING = "LOADING"
}

function TreeTableBranch(props: TreeTableBranchProps): ReactElement {
    const { level: currentContextLevel, hasParent } = useContext(TreeTableBranchContext);
    const [treeTableState, setTreeTableState] = useState<TreeTableState>(
        props.startExpanded ? TreeTableState.EXPANDED : TreeTableState.COLLAPSED_WITH_JS
    );
    const [isActualLeafNode, setIsActualLeafNode] = useState<boolean>(props.isUserDefinedLeafNode || !props.children);

    const informParentOfChildNodes = useCallback<TreeTableBranchContextProps["informParentOfChildNodes"]>(
        numberOfNodes => {
            console.warn("Number of nodes", numberOfNodes);
            if (numberOfNodes !== undefined) {
                setTreeTableState(treeTableState =>
                    treeTableState === TreeTableState.LOADING ? TreeTableState.EXPANDED : treeTableState
                );
                setIsActualLeafNode(currentIsActualLeafNode => {
                    if (numberOfNodes === 0 && !currentIsActualLeafNode) {
                        return true;
                    } else if (numberOfNodes > 0 && currentIsActualLeafNode) {
                        return false;
                    }
                    return currentIsActualLeafNode;
                });
            }
        },
        []
    );

    const treeTableBranchBody = useRef<HTMLDivElement>(null);
    const treeTableBranchRef = useRef<HTMLDivElement>(null);

    const { hasNestedTreeTable } = useTreeTableLazyLoading(treeTableBranchBody);
    const {
        isAnimating,
        captureElementHeight,
        animateTreeTableContent,
        cleanupAnimation
    } = useAnimatedTreeTableContentHeight(treeTableBranchBody);

    useLayoutEffect(() => {
        if (props.animateTreeTableContent && treeTableState !== TreeTableState.LOADING) {
            const animationCleanup = animateTreeTableContent();
            if (animationCleanup) {
                return animationCleanup;
            }
        }
    }, [animateTreeTableContent, props.animateTreeTableContent, treeTableState]);

    const eventTargetIsNotCurrentBranch = useCallback<(event: SyntheticEvent<HTMLElement>) => boolean>(event => {
        const target = event.target as Node;
        return (
            !treeTableBranchRef.current?.isSameNode(target) &&
            !treeTableBranchRef.current?.firstElementChild?.contains(target) &&
            !treeTableBranchRef.current?.lastElementChild?.isSameNode(target)
        );
    }, []);

    useEffect(() => {
        if (treeTableState === TreeTableState.LOADING) {
            if (!hasNestedTreeTable()) {
                setTreeTableState(TreeTableState.EXPANDED);
            }
        }
    }, [hasNestedTreeTable, treeTableState]);

    const toggleTreeTableContent = useCallback<ReactEventHandler<HTMLDivElement>>(
        event => {
            if (eventTargetIsNotCurrentBranch(event)) {
                return;
            }
            if (!isActualLeafNode) {
                captureElementHeight();
                setTreeTableState(treeTableState => {
                    if (treeTableState === TreeTableState.LOADING) {
                        // TODO:
                        return treeTableState;
                    }
                    if (treeTableState === TreeTableState.COLLAPSED_WITH_JS) {
                        return TreeTableState.LOADING;
                    }
                    if (treeTableState === TreeTableState.COLLAPSED_WITH_CSS) {
                        return TreeTableState.EXPANDED;
                    }
                    return TreeTableState.COLLAPSED_WITH_CSS;
                });
            }
        },
        [isActualLeafNode, eventTargetIsNotCurrentBranch, captureElementHeight]
    );

    const treeTableAccessibilityProps = getTreeTableAccessibilityProps(treeTableState === TreeTableState.EXPANDED);

    // const onHeaderKeyDown = useTreeTableBranchKeyboardHandler(
    //     toggleTreeTableContent,
    //     props.changeFocus,
    //     treeTableState,
    //     isActualLeafNode,
    //     eventTargetIsNotCurrentBranch
    // );

    const onTreeTableClick = useCallback<ReactEventHandler<HTMLDivElement>>(
        event => {
            if (eventTargetIsNotCurrentBranch(event)) {
                return;
            }
            toggleTreeTableContent(event);
        },
        [toggleTreeTableContent, eventTargetIsNotCurrentBranch]
    );

    return (
        <div
            className={classNames("widget-tree-table-row", {
                "widget-tree-table-row-clickable": !isActualLeafNode,
                "widget-tree-table-row-bordered": !hasParent
            })}
            // onClick={onTreeTableClick}
            // onKeyDown={onHeaderKeyDown}
            ref={treeTableBranchRef}
            {...treeTableAccessibilityProps}
            style={{
                gridTemplateColumns: props.columns.map(() => "1fr").join(" ")
            }}
        >
            {props.columns.map((column, index) => (
                <div
                    key={`${props.id}_column_${index}`}
                    onClick={onTreeTableClick}
                    className="widget-tree-table-column"
                >
                    {column.attribute}
                </div>
            ))}
            {((!isActualLeafNode && treeTableState !== TreeTableState.COLLAPSED_WITH_JS) || isAnimating) && (
                <TreeTableBranchContext.Provider
                    value={{
                        level: currentContextLevel + 1,
                        informParentOfChildNodes,
                        hasParent: true
                    }}
                >
                    <div
                        className={classNames(treeTableBranchUtils.bodyClassName, {
                            "widget-tree-table-branch-hidden":
                                treeTableState === TreeTableState.COLLAPSED_WITH_CSS && !isAnimating,
                            "widget-tree-table-branch-loading": treeTableState === TreeTableState.LOADING
                        })}
                        id={treeTableBranchUtils.getBodyId(props.id)}
                        aria-hidden={treeTableState !== TreeTableState.EXPANDED}
                        ref={treeTableBranchBody}
                        onTransitionEnd={cleanupAnimation}
                        style={{ gridColumn: "span " + props.columns.length }}
                    >
                        {props.children}
                    </div>
                </TreeTableBranchContext.Provider>
            )}
        </div>
    );
}
