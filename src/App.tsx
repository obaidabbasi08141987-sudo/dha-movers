import { lazy, Suspense, useState, type FormEvent } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'

const Scene = lazy(() => import('./Scene'))
const PHONE = '03111178987'
const TEL = 'tel:+923111178987'
const WA = 'https://wa.me/923111178987'
const MAIL = 'dhamovers@gmail.com'

const SERVICES = [
  ['House Shifting', 'A considered move for your home, with careful handling for furniture, household goods and the details that make a place yours.'],
  ['Office Relocation', 'Move desks, chairs, files and equipment with a clear plan to help your team settle into its next workspace.'],
  ['Packing & Unpacking', 'Organised packing with protective materials, sensible grouping and help getting settled at your destination.'],
  ['Furniture Transportation', 'Beds, sofas, wardrobes and other large items handled with care from collection through delivery.'],
  ['Loading & Unloading', 'Practical help at both ends of the move, from preparing the vehicle to placing items at the destination.'],
  ['Intercity Moving', 'Plan a move from Karachi to another city in Pakistan, or arrange an intercity move to Karachi.'],
]

const STORY = [
  {
    eyebrow: 'DHA Movers & Packers · Karachi',
    title: <>Moving, <em>composed.</em></>,
    text: 'A thoughtful move starts with a clear plan. Follow the journey from a careful pack to a new beginning.',
    link: 'Discover our services',
  },
  {
    eyebrow: 'The journey begins',
    title: <>Ready for the <em>road ahead.</em></>,
    text: 'From local journeys in Karachi to intercity moves across Pakistan, the next chapter starts at your door.',
    link: 'How we can help',
  },
  {
    eyebrow: 'Packed with care',
    title: <>Every box has <em>a place.</em></>,
    text: 'Carefully grouped and protected belongings are prepared for the journey, then loaded with the destination in mind.',
    link: 'Explore packing',
  },
  {
    eyebrow: 'Home shifting',
    title: <>Make room for <em>what’s next.</em></>,
    text: 'From living-room furniture to the everyday things that make a home, plan your shift with a team ready to help.',
    link: 'Plan a home move',
  },
  {
    eyebrow: 'Moving day',
    title: <>A smoother <em>change of address.</em></>,
    text: 'Loading, transport and unloading come together in one considered move—from your old front door to the new one.',
    link: 'Talk about your move',
  },
  {
    eyebrow: 'Office relocation',
    title: <>Move work <em>forward.</em></>,
    text: 'Desks, chairs, files and equipment all need a plan. Tell us about your workspace and where you’re headed.',
    link: 'Discuss an office move',
  },
  {
    eyebrow: 'Thoughtful packing',
    title: <>Protection in <em>every layer.</em></>,
    text: 'Boxes, wrapping and careful preparation help give furniture and belongings a more considered journey.',
    link: 'Ask about packing',
  },
  {
    eyebrow: 'Across Pakistan',
    title: <>Further down <em>the road.</em></>,
    text: 'Moving between cities? Share your pickup and destination with us to start planning your intercity relocation.',
    link: 'Plan an intercity move',
  },
  {
    eyebrow: 'A new beginning',
    title: <>Arrive ready <em>to settle in.</em></>,
    text: 'See the complete home and moving crew come together one last time. Call or WhatsApp DHA Movers & Packers to plan your move.',
    link: 'Get in touch',
  },
]

function Logo() {
  return (
    <Link to="/" className="logo" aria-label="DHA Movers & Packers home">
      <img src="/favicon.svg" width="38" height="38" alt="" />
      <span><strong>DHA</strong><b>Movers & Packers</b></span>
    </Link>
  )
}

function Cta() {
  return (
    <div className="cta">
      <a className="btn gold" href={TEL}>Call now · {PHONE}</a>
      <a className="btn outline" href={WA} target="_blank" rel="noopener noreferrer">WhatsApp us</a>
    </div>
  )
}

function Home() {
  return (
    <div className="home">
      <section className="story" id="story" aria-label="Moving day, from packing to arrival">
        {STORY.map((scene, index) => (
          <article className={`story-beat${index === 0 ? ' story-intro' : ''}${index === STORY.length - 1 ? ' story-finale' : ''}`} key={scene.eyebrow}>
            <div className="story-copy">
              <p className="eyebrow">{scene.eyebrow}</p>
              <h1>{scene.title}</h1>
              <p className="story-text">{scene.text}</p>
              {index === 0 || index === STORY.length - 1
                ? <Cta />
                : <a className="text-link" href={index === 5 ? WA : '#services'} target={index === 5 ? '_blank' : undefined} rel={index === 5 ? 'noopener noreferrer' : undefined}>{scene.link} <span aria-hidden="true">→</span></a>}
            </div>
            <span className="beat-count" aria-hidden="true">{String(index + 1).padStart(2, '0')} <i>/ 09</i></span>
          </article>
        ))}
      </section>
      <section className="home-services" id="services">
        <div className="section-heading">
          <p className="eyebrow">Moving made more manageable</p>
          <h2>Help for the whole journey.</h2>
          <p>Choose the moving support you need in Karachi and across Pakistan.</p>
        </div>
        <div className="service-grid">
          {SERVICES.map(([title, description], index) => (
            <article className="service-card" key={title}>
              <span className="service-number">{String(index + 1).padStart(2, '0')}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <a href={WA} target="_blank" rel="noopener noreferrer">Ask us about this <span aria-hidden="true">→</span></a>
            </article>
          ))}
        </div>
        <div className="service-cta">
          <p>Not sure where to start? Tell us about your move.</p>
          <Cta />
        </div>
      </section>
    </div>
  )
}

function Services() {
  return (
    <section className="page page-services">
      <p className="eyebrow">How we can help</p>
      <h1>Moving support, from first box to final stop.</h1>
      <p className="page-lead">Tell us what you’re moving, where you’re going and what kind of help you need. We’ll discuss the details with you.</p>
      <div className="page-service-grid">{SERVICES.map(([title, description], index) => (
        <article className="service-card" key={title}>
          <span className="service-number">{String(index + 1).padStart(2, '0')}</span>
          <h2>{title}</h2>
          <p>{description}</p>
          <a href={WA} target="_blank" rel="noopener noreferrer">Ask about this service <span aria-hidden="true">→</span></a>
        </article>
      ))}</div>
      <div className="page-cta"><h2>Let’s talk through your move.</h2><Cta /></div>
    </section>
  )
}

function About() {
  return (
    <section className="page">
      <p className="eyebrow">About DHA Movers & Packers</p>
      <h1>A move shaped around what matters to you.</h1>
      <p className="page-lead">DHA Movers & Packers helps households and offices move in Karachi and between cities across Pakistan. Every move is different, so we start by listening to what you need and where you’re headed.</p>
      <div className="prose-block">
        <h2>Clear plans. Careful handling.</h2>
        <p>From home shifting and office relocation to packing, furniture transportation, loading and unloading, we can discuss the support that fits your move.</p>
        <p>Share your pickup location, destination and moving requirements over the phone or WhatsApp, and we’ll talk through the next steps.</p>
      </div>
      <Cta />
    </section>
  )
}

function Areas() {
  return (
    <section className="page">
      <p className="eyebrow">Where we move</p>
      <h1>Karachi to destinations across Pakistan.</h1>
      <p className="page-lead">We serve moves within Karachi and intercity relocations across Pakistan. Tell us your pickup and destination cities so we can discuss your route and requirements.</p>
      <div className="area-highlight"><span className="area-pin" aria-hidden="true">✦</span><div><h2>Karachi & intercity Pakistan</h2><p>Home shifting, office moves and packing support for local and long-distance journeys.</p></div></div>
      <Cta />
    </section>
  )
}

function Contact() {
  const [err, setErr] = useState<Record<string, string>>({})
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const value = (key: string) => String(form.get(key) ?? '').trim()
    const errors: Record<string, string> = {}
    if (value('name').length < 2) errors.name = 'Please enter your name.'
    if (!/^[+0-9\s-]{10,16}$/.test(value('phone'))) errors.phone = 'Enter a valid phone number.'
    if (value('email') && !/^\S+@\S+\.\S+$/.test(value('email'))) errors.email = 'Enter a valid email.'
    if (value('message').length < 10) errors.message = 'Please add a few details (10+ characters).'
    setErr(errors)
    if (Object.keys(errors).length) return
    window.location.href = `mailto:${MAIL}?subject=${encodeURIComponent('Moving enquiry from ' + value('name'))}&body=${encodeURIComponent(value('message') + '\n\nPhone: ' + value('phone') + (value('email') ? '\nEmail: ' + value('email') : ''))}`
  }

  return (
    <section className="page contact-page">
      <p className="eyebrow">Start planning</p>
      <h1>Tell us about your move.</h1>
      <p className="page-lead">Call or WhatsApp for a direct conversation, or send an enquiry by email using the form below.</p>
      <div className="contact-options">
        <a className="contact-option" href={TEL}><span>Call DHA Movers & Packers</span><strong>{PHONE}</strong></a>
        <a className="contact-option" href={WA} target="_blank" rel="noopener noreferrer"><span>WhatsApp</span><strong>Message our team →</strong></a>
        <a className="contact-option" href={`mailto:${MAIL}`}><span>Email</span><strong>{MAIL}</strong></a>
      </div>
      <form onSubmit={submit} noValidate>
        {(['name', 'phone', 'email'] as const).map(key => (
          <label key={key}>{key[0].toUpperCase() + key.slice(1)}{key === 'email' && ' (optional)'}
            <input name={key} autoComplete={key === 'name' ? 'name' : key === 'phone' ? 'tel' : 'email'} aria-invalid={!!err[key]} />
            {err[key] && <small role="alert">{err[key]}</small>}
          </label>
        ))}
        <label className="message-field">How can we help?<textarea name="message" rows={5} aria-invalid={!!err.message} />{err.message && <small role="alert">{err.message}</small>}</label>
        <button className="btn gold">Send via email</button>
        <p className="form-note">This form opens your email app to send the enquiry.</p>
      </form>
    </section>
  )
}

function NotFound() {
  return (
    <section className="page not-found">
      <p className="eyebrow">A little detour</p>
      <h1>We can’t find that page.</h1>
      <p className="page-lead">The page may have moved. Let’s get you back on the road.</p>
      <Link className="btn gold" to="/">Back to home</Link>
    </section>
  )
}

const NAVIGATION = [['/services', 'Services'], ['/about', 'About'], ['/areas', 'Areas we serve'], ['/contact', 'Contact']] as const

export default function App() {
  const { pathname } = useLocation()
  return (
    <>
      {pathname === '/' && <Suspense fallback={<div className="scene-fallback" aria-hidden="true" />}><Scene /></Suspense>}
      <header className="site-header">
        <Logo />
        <nav aria-label="Main navigation">
          {NAVIGATION.map(([to, label]) => <NavLink key={to} to={to}>{label}</NavLink>)}
        </nav>
        <a className="header-call" href={TEL}><span>Call now</span><strong>{PHONE}</strong></a>
      </header>
      <main><Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/areas" element={<Areas />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes></main>
      <footer className="site-footer">
        <div className="footer-top"><Logo /><p>Thoughtful moves in Karachi and across Pakistan.</p></div>
        <div className="footer-bottom">
          <p><a href={TEL}>{PHONE}</a><span aria-hidden="true"> · </span><a href={WA} target="_blank" rel="noopener noreferrer">WhatsApp</a><span aria-hidden="true"> · </span><a href={`mailto:${MAIL}`}>{MAIL}</a></p>
          <nav aria-label="Footer navigation">{NAVIGATION.map(([to, label]) => <NavLink key={to} to={to}>{label}</NavLink>)}</nav>
        </div>
      </footer>
    </>
  )
}
