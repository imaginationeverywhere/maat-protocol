# Profile Widget Manager Agent

> **Agent ID:** `profile-widget-manager`
> **Version:** 1.0.0
> **Category:** Frontend Components
> **Last Updated:** 2026-01-13

## Purpose

Specialized agent for generating and integrating production-ready profile widget dropdowns and theme-matched loading indicators into Next.js applications. Ensures consistent UX patterns across all boilerplate projects while respecting each project's unique design system.

## Capabilities

### Core Functions

1. **Theme Analysis & Extraction**
   - Read `tailwind.config.ts` for color schemes
   - Parse `globals.css` for CSS variables
   - Analyze existing components for style patterns
   - Extract brand colors and design tokens
   - Generate theme configuration file

2. **Profile Widget Generation**
   - Create UserAvatar component with Clerk integration
   - Build ProfileMenu dropdown with navigation
   - Generate ProfileWidget container component
   - Add TypeScript type definitions
   - Include accessibility features (ARIA, keyboard nav)

3. **Loading Indicator Creation**
   - Generate themed Spinner component (multiple sizes)
   - Create PageLoader full-page overlay
   - Build LoadingBar for navigation progress
   - Add skeleton loaders for specific sections
   - Implement Redux state management for global loading

4. **Component Integration**
   - Update `app/layout.tsx` with PageLoader
   - Integrate ProfileWidget into Header/Navigation
   - Add Redux UI slice for loading states
   - Update existing components with loading patterns
   - Ensure proper import paths and exports

5. **Validation & Testing**
   - Check TypeScript compilation
   - Verify Clerk auth integration
   - Test theme color application
   - Validate accessibility compliance
   - Ensure responsive behavior

## Activation Triggers

- `profile-widget-setup` command invocation
- User requests for "profile dropdown", "user menu", or "loading spinner"
- Frontend development workflow that needs these components
- New project bootstrap requiring standard UI components

## Component Generation Patterns

### 1. Profile Widget Structure

```
frontend/src/components/ProfileWidget/
├── index.tsx                  # Main export
├── UserAvatar.tsx            # Avatar with initials fallback
├── ProfileMenu.tsx           # Dropdown menu items
├── ProfileWidget.tsx         # Container component
└── types.ts                  # TypeScript interfaces
```

**UserAvatar Component:**
```typescript
interface UserAvatarProps {
  src?: string;
  name: string;
  email?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function UserAvatar({
  src,
  name,
  email,
  size = 'md',
  className
}: UserAvatarProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base'
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {src ? (
        <AvatarImage src={src} alt={name} />
      ) : (
        <AvatarFallback className="bg-primary text-primary-foreground">
          {initials}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
```

**ProfileMenu Component:**
```typescript
interface ProfileMenuProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  };
}

export function ProfileMenu({ user }: ProfileMenuProps) {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <UserAvatar
            src={user.avatar}
            name={user.name}
            email={user.email}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            {user.role && (
              <Badge variant="secondary" className="w-fit text-xs">
                {user.role}
              </Badge>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/profile')}>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### 2. Loading Components Structure

```
frontend/src/components/Loading/
├── index.tsx           # Main exports
├── Spinner.tsx         # Reusable spinner
├── PageLoader.tsx      # Full page overlay
├── LoadingBar.tsx      # Top progress bar
└── SkeletonLoader.tsx  # Content skeletons
```

**Spinner Component:**
```typescript
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export function Spinner({ size = 'md', className, label }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex items-center justify-center" role="status">
      <svg
        className={cn(
          'animate-spin text-primary',
          sizeClasses[size],
          className
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-label={label || 'Loading'}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {label && <span className="sr-only">{label}</span>}
    </div>
  );
}
```

**PageLoader Component:**
```typescript
'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Spinner } from './Spinner';

export function PageLoader() {
  const { isPageLoading, loadingMessage } = useSelector(
    (state: RootState) => state.ui
  );

  if (!isPageLoading) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
      role="alert"
      aria-live="assertive"
      aria-busy="true"
    >
      <Spinner size="lg" label={loadingMessage || 'Loading'} />
      {loadingMessage && (
        <p className="mt-4 text-sm text-muted-foreground">
          {loadingMessage}
        </p>
      )}
    </div>
  );
}
```

### 3. Redux UI Slice

```typescript
// frontend/src/store/slices/uiSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isPageLoading: boolean;
  loadingMessage?: string;
  isSidebarOpen: boolean;
}

const initialState: UIState = {
  isPageLoading: false,
  loadingMessage: undefined,
  isSidebarOpen: true,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setPageLoading: (state, action: PayloadAction<string | undefined>) => {
      state.isPageLoading = true;
      state.loadingMessage = action.payload;
    },
    clearPageLoading: (state) => {
      state.isPageLoading = false;
      state.loadingMessage = undefined;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
  },
});

export const { setPageLoading, clearPageLoading, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;
```

## Theme Extraction Algorithm

```typescript
// Extract theme from Tailwind config
const extractTheme = async (projectPath: string) => {
  const tailwindConfig = await readFile(
    `${projectPath}/frontend/tailwind.config.ts`
  );

  // Parse config to extract colors
  const colors = extractColors(tailwindConfig);

  // Read CSS variables from globals.css
  const globalsCss = await readFile(
    `${projectPath}/frontend/src/app/globals.css`
  );
  const cssVars = extractCSSVariables(globalsCss);

  // Generate theme configuration
  return {
    primary: colors.primary || cssVars['--primary'] || '#3B82F6',
    secondary: colors.secondary || cssVars['--secondary'] || '#10B981',
    accent: colors.accent || cssVars['--accent'] || '#F59E0B',
    background: colors.background || cssVars['--background'] || '#FFFFFF',
    foreground: colors.foreground || cssVars['--foreground'] || '#1F2937',
    muted: colors.muted || cssVars['--muted'] || '#F3F4F6',
    border: colors.border || cssVars['--border'] || '#E5E7EB',
  };
};
```

## Integration Workflow

```
1. Initialize
   ├── Check project structure (Next.js 15/16)
   ├── Verify Clerk installation
   ├── Check Redux setup
   └── Validate ShadCN UI components

2. Theme Analysis
   ├── Read tailwind.config.ts
   ├── Parse globals.css
   ├── Extract color scheme
   ├── Analyze existing components
   └── Generate theme.ts

3. Generate Components
   ├── Create ProfileWidget/
   │   ├── UserAvatar.tsx
   │   ├── ProfileMenu.tsx
   │   ├── ProfileWidget.tsx
   │   └── types.ts
   ├── Create Loading/
   │   ├── Spinner.tsx
   │   ├── PageLoader.tsx
   │   ├── LoadingBar.tsx
   │   └── SkeletonLoader.tsx
   └── Create Redux slices
       └── uiSlice.ts

4. Integration
   ├── Update app/layout.tsx
   │   └── Add <PageLoader />
   ├── Update components/Header.tsx
   │   └── Add <ProfileWidget />
   ├── Update store/index.ts
   │   └── Add uiReducer
   └── Update globals.css
       └── Add animations

5. Validation
   ├── TypeScript compilation check
   ├── Import validation
   ├── Clerk auth test
   ├── Theme color verification
   └── Accessibility audit

6. Documentation
   ├── Generate component docs
   ├── Create usage examples
   ├── Add customization guide
   └── Update project CLAUDE.md
```

## Project-Type Specific Customization

### E-commerce Projects
```typescript
// Additional ProfileMenu items
<DropdownMenuItem onClick={() => router.push('/orders')}>
  <Package className="mr-2 h-4 w-4" />
  My Orders
</DropdownMenuItem>
<DropdownMenuItem onClick={() => router.push('/wishlist')}>
  <Heart className="mr-2 h-4 w-4" />
  Wishlist
</DropdownMenuItem>
```

### SaaS Projects
```typescript
// Additional ProfileMenu items
<DropdownMenuItem onClick={() => router.push('/workspace')}>
  <Building className="mr-2 h-4 w-4" />
  Workspace
</DropdownMenuItem>
<DropdownMenuItem onClick={() => router.push('/billing')}>
  <CreditCard className="mr-2 h-4 w-4" />
  Billing
</DropdownMenuItem>
```

### Booking Projects
```typescript
// Additional ProfileMenu items
<DropdownMenuItem onClick={() => router.push('/bookings')}>
  <Calendar className="mr-2 h-4 w-4" />
  My Bookings
</DropdownMenuItem>
<DropdownMenuItem onClick={() => router.push('/favorites')}>
  <Star className="mr-2 h-4 w-4" />
  Favorites
</DropdownMenuItem>
```

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| Theme not found | Missing tailwind.config.ts | Use default theme, create config |
| Clerk not installed | @clerk/nextjs missing | Install Clerk, configure |
| Redux not setup | Store not configured | Set up Redux with persist |
| Component conflict | Existing ProfileWidget | Backup and replace |
| Import errors | Wrong paths | Fix import paths, update aliases |

## Performance Optimization

1. **Code Splitting**
   - ProfileWidget lazy loaded
   - Dropdown rendered on-demand
   - Icons tree-shaken

2. **Memoization**
   - User data memoized with `useMemo`
   - Menu items cached
   - Event handlers wrapped in `useCallback`

3. **Bundle Size**
   - Lucide icons imported individually
   - No heavy dependencies
   - Optimized animations

## Accessibility Features

✅ **Keyboard Navigation**
- Tab through dropdown items
- Enter/Space to activate
- Escape to close

✅ **Screen Reader Support**
- ARIA labels on all interactive elements
- Role attributes (menu, menuitem, button)
- Live regions for loading states

✅ **Focus Management**
- Focus trap in dropdown
- Focus return on close
- Visible focus indicators

## Testing Patterns

```typescript
// Auto-generated test suite
describe('ProfileWidget', () => {
  it('renders user avatar with initials', () => {
    const { getByText } = render(
      <ProfileWidget user={{ name: 'John Doe', email: 'john@example.com' }} />
    );
    expect(getByText('JD')).toBeInTheDocument();
  });

  it('opens dropdown on click', async () => {
    const { getByRole, getByText } = render(<ProfileWidget />);
    await userEvent.click(getByRole('button'));
    expect(getByText('Sign Out')).toBeVisible();
  });

  it('handles sign out', async () => {
    const signOut = jest.fn();
    useClerk.mockReturnValue({ signOut });
    const { getByText } = render(<ProfileWidget />);
    await userEvent.click(getByText('Sign Out'));
    expect(signOut).toHaveBeenCalled();
  });
});
```

## Integration Points

### With Other Agents
- **nextjs-architecture-guide** - Next.js patterns and best practices
- **shadcn-ui-specialist** - ShadCN UI component implementation
- **typescript-frontend-enforcer** - Type safety validation
- **clerk-auth-enforcer** - Clerk authentication patterns
- **redux-persist-state-manager** - State management

### With Commands
- **profile-widget-setup** - Primary command interface
- **frontend-dev** - Frontend development workflow
- **design-to-nextjs** - Convert designs to components

## Best Practices

1. **Theme Consistency** - Always match project colors
2. **Type Safety** - Full TypeScript coverage
3. **Accessibility** - WCAG 2.1 AA compliance
4. **Performance** - Lazy loading and code splitting
5. **Testing** - Component and integration tests
6. **Documentation** - Clear usage examples

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-13 | Initial release with profile widget and loading system |
