import { RefObject, useCallback } from "react";

export function elementHasNestedTreeTable(element: HTMLDivElement | null): boolean {
    return element?.lastElementChild?.className.includes("widget-tree-table") ?? true;
}

export const useTreeTableLazyLoading = (
    treeNodeBranchBody: RefObject<HTMLDivElement>
): {
    hasNestedTreeTable: () => boolean;
} => {
    const hasNestedTreeTable = useCallback(
        () => treeNodeBranchBody.current?.lastElementChild?.className.includes("widget-tree-table") ?? true,
        []
    );

    return { hasNestedTreeTable };
};
