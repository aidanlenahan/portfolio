# IT Blog

## Getting Started

### Adding New Articles

To add a new article to your blog:

1. **Create your article HTML file** in the `articles/` directory (e.g., `articles/my-new-article.html`)
   - You can copy one of the existing articles as a template
   - Make sure to link to `../style.css` for consistent styling
   - Include a "Back to Home" link

2. **Update the articles index** by editing `articles/index.json`
   - Add a new entry to the `articles` array:
   ```json
   {
       "title": "Your Article Title",
       "date": "2024-01-20",
       "author": "Your Name",
       "excerpt": "A brief description of your article (1-2 sentences)",
       "file": "my-new-article.html"
   }

   - `title` (required): The article title displayed on the homepage
   - `date` (required): Publication date in YYYY-MM-DD format
   - `author` (optional): Author name
   - `excerpt` (required): Brief description shown on homepage
   - `file` (required): Filename of the article HTML file

Articles are automatically sorted by date (newest first) on the homepage.

## Structure

```
blog/
├── index.html              # Homepage with article list
├── style.css              # Styling for the blog
├── script.js              # JavaScript for auto-populating articles
├── articles/              # Directory containing all articles
│   ├── index.json        # Article index/metadata
│   ├── docker-guide.html
│   ├── nginx-reverse-proxy.html
│   └── kubernetes-basics.html
└── README.md
```

## License

Feel free to use and modify this blog for your own purposes!