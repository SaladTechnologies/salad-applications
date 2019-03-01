import React from "react";
import { storiesOf } from "@storybook/react";
import { InfoButton } from "./InfoButton";

storiesOf("Components/InfoButton", module).add("with text", () => {
  return (
    <div>
      <InfoButton text={"This is a test of a help button"} />
    </div>
  );
});
