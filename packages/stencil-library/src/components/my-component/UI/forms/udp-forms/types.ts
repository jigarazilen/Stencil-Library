import { TypographyVariant } from "../../../unity-typography";

export type Guid = string; // a Guid is represented as a string in ts, but better to declare it as a Guid rather than string

export interface Question {
  businessObjectKey: string;
  id: Guid;
  formId: Guid;
  formVersion: number;
  name: string;
  questionText: string;
  fieldTypeId: number;
  fieldProperties: any; // this can be an object, list of objects, or null. Might want to define specific types that this can be
  clusterId: number;
  helperText: string;
  section: number;
  questionOrder: number;
  required: boolean;
  form: null;
}

export interface Form {
  businessObjectKey: string;
  id: Guid;
  version: number;
  type: number;
  isPrivate: boolean;
  name: string;
  description: string;
  tenantId: Guid;
  clusterId: number;
  actionId?: Guid;
  formQuestions: Question[];
  styleOverrides?: StyleOverrides | null;
}

export interface StyleOverrides {
  background?: {
    backgroundImage?: string | null;
    backgroundColor?: string | null;
  };
  headerBackgroundColor?: string|null
  fontFamily?: string;
  helperText?: FontOverrides;
  questionText?: FontOverrides;
  titleText?: FontOverrides;
  paragraphText?: FontOverrides;
}

export interface FontOverrides {
  
  variant?: TypographyVariant;
  fontFamily?: string;
}
