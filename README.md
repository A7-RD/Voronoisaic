# Voronoisaic

A web application that transforms images into beautiful Voronoi mosaics. Upload any image, adjust the settings, and create stunning geometric art with customizable Voronoi diagrams.

![Voronoisaic](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- **Multiple Image Input Methods**
  - Upload images from your computer
  - Load images from URLs
  - Paste images directly from your clipboard (⌘+V / Ctrl+V)

- **Customizable Processing**
  - Adjust the number of Voronoi points (100-6000)
  - Control color smoothness (1x1 to 9x9 sampling)
  - Set line thickness for cell borders (0-10px)

- **Export Options**
  - Download processed images as PNG
  - Copy SVG code to clipboard for vector graphics

- **Beautiful UI**
  - Light and dark theme support
  - Responsive design that works on desktop and mobile
  - Custom design system with smooth animations
  - Fun "Moth Mode" theme toggle

## How to Use

1. **Load an Image**
   - Enter an image URL and click the load button, or
   - Click "Choose File" to upload from your computer, or
   - Press ⌘+V (Mac) or Ctrl+V (Windows/Linux) to paste from clipboard

2. **Adjust Settings**
   - **Number of Points**: More points = more detail (but slower processing)
   - **Smoothness**: Higher values = smoother color transitions
   - **Line Thickness**: Set to 0 for no borders, or increase for visible cell edges

3. **Process Image**
   - Click "Process Image" to generate your Voronoi mosaic
   - Watch the progress percentage as it processes

4. **Export Your Creation**
   - Click "Download" to save as PNG
   - Click "Copy SVG" to get vector code for use in other applications

## Getting Started

### Quick Start

Simply open `index.html` in a modern web browser. No build process or installation required!

```bash
# Clone the repository
git clone https://github.com/A7-RD/Voronoisaic.git

# Open in your browser
open index.html
```

### Requirements

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- No server required - works offline after initial load

## Project Structure

```
Voronoisaic/
├── index.html          # Main application page
├── app.js              # Voronoi processing logic
├── MothMode.png        # Theme toggle icon
└── design-system/      # UI component library
    ├── design-system.css
    ├── tokens.css
    ├── base.css
    └── components/     # Individual component styles
```

## How It Works

Voronoisaic uses a custom implementation of the Voronoi diagram algorithm:

1. **Point Generation**: Random points are generated across the image (plus border points for clean edges)
2. **Delaunay Triangulation**: Points are triangulated using the Bowyer-Watson algorithm
3. **Voronoi Cells**: Each cell is created from the circumcenters of adjacent triangles
4. **Color Sampling**: The average color from the original image is calculated for each cell
5. **Rendering**: Cells are drawn as filled polygons with optional borders

## Technical Details

- **Pure JavaScript**: No external dependencies or frameworks
- **Canvas API**: Uses HTML5 Canvas for image processing and rendering
- **Custom Voronoi Implementation**: Built from scratch (not using d3-delaunay)
- **Chunked Processing**: Processes cells in chunks to keep the UI responsive
- **SVG Export**: Generates clean, scalable vector graphics

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Requires support for:
- HTML5 Canvas
- ES6 JavaScript features
- CSS Custom Properties
- Clipboard API (for SVG copy feature)

## Customization

### Design System

The project includes a complete design system in the `design-system/` folder. See `design-system/README.md` for documentation on using the component library in other projects.

### Theme Customization

Themes are controlled via CSS custom properties. Modify colors in `design-system/tokens.css` to create your own theme.

## License

This project is open source and available for use in your own projects.

## Credits

- Uses the Geist font family
- Design system inspired by modern UI patterns
- Voronoi algorithm implementation by the project author

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

**Enjoy creating beautiful Voronoi mosaics!** 🎨
