import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";

import { authOptions } from "../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";

function asInt(param: string | string[] | undefined, fallback: number): number {
  if (!param) {
    return fallback;
  }
  return Array.isArray(param) ? parseInt(String(param)) : parseInt(param);
}

export default async function index(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session?.user) {
    res.status(403);
    res.end();
  }
  if (req.method === "POST") {
    const created = await prisma.monster.create({
      data: {
        created: new Date(),
        prompt: "",
        userId: session?.user?.id as string,
        output: JSON.stringify(req.body),
      },
    });
    return res.status(200).json({
      id: created.id,
      complete: true,
      monster: { ...JSON.parse(created.output as string), id: created.id },
    });
  } else {
    await getMonsters(req, res);
  }

  async function getMonsters(req: NextApiRequest, res: NextApiResponse) {
    console.warn(req.method);
    const reqParams = req.query;

    const page = asInt(reqParams.page, 1) - 1;
    const size = asInt(reqParams.size, 10);

    const params = {
      where: { userId: session?.user?.id, output: { not: null } },
    };

    const results = await prisma.$transaction([
      prisma.monster.count(params),
      prisma.monster.findMany({ ...params, skip: page * size, take: size }),
    ]);
    res.status(200).send({
      page: page,
      size: size,
      total: results[0],
      content: results[1].map((m) => {
        if (m.output) {
          return { id: m.id, ...JSON.parse(m.output) };
        } else {
          return m;
        }
      }),
    });
  }
}
