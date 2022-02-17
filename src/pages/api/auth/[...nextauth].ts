import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import DiscordProvider from 'next-auth/providers/discord';

import { query as q } from 'faunadb';
import { fauna } from '../../../services/fauna';
import { encryptString } from '../../../lib/crypto';

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET
    })
  ],
  callbacks: {
    async signIn({ account, profile, user }) {
      const email = user.email;

      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(q.Index('user_by_email'), q.Casefold(String(email)))
              )
            ),
            q.Create(q.Collection('users'), {
              data: {
                email,
                completed: encryptString(String(0)),
                ongoing: encryptString(String(0))
              }
            }),
            null
          )
        );

        return true;
      } catch (error) {
        return false;
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET as string
});
