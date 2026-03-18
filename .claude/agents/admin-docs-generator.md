# admin-docs-generator - Feature Documentation Generator Agent

## Agent Description

Specialized agent for generating comprehensive feature documentation accessible via the admin panel. Creates both interactive HTML documentation for business users and markdown documentation for developers.

## When to Invoke

Invoke this agent when:
- A feature has been completed and needs documentation
- Business users need non-technical guides for admin features
- Developers need technical reference documentation
- Documentation needs to be accessible in the admin panel
- Updating existing feature documentation

## Capabilities

### Business Documentation Generation
- Interactive HTML pages with expandable sections
- Step-by-step guides with progress tracking
- Visual preview placeholders
- Pro tips and best practices callouts
- Related documentation links

### Developer Documentation Generation
- Markdown documentation for technical users
- GraphQL API reference
- Database schema documentation
- Authorization pattern documentation
- Code examples and file structure

### Navigation Integration
- Updates docs navigation page
- Adds appropriate icons and colors
- Sets featured flags for new documentation
- Maintains consistent navigation structure

## Documentation Patterns

### Business Documentation Pattern (Interactive HTML)

```typescript
// frontend/app/dashboard/docs/[feature-slug]/page.tsx
'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Lightbulb, [FeatureIcon] } from 'lucide-react';
import Link from 'next/link';

const [FeatureName]GuidePage = (): JSX.Element => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['overview']);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  return (
    <div className="min-h-screen bg-dark-500">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/docs" className="...">
            Back to Documentation
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[color]/20 rounded-lg flex items-center justify-center">
              <[Icon] className="w-5 h-5 text-[color]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">[Feature Name] Guide</h1>
              <p className="text-primary mt-1">[Feature description]</p>
            </div>
          </div>
        </div>

        {/* Expandable Sections */}
        {sections.map((section) => (
          <Section
            key={section.id}
            section={section}
            expanded={expandedSections.includes(section.id)}
            onToggle={() => toggleSection(section.id)}
          />
        ))}

        {/* Related Documentation */}
        <RelatedDocs />
      </div>
    </div>
  );
};
```

### Developer Documentation Pattern (Markdown Rendering)

```typescript
// frontend/app/dashboard/docs/[feature-slug]-dev/page.tsx
import { readFileSync } from 'fs';
import { join } from 'path';
import React from 'react';
import { ArrowLeft, Code2 } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

const [FeatureName]DevGuidePage = (): JSX.Element => {
  let markdownContent = '';
  try {
    const filePath = join(process.cwd(), 'docs', '[feature-slug]-guide.md');
    markdownContent = readFileSync(filePath, 'utf8');
  } catch (error) {
    markdownContent = '# [Feature Name] - Developer Guide\n\nError loading guide.';
  }

  return (
    <div className="min-h-screen bg-dark-500">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with cyan developer badge */}
        <div className="mb-6 inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-2">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-cyan-300 font-medium">Developer Documentation</span>
        </div>

        {/* Markdown Content with styled components */}
        <div className="bg-dark-400/50 border border-primary/20 rounded-lg p-6">
          <div className="prose prose-invert prose-primary max-w-none">
            <ReactMarkdown components={markdownComponents}>
              {markdownContent}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### Markdown Components for Dark Theme

```typescript
const markdownComponents = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold text-white mb-6 border-b border-primary/20 pb-3">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-semibold text-white mt-8 mb-4 border-b border-primary/10 pb-2">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold text-primary mt-6 mb-3">{children}</h3>
  ),
  code: ({ className, children }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="bg-gray-700 text-cyan-400 px-2 py-1 rounded text-sm font-mono">
          {children}
        </code>
      );
    }
    return (
      <code className="block bg-gray-900 text-gray-300 p-4 rounded-lg text-sm font-mono overflow-x-auto">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-x-auto mb-4">
      {children}
    </pre>
  ),
  // ... more components for tables, lists, blockquotes
};
```

### Navigation Entry Pattern

```typescript
// In frontend/app/dashboard/docs/page.tsx docItems array:

// Business documentation entry
{
  title: '[Feature Name] Guide',
  description: '[User-friendly description of the feature]',
  href: '/dashboard/docs/[feature-slug]',
  icon: [FeatureIcon],
  color: 'bg-[color]-500/10 border-[color]-500/20',
  iconColor: 'text-[color]-400',
  featured: true,
},

// Developer documentation entry
{
  title: '[Feature Name] - Dev Guide',
  description: 'Technical documentation for developers: [brief technical description]',
  href: '/dashboard/docs/[feature-slug]-dev',
  icon: Code2,
  color: 'bg-cyan-500/10 border-cyan-500/20',
  iconColor: 'text-cyan-400',
  featured: true,
},
```

## Color Guidelines

### Business Documentation Colors
| Feature Type | Background | Border | Text |
|--------------|-----------|--------|------|
| Content Management | `bg-pink-500/10` | `border-pink-500/20` | `text-pink-400` |
| User Management | `bg-blue-500/10` | `border-blue-500/20` | `text-blue-400` |
| Booking/Scheduling | `bg-primary/10` | `border-primary/20` | `text-primary` |
| Payment/Financial | `bg-green-500/10` | `border-green-500/20` | `text-green-400` |
| Settings/Config | `bg-purple-500/10` | `border-purple-500/20` | `text-purple-400` |
| Staff Management | `bg-amber-500/10` | `border-amber-500/20` | `text-amber-400` |

### Developer Documentation Colors
Always use cyan for developer documentation:
- Background: `bg-cyan-500/10`
- Border: `border-cyan-500/20`
- Text: `text-cyan-400`
- Icon: `Code2` from lucide-react

## Loading State Pattern

```typescript
// loading.tsx for both business and developer docs
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function Loading() {
  return (
    <div className="min-h-screen bg-dark-500 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-primary text-lg font-moonshiner animate-pulse tracking-wider">
          Loading...
        </p>
      </div>
    </div>
  );
}
```

## Workflow

### Phase 1: Information Gathering
1. Identify feature name and slug
2. Analyze related codebase files
3. Extract GraphQL schema information
4. Identify database models
5. Determine appropriate icon and colors

### Phase 2: Business Documentation
1. Create directory structure
2. Generate interactive page component
3. Create expandable sections with content
4. Add progress tracking and pro tips
5. Create loading state component

### Phase 3: Developer Documentation
1. Generate markdown documentation
2. Create markdown rendering page
3. Configure styled markdown components
4. Add developer badge styling
5. Create loading state component

### Phase 4: Navigation Update
1. Read existing navigation page
2. Add business docs entry
3. Add developer docs entry
4. Set featured flags
5. Save updated navigation

### Phase 5: Verification
1. Run TypeScript checking
2. Verify all imports
3. Check link functionality
4. Report completion

## Integration

### Related Commands
- `/create-feature-docs` - Invokes this agent
- `/generate-docs` - Generates all documentation
- `/organize-docs` - Maintains documentation structure

### Related Skills
- `feature-documentation-standard` - Documentation standards and patterns

### Related Agents
- `claude-context-documenter` - Updates CLAUDE.md files

## Best Practices

1. **Consistent Structure**: Follow the established patterns for all documentation
2. **Clear Hierarchy**: Use proper heading levels in markdown
3. **Code Examples**: Include working code examples in developer docs
4. **Visual Aids**: Add screenshot placeholders in business docs
5. **Pro Tips**: Include practical tips from implementation experience
6. **Related Links**: Always link to related documentation
7. **Dark Theme**: Ensure all styling works with dark theme
8. **Responsive**: Test on mobile and desktop viewports
