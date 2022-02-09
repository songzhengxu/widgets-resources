import { boolean, withKnobs, text, select, object } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react-native";
import React from "react";
import { Switch } from ".";
import CenterView from "../CenterView";
import { EditableValueBuilder } from "../../mx-api/EditableValue";
import { dynamicValue } from "../../mx-api/DynamicValue";

storiesOf("Switch", module)
    .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
    .addDecorator(withKnobs)
    .add("basic", () => {
        const bool = boolean("boolean", false);
        const label = text("label", "I am your nice label");
        const orientation = select("Orientation", {
            Vertical: "vertical",
            Horizontal: "horizontal"
        });
        const validationMessage = text("validation error", "");
        const readOnly = boolean("read only", false);
        const booleanAttribute = new EditableValueBuilder().withValue(bool);
        if (readOnly) {
            booleanAttribute.isReadOnly();
        }
        if (validationMessage) {
            booleanAttribute.withValidation(validationMessage);
        }

        const styling = object("styling", {
            container: undefined,
            containerDisabled: undefined,
            label: undefined,
            labelDisabled: undefined,
            input: undefined,
            inputDisabled: undefined,
            inputError: undefined,
            validationMessage: {
                color: "pink"
            }
        });

        return (
            <Switch
                name="test"
                style={[styling]}
                booleanAttribute={booleanAttribute.build()}
                showLabel={label.length > 0}
                label={dynamicValue(label, false)}
                labelOrientation={orientation}
            />
        );
    });
