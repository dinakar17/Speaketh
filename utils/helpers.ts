// utils/helpers.ts

import facts from "./facts.json";

export const getRandomFact = () => {
  const randomIndex = Math.floor(Math.random() * facts.length);
  return facts[randomIndex];
};

export function preprocessMarkdown(markdownString: string) {
  // Add newline character before each numbered point and hyphen with spaces on both sides
  const withNewLines = markdownString.replace(/(\d+\.|\s-\s)/g, "\n$1"); 

  // Add bold markdown for words between double quotes
  const withBoldQuotes = withNewLines.replace(/"([^"]*)"/g, "**$1**");

  return withBoldQuotes;
}

export const fetchRandomTitle = async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex].title;
};