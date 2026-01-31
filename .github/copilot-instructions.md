# Copilot Instructions for Simple YT

## Project Overview

Simple YT is a clean, no-fluff YouTube search application built with Next.js. It provides a simple interface to search YouTube videos without requiring API tokens, using the `youtube-sr` library for server-side searches.

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **React**: 19.0.0
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 4.x
- **UI Components**: HeroUI (Hero Icons) 2.6.14
- **Animations**: Framer Motion 11.18.1
- **YouTube Search**: youtube-sr 4.3.11

## Project Structure

```
app/
├── actions.ts          # Server actions for YouTube search
├── components/         # React components
│   └── YtSearch.tsx   # Main search component
├── layout.tsx         # Root layout with providers
├── page.tsx           # Home page
├── providers.tsx      # Context providers
├── globals.css        # Global styles with Tailwind directives
└── favicon.ico        # App favicon
```

## Code Style & Conventions

### TypeScript
- Use strict TypeScript configuration
- Target ES2017
- Prefer explicit types for function parameters and return values
- Use type inference where obvious

### React
- Use functional components with hooks
- Use 'use client' directive for client components
- Use 'use server' directive for server actions
- Prefer React.useState for local state management

### Formatting (Prettier)
- Single quotes for strings
- No semicolons
- 2 spaces for indentation
- Trailing commas (ES5 style)
- Bracket spacing enabled

### Naming Conventions
- Components: PascalCase (e.g., `YtSearch`)
- Files: PascalCase for components (e.g., `YtSearch.tsx`)
- Variables/functions: camelCase
- Types: PascalCase (e.g., `YtVideo`)

## Development Workflow

### Available Scripts
- `npm run dev` - Start development server with Turbopack (default: http://localhost:3000)
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run Next.js linter

### Making Changes
1. Run the dev server: `npm run dev`
2. Make changes - the app auto-reloads
3. Run linter before committing: `npm run lint`
4. Format with Prettier: `npx prettier --write .`

## Key Implementation Details

### Server Actions
- YouTube searches are performed server-side in `app/actions.ts`
- Uses `youtube-sr` library to search without API keys
- Returns a limited set of 5 results per search
- Type-safe with `YtVideo` interface

### Client Components
- Main search UI is in `YtSearch.tsx`
- Uses HeroUI components: Input, Card, CardBody, CardFooter, Skeleton
- Implements loading states with Skeleton component
- Embeds YouTube videos via iframe with `rel=0` parameter

### Styling
- Dark mode enabled by default in root layout
- Uses Tailwind CSS utility classes
- Responsive grid layout: 1 column on mobile, 2 on medium+ screens
- Custom Tailwind configuration in `tailwind.config.ts`

## Best Practices

1. **Server Actions**: Keep YouTube API calls on the server using 'use server' directive
2. **Client Components**: Use 'use client' only when needed (hooks, events, browser APIs)
3. **Type Safety**: Define types for all API responses and component props
4. **Performance**: Limit search results to avoid overwhelming the UI
5. **User Experience**: Show loading states during async operations
6. **Accessibility**: Use semantic HTML and proper ARIA labels

## Testing

Currently, this project does not have a formal testing setup. When adding tests:
- Consider using Jest + React Testing Library
- Test server actions separately from UI components
- Mock the youtube-sr library in tests

## Common Tasks

### Adding a New Component
1. Create in `app/components/` directory
2. Use PascalCase naming (e.g., `NewComponent.tsx`)
3. Add 'use client' if it needs client-side features
4. Export as named export

### Modifying Search Behavior
- Edit `app/actions.ts`
- Adjust the `limit` parameter in `YouTube.search()` call
- Update `YtVideo` type if adding new fields

### Styling Changes
- Update `globals.css` for global styles
- Use Tailwind utilities in components
- Modify `tailwind.config.ts` for theme customization

## Dependencies

### Key Dependencies
- `next`: Core framework
- `react` & `react-dom`: UI library
- `@heroui/react`: UI component library
- `youtube-sr`: YouTube search without API key
- `framer-motion`: Animation library (required by HeroUI)

### When Adding Dependencies
1. Use npm: `npm install <package>`
2. Update package.json and package-lock.json
3. Document new dependencies if significant

## Deployment

The application is designed to be deployed on Vercel:
- Build command: `npm run build`
- Output directory: `.next`
- Node.js version: 20.x recommended
- Environment variables: None currently required

## Notes

- No API keys required for YouTube search
- Uses server-side rendering where possible
- Minimal dependencies for fast builds
- Focus on simplicity and performance
