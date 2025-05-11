# Hedge Calculator Deployment and Monetization Plan

## 0. Current Site Information

- Current hosting: GitHub Pages (https://sssorc.github.io/oa/#/devig)
- Current routing issues:
    - Uses hash-based routing (#/)
    - Has unnecessary /oa prefix
    - Needs to be updated to use clean URLs (e.g., sssorc.net/devig)

### Routing Changes Required

1. Update Vue Router configuration:

    ```javascript
    // router/index.js
    import { createRouter, createWebHistory } from 'vue-router';

    const router = createRouter({
        history: createWebHistory(), // Change from createWebHashHistory()
        routes: [
            {
                path: '/',
                name: 'home',
                component: Home,
            },
            {
                path: '/devig',
                name: 'devig',
                component: DevigCalculator,
            },
            // ... other routes
        ],
    });
    ```

2. Update build configuration:

    ```javascript
    // vite.config.js or vue.config.js
    export default defineConfig({
        base: '/', // Remove /oa/ prefix
        // ... other config
    });
    ```

3. Update GitHub Pages configuration:
    - Remove any custom domain settings
    - Update repository settings for new domain

## 1. Domain and Hosting Setup

### Domain Registration

- Purchase a domain through Cloudflare Registrar or another provider
- Recommended domain options:
    - hedgecalc.com
    - bethedge.com
    - hedgecalculator.com
    - sssorc.net (if available)
- Consider purchasing common misspellings to protect your brand

### Migration Steps

1. Update routing configuration as described above
2. Test locally with new routing setup
3. Deploy to Cloudflare Pages
4. Update DNS settings
5. Verify all routes work correctly
6. Set up 301 redirects from old GitHub Pages URLs to new domain

### Cloudflare Pages Deployment

1. Connect your GitHub repository to Cloudflare Pages
2. Configure build settings:
    - Build command: `npm run build`
    - Build output directory: `dist`
    - Node.js version: 18 (or latest LTS)
    - Environment variables:
        ```
        VITE_BASE_URL=/
        ```
3. Set up custom domain in Cloudflare Pages
4. Enable Cloudflare's SSL/TLS encryption
5. Configure DNS settings in Cloudflare
6. Set up URL rewrite rules to handle client-side routing:
    ```
    /* /index.html 200
    ```

## 2. Google Analytics Implementation

### Setup Steps

1. Create a Google Analytics 4 (GA4) property
2. Add Google Analytics to your Vue app:

    ```javascript
    // In main.js or similar
    import { createApp } from 'vue';
    import App from './App.vue';
    import VueGtag from 'vue-gtag-next';

    const app = createApp(App);
    app.use(VueGtag, {
        property: {
            id: 'G-XXXXXXXXXX', // Your GA4 measurement ID
        },
    });
    ```

### Key Metrics to Track

- Page views per calculator
- User engagement time
- Bounce rate
- Traffic sources
- User demographics
- Device types
- Conversion rates (if applicable)

## 3. SEO Optimization

### Technical SEO

1. Implement proper meta tags for each page
2. Create a sitemap.xml
3. Set up robots.txt
4. Implement structured data (JSON-LD) for each calculator
5. Ensure mobile responsiveness
6. Optimize page load speed

### Content Structure

1. Create dedicated landing pages for each calculator:

    - /arbitrage-calculator
    - /bonus-bet-converter
    - /risk-free-bet-calculator
    - /devig-calculator

2. Each page should include:
    - Unique meta title and description
    - H1 heading with calculator name
    - Comprehensive introduction
    - How-to-use section
    - FAQ section
    - Related calculators section

### URL Structure

```
https://yourdomain.com/
├── arbitrage-calculator/
│   ├── how-to-use
│   └── faq
├── bonus-bet-converter/
│   ├── how-to-use
│   └── faq
├── risk-free-bet-calculator/
│   ├── how-to-use
│   └── faq
└── devig-calculator/
    ├── how-to-use
    └── faq
```

## 4. Google AdSense Preparation

### Ad Placement Strategy

1. Header Ad Space

    - Top of page, below navigation
    - Size: 728x90 (leaderboard)

2. Sidebar Ad Spaces

    - Right side of calculator
    - Size: 300x250 (medium rectangle)
    - Multiple placements for different screen sizes

3. In-content Ad Spaces

    - Between calculator sections
    - Size: 300x250 (medium rectangle)

4. Footer Ad Space
    - Bottom of page
    - Size: 728x90 (leaderboard)

### Implementation Plan

1. Create placeholder components for each ad space
2. Design responsive layouts to accommodate ads
3. Implement lazy loading for ad components
4. Create ad-free zones around calculators
5. Prepare CSS classes for ad containers

### Ad Component Structure

```vue
<template>
    <div class="ad-container" :class="adSize">
        <!-- AdSense code will go here -->
        <div class="ad-placeholder">Advertisement</div>
    </div>
</template>
```

## 5. Traffic Generation Strategy

### Content Marketing

1. Create blog posts about:
    - Sports betting strategies
    - How to use each calculator
    - Betting tips and tricks
    - Industry news and updates

### Social Media

1. Create accounts on:
    - Twitter
    - Reddit (r/sportsbetting)
    - Discord
    - Facebook Groups

### Backlink Building

1. Reach out to:
    - Sports betting blogs
    - Betting strategy websites
    - Sports forums
    - Betting communities

### Paid Advertising (Future)

1. Google Ads
2. Social media ads
3. Betting-related websites

## 6. Monetization Timeline

### Phase 1: Traffic Building (Months 1-3)

- Focus on SEO and content creation
- Build social media presence
- Gather initial analytics data

### Phase 2: AdSense Implementation (Months 4-6)

- Apply for Google AdSense
- Implement ad spaces
- Monitor performance and adjust placements

### Phase 3: Optimization (Months 7+)

- Analyze ad performance
- A/B test ad placements
- Optimize for maximum revenue
- Consider additional monetization methods

## 7. Performance Monitoring

### Key Metrics to Track

1. Traffic Sources
2. User Engagement
3. Ad Revenue
4. Page Load Times
5. Bounce Rates
6. Conversion Rates

### Tools to Implement

1. Google Analytics
2. Google Search Console
3. Cloudflare Analytics
4. AdSense Dashboard
5. Page Speed Insights

## 8. Maintenance Plan

### Regular Tasks

1. Weekly:

    - Check analytics
    - Monitor ad performance
    - Review error logs

2. Monthly:

    - Update content
    - Check for broken links
    - Review SEO performance
    - Update calculators if needed

3. Quarterly:
    - Major content updates
    - Feature additions
    - Performance optimization
    - Security updates
