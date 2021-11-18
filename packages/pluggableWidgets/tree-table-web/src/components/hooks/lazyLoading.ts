import { useCallback } from "react";

export function elementHasNestedTreeTable(element: HTMLDivElement | null): boolean {
    return element?.lastElementChild?.className.includes("widget-tree-table") ?? true;
}

export const useTreeTableLazyLoading = (
    treeNodeBranchBody: HTMLDivElement | null
): {
    hasNestedTreeTable: () => boolean;
} => {
    const hasNestedTreeTable = useCallback(() => {
        console.warn("Tree node branch body", treeNodeBranchBody, treeNodeBranchBody?.childElementCount);
        return treeNodeBranchBody?.lastElementChild?.className.includes("widget-tree-table") ?? true;
    }, [treeNodeBranchBody]);

    return { hasNestedTreeTable };
};
