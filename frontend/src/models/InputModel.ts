import { TextFieldVariants } from "@mui/material";
import { ChangeEventHandler, FocusEventHandler } from "react";
export interface InputModel {
    name: string;
    value: string;
    label: string;
    variant: TextFieldVariants;
    onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    type?: string
    helperText?: string
    onBlur: FocusEventHandler<any>
}