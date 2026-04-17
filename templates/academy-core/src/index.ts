import React from "react";
import "./styles.css";
import templateMetadata from "../template.json";
import HtmlContent from "./components/composite/HtmlContent";
import ThemeToggle from "./components/composite/ThemeToggle";
import { handlerMap, initTheme } from "./handlers";

const logger = ((window as any).G7Core?.createLogger?.("Template:academy-core")) ?? {
  log: (...args: unknown[]) => console.log("[Template:academy-core]", ...args),
  warn: (...args: unknown[]) => console.warn("[Template:academy-core]", ...args),
  error: (...args: unknown[]) => console.error("[Template:academy-core]", ...args),
};

const createElementComponent = (tagName: string, allowChildren = true) => (props: any) =>
  React.createElement(tagName, props, allowChildren ? props.children : undefined);

export const Div = createElementComponent("div");
export const Span = createElementComponent("span");
export const Button = createElementComponent("button");
export const Input = createElementComponent("input", false);
export const P = createElementComponent("p");
export const Form = createElementComponent("form");
export const Label = createElementComponent("label");
export const Select = createElementComponent("select");
export const Option = createElementComponent("option");
export const Textarea = createElementComponent("textarea");
export const Img = createElementComponent("img", false);
export const Table = createElementComponent("table");
export const Thead = createElementComponent("thead");
export const Tbody = createElementComponent("tbody");
export const Tr = createElementComponent("tr");
export const Th = createElementComponent("th");
export const Td = createElementComponent("td");

export { default as HtmlContent } from "./components/composite/HtmlContent";
export { default as ThemeToggle } from "./components/composite/ThemeToggle";

export const handlers = {
  ...handlerMap,
};

const registerHandlers = () => {
  if (typeof window === "undefined") {
    return true;
  }

  (window as any).G7TemplateHandlers = handlers;

  const actionDispatcher = (window as any).G7Core?.getActionDispatcher?.();
  if (!actionDispatcher) {
    return false;
  }

  Object.entries(handlers).forEach(([name, handler]) => {
    actionDispatcher.registerHandler(name, handler);
  });

  logger.log("Template handlers registered:", Object.keys(handlers));
  return true;
};

export { templateMetadata };

export function initTemplate() {
  if (typeof window === "undefined") {
    return;
  }

  let retryCount = 0;
  const maxRetries = 50;

  const bootstrap = () => {
    const registered = registerHandlers();

    if (!registered) {
      retryCount += 1;
      if (retryCount <= maxRetries) {
        window.setTimeout(bootstrap, 100);
      } else {
        logger.warn("ActionDispatcher registration timed out; exposed handler map remains available.");
      }
    }
  };

  initTheme();

  if (document.readyState === "complete") {
    bootstrap();
    return;
  }

  window.addEventListener("load", bootstrap, { once: true });
}

initTemplate();
