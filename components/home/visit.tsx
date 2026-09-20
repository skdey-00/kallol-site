import Link from "next/link"
import { Reveal } from "@/components/kallol/reveal"

/**
 * VISIT — the quiet, practical close (Phase 5B).
 *
 * Address set as small metadata columns under a modest heading;
 * timings; the map kept (it is genuinely useful). CONTACT and
 * MAPS buttons remain from Phase 5A. Verified facts only — no
 * invented hours, parking, or transport claims.
 */
export function Visit() {
  return (
    <section aria-labelledby="visit-heading" className="bg-stone-paper">
      <div className="container py-16 md:py-24">
        <Reveal className="grid gap-12 lg:grid-cols-12">
          {/* Metadata columns */}
          <div className="lg:col-span-5">
            <p className="section-eyebrow">Visit</p>
            <h2 id="visit-heading" className="section-title mt-3">
              Find us in Bangur Nagar
            </h2>
            <address className="mt-8 not-italic leading-relaxed text-ink-soft">
              Kallol Kali Mandir
              <br />
              Bangur Nagar, Goregaon West
              <br />
              Mumbai &ndash; 400104
            </address>
            <dl className="mt-8 space-y-5">
              <div>
                <dt className="text-caption uppercase tracking-caps text-ink-mute">
                  Phone
                </dt>
                <dd className="mt-1">
                  <a
                    href="tel:+918****2917"
                    className="link-editorial text-kallol-700"
                  >
                    +91-8655852917
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-caption uppercase tracking-caps text-ink-mute">
                  Email
                </dt>
                <dd className="mt-1">
                  <a
                    href="mailto:info@kallolmumbai.com"
                    className="link-editorial text-kallol-700"
                  >
                    info@kallolmumbai.com
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-caption uppercase tracking-caps text-ink-mute">
                  Mandir timings
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-ink-soft">
                  Morning 6:00 AM &ndash; 12:30 PM · Evening 5:00 PM &ndash; 9:00 PM
                  <br />
                  <span className="text-ink-mute">
                    (Tue, Sat &amp; Sun until 1:00 PM / 9:30 PM)
                  </span>
                </dd>
              </div>
            </dl>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn-primary">
                Contact Kallol
              </Link>
              <a
                href="https://maps.app.goo.gl/2AbY2NxYEX1fgfWHA"
                target="_blank"
                rel="noreferrer"
                className="btn-outline"
              >
                Open in Google Maps
              </a>
            </div>
          </div>

          {/* Map — same embed as /contact */}
          <div className="lg:col-span-7">
            <div className="h-full min-h-[320px] overflow-hidden rounded-md border border-stone-line">
              <iframe
                title="Map showing the location of Kallol Kali Mandir, Bangur Nagar, Goregaon West, Mumbai"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13274.317827296245!2d72.83752767472929!3d19.16408215102074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b65c30fda125%3A0x8725da56052753f8!2sKallol+Kali+Mandir!5e0!3m2!1sen!2sin!4v1554378261303!5m2!1sen!2sin"
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
