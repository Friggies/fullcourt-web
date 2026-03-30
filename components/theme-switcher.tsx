'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Moon, Sun, SunMoon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

const ThemeSwitcher = () => {
  // Hide theme-dependent UI until after hydration because `next-themes`
  // cannot know the active theme during SSR, and the old `mounted` +
  // `useEffect` pattern is now flagged by the React hooks lint rule.
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const { theme, setTheme } = useTheme();

  if (!isClient) {
    return null;
  }

  const ICON_SIZE = 16;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="bg-accent border p-6 shadow-sm rounded-lg"
          variant="ghost"
          size={'sm'}
        >
          {theme === 'light' ? (
            <Sun
              key="light"
              size={ICON_SIZE}
              className={'text-muted-foreground'}
            />
          ) : theme === 'dark' ? (
            <Moon
              key="dark"
              size={ICON_SIZE}
              className={'text-muted-foreground'}
            />
          ) : (
            <SunMoon
              key="system"
              size={ICON_SIZE}
              className={'text-muted-foreground'}
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-content" align="start">
        <DropdownMenuRadioGroup value={theme} onValueChange={e => setTheme(e)}>
          <DropdownMenuRadioItem className="flex gap-2" value="light">
            <Sun size={ICON_SIZE} className="text-muted-foreground" />{' '}
            <span>Light</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2" value="dark">
            <Moon size={ICON_SIZE} className="text-muted-foreground" />{' '}
            <span>Dark</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem className="flex gap-2" value="system">
            <SunMoon size={ICON_SIZE} className="text-muted-foreground" />{' '}
            <span>System</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ThemeSwitcher };
