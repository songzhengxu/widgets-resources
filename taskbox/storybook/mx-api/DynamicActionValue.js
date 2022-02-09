export function actionValue(canExecute = true, isExecuting = false, fn = () => window.alert("Action invoked.")) {
    return {
        canExecute,
        isExecuting,
        execute: fn
    };
}
