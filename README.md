# Professional Portfolio Template

A modern, responsive, and accessible portfolio website template built with HTML, CSS, and vanilla JavaScript. Features light/dark mode (defaults to dark), mobile-friendly navigation, and a clean professional design.

## Features

✨ **Modern Design**
- Clean, professional aesthetic with darker blue accents
- No gradients or emojis - pure professional look
- Professional icons using Font Awesome

🎨 **Dark Mode by Default**
- Opens in dark mode for modern aesthetic
- Toggle to light mode available
- Theme preference saved in browser
- Smooth transitions between themes
- WCAG compliant color contrast

📱 **Fully Responsive**
- Mobile-first approach
- Optimized for desktop, tablet, and mobile
- Touch-friendly interactive elements
- Hamburger menu for mobile devices

🎯 **Multiple Pages**
- **Home**: Landing page with hero section and featured projects
- **About**: Detailed background, skills, experience timeline, and education
- **Projects**: Portfolio showcase with featured dog walking project
- **Tech Help**: Dedicated freelance tech support services page
- **Contact**: Contact form and social media links
- **404**: Custom error page

🚀 **Performance**
- Fast loading time
- No framework dependencies
- Optimized CSS and JavaScript
- Minimal external dependencies
- .htaccess with caching and compression

♿ **Accessible**
- Semantic HTML5
- ARIA labels
- Keyboard navigation support
- Screen reader compatible

## File Structure

```
portfolio/
├── index.html          # Home page
├── about.html          # About page
├── projects.html       # Projects showcase (includes dog walking)
├── techhelp.html       # Freelance tech help services
├── contact.html        # Contact page
├── 404.html            # Custom 404 error page
├── .htaccess           # Apache config for extensionless URLs
├── css/
│   └── style.css      # All styles including responsive and themes
├── js/
│   └── main.js        # JavaScript for interactivity
├── images/            # (Create this folder for your images)
├── PRD.md             # Product Requirements Document
└── README.md          # This file
```

## What's Included

✅ **Tech Help Services Page** - Complete page outlining freelance tech support
✅ **Dog Walking Link** - Featured in projects and footer
✅ **Extensionless URLs** - Clean URLs (/about instead of /about.html)
✅ **Custom 404 Page** - Themed error page with helpful navigation
✅ **Dark Mode Default** - Modern dark theme on first visit
✅ **Darker Blue Accent** - Professional #1e40af instead of bright blue

## Getting Started

### Important: Enable Apache Rewrite Module

For extensionless URLs to work with WAMP:
1. Open WAMP tray icon → Apache → Apache Modules
2. Ensure `rewrite_module` is checked
3. Restart Apache

### 1. Setup

Simply clone or download the files to your web server or local machine. The portfolio works without any build process.

```bash
# If using WAMP, XAMPP, or similar
# Place files in your www/htdocs directory

# Or open directly in browser
# Open index.html in your web browser
```

### 2. Customization

#### Update Personal Information

**In all HTML files:**
- Replace "Your Name" with your actual name
- Update titles and descriptions
- Modify the contact information
- Add your social media links

**Example - Update name in index.html:**
```html
<h1 class="hero-title">Hello, I'm <span class="highlight">John Doe</span></h1>
```

#### Update Projects

**In projects.html:**
- Replace placeholder projects with your actual projects
- Update project titles, descriptions, and technologies
- Add your project links (live demo, GitHub, etc.)

**Example:**
```html
<h3 class="project-title">My Awesome Project</h3>
<p class="project-description">
    Description of your project...
</p>
<div class="project-tags">
    <span class="tag">React</span>
    <span class="tag">Node.js</span>
</div>
```

#### Add Images

Create an `images` folder and add your images:
```
images/
├── profile.jpg        # Your profile photo
├── project1.jpg       # Project screenshots
├── project2.jpg
└── ...
```

Update the image placeholders:
```html
<!-- Replace this -->
<div class="profile-placeholder">
    <i class="fas fa-user fa-5x"></i>
</div>

<!-- With this -->
<img src="images/profile.jpg" alt="Your Name" />
```

#### Customize Colors

Edit CSS variables in `css/style.css`:

```css
:root {
    --accent-primary: #2563eb;  /* Change primary color */
    --accent-hover: #1d4ed8;    /* Change hover color */
    /* etc... */
}
```

#### Update Skills

**In about.html**, modify the skills section:
```html
<div class="skill-tags">
    <span class="skill-tag">Your Skill</span>
    <span class="skill-tag">Another Skill</span>
    <!-- Add more skills -->
</div>
```

#### Update Experience Timeline

**In about.html**, edit the timeline items:
```html
<div class="timeline-item">
    <div class="timeline-content">
        <h3 class="timeline-title">Your Job Title</h3>
        <p class="timeline-company">Company Name</p>
        <span class="timeline-date">
            <i class="far fa-calendar"></i> 2020 - Present
        </span>
        <p class="timeline-description">
            Your job description...
        </p>
    </div>
</div>
```

#### Contact Form Integration

The contact form in `contact.html` currently shows a demo notification. To connect it to a real backend:

**Option 1: Use FormSpree**
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

**Option 2: Use Netlify Forms**
```html
<form name="contact" method="POST" data-netlify="true">
```

**Option 3: Create your own backend**
- Modify the form submission handler in `js/main.js`
- Send data to your server endpoint

## Customization Guide

### Changing Font

To use a custom font (e.g., Google Fonts):

1. Add to the `<head>` of all HTML files:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

2. Update CSS variable:
```css
:root {
    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

### Adding New Pages

1. Create a new HTML file (e.g., `blog.html`)
2. Copy the structure from an existing page
3. Update the navigation in all HTML files:

```html
<ul class="nav-menu" id="navMenu">
    <li><a href="index.html" class="nav-link">Home</a></li>
    <li><a href="about.html" class="nav-link">About</a></li>
    <li><a href="projects.html" class="nav-link">Projects</a></li>
    <li><a href="blog.html" class="nav-link">Blog</a></li> <!-- New -->
    <li><a href="contact.html" class="nav-link">Contact</a></li>
</ul>
```

### Modifying the Theme

The template uses CSS custom properties for easy theming. Simply update the values in `:root` and `[data-theme="dark"]` sections.

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment

### GitHub Pages

1. Create a GitHub repository
2. Push your files
3. Go to Settings → Pages
4. Select main branch
5. Your site will be live at `username.github.io/repository-name`

### Netlify

1. Drag and drop your folder to Netlify
2. Or connect your GitHub repository
3. Your site will be live instantly

### Traditional Hosting

Upload all files via FTP to your web hosting provider.

## Icons

This template uses [Font Awesome](https://fontawesome.com/) for icons. The free version is included via CDN.

To change icons, browse Font Awesome's library and replace the icon classes:
```html
<i class="fas fa-code"></i>  <!-- Change 'fa-code' to any other icon -->
```

## Performance Tips

1. **Optimize Images**: Compress images before uploading
2. **Use WebP Format**: Convert images to WebP for better compression
3. **Lazy Loading**: Add `loading="lazy"` to images
4. **Minify Files**: Use tools to minify CSS and JS for production

## Accessibility

The template follows WCAG 2.1 AA guidelines:
- Proper heading hierarchy
- Alt text for images (add your own)
- Keyboard navigation
- Sufficient color contrast
- ARIA labels
- Focus indicators

## Troubleshooting

**Theme not switching?**
- Check browser console for errors
- Ensure JavaScript is enabled
- Clear browser cache

**Mobile menu not working?**
- Verify the JavaScript file is loading
- Check for console errors
- Ensure proper file paths

**Styles not loading?**
- Verify CSS file path is correct
- Check for typos in file names
- Ensure files are in correct folders

## Support

For issues or questions:
1. Check the PRD.md file for detailed specifications
2. Review the inline code comments
3. Validate your HTML at [W3C Validator](https://validator.w3.org/)

## License

Free to use for personal and commercial projects. No attribution required.

## Credits

- Icons: Font Awesome (https://fontawesome.com/)
- Fonts: System font stack for optimal performance

---

**Built with ❤️ for developers, designers, and creative professionals**

## 📋 Portfolio Recommendations & Next Steps

### ✅ What You Have Now (Excellent Foundation)
1. Professional, modern design with dark mode
2. Fully responsive across all devices
3. Multiple pages covering all essential areas
4. Tech Help services page
5. Custom 404 page
6. Contact form
7. Featured dog walking project
8. Clean navigation

### 🎯 Critical Next Steps (Do These First)

#### 1. **Replace All Placeholder Content**
- [ ] Change "Your Name" to your actual name everywhere
- [ ] Update your professional email address
- [ ] Add your real phone number
- [ ] Replace sample project descriptions with your actual projects
- [ ] Update experience timeline with real jobs
- [ ] Modify skills to match your actual skillset

#### 2. **Add Real Links**
- [ ] Connect GitHub profile URL
- [ ] Add LinkedIn profile
- [ ] Link Twitter/X if you use it
- [ ] Update all project demo/source links
- [ ] Verify dog walking link works (✓ already added)

#### 3. **Add Professional Content**
- [ ] Create and link to downloadable resume/CV (PDF)
- [ ] Add a professional profile photo to About page
- [ ] Add actual project screenshots to Projects page
- [ ] Replace icon placeholders with real images

#### 4. **Configure Contact Form**
Choose one of these backends:
- **FormSpree** (easiest): https://formspree.io/
- **Netlify Forms** (if deploying to Netlify)
- **EmailJS**: https://www.emailjs.com/
- Custom PHP script (since you have WAMP)

### 🚀 Highly Recommended Additions

#### 5. **Add Testimonials**
- [ ] Collect 3-5 client testimonials/reviews
- [ ] Add them to Tech Help page (placeholders already there)
- [ ] Consider adding to home page as social proof
- **Why**: Builds trust, especially for freelance services

#### 6. **Create Resume/CV Download**
```html
<!-- Add to About page -->
<a href="files/resume.pdf" download class="btn btn-primary">
    <i class="fas fa-download"></i> Download Resume
</a>
```

#### 7. **Add Real Metrics to Projects**
Instead of: "A task management app with collaboration features"
Write: "Task management app serving 500+ active users with 99.9% uptime"
- Numbers build credibility
- Shows real-world impact
- Makes projects more impressive

#### 8. **Create Detailed Case Studies**
For 2-3 best projects, create dedicated pages with:
- ProblemStatement
- Your Solution
- Technologies Used
- Challenges Overcome
- Results/Metrics
- Screenshots/Demo

#### 9. **Tech Help Page Enhancements**
- [ ] Add your actual service area/location
- [ ] Set real pricing (or "Contact for quote")
- [ ] Add your actual availability
- [ ] Include real client testimonials
- [ ] Add FAQ section

#### 10. **SEO Optimization**
```html
<!-- Update meta tags in each page -->
<meta name="description" content="[Your specific description]">
<meta name="keywords" content="web developer, tech support, [your skills]">
<meta property="og:title" content="[Your Name] - Portfolio">
<meta property="og:description" content="[Description]">
<meta property="og:image" content="[Your photo URL]">
<meta name="twitter:card" content="summary_large_image">
```

### 💡 Nice-to-Have Enhancements

#### 11. **Blog Section** (Great for SEO)
- Positions you as an expert
- Drives organic traffic
- Shows communication skills
- Can be simple HTML pages to start

#### 12. **Project Filtering**
Add filter buttons on Projects page:
- Filter by technology (React, Node.js, etc.)
- Filter by type (Web App, Mobile, etc.)
- Enhances user experience

#### 13. **Analytics**
```html
<!-- Add Google Analytics or Plausible -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-ID"></script>
```
Track: page views, popular projects, contact form conversions

#### 14. **Speed Optimizations**
- [ ] Compress images (use TinyPNG or similar)
- [ ] Convert images to WebP format
- [ ] Add lazy loading to images: `<img loading="lazy" ...>`
- [ ] Consider CDN for Font Awesome (already using)

#### 15. **Trust Indicators**
- Certifications badges (AWS, Google, etc.)
- Years of experience prominently displayed
- "As seen on" or "Featured in" section
- Client logos (with permission)

#### 16. **Newsletter Signup**
- Collect interested leads
- Build audience for blog
- Use MailChimp, ConvertKit, or Buttondown

#### 17. **Accessibility Audit**
- [ ] Test with screen reader (NVDA or JAWS)
- [ ] Verify keyboard navigation
- [ ] Run Lighthouse audit in Chrome
- [ ] Fix any color contrast issues
- [ ] Add alt text to all images

### 🔒 Security & Professional Touches

#### 18. **Security Enhancements**
- ✅ .htaccess already includes security headers
- [ ] Set up SSL certificate (Let's Encrypt)
- [ ] Use environment variables for sensitive data
- [ ] Implement CAPTCHA on contact form (if spam becomes issue)

#### 19. **Professional Email**
Instead of Gmail, consider:
- Custom domain email (you@aidanlenahan.com)
- Google Workspace
- ProtonMail for privacy

#### 20. **Social Proof Additions**
- GitHub contribution graph widget
- LinkedIn recommendations
- Stack Overflow reputation (if applicable)
- Codepen/CodeSandbox embeds

### 📊 Performance Checklist

Before launching:
- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Test on mobile devices (iOS and Android)
- [ ] Validate HTML: https://validator.w3.org/
- [ ] Validate CSS: https://jigsaw.w3.org/css-validator/
- [ ] Run Lighthouse audit (aim for 90+ scores)
- [ ] Test contact form submission
- [ ] Verify all links work
- [ ] Check spelling and grammar
- [ ] Get feedback from 2-3 people

### 🎯 Content Writing Tips

**For Project Descriptions:**
- Start with the problem/need
- Explain your solution
- Highlight unique features
- Include technologies used
- Add metrics if possible
- End with a call-to-action (link)

**For About Page:**
- Tell your story (how you got into tech)
- Highlight what makes you unique
- Show personality (professional but human)
- Include what you're learning currently
- Mention your goals/aspirations

**For Tech Help Page:**
- Speak to pain points ("Frustrated with slow computer?")
- Use simple, non-technical language
- Include clear pricing or call-to-action
- Add urgency where appropriate
- Build trust with testimonials

### 🚀 Launch Checklist

Ready to go live?
- [ ] All placeholder content replaced
- [ ] Contact form works and tested
- [ ] Real profile photo added
- [ ] Resume/CV downloadable
- [ ] All links verified
- [ ] Mobile responsive tested
- [ ] SSL certificate installed
- [ ] Custom domain connected
- [ ] Google Analytics added
- [ ] Social media profiles updated with portfolio link
- [ ] Announced on LinkedIn/Twitter

### 📈 Post-Launch

After launching:
1. **Share widely**: LinkedIn, Twitter, Reddit (r/webdev), Facebook
2. **Ask for feedback**: Send to colleagues and mentors
3. **Update regularly**: Keep projects and skills current
4. **Track metrics**: See which projects get most attention
5. **Iterate**: Portfolio is never "done" - keep improving
6. **Add new projects** as you complete them
7. **Refresh testimonials** regularly
8. **Blog** about your work (if you added blog section)

### 🎨 Design Customization Ideas

If you want to further personalize:
- Add custom illustrations or graphics
- Use a unique color scheme (within professional bounds)
- Add subtle animations (micro-interactions)
- Custom cursor effects
- Animated background elements
- Unique section dividers

### 💰 Monetization Ideas (If Applicable)

- Offer 1-on-1 consulting calls
- Create a "Hire Me" page with clear rates
- Sell digital products (templates, courses)
- Affiliate links for tools you recommend
- Sponsored content (if you add a blog)

## 🎓 Learning Resources

Want to improve your skills?
- **Free**: freeCodeCamp, MDN Web Docs, W3Schools
- **Design**: Refactoring UI, Design for Developers
- **Performance**: web.dev, Web Performance in Action
- **SEO**: Moz Beginner's Guide, Google Search Central

## Need Help?

The PRD.md file contains complete technical specifications. All code is commented for easy understanding.

---

Happy customizing! 🚀