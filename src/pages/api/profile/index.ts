import type { NextApiRequest, NextApiResponse } from 'next';

import { getSession } from 'next-auth/react';

import { query as q } from 'faunadb';

import { fauna } from '../../../services/fauna';

import { formatDate } from '../../../lib/formatDate';
import { decryptString, encryptString } from '../../../lib/crypto';

interface RawProfile {
  ref: { id: string };
  data: {
    email: string;
    completed: string;
    ongoing: string;
    lastCompletedDate?: number;
  };
}

const calculateOngoing = (current: number, newValue: number | null) => {
  if (newValue) {
    const sum = current + newValue;

    return sum < 0 ? 0 : sum;
  }

  return current;
};

const calculateCompleted = (current: number, newValue: number | null) => {
  if (newValue) {
    const sum = current + newValue;

    return sum < 0 ? 0 : sum;
  }

  return current;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ error: 'Unauthenticated User' });
    }

    const profile = await fauna.query<RawProfile>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(String(session.user?.email))
        )
      )
    );

    const decryptedProfileData = {
      email: profile.data.email,
      completed: Number(decryptString(profile.data.completed)),
      ongoing: Number(decryptString(profile.data.ongoing)),
      lastCompletedDate: profile.data.lastCompletedDate
    };

    if (session.user?.email !== decryptedProfileData.email) {
      return res.status(403).json({ error: 'Invalid Credentials' });
    }

    if (req.method === 'GET') {
      return res.status(200).json({
        ...decryptedProfileData,
        lastCompletedDate: decryptedProfileData.lastCompletedDate
          ? formatDate(decryptedProfileData.lastCompletedDate)
          : '- - -'
      });
    }

    if (req.method === 'PATCH') {
      const data = {
        ...decryptedProfileData,
        completed: encryptString(
          String(
            calculateCompleted(
              decryptedProfileData.completed,
              req.body.toAddCompleted
            )
          )
        ),
        ongoing: encryptString(
          String(
            calculateOngoing(
              decryptedProfileData.ongoing,
              req.body.toAddOngoing
            )
          )
        ),
        lastCompletedDate: req.body.updateLastCompletedDate
          ? Date.now()
          : decryptedProfileData.lastCompletedDate
      };

      await fauna.query(
        q.Update(q.Ref(q.Collection('users'), profile.ref.id), {
          data
        })
      );

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
