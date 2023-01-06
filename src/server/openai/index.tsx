import { NextApiRequest, NextApiResponse } from "next";
import type {
  CreateCompletionResponse,
  ListEnginesResponse,
  ListModelsResponse,
} from "openai";
import { Configuration, OpenAIApi } from "openai";
import fetch from "node-fetch";
import logger from "../common/logger";

const configuration = new Configuration({
  organization: process.env.OPEN_AI_ORGANIZATION_ID,
  apiKey: process.env.OPEN_AI_API_KEY,
});

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
    max_tokens: 2000,
    temperature: 0,
  });
  return response.data;
};

export const streamCompletion = async (
  prompt: string,
  res: NextApiResponse
): Promise<void> => {
  if (!prompt) {
    res.status(400).json({ error: "a 'text' parameter is required" });
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
  const reqBody = JSON.stringify({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0.6,
    max_tokens: 512,
    top_p: 1.0,
    frequency_penalty: 0.5,
    presence_penalty: 0.7,
    stream: true,
  });
  const response = await fetch("https://api.openai.com/v1/completions", {
    body: reqBody,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.OPEN_AI_API_KEY,
    },
  });
  if (!response.ok) {
    throw new Error(`unexpected response ${response.statusText}`);
  }
  return new Promise(async (resolve, reject) => {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "text/event-stream; charset=utf-8",
      "Content-Encoding": "none",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    });
    res.flushHeaders();
    res.write(Buffer.from("retry: 1000\n\n"));
    try {
      for await (const chunk of response?.body as any) {
        if (response.body) {
          const output = chunk.toString().substring(5);
          if (output.indexOf("[DONE]") === 1) {
            logger.debug("DONE");
            res.write(Buffer.from("data: [DONE]\n\n"));
            res.end();
            resolve();
          } else {
            try {
              const json = JSON.parse(output);
              res.write(
                Buffer.from("data: " + json.choices[0].text + "\n\n", "utf-8")
              );
            } catch (err) {
              logger.warn({ error: err, output: output });
            }
          }
        } else {
          logger.warn("No chunk, aborting");
          res.end();
          resolve();
        }
      }
    } catch (err: any) {
      console.warn("error from ChatGPT", err.stack);
      res.end();
      resolve();
    }
  });
};
