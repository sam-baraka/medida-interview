# Interactive Measurement Dashboard with React and TypeScript

## Medida Senior Frontend Developer Submission
**By**: Samuel Baraka Bushuru  
**Email**: samuel.baraka1981@gmail.com

A modern React application built with TypeScript that allows users to draw and measure rectangles on a canvas. The application leverages React's powerful component system and TypeScript's type safety to provide a robust and maintainable codebase.

 **[View Live Application](https://medida-interview.web.app/)**

## Features

- Interactive canvas drawing powered by React's event system
- Type-safe rectangle measurements with TypeScript
- Real-time calculations with React state management
- Strongly-typed data persistence with TypeScript interfaces
- React-powered sortable measurement table
- TypeScript-enforced data validation and error handling
- Responsive React components for all screen sizes
- Type-safe event handling for drawing operations

## Technical Stack

- **Framework**: [Next.js](https://nextjs.org) with React 18
- **Language**: TypeScript 5.0+ for full type safety
- **Styling**: Tailwind CSS with type-safe classes
- **State Management**: React Hooks with TypeScript generics
- **Storage**: Local Storage API with typed schemas
- **Drawing**: HTML Canvas API with TypeScript event handling
- **Testing**: Jest and React Testing Library with TypeScript
- **Deployment**: Firebase Hosting with CI/CD Pipeline

## Project Structure

```typescript
app/
├── components/         # React components with TypeScript
│   ├── Canvas.tsx     # Canvas component with typed props
│   └── MeasurementTable.tsx  # Table with TypeScript generics
├── types/             # TypeScript type definitions
│   └── index.ts       # Shared interfaces and types
├── utils/            # Typed utility functions
│   ├── calculations.ts  # Type-safe calculations
│   └── storage.ts      # Typed storage operations
└── page.tsx          # Main React component
```

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/sam-baraka/medida-interview
cd medida-interview
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm start` - Start production server
- `npm test` - Run TypeScript-aware tests
- `npm run lint` - Run ESLint with TypeScript support

## Implementation Details

### Technical Implementation
- React components built with TypeScript for type safety
- Canvas drawing implemented with typed mouse event handlers
- Real-time calculations using React's state management
- Type-safe data persistence with TypeScript interfaces
- Responsive UI built with React components
- Strongly-typed sorting functionality in the table

### Assumptions
- Modern web browser with React 18+ support
- Node.js (v16 or higher) for development
- TypeScript-aware IDE for development
- Adequate screen resolution for canvas operations

### Limitations
- Maximum of two rectangles per canvas (type-enforced)
- Mouse-based drawing interface
- Browser local storage for data persistence
- Fixed canvas dimensions (800x600 pixels)
- Pixel-based measurements

## Deployment

The application is automatically deployed to Firebase Hosting through a CI/CD pipeline that runs on every push to the main branch. The pipeline:

1. Type-checks and tests the entire codebase
2. Builds the production version with TypeScript compilation
3. Deploys to Firebase if all checks pass

 **Live Application**: [https://medida-interview.web.app/](https://medida-interview.web.app/)

