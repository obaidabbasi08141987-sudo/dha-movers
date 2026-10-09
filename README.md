# DHA Movers & Packers

A React, TypeScript, Vite and React Three Fiber website for DHA Movers & Packers.

## Run locally

```sh
npm install
npm run dev
```

Vite prints the local development URL after starting.

## Build for production

```sh
npm run build
npm run preview
```

The build script runs the TypeScript check before creating the production bundle.

## Website notes

- The home page follows a nine-part, scroll-driven 3D moving story. Its truck, road, boxes, home, office and packing props are procedural Three.js models.
- The 3D scene uses reduced pixel density and disables real-time shadows on smaller screens. Time-based motion is reduced when the visitor prefers reduced motion.
- Call and WhatsApp links use the provided business phone number. The contact form validates details and opens the visitor's email app; it does not send data to a server.
- Add a sitemap only after the business has an official website domain.
