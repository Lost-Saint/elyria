'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User, Settings, CreditCard, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react';

import { cn } from '~/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

interface UserData {
  name: string;
  email: string;
  avatar?: string;
  initials?: string;
}

interface AvatarDropdownMenuProps {
  user: UserData;
  className?: string;
  onLogout?: () => void;
  onNavigate?: (path: string) => void;
}

export function AvatarDropdownMenu({
  user,
  className,
  onLogout,
  onNavigate,
}: AvatarDropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Generate initials from name if not provided
  const getInitials = useCallback((name: string): string => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, []);

  const initials = user.initials ?? getInitials(user.name);

  const handleNavigation = useCallback(
    (path: string) => {
      setIsOpen(false);
      if (onNavigate) {
        onNavigate(path);
      } else {
        router.push(path);
      }
    },
    [router, onNavigate],
  );

  const handleLogout = useCallback(() => {
    setIsOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      // Default logout behavior - you might want to call your auth logout here
      console.log('Logout clicked');
    }
  }, [onLogout]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'hover:bg-accent focus-visible:ring-ring relative h-10 w-10 rounded-full p-0 focus-visible:ring-2 focus-visible:ring-offset-2',
            className,
          )}
          aria-label={`Open menu for ${user.name}`}
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={`${user.name}'s avatar`} className="object-cover" />
            <AvatarFallback className="bg-primary text-primary-foreground font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <ChevronDown
            className={cn(
              'bg-background border-background absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 transition-transform duration-200',
              isOpen && 'rotate-180',
            )}
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 p-2" align="end" sideOffset={8} forceMount>
        {/* User info section */}
        <DropdownMenuLabel className="p-3 pb-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={user.avatar}
                alt={`${user.name}'s avatar`}
                className="object-cover"
              />
              <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col space-y-1">
              <p className="truncate text-sm leading-none font-medium">{user.name}</p>
              <p className="text-muted-foreground truncate text-xs">{user.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Navigation section */}
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => handleNavigation('/dashboard')}
            className="focus:bg-accent focus:text-accent-foreground flex cursor-pointer items-center gap-2 px-3 py-2"
          >
            <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
            <span>Dashboard</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleNavigation('/settings')}
            className="focus:bg-accent focus:text-accent-foreground flex cursor-pointer items-center gap-2 px-3 py-2"
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
            <span>Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleNavigation('/billing')}
            className="focus:bg-accent focus:text-accent-foreground flex cursor-pointer items-center gap-2 px-3 py-2"
          >
            <CreditCard className="h-4 w-4" aria-hidden="true" />
            <span>Billing</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleNavigation('/profile')}
            className="focus:bg-accent focus:text-accent-foreground flex cursor-pointer items-center gap-2 px-3 py-2"
          >
            <User className="h-4 w-4" aria-hidden="true" />
            <span>Profile</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Logout section */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="focus:bg-destructive focus:text-destructive-foreground text-destructive flex cursor-pointer items-center gap-2 px-3 py-2"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Example usage component
export function AvatarDropdownExample() {
  const sampleUser: UserData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://avatars.githubusercontent.com/u/85581209?v=4&size=64', // Placeholder avatar
  };

  const handleLogout = () => {
    console.log('Logging out...');
    // Implement your logout logic here
  };

  const handleNavigate = (path: string) => {
    console.log(`Navigating to: ${path}`);
    // Custom navigation logic if needed
  };

  return (
    <div className="bg-background flex items-center justify-end border-b p-4">
      <div className="flex items-center gap-4">
        <span className="text-muted-foreground text-sm">Welcome back!</span>
        <AvatarDropdownMenu user={sampleUser} onLogout={handleLogout} onNavigate={handleNavigate} />
      </div>
    </div>
  );
}
