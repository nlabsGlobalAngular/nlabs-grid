# 📦 @nlabs/grid - Package Information

## Package Details

- **Name:** `@nlabs/grid`
- **Version:** 1.0.0
- **License:** MIT
- **Author:** Cuma Köse
- **Repository:** https://github.com/nlabsGlobalAngular/nlabs-grid

## Installation

```bash
npm install @nlabs/grid
```

## Key Features

✅ Enterprise-grade DataGrid component  
✅ Light/Dark theme system with auto mode  
✅ Dual edit modes (inline + modal)  
✅ CRUD operations with Turkish UI  
✅ Export to Excel, CSV, PDF, JSON  
✅ Advanced filtering, sorting, grouping  
✅ Custom cell and footer templates  
✅ Responsive design  
✅ TypeScript support  
✅ Angular 18+ compatibility  

## Dependencies

### Peer Dependencies
- `@angular/common`: >=18.0.0
- `@angular/core`: >=18.0.0
- `@angular/forms`: >=18.0.0
- `rxjs`: >=7.0.0

### Dev Dependencies
- Angular 20.0.0
- TypeScript 5.8.2

## File Structure

```
Package includes:
├── dist/              # Compiled library
├── src/               # Source files
├── README.md          # Documentation
└── LICENSE            # MIT License
```

## Files NOT Included in NPM

Thanks to `.npmignore`, these are excluded:
- node_modules/
- src/ (except compiled dist/)
- .angular/
- Tests (*.spec.ts)
- Config files (angular.json, tsconfig.*)
- Documentation (ADVANCED-CUSTOMIZATION.md, etc.)
- CI/CD files (.github/)

## Files NOT Included in Git

Thanks to `.gitignore`, these are excluded:
- node_modules/
- dist/
- .angular/cache
- *.log
- package-lock.json

## Quick Start

### 1. Install
```bash
npm install @nlabs/grid
```

### 2. Import
```typescript
import { DataGrid } from '@nlabs/grid';
```

### 3. Use
```html
<app-data-grid
    [data]="myData"
    [columns]="columns"
    [theme]="'auto'"
>
</app-data-grid>
```

## Scripts

```json
{
  "start": "ng serve",
  "build": "ng build",
  "build:lib": "ng build --configuration production",
  "test": "ng test"
}
```

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Links

- 📖 [Documentation](https://github.com/nlabsGlobalAngular/nlabs-grid#readme)
- 🐛 [Issues](https://github.com/nlabsGlobalAngular/nlabs-grid/issues)
- 💬 [Discussions](https://github.com/nlabsGlobalAngular/nlabs-grid/discussions)
- 📦 [NPM](https://www.npmjs.com/package/@nlabs/grid)

## Support

For support, issues, or feature requests:
- Open an issue on GitHub
- Contact: Cuma Köse via [LinkedIn](https://www.linkedin.com/in/turkmvc/)

## License

MIT © 2025 Cuma Köse

---

**Made with ❤️ and Angular**
