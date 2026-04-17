import React from "react";

type HtmlContentProps = {
  content?: string;
  className?: string;
  isHtml?: boolean | string;
};

const toBoolean = (value: HtmlContentProps["isHtml"]): boolean => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value === "true";
  }

  return false;
};

const HtmlContent = ({
  content = "",
  className,
  isHtml = true,
}: HtmlContentProps) => {
  const resolvedContent = typeof content === "string" ? content : "";
  const resolvedIsHtml = toBoolean(isHtml);

  if (!resolvedIsHtml) {
    return React.createElement(
      "div",
      {
        className,
        style: {
          whiteSpace: "pre-wrap",
        },
      },
      resolvedContent,
    );
  }

  return React.createElement("div", {
    className,
    dangerouslySetInnerHTML: {
      __html: resolvedContent,
    },
  });
};

export default HtmlContent;
