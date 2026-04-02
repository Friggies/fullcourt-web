import { cn, stripMarkdown, truncate } from '@/lib/utils';

test('stripMarkdown removes code blocks, inline code, links, images, and formatting', () => {
  //Arrange
  const md = `
# Title

Some **bold** text, _italic_, and ~~strike~~.

\`inline code\`

\`\`\`ts
const x = 1;
\`\`\`

![alt](https://example.com/img.png)
[link text](https://example.com)

> quote
- list item
`;

  //Act
  const result = stripMarkdown(md);

  //Assert
  expect(result).toContain('Title');
  expect(result).toContain('Some');
  expect(result).toContain('bold');
  expect(result).toContain('italic');
  expect(result).toContain('strike');

  expect(result).not.toContain('```');
  expect(result).not.toContain('inline code');
  expect(result).not.toContain('https://example.com');
  expect(result).not.toContain('[');
  expect(result).not.toContain(']');
  expect(result).not.toContain('!');
  expect(result).not.toContain('#');
});

test('truncate returns original string when within max length', () => {
  //Arrange
  const s = 'short';

  //Act
  const out = truncate(s, 10);

  //Assert
  expect(out).toBe('short');
});

test('truncate shortens and appends an ellipsis when exceeding max length', () => {
  //Arrange
  const s = 'abcdefghijklmnopqrstuvwxyz';

  //Act
  const out = truncate(s, 10);

  //Assert
  expect(out.endsWith('…')).toBe(true);
  expect(out.length).toBeLessThanOrEqual(10);
});

test('cn merges tailwind class conflicts using tailwind-merge', () => {
  //Arrange / Act
  const out = cn('p-2', 'p-4');

  //Assert
  expect(out).toContain('p-4');
  expect(out).not.toContain('p-2');
});
