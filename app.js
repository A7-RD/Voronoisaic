// Voronoi Filter Image Processing App
// Using custom Voronoi implementation (not d3-delaunay)

// ============================================================================
// Point Class
// ============================================================================
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  equals(other) {
    return Math.abs(this.x - other.x) < 0.000001 && 
           Math.abs(this.y - other.y) < 0.000001;
  }
}

// ============================================================================
// Triangle Class
// ============================================================================
class Triangle {
  constructor(p1, p2, p3) {
    this.points = [p1, p2, p3];
    this.edges = [
      [p1, p2],
      [p2, p3],
      [p3, p1]
    ];
    this.calculateCircumcenter();
  }

  calculateCircumcenter() {
    const [p1, p2, p3] = this.points;
    const D = 2 * (p1.x * (p2.y - p3.y) + 
                  p2.x * (p3.y - p1.y) + 
                  p3.x * (p1.y - p2.y));
    
    const Ux = ((p1.x * p1.x + p1.y * p1.y) * (p2.y - p3.y) +
               (p2.x * p2.x + p2.y * p2.y) * (p3.y - p1.y) +
               (p3.x * p3.x + p3.y * p3.y) * (p1.y - p2.y)) / D;
    
    const Uy = ((p1.x * p1.x + p1.y * p1.y) * (p3.x - p2.x) +
               (p2.x * p2.x + p2.y * p2.y) * (p1.x - p3.x) +
               (p3.x * p3.x + p3.y * p3.y) * (p2.x - p1.x)) / D;

    this.circumcenter = new Point(Ux, Uy);
    
    this.radiusSquared = (p1.x - Ux) * (p1.x - Ux) + 
                       (p1.y - Uy) * (p1.y - Uy);
  }

  containsPoint(point) {
    const dx = point.x - this.circumcenter.x;
    const dy = point.y - this.circumcenter.y;
    const distSquared = dx * dx + dy * dy;
    return distSquared <= this.radiusSquared * (1 + 0.000001);
  }
}

// ============================================================================
// VoronoiDiagram Class
// ============================================================================
class VoronoiDiagram {
  constructor(width, height, points) {
    this.width = width;
    this.height = height;
    this.points = points;
    this.triangles = [];
    this.cells = new Map();
  }

  async generate() {
    await this.generateTriangulation();
    await this.generateVoronoiCells();
    return this;
  }

  async generateTriangulation() {
    return new Promise(resolve => {
      setTimeout(() => {
        // Add super-triangle
        const margin = Math.max(this.width, this.height) * 2;
        const p1 = new Point(-margin, -margin);
        const p2 = new Point(this.width + margin, -margin);
        const p3 = new Point(this.width/2, this.height + margin);
        
        this.triangles = [new Triangle(p1, p2, p3)];

        // Add points one by one
        for (const point of this.points) {
          const badTriangles = [];
          
          // Find all triangles where point lies in their circumcircle
          for (const triangle of this.triangles) {
            if (triangle.containsPoint(point)) {
              badTriangles.push(triangle);
            }
          }
          
          // Find boundary of the polygonal hole
          const boundary = [];
          for (const triangle of badTriangles) {
            for (const edge of triangle.edges) {
              let isShared = false;
              for (const otherTriangle of badTriangles) {
                if (triangle === otherTriangle) continue;
                
                for (const otherEdge of otherTriangle.edges) {
                  if ((edge[0].equals(otherEdge[0]) && edge[1].equals(otherEdge[1])) ||
                      (edge[0].equals(otherEdge[1]) && edge[1].equals(otherEdge[0]))) {
                    isShared = true;
                    break;
                  }
                }
                if (isShared) break;
              }
              if (!isShared) {
                boundary.push(edge);
              }
            }
          }
          
          // Remove bad triangles
          this.triangles = this.triangles.filter(t => !badTriangles.includes(t));
          
          // Create new triangles from point and boundary edges
          for (const edge of boundary) {
            this.triangles.push(new Triangle(edge[0], edge[1], point));
          }
        }

        // Remove triangles that share vertices with super-triangle
        this.triangles = this.triangles.filter(triangle => {
          return !triangle.points.some(p => 
            p === p1 || p === p2 || p === p3
          );
        });
        resolve();
      }, 0);
    });
  }

  async generateVoronoiCells() {
    return new Promise(resolve => {
      setTimeout(() => {
        // Initialize cells for each point
        for (const point of this.points) {
          this.cells.set(point, []);
        }

        // For each triangle, add its circumcenter to the cells of its vertices
        for (const triangle of this.triangles) {
          for (const point of triangle.points) {
            const cell = this.cells.get(point);
            if (cell) {
              cell.push(triangle.circumcenter);
            }
          }
        }

        // Sort points in each cell clockwise
        for (const [point, cell] of this.cells) {
          this.sortPointsClockwise(cell, point);
        }
        resolve();
      }, 0);
    });
  }

  sortPointsClockwise(points, center) {
    points.sort((a, b) => {
      const angleA = Math.atan2(a.y - center.y, a.x - center.x);
      const angleB = Math.atan2(b.y - center.y, b.x - center.x);
      return angleA - angleB;
    });
  }
}

// ============================================================================
// Helper Functions
// ============================================================================
function calculateCentroid(polygon, width, height) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  
  // Find min and max coordinates
  for (const point of polygon) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }
  
  // Calculate middle point
  let x = (minX + maxX) / 2;
  let y = (minY + maxY) / 2;
  
  // Ensure centroid is within image bounds
  x = Math.max(0, Math.min(width - 1, x));
  y = Math.max(0, Math.min(height - 1, y));
  
  return { x, y };
}

function getAverageColorAtPoint(ctx, centerX, centerY, smoothness) {
  const halfSize = Math.floor(smoothness / 2);
  
  // Get exact pixel coordinates
  const x = Math.floor(centerX);
  const y = Math.floor(centerY);
  
  // Ensure we don't sample outside the image bounds
  const startX = Math.max(0, x - halfSize);
  const startY = Math.max(0, y - halfSize);
  const endX = Math.min(ctx.canvas.width, x + halfSize + 1);
  const endY = Math.min(ctx.canvas.height, y + halfSize + 1);
  
  const imageData = ctx.getImageData(startX, startY, 
                                   endX - startX, 
                                   endY - startY);
  const data = imageData.data;
  
  let r = 0, g = 0, b = 0, count = 0;
  
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count++;
  }
  
  if (count === 0) return { r: 0, g: 0, b: 0 };
  
  return {
    r: Math.round(r / count),
    g: Math.round(g / count),
    b: Math.round(b / count)
  };
}

function generatePoints(count, width, height) {
  const points = [];
  
  // Add border points for clean edges
  points.push(new Point(0, 0));
  points.push(new Point(width, 0));
  points.push(new Point(0, height));
  points.push(new Point(width, height));
  points.push(new Point(width/2, 0));
  points.push(new Point(width/2, height));
  points.push(new Point(0, height/2));
  points.push(new Point(width, height/2));
  
  // Add random points
  for (let i = 0; i < count - 8; i++) {
    points.push(new Point(
      Math.random() * width,
      Math.random() * height
    ));
  }
  
  return points;
}

// ============================================================================
// Main Application
// ============================================================================

// DOM elements
const imageInput = document.getElementById('image-input');
const urlInput = document.getElementById('url-input');
const loadUrlBtn = document.getElementById('load-url-btn');
const uploadBtn = document.getElementById('upload-btn');
const fileNameDisplay = document.getElementById('file-name');
const pointsInput = document.getElementById('points-input');
const smoothnessInput = document.getElementById('smoothness-input');
const thicknessInput = document.getElementById('thickness-input');
const processBtn = document.getElementById('process-btn');
const downloadBtn = document.getElementById('download-btn');
const copySvgBtn = document.getElementById('copy-svg-btn');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Default image URL
const DEFAULT_IMAGE_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/960px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg';

// State
let originalImage = null;
let originalCtx = null;
let processedVoronoiData = null; // Stores processed cells with colors for SVG generation

// Function to load and display image
function loadImage(img) {
  originalImage = img;
  // Set canvas size to match image
  canvas.width = img.width;
  canvas.height = img.height;
  
  // Fill with white background first
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw original image
  ctx.drawImage(img, 0, 0);
  
  // Create a separate canvas for original image data (for color sampling)
  const originalCanvas = document.createElement('canvas');
  originalCtx = originalCanvas.getContext('2d');
  originalCanvas.width = canvas.width;
  originalCanvas.height = canvas.height;
  originalCtx.drawImage(img, 0, 0);
  
  // Enable process button
  processBtn.disabled = false;
  downloadBtn.disabled = true;
  copySvgBtn.disabled = true;
  processedVoronoiData = null;
}

// Function to load image from URL
function loadImageFromURL(url) {
  // Clear file name display when loading from URL
  fileNameDisplay.textContent = '';
  
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    loadImage(img);
  };
  img.onerror = () => {
    alert('Failed to load image from URL. Please check the URL and ensure CORS is enabled on the server.');
  };
  img.src = url;
}

// Upload button click handler
uploadBtn.addEventListener('click', () => {
  imageInput.click();
});

// Load image from file input
imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  // Update file name display
  fileNameDisplay.textContent = file.name;
  
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      loadImage(img);
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

// Clipboard paste functionality
document.addEventListener('paste', (e) => {
  const items = e.clipboardData.items;
  
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      const blob = items[i].getAsFile();
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          loadImage(img);
          fileNameDisplay.textContent = 'Pasted from clipboard';
        };
        img.src = event.target.result;
      };
      
      reader.readAsDataURL(blob);
      e.preventDefault();
      break;
    }
  }
});

// Load image from URL input
loadUrlBtn.addEventListener('click', () => {
  const url = urlInput.value.trim();
  if (!url) {
    alert('Please enter an image URL');
    return;
  }
  loadImageFromURL(url);
});

// Allow Enter key to load from URL
urlInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    loadUrlBtn.click();
  }
});

// Update slider progress fill for WebKit browsers
function updateSliderProgress(slider) {
  const min = parseFloat(slider.min) || 0;
  const max = parseFloat(slider.max) || 100;
  const value = parseFloat(slider.value);
  const percentage = ((value - min) / (max - min)) * 100;
  slider.style.setProperty('--slider-progress', percentage + '%');
}

// Update smoothness display when slider changes
smoothnessInput.addEventListener('input', (e) => {
  const size = e.target.value;
  document.getElementById('smoothness-display').textContent = `${size}x${size}`;
  updateSliderProgress(e.target);
});

// Update points display when slider changes
pointsInput.addEventListener('input', (e) => {
  const points = e.target.value;
  document.getElementById('points-display').textContent = points;
  updateSliderProgress(e.target);
});

// Process image with Voronoi filter
processBtn.addEventListener('click', async () => {
  if (!originalImage || !originalCtx) return;
  
  processBtn.disabled = true;
  const originalText = processBtn.textContent;
  processBtn.textContent = 'Processing...';
  
  try {
    const numPoints = parseInt(pointsInput.value) || 2000;
    const smoothness = parseInt(smoothnessInput.value) || 7;
    const lineThickness = parseFloat(thicknessInput.value) || 3;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Generate points
    const points = generatePoints(numPoints, width, height);
    
    // Create Voronoi diagram
    const voronoi = new VoronoiDiagram(width, height, points);
    await voronoi.generate();
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Process cells in chunks
    const cells = Array.from(voronoi.cells.entries());
    const totalCells = cells.length;
    const chunkSize = Math.max(1, Math.floor(totalCells / 100));
    let processed = 0;
    
    // Store processed data for SVG generation
    const processedCells = [];
    
    await new Promise(resolve => {
      function processChunk() {
        const start = processed;
        const end = Math.min(processed + chunkSize, totalCells);
        
        // Set line thickness
        ctx.lineWidth = lineThickness;
        
        for (let i = start; i < end; i++) {
          const [point, cell] = cells[i];
          if (cell.length < 3) continue;
          
          const centroid = calculateCentroid(cell, width, height);
          const color = getAverageColorAtPoint(originalCtx, centroid.x, centroid.y, smoothness);
          
          // Store cell data for SVG
          processedCells.push({
            points: cell.map(p => ({ x: p.x, y: p.y })),
            color: { r: color.r, g: color.g, b: color.b },
            lineThickness: lineThickness
          });
          
          // Fill polygon
          ctx.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
          ctx.beginPath();
          ctx.moveTo(cell[0].x, cell[0].y);
          
          for (let j = 1; j < cell.length; j++) {
            ctx.lineTo(cell[j].x, cell[j].y);
          }
          
          ctx.closePath();
          ctx.fill();
          
          // Draw polygon outline if thickness > 0
          if (lineThickness > 0) {
            ctx.strokeStyle = 'rgba(0,0,0,0.3)';
            ctx.stroke();
          }
        }
        
        processed = end;
        
        // Update button text with progress
        const percent = Math.round((processed / totalCells) * 100);
        processBtn.textContent = `Processing... ${percent}%`;
        
        if (processed < totalCells) {
          setTimeout(processChunk, 0);
        } else {
          resolve();
        }
      }
      
      // Start processing chunks
      setTimeout(processChunk, 0);
    });
    
    // Store processed data for SVG generation
    processedVoronoiData = {
      width: width,
      height: height,
      cells: processedCells
    };
    
    // Reset button
    processBtn.disabled = false;
    processBtn.textContent = originalText;
    downloadBtn.disabled = false;
    copySvgBtn.disabled = false;
    
  } catch (error) {
    console.error('Error processing image:', error);
    alert('An error occurred while processing the image. Please try again.');
    processBtn.disabled = false;
    processBtn.textContent = originalText;
  }
});

// Download processed image
downloadBtn.addEventListener('click', () => {
  if (!canvas) return;
  
  const link = document.createElement('a');
  link.download = 'voronoi-filtered-image.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

// Generate SVG from processed Voronoi data
function generateSVG(data) {
  const { width, height, cells } = data;
  
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n`;
  
  // Add each cell as a polygon
  for (const cell of cells) {
    const { points, color, lineThickness } = cell;
    
    // Build polygon points string
    const pointsString = points.map(p => `${p.x},${p.y}`).join(' ');
    
    // Fill color
    const fillColor = `rgb(${color.r},${color.g},${color.b})`;
    
    // Stroke color and width (matching canvas: rgba(0,0,0,0.3))
    const strokeColor = 'rgba(0,0,0,0.3)';
    const strokeWidth = lineThickness > 0 ? lineThickness : 0;
    
    svg += `  <polygon points="${pointsString}" fill="${fillColor}"`;
    
    if (strokeWidth > 0) {
      svg += ` stroke="${strokeColor}" stroke-width="${strokeWidth}"`;
    }
    
    svg += ` />\n`;
  }
  
  svg += `</svg>`;
  
  return svg;
}

// Copy SVG to clipboard
copySvgBtn.addEventListener('click', async () => {
  if (!processedVoronoiData) {
    alert('Please process an image first.');
    return;
  }
  
  try {
    const svg = generateSVG(processedVoronoiData);
    
    // Use Clipboard API to copy SVG as text
    await navigator.clipboard.writeText(svg);
    
    // Provide user feedback
    const originalText = copySvgBtn.textContent;
    copySvgBtn.textContent = 'Copied!';
    setTimeout(() => {
      copySvgBtn.textContent = originalText;
    }, 2000);
  } catch (error) {
    console.error('Error copying SVG to clipboard:', error);
    
    // Fallback: Create a textarea and use execCommand
    try {
      const svg = generateSVG(processedVoronoiData);
      const textarea = document.createElement('textarea');
      textarea.value = svg;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      
      const originalText = copySvgBtn.textContent;
      copySvgBtn.textContent = 'Copied!';
      setTimeout(() => {
        copySvgBtn.textContent = originalText;
      }, 2000);
    } catch (fallbackError) {
      console.error('Fallback copy failed:', fallbackError);
      alert('Failed to copy SVG to clipboard. Please check your browser permissions.');
    }
  }
});

// Theme toggle functionality
function setTheme(theme) {
  const body = document.body;
  body.className = `theme-${theme}`;
  localStorage.setItem('theme', theme);
  
  // Update switch state
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.checked = theme === 'dark';
  }
}

// Load default image and theme on page load
window.addEventListener('DOMContentLoaded', () => {
  // Load saved theme or default to light
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);
  
  // Theme toggle switch handler
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('change', () => {
      const newTheme = themeToggle.checked ? 'dark' : 'light';
      setTheme(newTheme);
    });
  }
  
  // Set default URL in input
  urlInput.value = DEFAULT_IMAGE_URL;
  // Load the default image
  loadImageFromURL(DEFAULT_IMAGE_URL);
  
  // Initialize slider progress fills
  updateSliderProgress(pointsInput);
  updateSliderProgress(smoothnessInput);
});
