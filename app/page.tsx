const collections = [
  {
    number: "01",
    title: "Fabric by the yard",
    copy: "Thoughtfully chosen cottons for quilts, keepsakes, and everyday sewing.",
    className: "fabric-yardage",
  },
  {
    number: "02",
    title: "Precuts & bundles",
    copy: "Coordinated cuts that make starting something beautiful feel easy.",
    className: "fabric-precuts",
  },
  {
    number: "03",
    title: "Quilted goods",
    copy: "Small-batch pieces, sewn by hand and made to be used often.",
    className: "fabric-quilted",
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Loon and Pine home">
          <img src="/loon-and-pine-logo.png" alt="Loon & Pine" />
        </a>
        <nav aria-label="Main navigation">
          <a href="#collection">Collection</a>
          <a href="#about">Our story</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="header-note" href="mailto:hello@shoploonandpine.com">
          Opening soon
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">A new sewing & craft shop · Coming soon</p>
          <h1>Quality fabric.<br />Crafted with care.</h1>
          <p className="hero-intro">
            Loon & Pine is a small, independently owned shop for carefully
            selected quilting cotton, useful precuts, and handmade quilted
            goods—created for slow afternoons and projects worth keeping.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#collection">Preview the shop</a>
            <a className="text-link" href="#about">Meet Loon & Pine <span>→</span></a>
          </div>
        </div>
        <div className="hero-mark" aria-hidden="true">
          <div className="hero-logo-wrap">
            <img src="/loon-and-pine-logo-cream.png" alt="" />
          </div>
          <p>Fabric · Notions · Handmade</p>
        </div>
      </section>

      <div className="ticker" aria-label="Planned shop offerings">
        <span>QUILTING COTTONS</span><i>✦</i>
        <span>SMALL-BATCH GOODS</span><i>✦</i>
        <span>PRE-CUT BUNDLES</span><i>✦</i>
        <span>MADE FOR MAKING</span>
      </div>

      <section className="collection section" id="collection">
        <div className="section-heading">
          <div>
            <p className="eyebrow">The opening collection</p>
            <h2>A little something<br />for every maker.</h2>
          </div>
          <p>
            We&apos;re building a friendly, well-edited shop for new sewists,
            lifelong quilters, and anyone who appreciates a beautifully made
            object.
          </p>
        </div>

        <div className="collection-grid">
          {collections.map((item) => (
            <article className="collection-card" key={item.title}>
              <div className={`fabric-swatch ${item.className}`}>
                <span>{item.number}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
              <span className="coming-label">Arriving soon</span>
            </article>
          ))}
        </div>
      </section>

      <section className="about section" id="about">
        <div className="about-art" aria-hidden="true">
          <span className="stitch stitch-one"></span>
          <span className="stitch stitch-two"></span>
          <div className="quilt-block">
            <i></i><i></i><i></i><i></i>
          </div>
          <figure className="maker-photo">
            <img
              src="/isabelle-maker-square.jpg"
              alt="Isabelle, the founder and maker behind Loon & Pine"
            />
            <figcaption>Isabelle · Founder & maker</figcaption>
          </figure>
        </div>
        <div className="about-copy">
          <p className="eyebrow">Our story</p>
          <h2>A shop built from a love of making.</h2>
          <p>
            Hi, I&apos;m Isabelle, the maker behind Loon & Pine. After being
            laid off from my software engineering job in May 2026, I decided it
            was time to take a chance on something I had always dreamed of
            building. Loon & Pine grew from my love of sewing, quilting, and
            the simple joy of finding just the right fabric for a new project.
          </p>
          <p>
            I wanted to create the kind of craft shop I love to browse: warm,
            welcoming, thoughtfully curated, and filled with materials that
            make you excited to sit down and create. Loon & Pine will offer
            fabrics and precuts I would happily add to my own stash, along with
            quilted goods made by me in small batches.
          </p>
          <p>
            Whether you are learning to sew, have been quilting for years, or
            simply appreciate something thoughtfully made by hand, I hope Loon
            & Pine offers a little inspiration for whatever you create next.
          </p>
          <dl className="details">
            <div><dt>Based in</dt><dd>Central Florida</dd></div>
            <div><dt>Shopping</dt><dd>Online + local markets</dd></div>
            <div><dt>Opening</dt><dd>2026</dd></div>
          </dl>
        </div>
      </section>

      <section className="contact section" id="contact">
        <p className="eyebrow">Stay in the loop</p>
        <h2>The shop is taking shape.</h2>
        <p>
          Have a question, a wholesale inquiry, or want to know when the first
          collection lands? We&apos;d love to hear from you.
        </p>
        <a className="button cream" href="mailto:hello@shoploonandpine.com">
          hello@shoploonandpine.com
        </a>
      </section>

      <footer>
        <img src="/loon-and-pine-logo.png" alt="Loon & Pine" />
        <p>Fabric, notions & handmade goods</p>
        <p>© 2026 Loon & Pine · A Nelson Labs LLC company</p>
      </footer>
    </main>
  );
}
