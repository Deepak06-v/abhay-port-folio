# Abhay Kumar - AI-Assisted Web Developer Portfolio

A premium personal portfolio website built with React, Vite, GSAP, and Lenis smooth scrolling.

## Development

```bash
npm install
npm run dev
```

Open http://localhost:5173 to view the portfolio in development mode.

## Production Build

```bash
npm run build
```

This generates the production build in the `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

Runs the production build locally at http://localhost:4173 for verification before deployment.

## Deployment

This portfolio is a static single-page application and is compatible with the following platforms:

- **Vercel**: Connect your GitHub repository and deploy. The `dist/` folder contains the static assets.
- **Netlify**: Drag and drop the `dist/` folder, or connect your GitHub repository for automatic deploys.
- **Cloudflare Pages**: Connect your repository and deploy.
- **GitHub Pages**: Configure the repository settings to use the `dist/` folder as the publish directory.

### Manual Deployment Steps

1. Run `npm install` to install dependencies
2. Run `npm run build` to generate the production build
3. Run `npm run preview` to verify the production build locally
4. Deploy the `dist/` folder to your preferred hosting platform

## Environment Variables

Create a `.env` file if needed with the following variables:

```
VITE_SITE_URL=<your-deployment-url>
VITE_API_URL=<api-endpoint-if-required>
```

Note: `VITE_*` variables are exposed to the browser. Do not put secret credentials in them.

## License

This project is for personal portfolio purposes.