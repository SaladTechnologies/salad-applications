import React from "react";
import { ThemeProvider } from "react-jss";
import { DefaultTheme } from "../src/SaladTheme";

export const ThemeDecorator = (storyFn: Function) => (
  <ThemeProvider theme={DefaultTheme}>{storyFn()}</ThemeProvider>
);
