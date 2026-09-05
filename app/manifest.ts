import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Helloow Creators",
    short_name: "Helloow",
    description:
      "Plataforma que conecta criadores de conteúdo e marcas na Helloow Creators.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#d14e95",
    icons: [
      {
        src: "/pwa-icon-192-v3.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/pwa-icon-512-v3.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/pwa-icon-maskable-512-v3.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
