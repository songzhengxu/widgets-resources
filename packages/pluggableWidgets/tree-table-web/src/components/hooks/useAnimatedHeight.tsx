import { RefObject, useCallback, useRef, useState } from "react";

export const useAnimatedTreeTableContentHeight = (
    treeTableBranchBody: RefObject<HTMLDivElement>
): {
    isAnimating: boolean;
    captureElementHeight: () => void;
    animateTreeTableContent: () => (() => void) | undefined;
    cleanupAnimation: () => void;
} => {
    const currentElementHeight = useRef<number>();
    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    const captureElementHeight = useCallback(() => {
        currentElementHeight.current = treeTableBranchBody.current?.getBoundingClientRect().height ?? 0;
    }, []);

    const animateTreeTableContent = useCallback(() => {
        if (
            treeTableBranchBody.current &&
            currentElementHeight.current !== undefined &&
            !Number.isNaN(currentElementHeight.current)
        ) {
            const newElementHeight = treeTableBranchBody.current.getBoundingClientRect().height;
            if (newElementHeight - currentElementHeight.current !== 0) {
                setIsAnimating(true);
                treeTableBranchBody.current.style.height = `${currentElementHeight.current}px`;
                const timeout = setTimeout(() => {
                    treeTableBranchBody.current!.style.height = `${newElementHeight}px`;
                    currentElementHeight.current = newElementHeight;
                }, 1);
                return () => clearTimeout(timeout);
            }
        }
    }, []);

    const cleanupAnimation = useCallback(() => {
        console.warn("Cleaning");
        setIsAnimating(false);
        treeTableBranchBody.current?.style.removeProperty("height");
    }, []);

    return { isAnimating, captureElementHeight, animateTreeTableContent, cleanupAnimation };
};
