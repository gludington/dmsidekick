import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { getCompletion } from "../../../server/openai";

export default async function index(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions);
  const { pid } = req.query;
  if (!session?.user) {
    res.status(403).end();
    return;
  }
  switch (pid) {
    case "chat":
      monsterChat(req, res);
      break;
    default:
      res.status(404).end();
  }
}

async function monsterChat(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }
  const text = req?.body?.text;
  if (!text) {
    res.status(400).json("json payload with a 'text' field is required");
    return;
  }
  const completion = await getCompletion(req.body.text);
  res.status(200).json({ response: completion.choices[0]?.text });
}
