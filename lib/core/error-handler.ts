import { getRelativePath } from "../typescript";
import { SassError } from "node-sass";
import slash from "slash";
import { alerts } from "./alerts";

export const errorHandler = (error: SassError, action?: string) => {
  const { message, file, line, column } = error;
  if (
    typeof file !== "undefined" ||
    typeof line !== "undefined" ||
    typeof column !== "undefined"
  ) {
    const location = file ? `${file}:${line}:${column}` : "";
    let msg = message;
    if (location) {
      msg = msg.replace(location, "").replace(/^[:\s]+/, "");
      msg += ` (${slash(getRelativePath(location))})`;
    }
    alerts.error(msg);
  } else {
    alerts.error(
      `An error occurred ${action}:\n${message || JSON.stringify(error)}`
    );
  }
};
