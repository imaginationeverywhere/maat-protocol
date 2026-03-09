# build-docs — Build All Phase 1 Documentation

Read the CLAUDE.md work instructions and execute every document in order. This is your build queue.

## EXECUTE IMMEDIATELY

1. Read `CLAUDE.md` in the project root — it contains the full list of documents to build
2. For each document listed:
   a. Create the file with the content described in CLAUDE.md
   b. Follow the writing style guidelines in CLAUDE.md
   c. Stage the file: `git add <file>`
   d. Commit: `git commit -m "docs: add <filename> — <brief description>"`
   e. Push: `git push`
   f. Confirm: "Completed <N>/<total>: <filename>"
3. After all documents are built, report: "All documents complete. <total> files committed and pushed."

## Rules

- ONE commit per document — do not batch
- Push after EVERY commit — do not accumulate
- Follow the order in CLAUDE.md exactly
- Do NOT modify README.md, LICENSE, or CONTRIBUTING.md
- Do NOT create files outside of `docs/` and `templates/`
- If a directory doesn't exist, create it
- If you're unsure about content, write what you know and mark `<!-- TODO: expand -->` for review

## Do NOT

- Ask questions — just build
- Wait for approval — commit and push immediately
- Skip documents — build all of them
- Change the project architecture — just write docs
