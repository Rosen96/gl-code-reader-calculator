# GL Code Assistant

A modern web application to replace the `GL_Code.ods` spreadsheet for managing GL code calculations. Built with React, Vite, and Tailwind CSS.

## Features

- **Multi-Event Support**: Handle up to 3 simultaneous events (Order Shipped, Refunds, Replacements, Change Installer, Change Product)
- **Dynamic Filtering**: Automatically filters GL codes based on marketplace, event, product, payment type, and other settings
- **Real-time Calculations**: Calculates amounts using SUMIFS logic from pasted input data
- **Extensible Data Model**: All GL code mappings stored in `src/data/gl_codes.json` (485 records)
- **Clean UI**: Modern, responsive interface with separate input/results sections for each event

## Running Locally

### First Time Setup

1. **Navigate to the project directory**

2. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

### Starting the Development Server

```bash
npm run dev
```

The app will be available at **http://localhost:5173/**

To run on a specific port (e.g., port 3000):
```bash
npm run dev -- --port 3000
```

Then open **http://localhost:3000/** in your browser.

### Stopping the Server

Press `Ctrl + C` in the terminal where the dev server is running.

## Usage

1. **Configure Settings**: Select Marketplace, Events (1-3), Product, Payment Type, etc.
2. **Paste Input Data**: For each active event, paste data in the format:
   ```
   Amount | Event | GL Code
   ```
   Example:
   ```
   100.50	FIRST_ITEM_SHIPPED	40001
   200.00	FIRST_ITEM_SHIPPED	40002
   ```
3. **View Results**: Calculated GL codes appear automatically with Debit/Credit totals

## Extending the App

### Adding New Marketplaces or GL Codes

1. Edit `src/data/gl_codes.json`
2. Add new entries following this format:
   ```json
   {
     "Marketplace": "NewMarketplace",
     "Event": "FIRST_ITEM_SHIPPED",
     "GL Code": "12345",
     "Description": "New GL Code Description",
     "Recorded Value": "Credit (-)",
     "Notes": "Common"
   }
   ```
3. Update dropdown options in `src/components/SettingsPanel.jsx` if adding new marketplace/product types
4. Save and the dev server will hot-reload

## Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` folder.

To preview the production build:
```bash
npm run preview
```

## Project Structure

```
gl-code-app/
├── src/
│   ├── components/
│   │   ├── SettingsPanel.jsx    # Configuration UI
│   │   ├── InputSection.jsx     # Data input with CSV parsing
│   │   └── ResultsTable.jsx     # Calculated results display
│   ├── lib/
│   │   └── logic.js             # Core filtering & calculation logic
│   ├── data/
│   │   └── gl_codes.json        # 485 GL code mappings
│   ├── App.jsx                  # Main application
│   └── index.css                # Tailwind styles
└── package.json
```

## Technology Stack

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Styling
- **Lucide React** - Icons
- **PapaParse** - CSV/TSV parsing
