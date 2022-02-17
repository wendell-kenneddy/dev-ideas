import { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from 'next-auth/react';

import { query as q } from 'faunadb';

import { fauna } from '../../../services/fauna';

import { formatDate } from '../../../lib/formatDate';
import { decryptString, encryptString } from '../../../lib/crypto';

export interface IdeaQueryResponse {
  ref: { id: string };
  data: {
    userEmail: string;
    title: string;
    notionUrl?: string;
    figmaUrl?: string;
    goal: string;
    updatedAt: number;
  };
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

    const id = String(req.query.id);
    const idea = await fauna.query<IdeaQueryResponse>(
      q.Get(q.Ref(q.Collection('ideas'), id))
    );

    if (idea.data.userEmail !== session.user?.email) {
      return res.status(403).json({ error: 'Invalid Credentials' });
    }

    if (req.method === 'GET') {
      return res.status(200).json({
        id: idea.ref.id,
        title: decryptString(idea.data.title),
        notionUrl: decryptString(idea.data.notionUrl ?? ''),
        figmaUrl: decryptString(idea.data.figmaUrl ?? ''),
        goal: decryptString(idea.data.goal),
        updatedAt: formatDate(idea.data.updatedAt)
      });
    }

    if (req.method === 'PATCH') {
      await fauna.query(
        q.Update(q.Ref(q.Collection('ideas'), id), {
          data: {
            title: encryptString(req.body.title),
            notionUrl: encryptString(req.body.notionUrl ?? idea.data.notionUrl),
            figmaUrl: encryptString(req.body.figmaUrl ?? idea.data.figmaUrl),
            goal: encryptString(req.body.goal),
            updatedAt: Date.now()
          }
        })
      );

      return res.status(200).json({ success: 'true' });
    }

    if (req.method === 'DELETE') {
      await fauna.query(q.Delete(q.Ref(q.Collection('ideas'), id)));

      return res.status(200).json({ success: 'true' });
    }

    return res.status(501).json({ error: 'Method Not Allowed' });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log(error);
    }

    return res.status(500).json({ error: 'Something Went Wrong' });
  }
}
