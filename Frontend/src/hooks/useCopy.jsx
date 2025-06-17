// useCopyToClipboard.js
import { useState } from "react";

export const useCopy = () => {
  const [copied, setCopied] = useState(false);

  const copy = (value) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 5000);
  };

  return { copied, copy };
};
