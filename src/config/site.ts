import ogImage from "@/assets/og-image.png";

export const siteConfig = {
  name: "CC_",
  description:
    "Personal space of Carlos Chida, a passionate software developer who knows maths and finance but loves linguistics even more.",
  url: "https://chida.me",
  lang: "en",
  locale: "en_GB",
  author: "Carlos Chida",
  twitter: "@carloschida",
  ogImage: ogImage,
  socialLinks: {
    twitter: "https://twitter.com/carloschida",
    github: "https://github.com/carloschida",
    linkedIn: "https://www.linkedin.com/in/carloschida",
  },
  navLinks: [
    { text: "Home", href: "/" },
    { text: "CV", href: "/cv" },
    // { text: "Services", href: "/services" },
    { text: "Blog", href: "/blog" },
    // { text: "Contact", href: "/contact" },
    // { text: "Widgets", href: "/widgets" },
  ],
};
