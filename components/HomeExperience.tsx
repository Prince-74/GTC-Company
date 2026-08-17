"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import {
  FaArrowRight,
  FaBars,
  FaBoxOpen,
  FaCheck,
  FaChevronDown,
  FaEnvelope,
  FaHandshake,
  FaLocationDot,
  FaMoon,
  FaPhone,
  FaShieldHalved,
  FaSun,
  FaWhatsapp,
  FaXmark
} from "react-icons/fa6";
import {
  boxTypes,
  factoryGallery,
  faqs,
  industries,
  ownerProfile,
  plyOptions,
  processSteps,
  products,
  qualityAssurance,
  siteConfig,
  stats
} from "@/data/site";
import Box3DPreview from "./Box3DPreview";
import styles from "./HomeExperience.module.css";

const Atmosphere = dynamic(() => import("./Atmosphere"), { ssr: false });

type InquiryState = {
  company: string;
  name: string;
  phone: string;
  email: string;
  industry: string;
  boxType: string;
  ply: string;
  length: string;
  width: string;
  height: string;
  unit: string;
  quantity: string;
  printing: string;
  requirements: string;
};

export default function HomeExperience() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Theme State: 'dark' | 'light'
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  // 3D Customizer State
  const [studioLength, setStudioLength] = useState<number>(14);
  const [studioWidth, setStudioWidth] = useState<number>(10);
  const [studioHeight, setStudioHeight] = useState<number>(8);
  const [studioUnit, setStudioUnit] = useState<"inch" | "cm" | "mm">("inch");
  const [studioPly, setStudioPly] = useState<string>("5-Ply");

  // Lightbox Modal for Factory Gallery
  const [activeGalleryImg, setActiveGalleryImg] = useState<{
    src: string;
    title: string;
    description: string;
  } | null>(null);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number>(0);

  // Mobile Menu Drawer State
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Quotation Form State
  const [form, setForm] = useState<InquiryState>({
    company: "",
    name: "",
    phone: "",
    email: "",
    industry: "Food & Beverage",
    boxType: "Master Corrugated Cartons",
    ply: "5-Ply",
    length: "14",
    width: "10",
    height: "8",
    unit: "inch",
    quantity: "1000",
    printing: "Yes (Brand Logo)",
    requirements: ""
  });
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  // Sync Theme with HTML Attribute and LocalStorage
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("gtc-theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      const initialTheme = prefersLight ? "light" : "dark";
      setTheme(initialTheme);
      document.documentElement.setAttribute("data-theme", initialTheme);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("gtc-theme", nextTheme);

    // Pause / Play Video according to theme
    if (videoRef.current) {
      if (nextTheme === "dark") {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  };

  // Lenis Smooth Scroll & GSAP Animations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    const reqId = requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      // Reveal animations
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.from(element, {
          y: 32,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 88%"
          }
        });
      });

      // Count-up stats
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
    }, rootRef);

    return () => {
      cancelAnimationFrame(reqId);
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  const updateForm = (key: keyof InquiryState, value: string) => {
    setForm((curr) => ({ ...curr, [key]: value }));
    setErrors((curr) => ({ ...curr, [key]: "" }));
  };

  const handleApplyStudioSpecs = () => {
    setForm((curr) => ({
      ...curr,
      length: String(studioLength),
      width: String(studioWidth),
      height: String(studioHeight),
      unit: studioUnit,
      ply: studioPly
    }));

    const quoteElement = document.getElementById("inquiry");
    if (quoteElement) {
      quoteElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectProductForQuote = (prodTitle: string) => {
    setForm((curr) => ({
      ...curr,
      boxType: prodTitle
    }));
    const quoteElement = document.getElementById("inquiry");
    if (quoteElement) {
      quoteElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const submitInquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.company.trim()) nextErrors.company = "Please enter your business or company name";
    if (!form.name.trim()) nextErrors.name = "Please enter contact person name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = "Please enter a valid email";
    if (!/^[0-9+\-\s()]{7,}$/.test(form.phone)) nextErrors.phone = "Please enter a valid phone or WhatsApp number";
    if (!form.quantity.trim() || Number(form.quantity) <= 0) nextErrors.quantity = "Please enter estimated quantity";

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
            source: "GTC Website",
            fileAttached: selectedFile || "None"
          })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.message || "Unable to submit inquiry right now.");
        }

        setSubmitted(true);
        setSubmitMessage("Thank you! Your quotation request has been received. Our team will review your box size and share the best factory price shortly.");
      } catch (error) {
        setSubmitted(false);
        setSubmitMessage(error instanceof Error ? error.message : "Unable to process request right now. Please WhatsApp us directly for an instant quote.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <main className={styles.page} ref={rootRef}>
      <Atmosphere theme={theme} />

      {/* =========================================================================
          1. NAVIGATION HEADER
          ========================================================================= */}
      <header className={styles.nav}>
        <a href="#top" className={styles.logo} aria-label="Garg Trading Company home">
          <div className={styles.logoImgWrapper}>
            <Image
              src={siteConfig.logoUrl}
              alt="GTC Logo"
              width={34}
              height={34}
              className={styles.logoImg}
              priority
            />
          </div>
          <div className={styles.logoText}>
            <span className={styles.logoTitle}>GTC</span>
            <span className={styles.logoSub}>Garg Trading Company</span>
          </div>
        </a>

        <nav className={styles.navLinks} aria-label="Primary navigation">
          <a href="#customizer">3D Box Studio</a>
          <a href="#products">Our Boxes</a>
          <a href="#factory">Factory Photos</a>
          <a href="#about">About Us</a>
          <a href="#process">How It Works</a>
          <a href="#faq">FAQ</a>
        </nav>

        <div className={styles.navActions}>
          <button
            type="button"
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
          >
            {mounted && theme === "dark" ? <FaSun aria-hidden="true" /> : <FaMoon aria-hidden="true" />}
          </button>

          <a href="#inquiry" className={styles.quoteNavBtn}>
            Get Factory Price <FaArrowRight aria-hidden="true" />
          </a>

          <button
            type="button"
            className={styles.mobileMenuBtn}
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open mobile navigation menu"
          >
            <FaBars aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className={styles.mobileDrawer}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className={styles.mobileDrawerHeader}>
              <a
                href="#top"
                className={styles.logo}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className={styles.logoImgWrapper}>
                  <Image
                    src={siteConfig.logoUrl}
                    alt="GTC Logo"
                    width={34}
                    height={34}
                    className={styles.logoImg}
                  />
                </div>
                <div className={styles.logoText}>
                  <span className={styles.logoTitle}>GTC</span>
                  <span className={styles.logoSub}>Garg Trading Company</span>
                </div>
              </a>

              <button
                type="button"
                className={styles.mobileDrawerClose}
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close mobile menu"
              >
                <FaXmark aria-hidden="true" />
              </button>
            </div>

            <nav className={styles.mobileDrawerNav}>
              {[
                { href: "#customizer", label: "3D Box Studio" },
                { href: "#products", label: "Our Boxes" },
                { href: "#factory", label: "Factory Photos" },
                { href: "#about", label: "About Us" },
                { href: "#process", label: "How It Works" },
                { href: "#faq", label: "FAQ" }
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{item.label}</span>
                  <FaArrowRight aria-hidden="true" />
                </a>
              ))}
            </nav>

            <div className={styles.mobileDrawerActions}>
              <a
                href="#inquiry"
                className={styles.primaryButton}
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Factory Price <FaArrowRight aria-hidden="true" />
              </a>

              <a
                href={`https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  "Hello GTC Team! I would like to get a price quote for custom corrugated boxes."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappDirectBtn}
              >
                <FaWhatsapp aria-hidden="true" /> WhatsApp Quick Quote
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          2. HERO SECTION
          ========================================================================= */}
      <section className={styles.hero} id="top">
        {/* Conditional Video / Backdrop based on Theme */}
        {theme === "dark" ? (
          <div className={styles.heroVideoWrap}>
            <video
              ref={videoRef}
              className={styles.heroVideo}
              src="/media/factory.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
            <div className={styles.heroShadeDark} />
          </div>
        ) : (
          <div className={styles.heroBackdropLight} />
        )}

        <div className={styles.heroContent}>
          <div className={styles.heroPill} data-reveal>
            <span className={styles.heroPillDot} />
            <span>Direct Box Manufacturer · Custom Sizes & Fast Dispatch</span>
          </div>

          <h1 data-reveal>
            Strong Boxes. <br />
            <span className={styles.heroHighlight}>Honest Pricing.</span> <br />
            On-Time Delivery.
          </h1>

          <p className={styles.heroText} data-reveal>
            {siteConfig.subTagline}
          </p>

          <div className={styles.heroActions} data-reveal>
            <a href="#inquiry" className={styles.primaryButton}>
              Request a Free Quotation <FaArrowRight aria-hidden="true" />
            </a>
            <a href="#customizer" className={styles.secondaryButton}>
              <FaBoxOpen aria-hidden="true" /> Try 3D Box Customizer
            </a>
          </div>

          <div className={styles.heroMetrics} data-reveal>
            <div className={styles.heroMetricItem}>
              <span className={styles.heroMetricNum}>{siteConfig.experienceYears} Years</span>
              <span className={styles.heroMetricLabel}>Manufacturing Experience</span>
            </div>
            <div className={styles.heroMetricItem}>
              <span className={styles.heroMetricNum}>{siteConfig.boxesShipped}</span>
              <span className={styles.heroMetricLabel}>Boxes Shipped</span>
            </div>
            <div className={styles.heroMetricItem}>
              <span className={styles.heroMetricNum}>{siteConfig.clientsCount}</span>
              <span className={styles.heroMetricLabel}>Happy Business Clients</span>
            </div>
            <div className={styles.heroMetricItem}>
              <span className={styles.heroMetricNum}>99%</span>
              <span className={styles.heroMetricLabel}>On-Time Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. INTERACTIVE 3D BOX STUDIO & SPEC CALCULATOR
          ========================================================================= */}
      <section className={`${styles.section} ${styles.customizerSection}`} id="customizer">
        <div className={styles.sectionHeader} data-reveal>
          <span className={styles.sectionTag}>
            <FaBoxOpen aria-hidden="true" /> 3D Box Customizer
          </span>
          <h2>Check your box size in interactive 3D.</h2>
          <p className={styles.sectionSub}>
            Adjust Length, Width, Height, and Paper Ply. See live box volume and send your exact dimensions directly to our quotation team with one click.
          </p>
        </div>

        <div className={styles.studioGrid}>
          <div className={styles.studioPreviewWrap} data-reveal>
            <Box3DPreview
              length={studioLength}
              width={studioWidth}
              height={studioHeight}
              unit={studioUnit}
              ply={studioPly}
              theme={theme}
            />
          </div>

          <div className={styles.studioControlsCard} data-reveal>
            <h3 className={styles.studioTitle}>Box Size & Construction</h3>
            <p className={styles.studioDesc}>Set your custom box measurements:</p>

            <div className={styles.unitToggleGroup}>
              {(["inch", "cm", "mm"] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  className={`${styles.unitBtn} ${studioUnit === u ? styles.unitBtnActive : ""}`}
                  onClick={() => setStudioUnit(u)}
                >
                  {u.toUpperCase()}
                </button>
              ))}
            </div>

            <div className={styles.sliderGroup}>
              <div className={styles.sliderRow}>
                <div className={styles.sliderLabelRow}>
                  <span>Length (L)</span>
                  <strong>
                    {studioLength} {studioUnit}
                  </strong>
                </div>
                <input
                  type="range"
                  min={studioUnit === "inch" ? 4 : studioUnit === "cm" ? 10 : 100}
                  max={studioUnit === "inch" ? 48 : studioUnit === "cm" ? 120 : 1200}
                  step={studioUnit === "inch" ? 0.5 : 1}
                  value={studioLength}
                  onChange={(e) => setStudioLength(Number(e.target.value))}
                  className={styles.sliderInput}
                />
              </div>

              <div className={styles.sliderRow}>
                <div className={styles.sliderLabelRow}>
                  <span>Width (W)</span>
                  <strong>
                    {studioWidth} {studioUnit}
                  </strong>
                </div>
                <input
                  type="range"
                  min={studioUnit === "inch" ? 4 : studioUnit === "cm" ? 10 : 100}
                  max={studioUnit === "inch" ? 36 : studioUnit === "cm" ? 90 : 900}
                  step={studioUnit === "inch" ? 0.5 : 1}
                  value={studioWidth}
                  onChange={(e) => setStudioWidth(Number(e.target.value))}
                  className={styles.sliderInput}
                />
              </div>

              <div className={styles.sliderRow}>
                <div className={styles.sliderLabelRow}>
                  <span>Height / Depth (H)</span>
                  <strong>
                    {studioHeight} {studioUnit}
                  </strong>
                </div>
                <input
                  type="range"
                  min={studioUnit === "inch" ? 3 : studioUnit === "cm" ? 8 : 80}
                  max={studioUnit === "inch" ? 36 : studioUnit === "cm" ? 90 : 900}
                  step={studioUnit === "inch" ? 0.5 : 1}
                  value={studioHeight}
                  onChange={(e) => setStudioHeight(Number(e.target.value))}
                  className={styles.sliderInput}
                />
              </div>
            </div>

            <div style={{ marginBottom: "0.5rem", fontSize: "0.82rem", fontWeight: 600 }}>
              Select Board Thickness / Ply:
            </div>
            <div className={styles.plySelectGrid}>
              {["3-Ply", "5-Ply", "7-Ply"].map((ply) => (
                <button
                  key={ply}
                  type="button"
                  className={`${styles.plyOptionBtn} ${studioPly === ply ? styles.plyOptionBtnActive : ""}`}
                  onClick={() => setStudioPly(ply)}
                >
                  {ply}
                </button>
              ))}
            </div>

            <button
              type="button"
              className={styles.sendToQuoteBtn}
              onClick={handleApplyStudioSpecs}
            >
              Send Size to Quote Form <FaArrowRight aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. PRODUCT CATALOG & CAPABILITIES
          ========================================================================= */}
      <section className={styles.section} id="products">
        <div className={styles.sectionHeader} data-reveal>
          <span className={styles.sectionTag}>Our Box Products</span>
          <h2>Reliable corrugated packaging for every business need.</h2>
          <p className={styles.sectionSub}>
            Direct from our factory floor. Strong cardboard, accurate die-cuts, and clean printing to protect your products and showcase your brand.
          </p>
        </div>

        <div className={styles.productsGrid}>
          {products.map((prod) => (
            <article className={styles.productCard} key={prod.id} data-reveal>
              <div className={styles.productImgBox}>
                <div className={prod.images ? styles.productImageGrid : styles.productImageSingle}>
                  {(prod.images || [prod.image]).map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      className={styles.productImageCell}
                      onClick={() =>
                        setActiveGalleryImg({
                          src: image,
                          title: prod.title,
                          description: prod.description
                        })
                      }
                      aria-label={`Expand ${prod.title} image ${index + 1}`}
                    >
                      <Image
                        src={image}
                        alt={`${prod.title}${prod.images ? ` ${index + 1}` : ""}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={styles.productImg}
                      />
                    </button>
                  ))}
                </div>
                <span className={styles.productBadge}>{prod.badge}</span>
              </div>
              <div className={styles.productBody}>
                <h3>{prod.title}</h3>
                <span className={styles.productSubtitle}>{prod.subtitle}</span>
                <p>{prod.description}</p>
                <div className={styles.productSpecs}>
                  {prod.specs.map((spec) => (
                    <span key={spec} className={styles.productSpecTag}>
                      {spec}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  className={styles.productQuoteBtn}
                  onClick={() => handleSelectProductForQuote(prod.title)}
                >
                  <span>Get Quote for this Box</span>
                  <FaArrowRight aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* =========================================================================
          5. FACTORY SHOWCASE GALLERY & LIGHTBOX
          ========================================================================= */}
      <section className={styles.section} id="factory">
        <div className={styles.sectionHeader} data-reveal>
          <span className={styles.sectionTag}>Factory Photos</span>
          <h2>Inside our box manufacturing facility.</h2>
          <p className={styles.sectionSub}>
            Take a look at our corrugation lines, rotary cutting machines, printing setups, and ready dispatch warehouse.
          </p>
        </div>

        <div className={styles.galleryGrid}>
          {factoryGallery.map((item, idx) => (
            <div
              key={item.src}
              className={styles.galleryCard}
              onClick={() => setActiveGalleryImg(item)}
              data-reveal
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className={styles.galleryCardOverlay}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {activeGalleryImg && (
            <motion.div
              className={styles.modalBackdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveGalleryImg(null)}
            >
              <motion.div
                className={styles.modalContent}
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className={styles.modalClose}
                  onClick={() => setActiveGalleryImg(null)}
                  aria-label="Close image modal"
                >
                  <FaXmark aria-hidden="true" />
                </button>
                <div className={styles.modalImgWrap}>
                  <Image
                    src={activeGalleryImg.src}
                    alt={activeGalleryImg.title}
                    fill
                    sizes="90vw"
                  />
                </div>
                <div className={styles.modalText}>
                  <h3>{activeGalleryImg.title}</h3>
                  <p>{activeGalleryImg.description}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* =========================================================================
          6. OWNER & LEADERSHIP SPOTLIGHT
          ========================================================================= */}
      <section className={`${styles.section} ${styles.ownerSection}`} id="about">
        <div className={styles.ownerGrid}>
          <div className={styles.ownerImgWrap} data-reveal>
            <Image
              src={ownerProfile.image}
              alt={ownerProfile.name}
              fill
              sizes="(max-width: 900px) 100vw, 45vw"
              className={styles.ownerImg}
              priority
            />
          </div>

          <div className={styles.ownerBody} data-reveal>
            <span className={styles.sectionTag}>Meet the Founder</span>
            <h2>{ownerProfile.name}</h2>
            <p className={styles.ownerRole}>
              {ownerProfile.title} · {ownerProfile.experience}
            </p>

            <blockquote className={styles.ownerQuote}>
              "{ownerProfile.quote}"
            </blockquote>

            <div className={styles.ownerStory}>
              {ownerProfile.story.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className={styles.ownerPillars}>
              {ownerProfile.pillars.map((pillar) => (
                <div key={pillar.title} className={styles.pillarCard}>
                  <strong>{pillar.title}</strong>
                  <p>{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. QUALITY PROMISE & MANUFACTURING ASSURANCE
          ========================================================================= */}
      <section className={styles.section}>
        <div className={styles.sectionHeaderCenter} data-reveal>
          <span className={styles.sectionTag}>
            <FaShieldHalved aria-hidden="true" /> Our Quality Promise
          </span>
          <h2>Strong, dependable boxes you can trust.</h2>
          <p className={styles.sectionSub}>
            We build every carton to withstand real transport conditions, truck vibrations, and warehouse stacking so your goods always arrive safely.
          </p>
        </div>

        <div className={styles.qualityGrid}>
          {qualityAssurance.map((std) => {
            const Icon = std.icon;
            return (
              <div key={std.title} className={styles.qualityCard} data-reveal>
                <div className={styles.qualityIcon}>
                  <Icon aria-hidden="true" />
                </div>
                <h3>{std.title}</h3>
                <p>{std.detail}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          8. 7-STEP MANUFACTURING PROCESS
          ========================================================================= */}
      <section className={styles.section} id="process">
        <div className={styles.sectionHeader} data-reveal>
          <span className={styles.sectionTag}>How We Make Your Boxes</span>
          <h2>Simple and transparent 7-step process.</h2>
          <p className={styles.sectionSub}>
            From understanding your product size to manufacturing and doorstep dispatch.
          </p>
        </div>

        <div className={styles.processList}>
          {processSteps.map((step) => (
            <article key={step.number} className={styles.processItem} data-reveal>
              <span className={styles.processNum}>{step.number}</span>
              <h3>{step.step}</h3>
              <p>{step.detail}</p>
            </article>
          ))}
        </div>
      </section>

      {/* =========================================================================
          9. INDUSTRIES WE SERVE
          ========================================================================= */}
      <section className={styles.section}>
        <div className={styles.sectionHeader} data-reveal>
          <span className={styles.sectionTag}>Industries We Supply</span>
          <h2>Trusted packaging partner across diverse sectors.</h2>
          <p className={styles.sectionSub}>
            Whether you need clean food boxes or heavy 7-ply boxes for machine parts, we supply packaging tailored to your product.
          </p>
        </div>

        <div className={styles.industriesGrid}>
          {industries.map((ind) => {
            const Icon = ind.icon;
            return (
              <div key={ind.title} className={styles.industryCard} data-reveal>
                <Icon className={styles.industryIcon} aria-hidden="true" />
                <div>
                  <h3>{ind.title}</h3>
                  <p>{ind.highlight}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          10. STATS METRICS
          ========================================================================= */}
      <section className={`${styles.section} ${styles.statsSection}`}>
        <div className={styles.statsGrid}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.statBlock} data-reveal>
              <strong>
                <span data-count={stat.value}>0</span>
                {stat.suffix}
              </strong>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          11. QUOTATION BUILDER & INQUIRY FORM
          ========================================================================= */}
      <section className={`${styles.section} ${styles.inquirySection}`} id="inquiry">
        <div className={styles.quoteLayout}>
          <div className={styles.quoteInfo} data-reveal>
            <span className={styles.sectionTag}>Direct Factory Desk</span>
            <h2>Request a free price quote.</h2>
            <p>
              Tell us your box size, quantity, and requirements. We will give you our best direct factory pricing and estimated delivery time quickly.
            </p>

            <div className={styles.quoteContactList}>
              <div className={styles.quoteContactItem}>
                <FaPhone className={styles.quoteContactIcon} aria-hidden="true" />
                <span>Call Us: {siteConfig.phone}</span>
              </div>
              <div className={styles.quoteContactItem}>
                <FaEnvelope className={styles.quoteContactIcon} aria-hidden="true" />
                <span>Email: {siteConfig.email}</span>
              </div>
              <div className={styles.quoteContactItem}>
                <FaLocationDot className={styles.quoteContactIcon} aria-hidden="true" />
                <span>{siteConfig.address}</span>
              </div>
            </div>

            <a
              href={`https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                "Hello GTC Team! I would like to get a price quote for custom corrugated boxes."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappDirectBtn}
            >
              <FaWhatsapp aria-hidden="true" /> Chat on WhatsApp for Instant Quote
            </a>
          </div>

          <form className={styles.quoteForm} onSubmit={submitInquiry} data-reveal noValidate>
            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label>Company / Business Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Enterprises"
                  value={form.company}
                  onChange={(e) => updateForm("company", e.target.value)}
                />
                {errors.company && <span className={styles.formError}>{errors.company}</span>}
              </div>

              <div className={styles.formField}>
                <label>Your Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                />
                {errors.name && <span className={styles.formError}>{errors.name}</span>}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label>Email Address *</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                />
                {errors.email && <span className={styles.formError}>{errors.email}</span>}
              </div>

              <div className={styles.formField}>
                <label>Phone / WhatsApp Number *</label>
                <input
                  type="tel"
                  placeholder="+91 7060443193"
                  value={form.phone}
                  onChange={(e) => updateForm("phone", e.target.value)}
                />
                {errors.phone && <span className={styles.formError}>{errors.phone}</span>}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label>Box Style</label>
                <select
                  value={form.boxType}
                  onChange={(e) => updateForm("boxType", e.target.value)}
                >
                  {boxTypes.map((type) => (
                    <option key={type.value} value={type.label}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formField}>
                <label>Board Thickness / Ply</label>
                <select
                  value={form.ply}
                  onChange={(e) => updateForm("ply", e.target.value)}
                >
                  {plyOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formRow3}>
              <div className={styles.formField}>
                <label>Length ({form.unit})</label>
                <input
                  type="number"
                  step="any"
                  value={form.length}
                  onChange={(e) => updateForm("length", e.target.value)}
                />
              </div>
              <div className={styles.formField}>
                <label>Width ({form.unit})</label>
                <input
                  type="number"
                  step="any"
                  value={form.width}
                  onChange={(e) => updateForm("width", e.target.value)}
                />
              </div>
              <div className={styles.formField}>
                <label>Height ({form.unit})</label>
                <input
                  type="number"
                  step="any"
                  value={form.height}
                  onChange={(e) => updateForm("height", e.target.value)}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label>Quantity of Boxes *</label>
                <input
                  type="number"
                  placeholder="e.g. 1000"
                  value={form.quantity}
                  onChange={(e) => updateForm("quantity", e.target.value)}
                />
                {errors.quantity && <span className={styles.formError}>{errors.quantity}</span>}
              </div>

              <div className={styles.formField}>
                <label>Printing Requirement</label>
                <select
                  value={form.printing}
                  onChange={(e) => updateForm("printing", e.target.value)}
                >
                  <option value="Yes (Brand Logo)">Yes — Print Company Logo / Details</option>
                  <option value="Plain / No Print">No — Plain Brown Kraft Boxes</option>
                  <option value="Need Advice">Need Advice on Printing</option>
                </select>
              </div>
            </div>

            <div className={styles.formField}>
              <label>Optional Design File or Photo (.pdf, .png, .jpg, .ai)</label>
              <input
                type="file"
                accept=".pdf,.ai,.eps,.svg,.png,.jpg,.jpeg"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0].name);
                  }
                }}
              />
            </div>

            <div className={styles.formField}>
              <label>Additional Notes / Product Weight</label>
              <textarea
                rows={3}
                placeholder="Product weight, delivery city, special packing needs..."
                value={form.requirements}
                onChange={(e) => updateForm("requirements", e.target.value)}
              />
            </div>

            <button type="submit" className={styles.formSubmitBtn} disabled={isSubmitting}>
              {isSubmitting ? "Submitting Your Request..." : "Get Price Quotation"}{" "}
              <FaArrowRight aria-hidden="true" />
            </button>

            {submitMessage && (
              <div className={styles.successMsg}>
                {submitMessage}
              </div>
            )}
          </form>
        </div>
      </section>

      {/* =========================================================================
          12. FREQUENTLY ASKED QUESTIONS
          ========================================================================= */}
      <section className={styles.section} id="faq">
        <div className={styles.sectionHeaderCenter} data-reveal>
          <span className={styles.sectionTag}>FAQ</span>
          <h2>Frequently Asked Questions</h2>
          <p className={styles.sectionSub}>
            Simple answers to common questions about our boxes, order sizes, printing, and delivery.
          </p>
        </div>

        <div className={styles.faqList}>
          {faqs.map((faq, idx) => (
            <div key={faq.question} className={styles.faqItem} data-reveal>
              <button
                type="button"
                className={styles.faqBtn}
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
              >
                <span>{faq.question}</span>
                <FaChevronDown
                  className={`${styles.faqIcon} ${openFaq === idx ? styles.faqIconOpen : ""}`}
                  aria-hidden="true"
                />
              </button>
              {openFaq === idx && <div className={styles.faqAnswer}>{faq.answer}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          13. CONTACT & LOCATION DESK
          ========================================================================= */}
      <section className={styles.section}>
        <div className={styles.contactGrid}>
          <div className={styles.contactCard} data-reveal>
            <div>
              <span className={styles.sectionTag}>Factory Sales Desk</span>
              <h3>Visit our factory or get in touch directly.</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginTop: "0.5rem" }}>
                Our team is available 6 days a week for in-person visits, paper quality samples, and custom box consultations.
              </p>

              <div className={styles.contactDetails}>
                <div className={styles.contactRow}>
                  <FaLocationDot aria-hidden="true" />
                  <div>
                    <strong>Factory Address:</strong>
                    <div>{siteConfig.address}</div>
                  </div>
                </div>

                <div className={styles.contactRow}>
                  <FaPhone aria-hidden="true" />
                  <div>
                    <strong>Phone Support:</strong>
                    <div>{siteConfig.phone}</div>
                  </div>
                </div>

                <div className={styles.contactRow}>
                  <FaEnvelope aria-hidden="true" />
                  <div>
                    <strong>Email:</strong>
                    <div>{siteConfig.email}</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                Working Hours: {siteConfig.hours}
              </p>
              <a href="#inquiry" className={styles.primaryButton}>
                Get a Quote <FaArrowRight aria-hidden="true" />
              </a>
            </div>
          </div>

          <iframe
            data-reveal
            className={styles.mapFrame}
            title="GTC Factory Location Map - 689/4 Madhavpuram Delhi Road Meerut"
            loading="lazy"
            src={siteConfig.mapEmbedUrl}
          />
        </div>
      </section>

      {/* =========================================================================
          14. FOOTER
          ========================================================================= */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <a href="#top" className={styles.logo}>
              <div className={styles.logoImgWrapper}>
                <Image
                  src={siteConfig.logoUrl}
                  alt="GTC Logo"
                  width={34}
                  height={34}
                  className={styles.logoImg}
                />
              </div>
              <div className={styles.logoText}>
                <span className={styles.logoTitle}>GTC</span>
                <span className={styles.logoSub}>Garg Trading Company</span>
              </div>
            </a>
            <p className={styles.footerTagline}>
              Direct manufacturer of custom corrugated cardboard boxes, shipping cartons, and printed packaging. Strong quality, honest prices, and on-time delivery.
            </p>
          </div>

          <div className={styles.footerNavGroup}>
            <div className={styles.footerCol}>
              <strong>Box Products</strong>
              <a href="#products">Corrugated Cartons</a>
              <a href="#products">Printed Brand Boxes</a>
              <a href="#products">Die-Cut Boxes</a>
              <a href="#products">Heavy-Duty Boxes</a>
              <a href="#products">E-Commerce Mailers</a>
            </div>

            <div className={styles.footerCol}>
              <strong>Company</strong>
              <a href="#about">Meet Sonu Garg</a>
              <a href="#factory">Factory Photos</a>
              <a href="#process">Our Quality</a>
              <a href="#faq">FAQ</a>
            </div>

            <div className={styles.footerCol}>
              <strong>Contact</strong>
              <a href={`tel:${siteConfig.phone}`}>{siteConfig.phone}</a>
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              <a href="#inquiry">Request Quotation</a>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© {currentYear} Garg Trading Company (GTC). All rights reserved.</p>
          <p>Corrugated Box Manufacturer</p>
        </div>
      </footer>
    </main>
  );
}
