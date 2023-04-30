import { MessageType } from "@/pages/modes/interviewmode ";
import { generateGPT3Response } from "@/utils/Gpt3API ";
import { toast } from "react-hot-toast";

interface Props {
  messages: MessageType[];
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  jobDescription: string;
  setJobDescription: React.Dispatch<React.SetStateAction<string>>;
  companyDescription: string;
  setCompanyDescription: React.Dispatch<React.SetStateAction<string>>;
  experience: string;
  setExperience: React.Dispatch<React.SetStateAction<string>>;
}

const minChar = 20;

const RequiredInfo: React.FC<Props> = (props) => {
  const {
    messages,
    setMessages,
    tags,
    setTags,
    jobDescription,
    setJobDescription,
    companyDescription,
    setCompanyDescription,
    experience,
    setExperience,
  } = props;

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value) {
      setTags([...tags, e.currentTarget.value]);
      e.currentTarget.value = "";
    } else if (e.key === "Backspace" && e.currentTarget.value === "") {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (jobDescription === "" || companyDescription === "" || experience === "" || tags.length === 0) {
        toast.error("Please fill all the fields");
        return;
    } 
    // check all the field characters length to be greater than 10, if they are less than 10, then show toast error and return
    if (jobDescription.length < minChar || companyDescription.length < minChar || experience.length < minChar || tags.length < 1) {
        toast.error(`Please fill all the fields with atleast ${minChar} characters and atleast one tag`);
        return;
    }
  
    // Add a loader for the GPT-3 response
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + 1, text: "", isUser: false, isLoading: true },
    ]);

    const appendGpt3Response = (response: string) => {
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];

        if (lastMessage && !lastMessage.isUser) {
          // Update the last GPT-3 message with the new response chunk
          return prev.map((message) =>
            message.id === lastMessage.id
              ? { ...message, text: message.text + response, isLoading: false }
              : message
          );
        } else {
          // If the last message is from the user, create a new GPT-3 message
          return [
            ...prev,
            { id: Date.now(), text: response, isUser: false, isLoading: false },
          ];
        }
      });
    };

    const prompt = `You're an interviewer currently interviewing a candidate for a job for your company.\n\n Job Description: ${jobDescription}\n\nCompany Description: ${companyDescription}\n\nExperience: ${experience}\n\nCandidateSkills: ${tags.join(",")}\n\n
    Firstly tell the candidate whether he/she has the qualification for the job or not. Then Start the interview with the question you want to ask the candidate. \n\nQuestion: `

    console.log(prompt);
    // Send transcribedText to GPT-3 and get the response
    await generateGPT3Response(prompt, appendGpt3Response);

};

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-semibold text-center my-8">
        Interview Mode
      </h1>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Job Description</h2>
          <p className="mb-4">
            Provide a brief description of the job you are applying for.
          </p>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full h-32 p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Short Note on About Company
          </h2>
          <p className="mb-4">
            Provide a brief note about the company you are applying to.
          </p>
          <textarea
            value={companyDescription}
            onChange={(e) => setCompanyDescription(e.target.value)}
            className="w-full h-32 p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Enter your experience</h2>
          <p className="mb-4">
            Describe your professional experience relevant to this position.
          </p>
          <textarea
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full h-32 p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Enter your skills</h2>
          <p className="mb-4">
            Enter the skills that make you a suitable candidate for this
            position.
          </p>
          <div className="border border-gray-300 rounded p-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-blue-100 text-blue-800 mr-2 mb-2"
              >
                {tag}
                <button onClick={() => removeTag(index)} className="ml-2 p-1">
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              className="outline-none"
              onKeyDown={handleTagInput}
              placeholder="Type a skill and press Enter"
            />
          </div>
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="mt-8 py-2 px-4 bg-blue-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Submit
      </button>
    </div>
  );
};

export default RequiredInfo;
