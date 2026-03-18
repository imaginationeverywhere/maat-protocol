# GraphQL Validator Agent

> **Agent:** `graphql-validator`
> **Version:** 1.0.0
> **Category:** Code Quality
> **Trigger:** PROACTIVE - Invoke when GraphQL files change or before commits

## Purpose

Validate GraphQL schemas, operations, and resolvers for errors - providing the same validation experience for GraphQL that `npx tsc --noEmit` provides for TypeScript. This agent catches errors before runtime and ensures schema consistency.

## When to Invoke

**Automatically invoke this agent when:**
- GraphQL schema files (`.graphql`, `.gql`) are modified
- Resolver files are created or modified
- Frontend operation files change
- User requests GraphQL validation
- Pre-commit hooks need validation
- CI/CD pipeline validation

## Capabilities

### 1. Schema Validation
- Parse and validate GraphQL SDL syntax
- Check type references and definitions
- Validate directive usage
- Enforce naming conventions (PascalCase, camelCase)
- Identify circular references

### 2. Operation Validation
- Validate queries against schema
- Validate mutations against schema
- Validate subscriptions against schema
- Check fragment definitions
- Validate variable types

### 3. Resolver Checks
- Verify `context.auth?.userId` validation
- Check for DataLoader usage
- Detect `any` type usage
- Verify error handling patterns

### 4. Deprecation Tracking
- Identify deprecated fields
- Identify deprecated types
- Warn on deprecated usage

## Execution Steps

### Step 1: Preparation
```bash
# Navigate to backend directory
cd backend

# Verify dependencies are installed
npm install graphql @graphql-tools/load @graphql-tools/graphql-file-loader
```

### Step 2: Run Validation
```bash
# Full validation
npm run graphql:validate

# Or specific validations
npm run graphql:validate:schema    # Schema only
npm run graphql:validate:ops       # Operations only
```

### Step 3: Analyze Results
Parse the validation output:
- **Errors** - Must be fixed before commit
- **Warnings** - Should be reviewed
- **Info** - Informational messages

### Step 4: Fix Issues
For each error type:

**Schema Syntax Error:**
```graphql
# Fix: Correct the syntax
type User {
  id: ID!
  name: String!  # Was missing type
}
```

**Type Reference Error:**
```graphql
# Fix: Define the missing type or correct the reference
type Customer {
  id: ID!
}

type Order {
  customer: Customer!  # Now references defined type
}
```

**Operation Error:**
```graphql
# Fix: Update operation to match schema
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email  # Ensure field exists in schema
  }
}
```

### Step 5: Re-validate
```bash
npm run graphql:validate
```

## Output Interpretation

### Success Output
```
🔍 GraphQL Validation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Validating GraphQL Schema...
   Found 4 schema file(s)
   ✓ Schema syntax is valid
   ✓ Schema structure is valid
   Found 15 type definitions

📋 Validating GraphQL Operations...
   Found 8 operation file(s)
   ✓ 8 operation(s) validated successfully

📋 Checking Resolver Types...
   Found 6 resolver file(s)
   ✓ 6 resolver file(s) checked

════════════════════════════════════════
         GraphQL Validation Report
════════════════════════════════════════

📊 Statistics:
   Files checked:       18
   Schemas validated:   1
   Operations validated: 8
   Types found:         15
   Resolvers checked:   6

────────────────────────────────────────
✅ GraphQL validation passed!
```

### Error Output
```
❌ Errors (2):

   [SCHEMA_SYNTAX_ERROR]
   File: src/graphql/schema/user.graphql
   Location: Line 15, Column 3
   Syntax Error: Expected Name, found "}"

   [OPERATION_VALIDATION_ERROR]
   File: src/graphql/operations/getUser.graphql
   Cannot query field "unknownField" on type "User"
   Location: Line 5, Column 5

────────────────────────────────────────
❌ GraphQL validation failed with 2 error(s)
   Please fix the errors above before committing.
```

## Common Error Fixes

### SCHEMA_SYNTAX_ERROR
```graphql
# ❌ Before
type User {
  id: ID!
  name  # Missing type
}

# ✅ After
type User {
  id: ID!
  name: String!
}
```

### SCHEMA_VALIDATION_ERROR
```graphql
# ❌ Before
type Order {
  customer: UnknownType!  # Type doesn't exist
}

# ✅ After
type Customer {
  id: ID!
  name: String!
}

type Order {
  customer: Customer!
}
```

### OPERATION_VALIDATION_ERROR
```graphql
# ❌ Before
query GetUser {
  user(id: "123") {
    nonExistentField  # Field not in schema
  }
}

# ✅ After
query GetUser {
  user(id: "123") {
    id
    name
    email
  }
}
```

### RESOLVER_AUTH_CHECK
```typescript
// ❌ Before
const resolvers = {
  Query: {
    me: async (_, __, context) => {
      return await User.findByPk(context.userId); // No auth check
    },
  },
};

// ✅ After
const resolvers = {
  Query: {
    me: async (_, __, context) => {
      if (!context.auth?.userId) {
        throw new AuthenticationError('Authentication required');
      }
      return await User.findByPk(context.auth.userId);
    },
  },
};
```

### ANY_TYPE_USAGE
```typescript
// ❌ Before
const resolvers = {
  Query: {
    users: async (_: any, args: any, context: any) => {
      // Using any types
    },
  },
};

// ✅ After
interface QueryUsersArgs {
  limit?: number;
  offset?: number;
}

const resolvers = {
  Query: {
    users: async (
      _: unknown,
      args: QueryUsersArgs,
      context: GraphQLContext
    ) => {
      // Properly typed
    },
  },
};
```

## Integration with Other Agents

### graphql-backend-enforcer
Works alongside to enforce:
- Schema design patterns
- Resolver implementation standards
- DataLoader usage

### typescript-backend-enforcer
Complements by:
- Validating resolver TypeScript types
- Ensuring strict mode compliance
- Checking interface definitions

### testing-automation-agent
Integrates with:
- GraphQL operation testing
- Schema snapshot testing
- Resolver unit testing

## Pre-Commit Hook Setup

### Automatic Setup
```bash
# Using the validation script with husky
npx husky add .husky/pre-commit "cd backend && npm run graphql:validate"
```

### Manual Setup
```bash
# Create pre-commit hook
cat > .husky/pre-commit << 'EOF'
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Running pre-commit validation..."

# GraphQL validation
echo "📊 Validating GraphQL..."
cd backend && npm run graphql:validate
if [ $? -ne 0 ]; then
  echo "❌ GraphQL validation failed!"
  exit 1
fi

# TypeScript validation
echo "📊 Validating TypeScript..."
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ TypeScript validation failed!"
  exit 1
fi

echo "✅ All validations passed!"
EOF

chmod +x .husky/pre-commit
```

## CI/CD Integration

### GitHub Actions Workflow
```yaml
name: Validate

on:
  push:
    paths:
      - 'backend/src/graphql/**'
      - 'frontend/src/**/*.graphql'
  pull_request:
    paths:
      - 'backend/src/graphql/**'
      - 'frontend/src/**/*.graphql'

jobs:
  validate-graphql:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        run: cd backend && npm ci

      - name: Validate GraphQL
        run: cd backend && npm run graphql:validate

      - name: Validate TypeScript
        run: cd backend && npm run type-check
```

## Watch Mode

For development, use watch mode for continuous validation:

```bash
npm run graphql:validate:watch

# Output:
# 👀 Watch mode enabled. Watching for GraphQL file changes...
#    Press Ctrl+C to stop.
#
# 📝 File changed: src/graphql/schema/user.graphql
# 🔍 GraphQL Validation
# ...
```

## Troubleshooting

### "graphql module not found"
```bash
cd backend
npm install graphql @graphql-tools/load @graphql-tools/graphql-file-loader
```

### "No schema files found"
```bash
# Check schema directory exists
ls -la src/graphql/schema/

# If missing, create it
mkdir -p src/graphql/schema
```

### "Validation passes but runtime fails"
- Check for case sensitivity issues
- Verify resolver function signatures
- Ensure context is properly typed

### Watch mode not detecting changes
```bash
# Install chokidar
npm install chokidar

# Then run watch mode
npm run graphql:validate:watch
```

## Exit Codes

| Code | Meaning | Action |
|------|---------|--------|
| 0 | Validation passed | Continue with commit/deploy |
| 1 | Validation errors | Fix errors before proceeding |
| 2 | Setup/config errors | Check dependencies and paths |

## Best Practices

1. **Run before every commit** - Use pre-commit hook
2. **Run in CI/CD** - Add to pipeline validation
3. **Use watch mode** - During active development
4. **Fix warnings** - Don't ignore deprecations
5. **Keep schema organized** - One file per domain
6. **Document types** - Add descriptions to all types
7. **Test operations** - Validate frontend operations too

## Related Commands

- `/validate-graphql` - Run validation command
- `/backend-dev` - Full backend development
- `/debug-fix` - Debug GraphQL issues

## Related Skills

- `graphql-validation-standard` - Validation patterns
- `graphql-backend-enforcer` - Schema enforcement

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-14 | Initial creation |
