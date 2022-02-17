import { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from 'next-auth/react';

import { query as q } from 'faunadb';
import { fauna } from '../../../services/fauna';

import { formatDate } from '../../../lib/formatDate';
import { decryptString, encryptString } from '../../../lib/crypto';

interface IdeasQueryResponse {
  after?: {
    id: string;
  }[];
  data: {
    ts: number;
    ref: {
      id: string;
    };
    data: {
      userEmail: string;
      title: string;
      notionUrl?: string;
      figmaUrl?: string;
      goal: string;
      updatedAt: number;
    };
  }[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ error: 'Unauthenticated User' });
    }

    if (req.method === 'POST') {
      const { title, notionUrl, figmaUrl, goal } = req.body;

      await fauna.query(
        q.Create(q.Collection('ideas'), {
          data: {
            userEmail: session.user?.email,
            title: encryptString(title),
            notionUrl: encryptString(notionUrl ?? ''),
            figmaUrl: encryptString(figmaUrl ?? ''),
            goal: encryptString(goal),
            updatedAt: Date.now()
          }
        })
      );

      return res.status(200).json({ success: 'true' });
    }

    if (req.method === 'GET') {
      const { after } = req.query;

      const queryOptions = {
        after,
        ...(after && { after: q.Ref(q.Collection('ideas'), after) }),
        size: 12
      };

      const response = await fauna.query<IdeasQueryResponse>(
        q.Map(
          q.Paginate(
            q.Match(q.Index('idea_by_user_email'), String(session.user?.email)),
            queryOptions
          ),
          q.Lambda('X', q.Get(q.Var('X')))
        )
      );

      const formattedIdeas = response.data.map((idea) => ({
        title: decryptString(idea.data.title),
        notionUrl: decryptString(idea.data.notionUrl ?? ''),
        figmaUrl: decryptString(idea.data.figmaUrl ?? ''),
        goal: decryptString(idea.data.goal),
        updatedAt: formatDate(idea.data.updatedAt),
        id: idea.ref.id
      }));

      return res.status(200).json({
        data: formattedIdeas,
        after: response.after ? response.after[0].id : null
      });
    }

    return res.status(501).json({ error: 'Method Not Allowed' });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log(error);
    }

    return res.status(500).json({ error: 'Something Went Wrong' });
  }
}
