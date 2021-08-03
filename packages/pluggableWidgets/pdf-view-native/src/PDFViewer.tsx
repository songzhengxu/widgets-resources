import { createElement, ReactElement } from "react";
import { View } from "react-native";

// With Flow type annotations (https://flow.org/)
import PDFView from "react-native-view-pdf";
// Without Flow type annotations
// import PDFView from 'react-native-view-pdf/lib/index';
import type { PDFViewerProps } from "../typings/PDFViewerProps";

// https://github.com/rumax/react-native-PDFView

export function PDFViewer(props: PDFViewerProps<any>): ReactElement | null {
    const resourceType = "file";

    if (props.file?.status !== "available") {
        return null;
    }

    console.log(props.file.value.uri);
    console.info(props.file.value.uri);
    console.error(props.file.value.uri);
    console.warn(props.file.value.uri);

    return (
        <View style={{ flex: 1 }}>
            {/* Some Controls to change PDF resource */}
            <PDFView
                fadeInDuration={250.0}
                style={{ flex: 1 }}
                resource={props.file?.value?.uri}
                fileFrom={"documentsDirectory"}
                resourceType={resourceType}
                onLoad={() => console.log(`PDF rendered from ${resourceType}`)}
                onError={({ message }) => console.log("Cannot render PDF", message)}
            />
        </View>
    );
}
