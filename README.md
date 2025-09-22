# Pokémon Explorer

A React.js application for exploring Pokémon using the PokéAPI. Browse through different Pokémon, filter by type, and view detailed information including stats and artwork.

## Features

- Browse random Pokémon or filter by specific types
- View Pokémon details including height, weight, and type information
- Responsive design with beautiful cards layout
- Type-based filtering with multiple selection support
- Load more Pokémon functionality

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

You can start editing the page by modifying `src/App.jsx`. The page auto-updates as you edit the file.

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and development server
- **Tailwind CSS** - Styling and design system
- **Lucide React** - Beautiful icons
- **PokéAPI** - Pokémon data source

## Project Structure

```
src/
├── components/
│   ├── pokemon-card.jsx
│   └── type-selector.jsx
├── App.jsx           # Main application component
├── App.css           # Global styles
└── main.jsx          # React entry point
```

## Build

To build the project for production:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```
