import {
  FaAppleWhole,
  FaBoxesStacked,
  FaCarSide,
  FaLeaf,
  FaMicrochip,
  FaPills,
  FaPrint,
  FaRecycle,
  FaShirt,
  FaShop,
  FaTruckFast,
  FaWarehouse
} from "react-icons/fa6";

export const products = [
  {
    title: "Corrugated Boxes",
    image: "/images/product-corrugated.svg",
    description: "Durable fluted packaging engineered for shipping, stacking, and long-distance handling."
  },
  {
    title: "Printed Boxes",
    image: "/images/product-printed.svg",
    description: "High-quality brand printing with sharp color control and premium surface finishing."
  },
  {
    title: "E-commerce Packaging",
    image: "/images/product-ecommerce.svg",
    description: "Reliable mailer and shipper formats designed for fast fulfillment operations."
  },
  {
    title: "Heavy Duty Boxes",
    image: "/images/product-heavy-duty.svg",
    description: "Reinforced multi-ply cartons for industrial products, bulk loads, and export shipments."
  },
  {
    title: "Food Packaging",
    image: "/images/product-food.svg",
    description: "Clean, practical formats for food brands, cloud kitchens, and retail-ready packaging."
  },
  {
    title: "Die Cut Boxes",
    image: "/images/product-die-cut.svg",
    description: "Custom locking, display, and specialty formats cut to exact product requirements."
  }
];

export const processSteps = [
  "Design",
  "Material Selection",
  "Printing",
  "Cutting",
  "Quality Inspection",
  "Packaging",
  "Delivery"
];

export const industries = [
  { title: "Food", icon: FaAppleWhole },
  { title: "Electronics", icon: FaMicrochip },
  { title: "Automotive", icon: FaCarSide },
  { title: "Pharmaceutical", icon: FaPills },
  { title: "Retail", icon: FaShop },
  { title: "E-commerce", icon: FaTruckFast },
  { title: "FMCG", icon: FaBoxesStacked },
  { title: "Textile", icon: FaShirt }
];

export const features = [
  { title: "Premium Quality", detail: "Strict process controls from paper selection to dispatch.", icon: FaWarehouse },
  { title: "Eco Friendly Materials", detail: "Recyclable corrugated boards and responsible sourcing.", icon: FaRecycle },
  { title: "Competitive Pricing", detail: "Optimized production planning for practical bulk-order economics.", icon: FaBoxesStacked },
  { title: "Fast Delivery", detail: "Reliable scheduling for repeat orders and urgent business needs.", icon: FaTruckFast },
  { title: "Custom Sizes", detail: "Precise dimensions, flute profiles, and board grades for your product.", icon: FaPrint },
  { title: "Modern Machinery", detail: "Printing, die cutting, creasing, and finishing built for consistency.", icon: FaLeaf }
];

export const stats = [
  { value: 500, suffix: "+", label: "Clients" },
  { value: 2, suffix: "M+", label: "Boxes Manufactured" },
  { value: 20, suffix: "+", label: "Years Experience" },
  { value: 98, suffix: "%", label: "Customer Satisfaction" }
];

export const faqs = [
  {
    question: "Can you manufacture custom sizes?",
    answer: "Yes. We build cartons around your dimensions, weight, stacking needs, print requirements, and order volume."
  },
  {
    question: "Do you support bulk business orders?",
    answer: "Yes. The production workflow is designed for repeat B2B orders, scheduled dispatches, and large-volume requirements."
  },
  {
    question: "Can you print our brand artwork?",
    answer: "Yes. Share your design file and our team can review print feasibility, colors, box style, and finishing options."
  },
  {
    question: "What information is needed for a quotation?",
    answer: "Box dimensions, quantity, board grade, printing needs, usage category, delivery city, and any artwork or sample references."
  }
];
