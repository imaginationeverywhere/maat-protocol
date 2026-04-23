/**
 * Contract tests: /session-start command doc must retain brain_query + degraded fallback.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sessionStartPath = path.join(__dirname, '..', 'session-start.md');

test('session-start.md documents brain_query flow', () => {
  const md = fs.readFileSync(sessionStartPath, 'utf8');
  assert.match(md, /brain_query/);
  assert.match(md, /current priorities active pending work sprint/i);
  assert.match(md, /DEGRADED MODE|Degraded mode/i);
  assert.match(md, /5\s*s|5s|timeout/i);
  assert.match(md, /grep\s+-R/i);
});

test('session-start.md does not require wholesale MEMORY.md load', () => {
  const md = fs.readFileSync(sessionStartPath, 'utf8');
  assert.match(md, /memory\/MEMORY\.md/);
  assert.match(md, /do \*\*not\*\* load|not\*\* load|wholesale/i);
});
