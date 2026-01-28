This repository is for a Svelte component library.

# Svelte

## Tech Stack

- Framework: Svelte 5 with Runes
- Language: TypeScript (Strict mode)
- Tools: ESLint, Prettier, vanilla CSS

## Project Structure

- `/src/lib`: All exported omponents for this library
- `/src/routes`: The webpage used to test and demo the component

## Code Style

- Tab indentation
- Prefer named exports from `$lib`
- Keep components under 300 lines
- Use TypeScript for type safety
- Components are PascalCase, files are kebab-case

## Execution Rules

- **Token Efficiency**: Always propose a plan before writing code.
- **Commands**:
  - Run `npx wrangler dev` to test Cloudflare features.
  - Run `npm run check` for TypeScript validation.
