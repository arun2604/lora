import { ButtonPropsVariantOverrides } from "@mui/material";

export interface PrimaryButtonModel {
    label: string;
    variant: "text" | "outlined" | "contained" | undefined;
    type?: "button" | "submit" | "reset" | undefined;
}