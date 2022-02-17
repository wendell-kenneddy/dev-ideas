import Head from 'next/head';
import { useRouter } from 'next/router';

import { useSession } from 'next-auth/react';

import { withAuth } from '../../lib/withAuth';

import { useMutation } from 'react-query';
import { queryClient } from '../../lib/queryClient';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import * as yup from 'yup';

import { api } from '../../services/api';

import { toast } from '../../lib/toast';

import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Textarea } from '../../components/Textarea';

interface CreateIdeaFormData {
  title: string;
  'notion-url': string;
  'figma-url': string;
  goal: string;
}

const createIdeaFormSchema = yup.object().shape(
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

export default function CreateIdea() {
  const { data: session } = useSession();
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<CreateIdeaFormData>({
    resolver: yupResolver(createIdeaFormSchema)
  });

  const createIdea = useMutation(
    async (idea: CreateIdeaFormData) => {
      const { title, goal } = idea;

      await api.post('/ideas', {
        title,
        notionUrl: idea['notion-url'],
        figmaUrl: idea['figma-url'],
        goal
      });

      await api.patch('/profile', {
        toAddOngoing: 1
      });
    },
    {
      onSuccess() {
        queryClient.invalidateQueries();
      }
    }
  );

  const handleCreateIdea = handleSubmit(async (data) => {
    try {
      await createIdea.mutateAsync(data);

      toast('Idea successfully created!', 'success');

      return router.push('/dashboard');
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log(error);
      }

      toast('Something went wrong :(', 'error');
    }
  });

  return (
    <>
      <Head>
        <meta name="author" content="Wendell Kenneddy" />
        <meta name="description" content="Create a new idea." />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Devideas | Create Idea" />
        <meta property="og:site_name" content="Devideas | Create Idea" />
        <meta property="og:description" content="Create a new idea." />
        {/* <meta property="og:url" content="" /> */}
        <meta property="og:locale" content="en-US" />
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:title" content="Devideas | Create Idea" />
        <meta property="twitter:description" content="Create a new idea." />
        {/* <meta property="twitter:url" content="" /> */}
        <title>Devideas | Create Idea</title>
        {/* <link rel="canonical" href="" /> */}
      </Head>

      <main className="w-full max-w-[720px] mx-auto px-4 mb-4">
        <section className="bg-neutral-900 shadow-md p-4">
          <div className="border-b-[1px] border-b-white/25 pb-4 mb-6">
            <h2 className="font-bold text-2xl tracking-wide">Create Idea</h2>
          </div>

          <form onSubmit={handleCreateIdea}>
            <Input
              label="Title"
              labelFor="title"
              placeholder="Title"
              additionalStyles="mb-4"
              {...register('title')}
              error={errors.title}
            />

            <Input
              label="Notion URL"
              labelFor="notion-url"
              placeholder="Notion URL"
              additionalStyles="mb-4"
              {...register('notion-url')}
              error={errors['notion-url']}
            />

            <Input
              label="Figma URL"
              labelFor="figma-url"
              placeholder="Figma URL"
              additionalStyles="mb-4"
              {...register('figma-url')}
              error={errors['figma-url']}
            />

            <Textarea
              label="Goal"
              labelFor="goal"
              placeholder="Goal"
              rows={5}
              additionalStyles="mb-4"
              {...register('goal')}
              error={errors.goal}
            />

            <Button
              variant="contained"
              color="primary"
              additionalStyles="w-full"
              type="submit"
              isLoading={isSubmitting}
            >
              Create
            </Button>
          </form>
        </section>
      </main>
    </>
  );
}

export const getServerSideProps = withAuth(async (ctx) => ({ props: {} }));
