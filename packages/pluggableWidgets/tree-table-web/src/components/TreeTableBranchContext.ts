import { createContext, useContext, useEffect } from "react";

export interface TreeTableBranchContextProps {
    level: number;
    informParentOfChildNodes: (numberOfNodes: number | undefined) => void;
    hasParent: boolean;
}

export const TreeTableBranchContext = createContext<TreeTableBranchContextProps>({
    level: 0,
    informParentOfChildNodes: () => null,
    hasParent: false
});

export const useInformParentContextOfChildNodes = (
    nodes: any[] | null,
    identifyParentIsTreeNode: () => boolean
): void => {
    const { level, informParentOfChildNodes } = useContext(TreeTableBranchContext);
    useEffect(() => {
        if (level > 0 && identifyParentIsTreeNode()) {
            informParentOfChildNodes(nodes?.length);
        }
    }, [nodes, level, informParentOfChildNodes, identifyParentIsTreeNode]);
};
