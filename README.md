
# Duke Course Assistant

A Duke University-themed AI chatbot that helps students find and learn about courses. Built with React, TypeScript, and powered by DeepSeek AI with a custom Retrieval Augmented Generation (RAG) system for course data.

## Features

- **AI-Powered Chat**: Intelligent conversations about Duke University courses using DeepSeek AI
- **Course Search**: Advanced course discovery with relevance scoring and filtering
- **Course Cards**: Rich course information display with schedules, prerequisites, and instructor details
- **RAG System**: Custom retrieval system for accurate course information
- **Duke Branding**: Full Duke University theming and visual identity
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Project Info

**URL**: https://lovable.dev/projects/4bb091b4-b276-401d-b60f-c67ae7939a0c

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- DeepSeek API key (optional, falls back to RAG-only mode)

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm i

# Start the development server
npm run dev
```

### Configuration

1. Open the application
2. Click the Settings icon in the header
3. Enter your DeepSeek API key for enhanced AI responses
4. Without an API key, the system will use the built-in RAG system for course queries

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom Duke theming
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React
- **Charts**: Recharts (if needed for course analytics)
- **State Management**: React Context + TanStack Query
- **Build Tool**: Vite
- **AI Integration**: DeepSeek API
- **Data**: Custom RAG system with course database

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── CourseCard.tsx  # Course display component
│   ├── CourseResults.tsx # Course search results
│   └── ...
├── context/            # React context providers
├── services/           # API and RAG services
├── types/              # TypeScript type definitions
├── data/               # Course data and mock data
└── hooks/              # Custom React hooks
```

## Development

### Adding New Courses

Course data is stored in `src/data/courses.ts`. To add new courses:

1. Follow the `Course` type definition in `src/types/course.ts`
2. Add course objects to the courses array
3. Include relevant keywords for better search results

### Customizing the RAG System

The RAG system in `src/services/ragService.ts` can be customized:

- Modify scoring algorithms in `computeScore()`
- Add new course-related keywords in `isCourseRelatedQuery()`
- Adjust relevance thresholds and result limits

### Theming

Duke University colors and styling are defined in the Tailwind configuration. Key colors:
- `duke-blue`: Primary Duke blue
- `duke-text`: Text color variations
- Custom styling classes for Duke branding

## Deployment

### Using Lovable

Simply open [Lovable](https://lovable.dev/projects/4bb091b4-b276-401d-b60f-c67ae7939a0c) and click on Share → Publish.

### Custom Domain

For custom domains, visit the project settings in Lovable or refer to [Lovable's custom domain docs](https://docs.lovable.dev/tips-tricks/custom-domain/).

### Self-Hosting

The project generates standard React code that can be deployed to any static hosting service:

```sh
npm run build
# Deploy the dist/ folder to your hosting provider
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with both API and RAG-only modes
5. Submit a pull request

## License

This project is for educational purposes and demonstrates Duke University course information access.
