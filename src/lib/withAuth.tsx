import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult
} from 'next';
import { getSession } from 'next-auth/react';

export function withAuth<P>(fn: GetServerSideProps<P>) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    try {
      const session = await getSession({ ctx });

      if (!session) {
        return {
          redirect: {
            destination: '/login',
            permanent: false
          }
        };
      }

      return await fn(ctx);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log(error);
      }

      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      };
    }
  };
}
