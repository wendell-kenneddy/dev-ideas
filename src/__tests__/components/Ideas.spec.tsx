import { render, screen } from '@testing-library/react';

import { Ideas } from '../../components/Ideas';

const ideas = [
  {
    id: 1,
    title: 'NodeJS API',
    notionUrl: 'https://notion.so/something',
    figmaUrl: 'https://notion.so/something',
    goal: 'To build an amazing API with Node.'
  },
  {
    id: 2,
    title: 'Elixir API',
    notionUrl: undefined,
    figmaUrl: undefined,
    goal: 'To build an amazing API with Elixir.'
  }
];

describe('Ideas Component', () => {
  it('should be able to render correctly', () => {
    render(<Ideas ideas={ideas} isLoading={false} />);

    const firstTitle = screen.getByText('NodeJS API');
    const secondTitle = screen.getByText('Elixir API');

    const notionLinks = screen.getAllByText('Notion');
    const figmaLinks = screen.getAllByText('Figma');

    expect(firstTitle).toBeInTheDocument();
    expect(secondTitle).toBeInTheDocument();
    expect(firstTitle.closest('a')).toHaveAttribute(
      'href',
      `/ideas/${ideas[0].id}`
    );
    expect(secondTitle.closest('a')).toHaveAttribute(
      'href',
      `/ideas/${ideas[1].id}`
    );

    expect(notionLinks.length).toBe(2);
    expect(figmaLinks.length).toBe(2);

    expect(notionLinks[0].closest('a')).toHaveAttribute(
      'href',
      ideas[0].notionUrl
    );
    expect(figmaLinks[0].closest('a')).toHaveAttribute(
      'href',
      ideas[0].figmaUrl
    );

    expect(notionLinks[1].closest('a')).not.toBeInTheDocument();
    expect(figmaLinks[1].closest('a')).not.toBeInTheDocument();
  });

  it('should be able to render a loading state if isLoading is true', () => {
    render(<Ideas ideas={[]} isLoading={true} />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should be able to render an empty state if no idea is passed', () => {
    render(<Ideas ideas={[]} isLoading={false} />);

    expect(screen.getByText('Wow, so empty...')).toBeInTheDocument();
    expect(screen.getByAltText('Cat image')).toBeInTheDocument();
  });
});
