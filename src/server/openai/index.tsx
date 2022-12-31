import type {
  CreateCompletionResponse,
  ListEnginesResponse,
  ListModelsResponse,
} from "openai";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization: process.env.OPEN_AI_ORGANIZATION_ID,
  apiKey: process.env.OPEN_AI_API_KEY,
});

console.warn("WTF", process.env);
const openAi = new OpenAIApi(configuration);

export const getEngines = async (): Promise<ListEnginesResponse> => {
  const response = await openAi.listEngines();
  return response.data;
};

export const getModels = async (): Promise<ListModelsResponse> => {
  const response = await openAi.listModels();
  return response.data;
};

export const getCompletion = async (
  text: string
): Promise<CreateCompletionResponse> => {
  const response = await openAi.createCompletion({
    model: "text-davinci-003",
    prompt: text,
    max_tokens: 1000,
    temperature: 0,
  });
  return response.data;
};
