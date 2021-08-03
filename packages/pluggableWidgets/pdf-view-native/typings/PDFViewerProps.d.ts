/**
 * This file was generated from PDFViewer.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { DynamicValue, FileValue } from "mendix";

export interface PDFViewerProps<Style> {
    name: string;
    style: Style[];
    file?: DynamicValue<FileValue>;
}

export interface PDFViewerPreviewProps {
    class: string;
    style: string;
    file: string;
}
