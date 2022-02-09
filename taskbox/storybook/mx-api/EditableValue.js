const noop = () => {};

export class EditableValueBuilder {
    editableValue = {
        value: undefined,
        displayValue: "",
        status: "available",
        validation: undefined,
        readOnly: false,
        formatter: {
            format: name => `Formatted ${name}`,
            parse: noop,
            withConfig: () => new EditableValueBuilder().build().formatter,
            getFormatPlaceholder: noop,
            type: "datetime",
            config: {}
        },
        setValidator: noop,
        setValue: value => this.withValue(value),
        setTextValue: noop,
        setFormatter: noop
    };

    withValue(value) {
        this.editableValue.value = value;
        this.editableValue.displayValue = this.editableValue.formatter.format(value);
        return this;
    }

    withFormatter(formatter) {
        this.editableValue.formatter = formatter;
        return this;
    }

    isReadOnly() {
        this.editableValue.readOnly = true;
        return this;
    }

    isLoading() {
        this.editableValue.status = "loading";
        return this.isReadOnly();
    }

    isUnavailable() {
        this.editableValue.status = "unavailable";
        return this.isReadOnly();
    }

    withValidation(validation) {
        this.editableValue.validation = validation;
        return this;
    }

    withUniverse(...values) {
        this.editableValue.universe = values;
        return this;
    }

    build() {
        return this.editableValue;
    }
}
