# /sign-in-as — Impersonate Any User (PLATFORM_OWNER / VENUE_OWNER)

Generates a one-click Clerk sign-in token to log into this project's live site as any user — for debugging, account review, or QA from a user's perspective. Works in every Heru.

**Authorized roles:** PLATFORM_OWNER, VENUE_OWNER only.

## Usage
```
/sign-in-as admin@example.com          # by email
/sign-in-as frio16                     # by username
/sign-in-as user_3B7746mXoRuPYrpRM0z5  # by Clerk user ID
/sign-in-as PLATFORM_OWNER             # by role — lists matches, pick one
/sign-in-as VENUE_OWNER                # by role
```

## Execution

### Step 1 — Locate project root and .env.production

```bash
PROJECT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
ENV_FILE="$PROJECT_ROOT/backend/.env.production"
# Fallback locations
[ ! -f "$ENV_FILE" ] && ENV_FILE="$PROJECT_ROOT/.env.production"
[ ! -f "$ENV_FILE" ] && ENV_FILE="$PROJECT_ROOT/frontend/.env.production"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Cannot find .env.production in $PROJECT_ROOT"
  echo "   Tried: backend/.env.production, .env.production, frontend/.env.production"
  exit 1
fi

echo "✓ Using env: $ENV_FILE"
```

### Step 2 — Load credentials and site domain

```bash
CLERK_KEY=$(grep "^CLERK_SECRET_KEY=" "$ENV_FILE" | head -1 | cut -d= -f2-)
if [ -z "$CLERK_KEY" ]; then
  echo "❌ CLERK_SECRET_KEY not found in $ENV_FILE"
  exit 1
fi

# Detect the live site domain
SITE_DOMAIN=$(grep -E "^(NEXT_PUBLIC_APP_URL|APP_URL|SITE_URL|FRONTEND_URL)=" "$ENV_FILE" | head -1 | cut -d= -f2- | sed 's|/$||')
[ -z "$SITE_DOMAIN" ] && SITE_DOMAIN=$(grep -E "^(NEXT_PUBLIC_APP_URL|APP_URL|SITE_URL|FRONTEND_URL)=" "$PROJECT_ROOT/frontend/.env.production" 2>/dev/null | head -1 | cut -d= -f2- | sed 's|/$||')
[ -z "$SITE_DOMAIN" ] && SITE_DOMAIN="https://$(basename $PROJECT_ROOT).com"

echo "✓ Clerk key loaded: ${CLERK_KEY:0:12}..."
echo "✓ Site domain: $SITE_DOMAIN"
```

### Step 3 — Find the user

`$ARGUMENTS` can be an email, username, Clerk user ID (`user_` prefix), or role name.

```bash
QUERY="$ARGUMENTS"
ENCODED_QUERY=$(python3 -c "import urllib.parse, sys; print(urllib.parse.quote(sys.argv[1]))" "$QUERY")

if [[ "$QUERY" == user_* ]]; then
  # Direct lookup by Clerk user ID
  USER_JSON=$(curl -s "https://api.clerk.com/v1/users/$QUERY" \
    -H "Authorization: Bearer $CLERK_KEY")
  USERS_JSON=$(echo "$USER_JSON" | python3 -c "import json,sys; d=json.load(sys.stdin); print(json.dumps([d]) if 'id' in d else '[]')")
else
  # Search by email, username, or name
  USERS_JSON=$(curl -s "https://api.clerk.com/v1/users?query=$ENCODED_QUERY&limit=20" \
    -H "Authorization: Bearer $CLERK_KEY")
fi

# If role lookup (ALL_CAPS or contains _OWNER / _ADMIN), filter by public_metadata.role
if echo "$QUERY" | grep -qE '^[A-Z_]+$'; then
  USERS_JSON=$(echo "$USERS_JSON" | python3 -c "
import json, sys
users = json.load(sys.stdin)
role = sys.argv[1]
filtered = [u for u in users if u.get('public_metadata', {}).get('role') == role]
print(json.dumps(filtered))
" "$QUERY")
fi

USER_COUNT=$(echo "$USERS_JSON" | python3 -c "import json,sys; print(len(json.load(sys.stdin)))" 2>/dev/null || echo 0)

if [ "$USER_COUNT" -eq 0 ]; then
  echo "❌ No user found for: $QUERY"
  echo "   Search query used: $ENCODED_QUERY"
  exit 1
fi

if [ "$USER_COUNT" -gt 1 ]; then
  echo "Multiple users match '$QUERY' — choose one:"
  echo "$USERS_JSON" | python3 -c "
import json, sys
users = json.load(sys.stdin)
for i, u in enumerate(users):
  email = u.get('email_addresses', [{}])[0].get('email_address', 'no-email')
  name = f\"{u.get('first_name','')} {u.get('last_name','')}\".strip() or 'No name'
  role = u.get('public_metadata', {}).get('role', 'none')
  print(f\"  [{i+1}] {name} | {email} | role={role} | {u['id']}\")
"
  echo ""
  echo "Re-run with the specific Clerk user ID: /sign-in-as user_<ID>"
  exit 0
fi

# Extract user fields
USER_ID=$(echo "$USERS_JSON" | python3 -c "import json,sys; u=json.load(sys.stdin)[0]; print(u['id'])")
USER_EMAIL=$(echo "$USERS_JSON" | python3 -c "import json,sys; u=json.load(sys.stdin)[0]; print(u.get('email_addresses',[{}])[0].get('email_address','—'))")
USER_NAME=$(echo "$USERS_JSON" | python3 -c "import json,sys; u=json.load(sys.stdin)[0]; print(f\"{u.get('first_name','')} {u.get('last_name','')}\".strip() or '—')")
USER_USERNAME=$(echo "$USERS_JSON" | python3 -c "import json,sys; u=json.load(sys.stdin)[0]; print(u.get('username') or '—')")
USER_ROLE=$(echo "$USERS_JSON" | python3 -c "import json,sys; u=json.load(sys.stdin)[0]; print(u.get('public_metadata',{}).get('role','—'))")
```

### Step 4 — Generate the sign-in token

```bash
TOKEN_RESPONSE=$(curl -s -X POST "https://api.clerk.com/v1/sign_in_tokens" \
  -H "Authorization: Bearer $CLERK_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"user_id\": \"$USER_ID\", \"expires_in_seconds\": 3600}")

TOKEN=$(echo "$TOKEN_RESPONSE" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('token',''))" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to generate sign-in token"
  echo "$TOKEN_RESPONSE"
  exit 1
fi
```

### Step 5 — Output

```bash
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Signing in as: $USER_NAME"
echo "  Email:         $USER_EMAIL"
echo "  Username:      $USER_USERNAME"
echo "  Role:          $USER_ROLE"
echo "  Clerk ID:      $USER_ID"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  Open in incognito (sign out of $SITE_DOMAIN first):"
echo ""
echo "  $SITE_DOMAIN/sign-in?__clerk_ticket=$TOKEN"
echo ""
echo "  Token expires in 1 hour · Single use"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
```

## Rules

- Always reads from `.env.production` — never test/dev keys
- If multiple users match a role, lists all and stops — re-run with the specific Clerk user ID
- Token is single-use — generate a fresh one each session
- Always open in incognito while signed out of the site
- PLATFORM_OWNER and VENUE_OWNER use only — do not share the generated URL
