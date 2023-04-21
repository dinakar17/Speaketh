import ReactMarkdown from 'react-markdown';
import Draggable from 'react-draggable';



function MyComponent() {
  function preprocessMarkdown(markdownString: string) {
    // Add newline character before each numbered point and hyphen with spaces on both sides
    const withNewLines = markdownString.replace(/(\d+\.|\s-\s)/g, '\n$1');
  
    // Add bold markdown for words between double quotes
    const withBoldQuotes = withNewLines.replace(/"([^"]*)"/g, '**$1**');
  
    return withBoldQuotes;
  }

  const rawMarkdownContent = `
  1. Feedback on the relevance, word choice, and sentence structure of the "User's Speech": - Your speech is highly relevant to the slide text as it explains the purpose and scope of the project you have submitted. - You have used appropriate words and phrases to convey your message clearly, but some sentences could be restructured for better flow and impact. - Instead of saying "The main theme of the website is to provide or create a platform where all the things that happen in college," you can try "The website aims to serve as a comprehensive platform for documenting and sharing all college-related events and activities." - Similarly, instead of saying "be it in events, cultural activities, aluminized ceremonies, research projects, final projects, etc. etc.," you can try "including but not limited to events, cultural activities, alumni ceremonies, research and final projects, and more." 2. Revised "User's Speech" incorporating the feedback: - "Hello, my name is Dhanakar"
  `;

  const markdownContent = preprocessMarkdown(rawMarkdownContent);

  return (
    <Draggable axis='y'>
    <div className="w-[90%] lg:w-[70%] mx-auto p-2 prose prose-sm max-w-screen-xl prose-indigo md:prose-base dark:prose-invert overflow-auto">
      <ReactMarkdown>{markdownContent}</ReactMarkdown>
    </div>
    </Draggable>
  );
}


export default MyComponent;