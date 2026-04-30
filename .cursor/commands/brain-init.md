# /brain-init — Wire This Heru to Its Knowledge Engine

Detects which Heru this is, resolves the correct brain API endpoint and tenant ID,
writes `.claude/brain-config.json`, and verifies the connection is live.

## Usage
```
/brain-init                          # Auto-detect and configure
/brain-init --dry-run                # Show what would be written without writing
/brain-init --domain example.com     # Override domain for client Herus
/brain-init --force                  # Re-initialize even if already configured
```

## Brain Routing Rules

| Project path | Brain URL | Notes |
|---|---|---|
| `Quik-Nation/*` | `brain-api.quiknation.com` | Tenant = heru slug |
| `AI/quik-nation-ai-boilerplate` | `brain-api.quiknation.com` | Tenant = `platform` |
| `AI/quik-nation-devops` | `brain-api.quiknation.com` | Tenant = `devops` |
| `AI/claraagents` | `brain-api.claraagents.com` | Tenant = `claraagents` |
| `AI/clara-code` | `brain-api.claracode.ai` | Tenant = `clara-code` |
| `AI/*` (all others) | `brain-api.claracode.ai` | Tenant = heru slug |
| `clients/*` (has domain) | `brain-api.<domain>` | Production brain |
| `clients/*` (no domain / not live) | `brain-api-staging.quiknation.com` | Tenant = heru slug, staging = true |

## Execution Steps

### Step 1 — Detect project

```bash
PROJECT_PATH=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
HERU_NAME=$(basename "$PROJECT_PATH")
```

### Step 2 — Check if already initialized

```bash
CONFIG="$PROJECT_PATH/.claude/brain-config.json"
if [ -f "$CONFIG" ] && [ "$FORCE" != "true" ]; then
  echo "Already initialized. Use --force to re-run."
  cat "$CONFIG"
  exit 0
fi
```

### Step 3 — Resolve brain URL + tenant

Apply routing rules in this exact order:

```bash
resolve_brain() {
  local path="$1" name="$2" domain="$3"

  # Platform + devops exceptions first
  case "$name" in
    quik-nation-ai-boilerplate) echo "brain-api.quiknation.com platform false" ; return ;;
    quik-nation-devops)         echo "brain-api.quiknation.com devops false"   ; return ;;
    claraagents)                echo "brain-api.claraagents.com claraagents false" ; return ;;
    clara-code)                 echo "brain-api.claracode.ai clara-code false"  ; return ;;
  esac

  # Path-based routing
  if echo "$path" | grep -q "/Quik-Nation/"; then
    echo "brain-api.quiknation.com $name false"

  elif echo "$path" | grep -q "/AI/"; then
    echo "brain-api.claracode.ai $name false"

  elif echo "$path" | grep -q "/clients/"; then
    if [ -n "$domain" ]; then
      # Check if production brain is live
      HTTP=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "https://brain-api.$domain/health")
      if [ "$HTTP" = "200" ]; then
        echo "brain-api.$domain $name false"
      else
        echo "brain-api-staging.quiknation.com $name true"
      fi
    else
      echo "brain-api-staging.quiknation.com $name true"
    fi
  else
    echo "brain-api.quiknation.com $name false"
  fi
}

read BRAIN_HOST TENANT_ID STAGING <<< $(resolve_brain "$PROJECT_PATH" "$HERU_NAME" "$DOMAIN_OVERRIDE")
BRAIN_URL="https://$BRAIN_HOST"
```

### Step 4 — Resolve client domain (if needed)

For `clients/*` with no `--domain` flag, try to find the domain automatically:

```bash
# Check BRAIN.md for a declared domain
DECLARED=$(grep -E '^.*brain-api\.' "$PROJECT_PATH/BRAIN.md" 2>/dev/null | head -1 | grep -oE '[a-z0-9.-]+\.[a-z]{2,}' | head -1)

# Check package.json for a homepage/domain hint
PKG_DOMAIN=$(cat "$PROJECT_PATH/package.json" 2>/dev/null | jq -r '.homepage // empty' | grep -oE '[a-z0-9.-]+\.[a-z]{2,}' | head -1)

DOMAIN_OVERRIDE="${DOMAIN_OVERRIDE:-${DECLARED:-$PKG_DOMAIN}}"
```

### Step 5 — Dry run output (if --dry-run)

```
brain-init DRY RUN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Heru:       site962
Path:       /Volumes/X10-Pro/Native-Projects/Quik-Nation/site962
Brain URL:  https://brain-api.quiknation.com
Tenant ID:  site962
Staging:    false

Would write: .claude/brain-config.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 6 — Write `.claude/brain-config.json` and `.clara/brain-config.json`

Write to both directories — `.claude/` (Claude Code) and `.clara/` (Clara Code CLI). Same content, two destinations.

```bash
INIT_AT=$(date -u +%Y-%m-%dT%H:%M:%SZ)

CONFIG_JSON=$(cat << JSONEOF
{
  "heru": "$HERU_NAME",
  "tenant_id": "$TENANT_ID",
  "brain_url": "$BRAIN_URL",
  "staging": $STAGING,
  "initialized_at": "$INIT_AT",
  "path": "$PROJECT_PATH"
}
JSONEOF
)

# Write to .claude/ (Claude Code)
mkdir -p "$PROJECT_PATH/.claude"
echo "$CONFIG_JSON" > "$PROJECT_PATH/.claude/brain-config.json"
echo "Wrote .claude/brain-config.json"

# Write to .clara/ (Clara Code CLI)
mkdir -p "$PROJECT_PATH/.clara"
echo "$CONFIG_JSON" > "$PROJECT_PATH/.clara/brain-config.json"
echo "Wrote .clara/brain-config.json"
```

### Step 7 — Verify connection

```bash
HTTP=$(curl -s -o /dev/null -w "%{http_code}" --max-time 8 "$BRAIN_URL/health")
if [ "$HTTP" = "200" ]; then
  STATUS="✓ LIVE"
else
  STATUS="✗ UNREACHABLE (HTTP $HTTP) — brain may need deployment"
fi
```

### Step 8 — Register tenant with brain API (if live)

```bash
if [ "$HTTP" = "200" ]; then
  BRAIN_API_KEY=$(aws ssm get-parameter \
    --name '/quik-nation/platform/CLARA_BRAIN_API_KEY' \
    --with-decryption --query 'Parameter.Value' --output text --region us-east-1 2>/dev/null || echo "")

  if [ -n "$BRAIN_API_KEY" ]; then
    REG=$(curl -s -w "\n%{http_code}" -X POST "$BRAIN_URL/tenant/register" \
      -H "Authorization: Bearer $BRAIN_API_KEY" \
      -H "Content-Type: application/json" \
      -d "{\"tenant_id\":\"$TENANT_ID\",\"heru\":\"$HERU_NAME\",\"path\":\"$PROJECT_PATH\"}" 2>/dev/null)
    REG_CODE=$(echo "$REG" | tail -1)
    [ "$REG_CODE" = "200" ] || [ "$REG_CODE" = "201" ] || [ "$REG_CODE" = "409" ] && \
      echo "  ✓ Tenant registered (or already exists)" || \
      echo "  ⚠ Tenant registration returned HTTP $REG_CODE — check /tenant/register endpoint"
  fi
fi
```

### Step 9 — Output summary

```
brain-init COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Heru:        site962
Tenant ID:   site962
Brain URL:   https://brain-api.quiknation.com   ✓ LIVE
Staging:     false
Config:      .claude/brain-config.json   (Claude Code)
             .clara/brain-config.json    (Clara Code CLI)

To query this brain:
  brain_query({ topic: "your question", k: 10 })

To ingest content:
  brain-add <file|dir|url>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Staging note for client Herus

When a client Heru is in staging mode (`staging: true`), all brain queries route to
`brain-api-staging.quiknation.com` under the tenant path `/<tenant_id>`. This gives
every client Heru a working knowledge engine from day one, before their production
brain is deployed. When their domain's brain goes live, re-run `/brain-init --domain <domain>`
to cut over.

## After init

The config at `.claude/brain-config.json` is read by:
- `brain_query` MCP tool (passes `tenant_id` on every request)
- `brain-add` CLI (uses `brain_url` as the ingest endpoint)
- Session startup (validates connection is live before session begins)

Add `.claude/brain-config.json` to `.gitignore` if the repo is public.
For private repos it can be committed — it contains no secrets.
