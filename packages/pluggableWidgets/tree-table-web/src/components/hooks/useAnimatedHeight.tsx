import { useCallback, useRef, useState } from "react";

export const useAnimatedTreeTableContentHeight = (
    treeTableBranchBody: HTMLDivElement | null
): {
    isAnimating: boolean;
    captureElementHeight: () => void;
    animateTreeTableContent: () => (() => void) | undefined;
    cleanupAnimation: () => void;
} => {
    const currentElementHeight = useRef<number>();
    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    const captureElementHeight = useCallback(() => {
        currentElementHeight.current = treeTableBranchBody?.getBoundingClientRect().height ?? 0;
    }, []);

    const animateTreeTableContent = useCallback(() => {
        if (
            treeTableBranchBody &&
            currentElementHeight.current !== undefined &&
            !Number.isNaN(currentElementHeight.current)
        ) {
            const newElementHeight = treeTableBranchBody.getBoundingClientRect().height;
            if (newElementHeight - currentElementHeight.current !== 0) {
                setIsAnimating(true);
                treeTableBranchBody.style.height = `${currentElementHeight.current}px`;
                const timeout = setTimeout(() => {
                    treeTableBranchBody!.style.height = `${newElementHeight}px`;
                    currentElementHeight.current = newElementHeight;
                }, 1);
                return () => clearTimeout(timeout);
            }
        }
    }, []);

    const cleanupAnimation = useCallback(() => {
        console.warn("Cleaning");
        setIsAnimating(false);
        treeTableBranchBody?.style.removeProperty("height");
    }, []);

    return { isAnimating, captureElementHeight, animateTreeTableContent, cleanupAnimation };
};
