"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import {
  FaArrowRight,
  FaCheck,
  FaChevronDown,
  FaEnvelope,
  FaLocationDot,
  FaPhone,
  FaPlay,
  FaWhatsapp
} from "react-icons/fa6";
import { faqs, features, industries, processSteps, products, stats } from "@/data/site";
import styles from "./HomeExperience.module.css";

const Atmosphere = dynamic(() => import("./Atmosphere"), { ssr: false });

type InquiryState = {
  company: string;
  name: string;
  phone: string;
  email: string;
  industry: string;
  boxType: string;
  length: string;
  width: string;
  height: string;
  quantity: string;
  printing: string;
  requirements: string;
};

const initialInquiry: InquiryState = {
  company: "",
  name: "",
  phone: "",
  email: "",
  industry: "",
  boxType: "",
  length: "",
  width: "",
  height: "",
  quantity: "",
  printing: "Yes",
  requirements: ""
};

export default function HomeExperience() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [form, setForm] = useState(initialInquiry);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const year = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      gsap.from("[data-hero-line]", {
        y: 56,
        opacity: 0,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.12
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.from(element, {
          y: 42,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 84%"
          }
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((element) => {
        const target = Number(element.dataset.count || 0);
        gsap.fromTo(
          element,
          { textContent: 0 },
          {
            textContent: target,
            duration: 1.8,
            ease: "power2.out",
            snap: { textContent: 1 },
            scrollTrigger: { trigger: element, start: "top 86%" }
          }
        );
      });

      const gallery = document.querySelector("[data-gallery-track]");
      if (gallery) {
        gsap.to(gallery, {
          xPercent: -35,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-gallery]",
            start: "top center",
            end: "bottom top",
            scrub: 0.7
          }
        });
      }
    }, rootRef);

    return () => {
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  const updateForm = (key: keyof InquiryState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const submitInquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.company.trim()) nextErrors.company = "Required";
    if (!form.name.trim()) nextErrors.name = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = "Valid email required";
    if (!/^[0-9+\-\s]{7,}$/.test(form.phone)) nextErrors.phone = "Valid phone required";
    if (!form.quantity.trim()) nextErrors.quantity = "Required";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setIsSubmitting(true);
      setSubmitMessage("");

      try {
        const response = await fetch("/api/inquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            source: "website"
          })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.message || "Unable to submit your inquiry right now.");
        }

        setSubmitted(true);
        setSubmitMessage(data?.message || "Thanks! Your inquiry was sent successfully.");
        setForm(initialInquiry);
      } catch (error) {
        setSubmitted(false);
        setSubmitMessage(error instanceof Error ? error.message : "Unable to submit your inquiry right now.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <main className={styles.page} ref={rootRef}>
      <Atmosphere />

      <header className={styles.nav}>
        <a href="#top" className={styles.logo} aria-label="GTC home">
          <span />
          GTC
        </a>
        <nav aria-label="Primary navigation">
          <a href="#products">Products</a>
          <a href="#process">Process</a>
          <a href="#factory">Factory</a>
          <a href="#inquiry">Quote</a>
        </nav>
      </header>

      <section className={styles.hero} id="top">
        <video
          className={styles.heroVideo}
          src="/media/factory.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/hero-facility.svg"
        />
        <div className={styles.heroFallback} />
        <div className={styles.heroShade} />
        <div className={styles.heroContent}>
          <p data-hero-line className={styles.eyebrow}>
            GTC · Garg Trading Company
          </p>
          <h1 data-hero-line>Reliable packaging solutions for business growth and delivery confidence.</h1>
          <p data-hero-line className={styles.heroText}>
            Smarter packaging. Stronger brands. Faster delivery.
          </p>
          <div data-hero-line className={styles.heroActions}>
            <a href="#inquiry" className={styles.primaryButton}>
              Request a Quote <FaArrowRight aria-hidden="true" />
            </a>
            <a href="#products" className={styles.secondaryButton}>
              <FaPlay aria-hidden="true" /> View Products
            </a>
          </div>
        </div>
        <a href="#who" className={styles.scrollCue} aria-label="Scroll to company introduction">
          <span />
        </a>
      </section>

      <section className={styles.intro} id="who">
        <div className={styles.sectionLabel} data-reveal>
          Who We Are
        </div>
        <div className={styles.split}>
          <div data-reveal>
            <h2>Industrial capability with the finish of a premium brand partner.</h2>
            <p>
              GTC manufactures custom corrugated packaging for businesses that need boxes to
              perform in transit, look credible on arrival, and scale reliably across repeat orders.
            </p>
            <div className={styles.statementGrid}>
              <article>
                <span>Mission</span>
                <p>Build packaging that protects product value and strengthens brand trust.</p>
              </article>
              <article>
                <span>Vision</span>
                <p>Become the preferred corrugated partner for modern manufacturers and sellers.</p>
              </article>
            </div>
          </div>
          <div className={styles.mediaPanel} data-reveal>
            <Image
              src="/images/factory-showcase.svg"
              alt="Modern manufacturing facility floor"
              fill
              sizes="(max-width: 900px) 100vw, 48vw"
              priority
            />
          </div>
        </div>
      </section>

      <section className={styles.products} id="products">
        <div className={styles.sectionHeader} data-reveal>
          <span className={styles.sectionLabel}>Our Products</span>
          <h2>Packaging formats for production teams, procurement, and growing brands.</h2>
        </div>
        <div className={styles.productGrid}>
          {products.map((product) => (
            <article className={styles.productCard} data-reveal key={product.title}>
              <div className={styles.productImage}>
                <Image src={product.image} alt={product.title} fill sizes="(max-width: 800px) 100vw, 33vw" />
              </div>
              <div>
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <a href="#inquiry">Learn More <FaArrowRight aria-hidden="true" /></a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.process} id="process">
        <div className={styles.sectionHeader} data-reveal>
          <span className={styles.sectionLabel}>Manufacturing Process</span>
          <h2>From carton design to delivery, every step is built for repeatable quality.</h2>
        </div>
        <div className={styles.timeline}>
          {processSteps.map((step, index) => (
            <article className={styles.timelineItem} data-reveal key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step}</h3>
              {index < processSteps.length - 1 ? <FaChevronDown aria-hidden="true" /> : <FaCheck aria-hidden="true" />}
            </article>
          ))}
        </div>
      </section>

      <section className={styles.industries}>
        <div className={styles.sectionHeader} data-reveal>
          <span className={styles.sectionLabel}>Industries We Serve</span>
          <h2>Packaging for products that need dependable protection and polished presentation.</h2>
        </div>
        <div className={styles.iconGrid}>
          {industries.map(({ title, icon: Icon }) => (
            <article className={styles.iconCard} data-reveal key={title}>
              <Icon aria-hidden="true" />
              <h3>{title}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.sectionHeader} data-reveal>
          <span className={styles.sectionLabel}>Why Choose Us</span>
          <h2>Built for buyers who need confidence before they place a bulk order.</h2>
        </div>
        <div className={styles.featureGrid}>
          {features.map(({ title, detail, icon: Icon }) => (
            <article className={styles.featureCard} data-reveal key={title}>
              <Icon aria-hidden="true" />
              <h3>{title}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.gallerySection} id="factory" data-gallery>
        <div className={styles.sectionHeader} data-reveal>
          <span className={styles.sectionLabel}>Factory Showcase</span>
          <h2>Production details, finished cartons, machinery, and dispatch readiness.</h2>
        </div>
        <div className={styles.galleryViewport}>
          <div className={styles.galleryTrack} data-gallery-track>
            {[
              "/images/gallery-1.svg",
              "/images/gallery-2.svg",
              "/images/gallery-3.svg",
              "/images/gallery-4.svg"
            ].map((src, index) => (
              <button className={styles.galleryItem} key={src} aria-label={`Open factory image ${index + 1}`}>
                <Image src={src} alt="Factory and packaging production" fill sizes="70vw" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.stats}>
        {stats.map((stat) => (
          <article data-reveal key={stat.label}>
            <strong>
              <span data-count={stat.value}>0</span>
              {stat.suffix}
            </strong>
            <p>{stat.label}</p>
          </article>
        ))}
      </section>

      <section className={styles.testimonials}>
        <div className={styles.sectionHeader} data-reveal>
          <span className={styles.sectionLabel}>Testimonials</span>
          <h2>Trusted by teams who care about timelines, product safety, and consistency.</h2>
        </div>
        <div className={styles.testimonialGrid}>
          {["Procurement Head", "Operations Manager", "Brand Director"].map((role, index) => (
            <motion.article
              className={styles.testimonial}
              data-reveal
              key={role}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
            >
              <span>Client {index + 1}</span>
              <p>
                “The box quality, print finish, and dispatch discipline have made repeat ordering
                straightforward for our team.”
              </p>
              <strong>{role}</strong>
            </motion.article>
          ))}
        </div>
      </section>

      <section className={styles.faq}>
        <div className={styles.sectionHeader} data-reveal>
          <span className={styles.sectionLabel}>FAQ</span>
          <h2>Clear answers before your first inquiry.</h2>
        </div>
        <div className={styles.accordion}>
          {faqs.map((faq, index) => (
            <article className={styles.faqItem} data-reveal key={faq.question}>
              <button onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>
                {faq.question}
                <FaChevronDown aria-hidden="true" />
              </button>
              {openFaq === index ? <p>{faq.answer}</p> : null}
            </article>
          ))}
        </div>
      </section>

      <section className={styles.inquiry} id="inquiry">
        <div className={styles.inquiryCopy} data-reveal>
          <span className={styles.sectionLabel}>Inquiry</span>
          <h2>Request a quotation for your next packaging order.</h2>
          <p>
            Share your box dimensions, quantity, printing needs, and design file. The team can
            respond with practical production guidance and commercial next steps.
          </p>
        </div>
        <form className={styles.form} onSubmit={submitInquiry} data-reveal noValidate>
          <Field label="Company Name" error={errors.company}>
            <input name="company" value={form.company} onChange={(event) => updateForm("company", event.target.value)} />
          </Field>
          <Field label="Name" error={errors.name}>
            <input name="name" value={form.name} onChange={(event) => updateForm("name", event.target.value)} />
          </Field>
          <Field label="Phone" error={errors.phone}>
            <input name="phone" value={form.phone} onChange={(event) => updateForm("phone", event.target.value)} />
          </Field>
          <Field label="Email" error={errors.email}>
            <input name="email" value={form.email} onChange={(event) => updateForm("email", event.target.value)} />
          </Field>
          <Field label="Industry">
            <select name="industry" value={form.industry} onChange={(event) => updateForm("industry", event.target.value)}>
              <option value="">Select industry</option>
              {industries.map((item) => (
                <option key={item.title}>{item.title}</option>
              ))}
            </select>
          </Field>
          <Field label="Box Type">
            <select name="boxType" value={form.boxType} onChange={(event) => updateForm("boxType", event.target.value)}>
              <option value="">Select box type</option>
              {products.map((item) => (
                <option key={item.title}>{item.title}</option>
              ))}
            </select>
          </Field>
          <Field label="Length">
            <input name="length" value={form.length} onChange={(event) => updateForm("length", event.target.value)} inputMode="decimal" />
          </Field>
          <Field label="Width">
            <input name="width" value={form.width} onChange={(event) => updateForm("width", event.target.value)} inputMode="decimal" />
          </Field>
          <Field label="Height">
            <input name="height" value={form.height} onChange={(event) => updateForm("height", event.target.value)} inputMode="decimal" />
          </Field>
          <Field label="Quantity" error={errors.quantity}>
            <input name="quantity" value={form.quantity} onChange={(event) => updateForm("quantity", event.target.value)} inputMode="numeric" />
          </Field>
          <Field label="Printing Required">
            <select name="printing" value={form.printing} onChange={(event) => updateForm("printing", event.target.value)}>
              <option>Yes</option>
              <option>No</option>
              <option>Not Sure</option>
            </select>
          </Field>
          <Field label="Upload Design File">
            <input name="attachment" type="file" accept=".pdf,.ai,.eps,.svg,.png,.jpg,.jpeg" />
          </Field>
          <label className={styles.fullField}>
            <span>Additional Requirements</span>
            <textarea name="requirements" value={form.requirements} onChange={(event) => updateForm("requirements", event.target.value)} />
          </label>
          <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Inquiry"} <FaArrowRight aria-hidden="true" />
          </button>
          {submitMessage ? <p className={styles.success}>{submitMessage}</p> : null}
        </form>
      </section>

      <section className={styles.contact}>
        <div className={styles.contactDetails} data-reveal>
          <span className={styles.sectionLabel}>Contact</span>
          <h2>Factory sales desk</h2>
          <p><FaLocationDot aria-hidden="true" /> Industrial Area, Manufacturing Zone, Your City</p>
          <p><FaPhone aria-hidden="true" /> +91 98765 43210</p>
          <p><FaWhatsapp aria-hidden="true" /> WhatsApp quotations available</p>
          <p><FaEnvelope aria-hidden="true" /> sales@example.com</p>
          <p>Business Hours: Mon-Sat, 9:00 AM - 6:30 PM</p>
        </div>
        <iframe
          data-reveal
          className={styles.map}
          title="Factory location map"
          loading="lazy"
          src="https://www.google.com/maps?q=Industrial%20Area&output=embed"
        />
      </section>

      <footer className={styles.footer}>
        <a href="#top" className={styles.logo}><span />GTC</a>
        <div>
          <a href="#products">Products</a>
          <a href="#process">Process</a>
          <a href="#inquiry">Quote</a>
          <a href="#factory">Factory</a>
        </div>
        <p>© {year} Garg Trading Company. All rights reserved.</p>
      </footer>
    </main>
  );
}

function Field({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      {children}
      {error ? <small>{error}</small> : null}
    </label>
  );
}
