# Product Images Organization

This folder contains organized product images for the Pooja Bells website.

## Structure

### Hand Bells (`hand-bells/`)
- `type-1/` - First type of hand bells
- `type-2/` - Second type of hand bells  
- `type-3/` - Third type of hand bells
- `type-4/` - Fourth type of hand bells

### Hanging Bells (`hanging-bells/`)
- Images of hanging bells

### Jayagante (`jayagante/`)
- Images of jayagante bells

## Image Guidelines

- Use high-quality images (preferably 1200x1200px or larger)
- Supported formats: JPG, PNG, WebP
- Use descriptive filenames (e.g., `hand-bell-type1-front.jpg`)
- Include multiple angles when possible (front, side, detail shots)
- Optimize images for web (compress without losing quality)

## Usage in Code

Images in these folders can be imported in React components like:

```typescript
import handBellType1 from '../assets/products/hand-bells/type-1/main.jpg';
import hangingBell1 from '../assets/products/hanging-bells/bell-1.jpg';
import jayagante1 from '../assets/products/jayagante/main.jpg';
```

The ProductCard and ProductsSection components will automatically pick up images from these folders.