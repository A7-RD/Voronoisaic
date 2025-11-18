# Design System Component Library

A standalone, reusable design system and component library built with pure CSS and HTML. No JavaScript frameworks required - just clean, beautiful, and well-considered UI components.

## Features

- **Pure CSS/HTML** - No React, no build step, just copy and use
- **Theme Support** - Built-in light and dark theme system
- **Modular** - Use individual components or the complete system
- **Responsive** - Mobile-first design patterns
- **Accessible** - Semantic HTML and ARIA-friendly
- **Customizable** - CSS custom properties for easy theming

## Quick Start

### Option 1: Single File (Recommended for Quick Start)

Include the complete design system in one file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@200;300&family=Geist+Mono:wght@300&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="design-system.css">
</head>
<body class="theme-dark">
  <!-- Your content here -->
  <button class="button">Click Me</button>
</body>
</html>
```

### Option 2: Modular (Recommended for Production)

Import only what you need:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@200;300&family=Geist+Mono:wght@300&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="tokens.css">
  <link rel="stylesheet" href="base.css">
  <link rel="stylesheet" href="components/button.css">
  <link rel="stylesheet" href="components/input.css">
  <!-- Add only the components you need -->
</head>
<body class="theme-dark">
  <!-- Your content here -->
</body>
</html>
```

## Theme System

The design system supports light and dark themes. Apply themes using body classes:

```html
<body class="theme-dark">  <!-- Dark theme -->
<body class="theme-light">  <!-- Light theme -->
```

### Theme Toggle Example

```javascript
function toggleTheme() {
  const body = document.body;
  const isDark = body.classList.contains('theme-dark');
  body.classList.remove('theme-dark', 'theme-light');
  body.classList.add(isDark ? 'theme-light' : 'theme-dark');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
document.body.classList.add(`theme-${savedTheme}`);
```

## Components

### Core Components

#### Button

```html
<button class="button">Primary Button</button>
<button class="button button--secondary">Secondary</button>
<button class="button button--ghost">Ghost</button>
<button class="button button--sm">Small</button>
<button class="button button--lg">Large</button>
<button class="button button--full">Full Width</button>
<button class="button button--icon" aria-label="Icon button">
  <svg>...</svg>
</button>
```

#### Input

```html
<div class="input-group">
  <label class="input-group__label" for="input">Label</label>
  <input type="text" id="input" class="input" placeholder="Enter text...">
</div>

<!-- Number input with controls -->
<div class="input-group">
  <label class="input-group__label" for="number">Number</label>
  <div class="input-number">
    <button type="button" class="input-number__button">-</button>
    <input type="number" id="number" class="input-number__input" value="0">
    <button type="button" class="input-number__button">+</button>
  </div>
</div>

<!-- Textarea -->
<div class="input-group">
  <label class="input-group__label" for="textarea">Message</label>
  <textarea id="textarea" class="textarea" placeholder="Enter message..."></textarea>
</div>
```

#### Select

```html
<div class="select-group">
  <label class="select-group__label" for="select">Choose Option</label>
  <div class="select">
    <select id="select">
      <option>Option 1</option>
      <option>Option 2</option>
    </select>
  </div>
</div>
```

#### Slider

```html
<div class="slider-group">
  <label class="slider-group__label" for="slider">Value</label>
  <input type="range" id="slider" class="slider" min="0" max="100" value="50">
</div>
```

#### Checkbox

```html
<label class="checkbox-group">
  <input type="checkbox">
  <span>Checkbox Label</span>
</label>

<!-- Radio -->
<label class="radio-group">
  <input type="radio" name="group">
  <span>Radio Option</span>
</label>
```

#### Card

```html
<div class="card">
  <div class="card__header">
    <h3 class="card__title">Card Title</h3>
  </div>
  <div class="card__body">
    <p>Card content</p>
  </div>
  <div class="card__footer">
    <span>Footer</span>
    <button class="button">Action</button>
  </div>
</div>

<!-- Variants -->
<div class="card card--compact">Compact</div>
<div class="card card--spacious">Spacious</div>
<div class="card card--bordered">Bordered</div>
<div class="card card--interactive">Interactive (hover effect)</div>
```

#### Typography

```html
<p class="text">Default text</p>
<p class="text text--muted">Muted text</p>
<p class="text text--subtle">Subtle text</p>
<p class="text text--mono">Monospace</p>
<p class="text text--sm">Small</p>
<p class="text text--lg">Large</p>

<a href="#" class="link">Link</a>
<a href="#" class="link link--muted">Muted Link</a>

<label class="label">Label</label>
<label class="label label--sm">Small Label</label>
```

### Extended Components

#### Modal

```html
<div class="modal-backdrop">
  <div class="modal">
    <div class="modal__header">
      <h3 class="modal__title">Modal Title</h3>
      <button class="modal__close" aria-label="Close">×</button>
    </div>
    <div class="modal__body">
      <p>Modal content</p>
    </div>
    <div class="modal__footer">
      <button class="button button--secondary">Cancel</button>
      <button class="button">Confirm</button>
    </div>
  </div>
</div>

<!-- Sizes -->
<div class="modal modal--small">Small</div>
<div class="modal">Default</div>
<div class="modal modal--large">Large</div>
```

#### Dropdown

```html
<div class="dropdown">
  <button class="dropdown__trigger">Menu</button>
  <div class="dropdown__menu">
    <button class="dropdown__item">Option 1</button>
    <button class="dropdown__item">Option 2</button>
    <div class="dropdown__divider"></div>
    <button class="dropdown__item">Option 3</button>
  </div>
</div>

<!-- With button trigger -->
<div class="dropdown dropdown--button">
  <button class="dropdown__trigger">Actions</button>
  <div class="dropdown__menu dropdown__menu--right">
    <button class="dropdown__item">Edit</button>
    <button class="dropdown__item">Delete</button>
  </div>
</div>
```

#### Navigation

```html
<nav class="nav">
  <a href="#" class="nav__brand">Brand</a>
  <ul class="nav__links">
    <li><a href="#" class="nav__link">Home</a></li>
    <li><a href="#" class="nav__link nav__link--active">About</a></li>
    <li><a href="#" class="nav__link">Contact</a></li>
  </ul>
  <div class="nav__actions">
    <button class="button">Sign In</button>
  </div>
</nav>

<!-- Sticky navigation -->
<nav class="nav nav--sticky">...</nav>
```

#### Form

```html
<form class="form">
  <div class="form__section">
    <h3 class="form__section-title">Section Title</h3>
    <div class="input-group">
      <label class="input-group__label" for="name">Name</label>
      <input type="text" id="name" class="input">
      <span class="form__help">Help text</span>
    </div>
  </div>
  <div class="form__row">
    <div class="input-group">...</div>
    <div class="input-group">...</div>
  </div>
  <div class="form__actions">
    <button type="button" class="button button--secondary">Cancel</button>
    <button type="submit" class="button">Submit</button>
  </div>
</form>
```

#### Table

```html
<div class="table-container">
  <table class="table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>John Doe</td>
        <td>john@example.com</td>
        <td>
          <div class="table__actions">
            <button class="button button--sm">Edit</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

<!-- Variants -->
<table class="table table--striped">Striped rows</table>
<table class="table table--compact">Compact spacing</table>
<table class="table table--spacious">Spacious spacing</table>
```

#### Badge

```html
<span class="badge badge--primary">Primary</span>
<span class="badge badge--secondary">Secondary</span>
<span class="badge badge--muted">Muted</span>
<span class="badge badge--outline">Outline</span>

<!-- Sizes -->
<span class="badge badge--sm">Small</span>
<span class="badge">Default</span>
<span class="badge badge--lg">Large</span>
```

#### Tooltip

```html
<div class="tooltip">
  <span class="tooltip__trigger">Hover me</span>
  <div class="tooltip__content">Tooltip text</div>
</div>

<!-- Positions -->
<div class="tooltip tooltip--bottom">Bottom</div>
<div class="tooltip tooltip--left">Left</div>
<div class="tooltip tooltip--right">Right</div>

<!-- Multiline -->
<div class="tooltip">
  <span class="tooltip__trigger">Hover</span>
  <div class="tooltip__content tooltip__content--multiline">
    Long tooltip text that spans multiple lines
  </div>
</div>
```

## Design Tokens

The design system uses CSS custom properties for easy customization:

### Colors
- `--prime-light`, `--prime-dark` - Base colors
- `--theme-bg`, `--theme-surface`, `--theme-text` - Theme colors
- `--theme-button-bg`, `--theme-button-text` - Button colors

### Spacing
- `--space-xs` (2px), `--space-s` (4px), `--space-m` (8px)
- `--space-l` (12px), `--space-xl` (16px), `--space-2xl` (24px)

### Typography
- `--font-family-sans` - Geist, system fonts
- `--font-family-mono` - Geist Mono
- `--font-size-xs` through `--font-size-4xl`

### Border Radius
- `--radius-sm` (4px), `--radius-md` (8px)
- `--radius-full` (50%), `--radius-pill` (9999px)

## Examples

See the `examples/` folder for complete HTML examples of each component with all variants and states.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS custom properties required
- `color-mix()` function used for color variations (fallback provided)

## Customization

Override design tokens in your own CSS:

```css
:root {
  --prime-light: hsl(132, 11%, 91%);
  --prime-dark: hsl(86, 3%, 46%);
  /* Customize spacing, typography, etc. */
}
```

## License

Use freely in your projects.

## Credits

Design system extracted from SuperStroker codebase patterns. Uses Geist font family.

