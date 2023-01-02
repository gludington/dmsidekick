import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { getCompletion, streamCompletion } from "../../../server/openai";

export default async function index(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions);
  const { pid } = req.query;

  if (!session?.user) {
    res.status(403).end();
    return;
  }
  switch (pid) {
    case "chat":
      await monsterChat(req, res);
      break;
    case "test":
      await streamTest(req, res);
      break;
    default:
      res.status(404).end();
  }
}
async function streamTest(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const prompt = req.query.text;
  if (!prompt) {
    res.status(400).json({ error: "a 'text' parameter is required" });
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
  return streamCompletion(prompt as string, res);
}

async function monsterChat(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method not supported" });
    return;
  }
  const text = req?.body?.text;
  if (!text) {
    res.status(400).json("json payload with a 'text' field is required");
    return;
  }
  const textToComplete = (req.body.text +=
    ". Please provide a Dungeons and Dragons 5e stat block in JSON format");
  const completion = await getCompletion(textToComplete);
  let choice = completion.choices[0]?.text;
  if (!choice) {
    res.status(500).json({ error: "unable to get json from openai" });
    return;
  }
  if (choice.indexOf("{") != 0) {
    choice = choice.substring(choice.indexOf("{"));
  }
  res.status(200).json({ response: choice });
  return new Promise((resolve) => resolve());
}
