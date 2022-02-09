import { useCallback, createElement } from "react";
import { Platform, View, Text, Switch as Switch$1 } from "react-native";
var FormatterType;
!(function (FormatterType) {
    (FormatterType.Number = "number"), (FormatterType.DateTime = "datetime");
})(FormatterType || (FormatterType = {}));
var commonjsGlobal =
        "undefined" != typeof globalThis
            ? globalThis
            : "undefined" != typeof window
            ? window
            : "undefined" != typeof global
            ? global
            : "undefined" != typeof self
            ? self
            : {},
    dist = {},
    common$2 = {};
Object.defineProperty(common$2, "__esModule", { value: !0 }),
    (common$2.ensure = void 0),
    (common$2.ensure = function (arg) {
        if (null == arg) throw new Error("Did not expect an argument to be undefined");
        return arg;
    });
var common$1 = {};
Object.defineProperty(common$1, "__esModule", { value: !0 }),
    (common$1.extractStyles = common$1.mergeNativeStyles = void 0),
    (common$1.mergeNativeStyles = function (defaultStyle, overrideStyles) {
        const styles = [defaultStyle, ...overrideStyles.filter(object => void 0 !== object)];
        return Object.keys(defaultStyle).reduce((flattened, currentKey) => {
            const styleItems = styles.map(object => object[currentKey]);
            return Object.assign(Object.assign({}, flattened), {
                [currentKey]:
                    ((objects = styleItems),
                    objects.reduce((merged, object) => Object.assign(Object.assign({}, merged), object), {}))
            });
            var objects;
        }, {});
    }),
    (common$1.extractStyles = function (source, extractionKeys) {
        return source
            ? Object.entries(source).reduce(
                  ([extracted, rest], [key, value]) => (
                      extractionKeys.includes(key) ? (extracted[key] = value) : (rest[key] = value), [extracted, rest]
                  ),
                  [{}, {}]
              )
            : [{}, {}];
    });
var exports,
    __createBinding,
    __exportStar,
    common = {};
Object.defineProperty(common, "__esModule", { value: !0 }),
    (common.parseInlineStyle = void 0),
    (common.parseInlineStyle = function (style = "") {
        try {
            return style.split(";").reduce((styleObject, line) => {
                const pair = line.split(":");
                if (2 === pair.length) {
                    styleObject[pair[0].trim().replace(/(-.)/g, match => match[1].toUpperCase())] = pair[1].trim();
                }
                return styleObject;
            }, {});
        } catch (_) {
            return {};
        }
    }),
    (exports = dist),
    (__createBinding =
        (commonjsGlobal && commonjsGlobal.__createBinding) ||
        (Object.create
            ? function (o, m, k, k2) {
                  void 0 === k2 && (k2 = k),
                      Object.defineProperty(o, k2, {
                          enumerable: !0,
                          get: function () {
                              return m[k];
                          }
                      });
              }
            : function (o, m, k, k2) {
                  void 0 === k2 && (k2 = k), (o[k2] = m[k]);
              })),
    (__exportStar =
        (commonjsGlobal && commonjsGlobal.__exportStar) ||
        function (m, exports) {
            for (var p in m)
                "default" === p || Object.prototype.hasOwnProperty.call(exports, p) || __createBinding(exports, m, p);
        }),
    Object.defineProperty(exports, "__esModule", { value: !0 }),
    __exportStar(common$2, exports),
    __exportStar(common$1, exports),
    __exportStar(common, exports);
const defaultSwitchStyle = {
    container: { paddingVertical: 4, justifyContent: "center" },
    containerDisabled: {},
    label: { numberOfLines: 1 },
    labelDisabled: {},
    input: { marginRight: Platform.select({ android: -3 }) },
    inputDisabled: {},
    inputError: {},
    validationMessage: { alignSelf: "stretch" }
};
function Switch(props) {
    const {
            label: label,
            labelOrientation: labelOrientation,
            showLabel: showLabel,
            name: name,
            onChange: onChange,
            booleanAttribute: booleanAttribute
        } = props,
        styles = (function (style) {
            const {
                    input: inputStyle,
                    inputDisabled: inputDisabledStyle,
                    inputError: inputErrorStyle,
                    label: labelStyle,
                    ...others
                } = style,
                inputPropsKeys = ["thumbColorOn", "thumbColorOff", "trackColorOn", "trackColorOff"],
                [inputProps, input] = dist.extractStyles(inputStyle, inputPropsKeys),
                [inputDisabledProps, inputDisabled] = dist.extractStyles(inputDisabledStyle, inputPropsKeys),
                [inputErrorProps, inputError] = dist.extractStyles(inputErrorStyle, inputPropsKeys),
                [labelProps, label] = dist.extractStyles(labelStyle, ["numberOfLines"]);
            return {
                inputProps: inputProps,
                input: input,
                inputDisabledProps: inputDisabledProps,
                inputDisabled: inputDisabled,
                inputErrorProps: inputErrorProps,
                inputError: inputError,
                labelProps: labelProps,
                label: label,
                ...others
            };
        })(
            (function (defaultStyle, overrideStyles) {
                const styles = [defaultStyle, ...overrideStyles.filter(object => void 0 !== object)];
                return Object.keys(defaultStyle).reduce((flattened, currentKey) => {
                    const styleItems = styles.map(object => object[currentKey]);
                    return Object.assign(Object.assign({}, flattened), {
                        [currentKey]:
                            ((objects = styleItems),
                            objects.reduce((merged, object) => Object.assign(Object.assign({}, merged), object), {}))
                    });
                    var objects;
                }, {});
            })(defaultSwitchStyle, props.style)
        ),
        horizontalOrientation = showLabel && "horizontal" === labelOrientation,
        editable = !booleanAttribute.readOnly,
        hasValidationMessage = !!booleanAttribute.validation,
        onChangeCallback = useCallback(() => {
            var action;
            "available" === booleanAttribute.status &&
                (booleanAttribute.setValue(!booleanAttribute.value),
                (action = onChange) && action.canExecute && !action.isExecuting && action.execute());
        }, [booleanAttribute, onChange]),
        containerStyles = editable ? styles.container : { ...styles.container, ...styles.containerDisabled },
        labelStyles = editable ? styles.label : { ...styles.label, ...styles.labelDisabled },
        inputProps = editable
            ? hasValidationMessage
                ? { ...styles.inputProps, ...styles.inputErrorProps }
                : styles.inputProps
            : { ...styles.inputProps, ...styles.inputDisabledProps },
        inputStyle = editable
            ? hasValidationMessage
                ? [styles.input, styles.inputError]
                : styles.input
            : [styles.input, styles.inputDisabled],
        labelValue = "available" === (null == label ? void 0 : label.status) ? label.value : "";
    return createElement(
        View,
        {
            testID: name + "$wrapper",
            style: [containerStyles, horizontalOrientation ? { flexDirection: "row", alignItems: "center" } : null]
        },
        showLabel
            ? createElement(
                  Text,
                  { testID: name + "$label", style: [labelStyles, horizontalOrientation ? { flex: 1 } : null] },
                  labelValue
              )
            : null,
        createElement(
            View,
            { style: [horizontalOrientation ? { flex: 1, alignItems: "flex-end" } : { alignItems: "flex-start" }] },
            createElement(Switch$1, {
                disabled: !editable,
                testID: name,
                style: inputStyle,
                onValueChange: editable ? onChangeCallback : void 0,
                value: booleanAttribute.value,
                trackColor: { true: inputProps.trackColorOn, false: inputProps.trackColorOff },
                thumbColor: booleanAttribute.value ? inputProps.thumbColorOn : inputProps.thumbColorOff
            }),
            hasValidationMessage
                ? createElement(
                      Text,
                      { testID: name + "$alert", style: styles.validationMessage },
                      booleanAttribute.validation
                  )
                : null
        )
    );
}
export { Switch };
