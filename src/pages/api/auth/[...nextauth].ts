import NextAuth, { type User, type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

async function getRoles(user: User) {
  if (user?.id) {
    return await prisma.role.findMany({
      where: {
        users: {
          some: {
            userId: user.id,
          },
        },
      },
    });
  } else {
    return [];
  }
}

async function createRoles(user: User) {
  const toAdd = [];
  const codes = [];
  const userRole = await prisma.role.findFirst({
    where: { code: "USER" },
  });
  if (userRole) {
    toAdd.push({ userId: user.id, roleId: userRole.id });
    codes.push("USER");
  }

  if (user.email) {
    const invited = await prisma.invited.findFirst({
      where: {
        email: user.email,
      },
    });
    if (invited) {
      const monsterCreatorRole = await prisma.role.findFirst({
        where: { code: "MONSTER_CREATOR" },
      });
      if (monsterCreatorRole) {
        toAdd.push({ userId: user.id, roleId: monsterCreatorRole.id });
        codes.push("MONSTER_CREATOR");
      }
      await prisma.invited.delete({ where: { id: invited.id } });
    }
  }

  if (toAdd.length > 0) {
    await prisma.rolesOnUsers.createMany({
      data: toAdd,
    });
  }
  return codes;
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    async signIn({}) {
      return true;
    },
    // Include user.id on session
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        const roles = await getRoles(session.user);
        if (roles.length == 0) {
          const codes = await createRoles(user);
          session.user.roles = codes;
        } else {
          session.user.roles = roles.map((role) => role.code);
        }
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
};
export default NextAuth(authOptions);
