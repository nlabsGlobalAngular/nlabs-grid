# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-04

### 🎉 Initial Release

#### ✨ Features
- **Core DataGrid Component**
  - Fully customizable grid with width and max-width inputs
  - TypeScript support with complete type definitions
  - Responsive design for mobile and desktop
  - High-performance rendering for large datasets

- **Theme System**
  - Light theme with vibrant colors
  - Dark theme with eye-friendly soft colors
  - Auto theme following system preferences
  - Smooth theme transitions
  - CSS custom properties for easy customization

- **Data Operations**
  - Global search across all columns
  - Multi-column sorting
  - Advanced filtering with multiple operators
  - Column grouping
  - Pagination with customizable page sizes (10, 25, 50, 100)
  - Summary row with totals and averages

- **Editing Features**
  - Dual edit modes (inline and modal)
  - Inline editing for quick changes
  - Modal editing for detailed forms
  - Add new records via modal
  - Delete confirmation with record details
  - Turkish UI localization

- **Export & Import**
  - Export to Excel (.xlsx)
  - Export to CSV (.csv)
  - Export to PDF (.pdf)
  - Export to JSON (.json)
  - Import from Excel/CSV

- **Advanced Features**
  - Custom cell templates
  - Custom footer templates
  - Column menu (show/hide, reorder, resize)
  - Drag & drop column reordering
  - Column resizing
  - Row selection (single/multi)
  - Beautiful animations and transitions

#### 🎨 UI/UX
- Modern gradient modal headers
- Smooth backdrop blur effects
- Hover effects and transitions
- Mobile-friendly responsive design
- Accessibility features

#### 📚 Documentation
- Comprehensive README with examples
- API reference documentation
- Configuration guides
- Usage examples for all features
- Contributing guidelines

#### 🐛 Bug Fixes
- Fixed inline editing with proper ID comparison
- Fixed dark theme eye strain with softer colors
- Fixed CSS animation lint errors
- Fixed XSS warnings with proper sanitization

#### 🔧 Technical
- Angular 20.0.0 support
- TypeScript 5.8.2
- Standalone components
- Modern @if/@for syntax
- ViewChild pattern for component coordination
- CSS custom properties for theming

---

## [Unreleased]

### Planned Features
- Virtual scrolling for large datasets
- Server-side operations (sorting, filtering, paging)
- Column templates via content projection
- More export formats (XML, HTML)
- Accessibility improvements (ARIA labels)
- Internationalization (i18n) support
- More theme presets
- Mobile touch gestures
- Keyboard navigation
- Advanced column filtering UI

---

**Legend:**
- ✨ Features: New functionality
- 🐛 Bug Fixes: Fixed issues
- 📚 Documentation: Documentation updates
- 🎨 UI/UX: Interface improvements
- 🔧 Technical: Technical changes
- ⚡ Performance: Performance improvements
- 🔒 Security: Security improvements
- ⚠️ Breaking: Breaking changes

---

For more information, visit: https://github.com/nlabsGlobalAngular/nlabs-grid
