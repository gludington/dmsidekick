import type { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { getCompletion, streamCompletion } from "../../../server/openai";
import { hasRole } from "../../../utils/session";
import { convert, toJSON } from "../../../utils/conversions";
import { prisma } from "../../../server/db/client";
import logger from "../../../server/common/logger";

export default async function index(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions);
  const { pid } = req.query;

  if (!session?.user || !hasRole(session, "MONSTER_CREATOR")) {
    res.status(403).end();
    return;
  }
  switch (pid) {
    case "build":
      await buildMonster(req, res, session);
      break;
    case "chat":
      await streamChat(req, res);
      break;
    case "get":
      await getMonster(req, res);
    default:
      res.status(404).end();
  }
}

async function getMonster(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const param = req.query.id;
  let id;
  if (Array.isArray(param)) {
    id = param[0];
  } else {
    id = param;
  }
  if (!id) {
    res.status(400).json({ error: "an monster id is required" });
    return;
  }
  const monster = await prisma.monster.findUnique({
    select: {
      id: true,
      output: true,
      creator: true,
    },
    where: {
      id: id,
    },
  });

  if (!monster) {
    res.status(404).json({ error: "Not Found" });
    return;
  }
  if (monster.output) {
    return res
      .status(200)
      .json({ id, complete: true, monster: JSON.parse(monster.output) });
  } else {
    return res.status(200).json({ id, complete: false, monster: null });
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

async function sendBuildRequest({
  id,
  prompt,
}: {
  id: string;
  prompt: string;
}) {
  const textToComplete = (prompt +=
    ". Provide a Dungeons and Dragons 5e stat block in JSON format");
  logger.info(`Request ${id} sent`);
  getCompletion(textToComplete).then((completion) => {
    let choice = completion.choices[0]?.text;

    if (!choice) {
      logger.info(
        `${new Date()} unable to get json from openai for request ${id}`
      );
      return;
    }
    if (choice.indexOf("{") != 0) {
      choice = choice.substring(choice.indexOf("{"));
    }
    try {
      const parsed = convert(toJSON(choice));
      logger.info(
        `${new Date()} successful creation for ${id}: ${JSON.stringify(
          parsed
        )})`
      );
      prisma.monster
        .update({
          where: {
            id: id,
          },
          data: {
            output: JSON.stringify(parsed),
          },
        })
        .then((value) => {
          logger.info(`Created monster ${value}`);
        });
    } catch (err) {
      logger.warn(
        `${new Date()} error parsing for ${id}: ${JSON.stringify(err)}`
      );
    }
  });
}

async function buildMonster(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method not supported" });
    return;
  }
  const prompt = req?.body?.text;
  if (!prompt) {
    res.status(400).json("json payload with a 'text' field is required");
    return;
  }
  const created = new Date();
  //user.id is checked before this
  const id = req.body?.id;
  const newMonster = id
    ? await prisma.monster.update({
        where: {
          id: id,
        },
        data: {
          created: created,
          prompt: prompt,
          output: null,
        },
      })
    : await prisma.monster.create({
        select: { id: true },
        data: {
          prompt: prompt,
          created: created,
          userId: session.user?.id as string,
        },
      });
  sendBuildRequest({ id: newMonster.id, prompt });

  res.status(201).json({ id: newMonster.id, created: created });
  return new Promise((resolve) => resolve());
}
