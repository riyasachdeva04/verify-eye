import { HeroHeader, ContentSection } from "@/types/contents"

/* ====================
[> CUSTOMIZING CONTENT <]
-- Setup image by typing `/image-name.file` (Example: `/header-image.jpg`)
-- Add images by adding files to /public folder
-- Leave blank `` if you don't want to put texts or images
 ==================== */

export const heroHeader: HeroHeader = {
  header: `Unmasking Truth in Every Frame`,
  subheader: `Easy short form content validator`,
  image: `/eye.svg`,
}

export const featureCards: ContentSection = {
  header: `Built over`,
  subheader: `What makes Next Landing possible`,
  content: [
    {
      text: `Next.js+ shad cn`,
      subtext: `The Website is built using this`,
      icon: "nextjs",
    },
    {
      text: `Azure`,
      subtext: `Deployed here`,
      icon: "azure",
    },
    {
      text: `OpenAi`,
      subtext: `Whisper for Speech to Text`,
      icon: "openai",
    },
  ],
}

// export const features: ContentSection = {
//   header: `Features`,
//   subheader: `Why use Next Landing?`,
//   image: `/features-img.webp`,
//   content: [
//     {
//       text: `SEO Optimized`,
//       subtext: `Improved website visibility on search engines`,
//       icon: "fileSearch",
//     },
//     {
//       text: `Highly Performant`,
//       subtext: `Fast loading times and smooth performance`,
//       icon: "barChart",
//     },
//     {
//       text: `Easy Customizability`,
//       subtext: `Change your content and layout with little effort`,
//       icon: "settings",
//     },
//   ],
// }
