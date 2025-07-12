# Web Development Learning Wheel

A comprehensive web development learning resource featuring an interactive spinning wheel to discover new topics and skills.

## Features

- **Interactive Spinning Wheel**: Discover random web development topics
- **Comprehensive Resource Library**: 15+ curated learning resources
- **Responsive Design**: Works on all device sizes
- **Local Storage Integration**: Tracks your learning progress and recent spins
- **Contact Form**: Submit feedback and suggestions
- **Accessibility Compliant**: WCAG 2.1 guidelines followed
- **SEO Optimized**: Meta tags and social sharing support

## Project Requirements Met

### HTML Standards

- ✅ Valid, semantic HTML markup
- ✅ Proper use of header, nav, main, and footer elements
- ✅ Baseline development standards
- ✅ Unique title and meta description tags
- ✅ Open Graph and social media metadata

### CSS Standards

- ✅ Valid CSS with no unused declarations
- ✅ Responsive design (320px mobile to desktop)
- ✅ CSS Grid and Flexbox layouts
- ✅ CSS Custom Properties (variables)
- ✅ Animations and transitions
- ✅ Print styles included

### JavaScript Functionality

- ✅ **Data Fetching**: Fetch API with try/catch error handling
- ✅ **Dynamic Content**: 15+ items displayed from JSON data
- ✅ **Local Storage**: User preferences and spin history
- ✅ **Modal Dialogs**: Interactive topic details
- ✅ **DOM Manipulation**: Dynamic content generation
- ✅ **Event Handling**: Click, submit, change events
- ✅ **Array Methods**: map(), filter(), forEach() usage
- ✅ **Template Literals**: Dynamic string construction
- ✅ **ES Modules**: Modular code organization

### Form Implementation

- ✅ Complete HTML form with validation
- ✅ Form action page displaying submitted data
- ✅ Client-side validation with error messages
- ✅ Multiple input types (text, email, select, radio, checkbox, textarea)

### Design Principles

- ✅ Consistent look and feel
- ✅ Proper use of proximity, alignment, repetition, contrast
- ✅ Responsive navigation with hamburger menu
- ✅ Wayfinding with active page indicators
- ✅ Appropriate white-space usage

### Performance & Accessibility

- ✅ Page weight under 500kB
- ✅ Lazy loading for images
- ✅ Accessibility features (ARIA labels, keyboard navigation)
- ✅ Color contrast compliance
- ✅ Semantic markup for screen readers

## File Structure

```
final/
├── index.html              # Homepage with spinning wheel
├── resources.html          # All resources with filtering
├── contact.html           # Contact form
├── thankyou.html          # Form submission confirmation
├── attributions.html      # Resource credits
├── data/
│   └── resources.json     # Learning resources data
├── images/
│   ├── logo.png          # Site logo
│   ├── favicon.png       # Favicon
│   └── share-image.webp  # Social sharing image
├── scripts/
│   ├── main.js           # Homepage functionality
│   ├── resources.js      # Resources page
│   ├── contact.js        # Form handling
│   ├── thankyou.js       # Thank you page
│   ├── navigation.js     # Navigation module
│   ├── dataManager.js    # Data fetching module
│   ├── storageManager.js # Local storage module
│   └── modalManager.js   # Modal dialogs module
└── styles/
    ├── normalize.css     # CSS reset
    └── styles.css        # Main stylesheet
```

## Technologies Used

- **HTML5**: Semantic markup and modern features
- **CSS3**: Grid, Flexbox, Custom Properties, Animations
- **JavaScript ES6+**: Modules, Fetch API, Classes, Arrow Functions
- **Local Storage API**: Client-side data persistence
- **Responsive Design**: Mobile-first approach

## Key Features Explained

### Spinning Wheel

- CSS conic-gradient creates colorful wheel sections
- JavaScript handles rotation calculations and animations
- Results are stored in localStorage for tracking

### Resource Management

- JSON data file contains 15+ learning resources
- Dynamic filtering by category and difficulty
- Search functionality across all resource properties

### Form Validation

- Real-time validation with error messages
- Character counting for textarea
- Draft saving to localStorage
- Comprehensive data collection and display

### Accessibility Features

- ARIA labels and roles
- Keyboard navigation support
- Focus management in modals
- High contrast mode support
- Reduced motion preferences

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Author

**Kendy Chae**  
WDD 231: Web Frontend Development  
BYU-Idaho

## License

This project is created for educational purposes as part of the WDD 231 course at BYU-Idaho.
