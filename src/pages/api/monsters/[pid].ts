import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { getCompletion, streamCompletion } from "../../../server/openai";
import { hasRole } from "../../../utils/session";
import { convert, toJSON } from "../../../utils/conversions";
export default async function index(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions);
  const { pid } = req.query;

  if (!session?.user || !hasRole(session, "MONSTER_CREATOR")) {
    res.status(403).end();
    return;
  }
  switch (pid) {
    case "build":
      await buildMonster(req, res);
      break;
    case "chat":
      await streamChat(req, res);
      break;
    default:
      res.status(404).end();
  }
}
async function streamChat(
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

async function buildMonster(
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
  try {
    const parsed = convert(toJSON(choice));
    res.status(200).json(parsed);
  } catch (err) {
    res.status(500).json({ error: err, rawResponse: choice });
  }

  return new Promise((resolve) => resolve());
}
