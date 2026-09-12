import Link from "next/link"

/**
 * Visual memory — real Kallol photography from the existing gallery set,
 * laid out as a quiet editorial mosaic (no stock, no AI imagery).
 * All filenames verified against app/photos/page.tsx. Links to /photos.
 */
const FRAMES = [
  {
    src: "/assets/5B8A0782-1-2a544d2e.webp",
    alt: "The Kallol Kali Mandir sanctum",
    caption: "The Kali Mandir",
    span: "sm:col-span-2 sm:row-span-2",
    ratio: "aspect-[4/5]",
  },
  {
    src: "/assets/JTP_1643-1-ddea36c8.png",
    alt: "Evening aarti with lamps at the Kallol Kali Mandir",
    caption: "Evening aarti",
    span: "",
    ratio: "aspect-[4/3]",
  },
  {
    src: "/assets/5B8A9920-1-30c87be2.webp",
    alt: "Devotees gathered at a Kallol festival celebration",
    caption: "Festival crowds",
    span: "",
    ratio: "aspect-[4/3]",
  },
  {
    src: "/assets/Group-155-370a5d6a.png",
    alt: "A cultural performance on the Kallol stage",
    caption: "Cultural programme",
    span: "",
    ratio: "aspect-[4/3]",
  },
  {
    src: "/assets/IMG_9312-1-d83d3edb.png",
    alt: "Floral decorations and offerings at the Kali Mandir",
    caption: "Flowers for Maa Kali",
    span: "",
    ratio: "aspect-[4/3]",
  },
  {
    src: "/assets/5B8A9864-1-11a3d049.webp",
    alt: "The Kallol community gathered together",
    caption: "The community",
    span: "sm:col-span-2",
    ratio: "aspect-[16/9]",
  },
] as const

export function GalleryTeaser() {
  return (
    <section aria-labelledby="gallery-heading" className="bg-ivory-raised">
      <div className="container py-16 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="section-eyebrow">Gallery</p>
            <h2 id="gallery-heading" className="section-title mt-3">
              Kallol, seen up close
            </h2>
            <p className="mt-4 text-body-lg text-ink-soft">
              The mandir, the festivals, the people — photographs from
              Kallol&rsquo;s own celebrations.
            </p>
          </div>
          <Link href="/photos" className="btn-outline">
            View the gallery
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {FRAMES.map((frame) => (
            <figure key={frame.src} className={`group ${frame.span}`}>
              <div className="overflow-hidden rounded-md border border-stone-line">
                <img
                  src={frame.src}
                  alt={frame.alt}
                  width={640}
                  height={480}
                  loading="lazy"
                  decoding="async"
                  className={`${frame.ratio} w-full object-cover transition-transform duration-300 ease-calm group-hover:scale-[1.02]`}
                />
              </div>
              <figcaption className="img-caption mt-2">{frame.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
