# Interactive Measurement Dashboard

# Medida Senior Frontend Developer Submission
**By**: Samuel Baraka Bushuru  
**Email**: samuel.baraka1981@gmail.com

An application that allows users to draw and measure rectangles on a canvas, built with React, TypeScript, and Tailwind CSS.

## Features

- Draw two rectangles by clicking and dragging on the canvas
- Real-time calculation of rectangle dimensions
- Calculate Euclidean distance between rectangle centers
- Save measurements to local storage
- View saved measurements in a sortable table
- Click table rows to re-render rectangles in their original positions
- Responsive design for both desktop and mobile
- Delete saved measurements

## Technical Stack -> React

- **Framework**: [Next.js](https://nextjs.org)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Storage**: Local Storage API
- **Drawing**: HTML Canvas API

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
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

## Project Structure

```
app/
├── components/         # React components
│   ├── Canvas.tsx     # Canvas drawing component
│   └── MeasurementTable.tsx  # Saved measurements table
├── types/             # TypeScript type definitions
│   └── index.ts
├── utils/            # Utility functions
│   ├── calculations.ts  # Distance and dimension calculations
│   └── storage.ts      # Local storage operations
└── page.tsx          # Main application page
```

## Implementation Details

- Canvas drawing is implemented using mouse events (mousedown, mousemove, mouseup)
- Rectangle dimensions are calculated in real-time during drawing
- Distance between rectangles is calculated using the Euclidean distance formula
- Data persistence is handled through the browser's Local Storage API
- The UI is fully responsive and adapts to different screen sizes
- Table supports sorting by timestamp and distance

## Assumptions and Limitations

### Assumptions
- The application runs in a modern web browser with JavaScript enabled
- Users have Node.js (v16 or higher) installed on their system
- Users understand basic geometric concepts (rectangles, distances)
- Screen resolution is sufficient to display the canvas and measurements accurately

### Limitations
- Maximum of two rectangles can be drawn at a time
- Rectangles must be drawn using click-and-drag
- Local storage is used for data persistence (data is browser-specific)
- Canvas size is fixed at 800x600 pixels
- All measurements are in pixels

## Steps to Run the Application

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/medida-interview.git
   cd medida-interview
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

4. **Run Tests**
   ```bash
   npm test
   ```

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm start` - Start production server
- `npm test` - Run test suite
- `npm run lint` - Run linter

## Future Improvements

- Add unit tests using Jest and React Testing Library
- Implement undo/redo functionality
- Add more sorting and filtering options for the table
- Support for different measurement units
- Export/import functionality for saved measurements
- Add touch support for mobile devices

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
