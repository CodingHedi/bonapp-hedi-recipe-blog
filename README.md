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

The following fields are required for each recipe : `title`, `date`, `author`, `ingredients` and `steps`.

The `videoUrl:` contains an embeded YouTube video URL.
If you want to add a video who's not embeded you should modifiy [`[slug].js here`](https://github.com/CodingHedi/bonapp-hedi-recipe-blog/blob/main/pages/posts/%5Bslug%5D.js#L114).

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

### Next.js build

To build the app, run the following command:

`npm run build`

If the compilation is successful, you should see the following message :

```bash
 ✓ Generating static pages (X/X)
 ✓ Collecting build traces
 ✓ Finalizing page optimization

Route (pages)                             Size     First Load JS
┌ ● /                                     37.1 kB         133 kB
├   /_app                                 0 B            96.1 kB
├ ○ /404                                  189 B          96.3 kB
├ ƒ /api/rating                           0 B            96.1 kB
└ ● /posts/[slug] (1610 ms)               3.4 kB         99.5 kB
    └ [+X more paths]
+ First Load JS shared by all             98 kB
  ├ chunks/framework-a4ddb9b21624b39b.js  57.5 kB
  ├ chunks/main-dc3396de66256727.js       33.8 kB
  └ other shared chunks (total)           6.69 kB

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses getStaticProps)
ƒ  (Dynamic)  server-rendered on demand
```

Now that the app is building, let's use Docker to deploy it.

### Docker

Verify that you have a Dockerfile in the root directory of the project with the following content :

```bash
FROM node:22-alpine

RUN npm install -g pnpm

COPY . .

RUN pnpm install

RUN pnpm run build

CMD ["pnpm", "run", "start"]
```

`podman build -t ghcr.io/codinghedi/bonapphedi .`

Be carefull, the image must be named following this pattern `GHCR.IO/OWNER/NAME:TAG` but the tag is optional.

## Deploy

The Docker image is available on Github Packages : [https://github.com/CodingHedi?tab=packages](https://github.com/CodingHedi?tab=packages)

Create a `screen` with the screen command on the VPS :

`screen -s bonapphedi`

To switch to the `screen` :

`screen -x bonapphedi`

Pull it with the following command :

`podman pull ghcr.io/codinghedi/bonapphedi:latest`

To run a container, run the following command :

`podman run -it -p 3000:3000 bonapphedi`

To run a deamonized container, run the following command :

`podman run -d -p 3000:3000 bonapphedi`

## Debug

To list the containers

`podman container list`

To kill it

`podman kill -a`

To enter a specific container

`podman exec -it <CONTAINER_ID> sh`

To list all the listenning ports on the VPS

`netstat -tlnp`

`podman run -d --name=bonapphedi --rm -p 3000:3000 bonapphedi`

`podman container list -a`

`podman container rm bonapphedi`

`podman cp bonapphedi:/content/rating.md .`
