import Head from 'next/head';
import { useRouter } from 'next/router';

import { getSession, useSession } from 'next-auth/react';

import { useMutation } from 'react-query';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import * as yup from 'yup';

import { query as q } from 'faunadb';

import { fauna } from '../../services/fauna';
import { api } from '../../services/api';

import { decryptString } from '../../lib/crypto';
import { withAuth } from '../../lib/withAuth';
import { queryClient } from '../../lib/queryClient';
import { toast } from '../../lib/toast';

import { IdeaQueryResponse } from '../api/ideas/[id]';

import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Textarea } from '../../components/Textarea';
import { Idea } from '../../components/Ideas';

interface EditIdeaFormData {
  title: string;
  'notion-url': string;
  'figma-url': string;
  goal: string;
}

interface EditIdeaProps {
  idea: Idea;
}

const editIdeaFormSchema = yup.object().shape(
  {
    title: yup.string().required('Title required'),
    'notion-url': yup
      .string()
      .nullable()
      .notRequired()
      .when('notion-url', {
        is: (value: string) => value?.length,
        then: (rule) =>
          rule.matches(/^https:\/\/notion.so/, 'Must be a valid Notion URL')
      }),
    'figma-url': yup
      .string()
      .nullable()
      .notRequired()
      .when('figma-url', {
        is: (value: string) => value?.length,
        then: (rule) =>
          rule.matches(/^https:\/\/figma.com/, 'Must be a valid Figma URL')
      }),
    goal: yup.string().required('Goal required')
  },
  [
    ['notion-url', 'notion-url'],
    ['figma-url', 'figma-url']
  ]
);

export default function EditIdea({ idea }: EditIdeaProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { id, title, figmaUrl, goal, notionUrl } = idea;

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<EditIdeaFormData>({
    resolver: yupResolver(editIdeaFormSchema)
  });

  const editIdea = useMutation(
    async (idea: EditIdeaFormData) => {
      const { title, goal } = idea;

      await api.patch(`/ideas/${id}`, {
        title,
        notionUrl: idea['notion-url'],
        figmaUrl: idea['figma-url'],
        goal
      });
    },
    {
      onSuccess() {
        queryClient.invalidateQueries();
      }
    }
  );

  const completeIdea = useMutation(
    async () => {
      await api.delete(`/ideas/${id}`);
      await api.patch('profile', {
        toAddOngoing: -1,
        toAddCompleted: 1,
        updateLastCompletedDate: true
      });
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(`@${session?.user?.email}:profile`);
        queryClient.resetQueries(`@${session?.user?.email}:ideas`);
      }
    }
  );

  const handleEditIdea = handleSubmit(async (data) => {
    try {
      await editIdea.mutateAsync(data);

      toast('Idea successfully saved!', 'success');

      return router.push('/dashboard');
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log(error);
      }

      toast('Something went wrong :(', 'error');
    }
  });

  const handleCompleteIdea = async () => {
    try {
      await completeIdea.mutateAsync();

      toast('Idea successfully completed!', 'success');

      return router.push('/dashboard');
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log(error);
      }

      toast('Something went wrong :(', 'error');
    }
  };

  return (
    <>
      <Head>
        <meta name="author" content="Wendell Kenneddy" />
        <meta name="description" content="Edit an idea." />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Devideas | Edit Idea" />
        <meta property="og:site_name" content="Devideas | Edit Idea" />
        <meta property="og:description" content="Edit an idea." />
        <meta property="og:locale" content="en-US" />
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:title" content="Devideas | Edit Idea" />
        <meta property="twitter:description" content="Edit an idea." />
        <title>Devideas | Edit Idea</title>
      </Head>

      <main className="w-full max-w-[720px] mx-auto px-4">
        <section className="bg-neutral-900 shadow-md p-4">
          <div className="border-b-[1px] border-b-white/25 pb-4 mb-6">
            <h2 className="font-bold text-2xl tracking-wide">Edit Idea</h2>
          </div>

          <form onSubmit={handleEditIdea}>
            <Input
              defaultValue={title}
              label="Title"
              labelFor="title"
              placeholder="Title"
              additionalStyles="mb-4"
              {...register('title')}
              error={errors.title}
            />

            <Input
              defaultValue={notionUrl ?? ''}
              label="Notion URL"
              labelFor="notion-url"
              placeholder="Notion URL"
              additionalStyles="mb-4"
              {...register('notion-url')}
              error={errors['notion-url']}
            />

            <Input
              defaultValue={figmaUrl ?? ''}
              label="Figma URL"
              labelFor="figma-url"
              placeholder="Figma URL"
              additionalStyles="mb-4"
              {...register('figma-url')}
              error={errors['figma-url']}
            />

            <Textarea
              defaultValue={goal}
              label="Goal"
              labelFor="goal"
              placeholder="Goal"
              rows={5}
              additionalStyles="mb-4"
              {...register('goal')}
              error={errors.goal}
            />

            <div className="columns-2">
              <Button
                variant="contained"
                color="primary"
                additionalStyles="w-full"
                type="submit"
                isLoading={isSubmitting || completeIdea.isLoading}
              >
                Save
              </Button>

              <Button
                variant="outlined"
                color="primary"
                additionalStyles="w-full"
                type="button"
                isLoading={isSubmitting || completeIdea.isLoading}
                onClick={() => handleCompleteIdea()}
              >
                Complete
              </Button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}

export const getServerSideProps = withAuth(async (ctx) => {
  const id = ctx.params?.id;
  const session = await getSession(ctx);
  const idea = await fauna.query<IdeaQueryResponse>(
    q.Get(q.Ref(q.Collection('ideas'), id))
  );

  if (session?.user?.email !== idea.data.userEmail) {
    return {
      notFound: true
    };
  }

  const formattedIdea = {
    id: idea.ref.id,
    title: decryptString(idea.data.title),
    notionUrl: decryptString(idea.data.notionUrl ?? ''),
    figmaUrl: decryptString(idea.data.figmaUrl ?? ''),
    goal: decryptString(idea.data.goal)
  };

  return {
    props: {
      idea: formattedIdea
    }
  };
});
