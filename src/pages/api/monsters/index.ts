import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";
import logger from "../../../server/common/logger";
import { authOptions } from "../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";

export default async function index(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session?.user) {
    res.status(403);
    res.end();
  }
  const monsters = await prisma.monster.findMany({
    where: {
      userId: session?.user?.id,
      output: {
        not: null,
      },
    },
    skip: 1,
    take: 2,
  });
  res.status(200).send(
    monsters.map((m) => {
      return { id: m.id, ...JSON.parse(m.output) };
    })
  );
}
