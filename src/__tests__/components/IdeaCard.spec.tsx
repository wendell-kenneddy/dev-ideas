import { render, screen } from '@testing-library/react';

import { IdeaCard } from '../../components/IdeaCard';

const idea = {
  id: 1011,
  title: 'My Idea',
  notionUrl: 'https://notion.so/something',
  figmaUrl: 'https://figma.com/something',
  goal: 'An amazing idea.'
};

describe('IdeaCard Component', () => {
  it('should be able to render correctly', () => {
    render(<IdeaCard idea={idea} />);

    const title = screen.getByText(idea.title);
    const notionUrl = screen.getByText('Notion');
    const figmaUrl = screen.getByText('Figma');

    expect(title).toBeInTheDocument();
    expect(title.closest('a')).toHaveAttribute('href', '/ideas/1011');

    expect(screen.getByTitle('Arrow icon')).toBeInTheDocument();

    expect(screen.getByText(idea.goal)).toBeInTheDocument();

    expect(notionUrl).toBeInTheDocument();
    expect(notionUrl.closest('a')).toHaveAttribute('href', idea.notionUrl);

    expect(figmaUrl).toBeInTheDocument();
    expect(figmaUrl.closest('a')).toHaveAttribute('href', idea.figmaUrl);
  });

  it('should not render a link to notion if notionUrl is undefined', () => {
    render(<IdeaCard idea={{ ...idea, notionUrl: undefined }} />);

    const notionUrl = screen.getByText('Notion');

    expect(notionUrl.closest('a')).not.toBeInTheDocument();
  });

  it('should not render a link to figma if figmaUrl is undefined', () => {
    render(<IdeaCard idea={{ ...idea, figmaUrl: undefined }} />);

    const figmaUrl = screen.getByText('Figma');

    expect(figmaUrl.closest('a')).not.toBeInTheDocument();
  });
});
