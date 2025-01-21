# BONAPP' HEDI Recipe Blog

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app) designed for a recipe blog.
It features a modern and responsive user interface with various functionalities to enhance user experience. The perfect in-between of blog and recipe website.

## Features

- **Static Site Generation (SSG)**: Pre-renders pages at build time for fast load times and SEO benefits.
- **Markdown Content**: Recipes are stored as Markdown files for easy content management.
- **Search and Filtering**: Search for recipes and filter results by author and tags using [`react-select`](https://react-select.com/) and [`fuzzy`](https://github.com/mattyork/fuzzy).
- **Dark Mode**: Toggle between light and dark modes based on user preference.
- **Reusable Components**: Includes reusable components like `HeroCarousel.tsx`, `Card.tsx`, `TimeAgo.tsx` and `RatingSystem.tsx`.
- **TypeScript**: Written in TypeScript for type safety and better development experience.
- **Comments**: For each recipe, users can leave comments through a comment form powered by [`giscus`](https://giscus.app/) a comments system powered by GitHub Discussions.
- **Context API**: Manages global state, such as theme preference, using React's Context API.
- **Third-Party Libraries**: Utilizes libraries like [`react-select`](https://react-select.com/), [`fuzzy`](https://github.com/mattyork/fuzzy), [`giscus`](https://giscus.app/), [`gray-matter`](https://github.com/jonschlinkert/gray-matter) and [`remark`](https://github.com/remarkjs/remark).

## Getting Started

First, add some recipes to the `/content` directory. Here's an example recipe:

```yaml
---
title: "Spaghetti Aglio e Olio"
date: "2025-01-02"
author: "Hédi"
image: "thumbnail/spaghetti.png"
description: "A classic Italian pasta dish."
videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?si=EKd9zTRj9d8PKQdA"
tags: ["gluten", "pasta", "vegan"]

ingredients:
  - name: Spaghetti
    quantity: 200
    unit: g
  - name: Ground Beef
    quantity: 300
    unit: g
  - name: Tomato Sauce
    quantity: 400
    unit: mL
  - name: Onion
    quantity: 1
    unit: pc
  - name: Garlic
    quantity: 2
    unit: cloves
steps:
  - Boil the spaghetti in salted water until al dente. [00:30]
  - Sauté onion and garlic in a pan.
  - Add ground beef and cook until browned. [01:00]
  - Stir in tomato sauce and let simmer for 15 minutes.
  - Serve the sauce over the spaghetti. [1:25]
---
```

Then, add a `rating.md` to the `/content` directory. Here's the file :

```yaml
---
ratings: {}
---
```

Also, if you want to add some thumbnail to the blog cards, you can add them in the `/public/thumbnail` directory.
Avatars, logos and favicon can be added directly in the `/public` directory.

Finally, run the development server:

```bash
npm run dev
```

You can now open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build

## Deploy
