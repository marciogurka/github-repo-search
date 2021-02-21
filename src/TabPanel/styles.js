import styled from "styled-components";
import { List } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

export const FullWidthAlert = styled(Alert)`
  width: 100%;
`;

export const CustomList = styled(List)`
  max-height: 600px;
  overflow: auto;
`;
