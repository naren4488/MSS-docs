import type { BrochureData } from "../types/brochure";

export function createDefaultBrochureData(): BrochureData {
  return {
    company: {
      name: "Mahi Solar Solution Private Limited",
      shortName: "MSS",
      tagline: "Smart · Sustainable · Cost Effective",
      slogan: "Switch to Solar — Bijli Bill Bachao",
      logo: "/assets/mss-logo.png",
      phone: "+91 9928413501",
      email: "mahisolarsolution@gmail.com",
      website: "mahisolarsolution.com",
      address:
        "Plot No. 44, Jai Bhawani Vihar Vistar, Radha Vihar, Govindpura, Jaipur, Rajasthan – 302044",
      gst: "08AAUCM4104G1ZD",
    },
    hero: {
      title: "Power your home with clean solar energy",
      subtitle:
        "End-to-end rooftop solar for homes and businesses across Rajasthan — premium brands, expert installation, and complete subsidy & net-metering support.",
      promises: ["Clean Energy", "Lower Bills", "Secure Future"],
    },
    services: {
      title: "What we deliver",
      subtitle: "One partner for design, installation, paperwork, and long-term care.",
      items: [
        {
          title: "Solar Panel Installation",
          description:
            "Site survey, custom system design, and professional rooftop installation aligned with JVVNL & MNRE guidelines.",
        },
        {
          title: "Multi-Brand Solar Systems",
          description:
            "A-grade TopCon / bifacial panels with branded inverters and genuine accessories — chosen to match your load and budget.",
        },
        {
          title: "Home & Commercial Projects",
          description:
            "Residential rooftops to commercial setups — sized for today’s usage with room to grow.",
        },
      ],
    },
    brands: {
      title: "Trusted brands we offer",
      subtitle: "Industry-leading partners for panels, inverters, wires, and accessories.",
      groups: [
        {
          label: "Solar Panels",
          brands: ["Adani Solar", "Tata Power Solar", "Waaree", "Ina Solar"],
        },
        {
          label: "Inverters, Wires & Accessories",
          brands: ["GoodWe", "Polycab", "Havells"],
        },
      ],
    },
    whyChoose: {
      title: "Why clients choose Mahi Solar",
      subtitle: "Clarity, quality, and support — before and long after commissioning.",
      items: [
        {
          title: "JVVNL authorised vendor",
          description: "Compliant installations with full DISCOM coordination in the Jaipur circle.",
        },
        {
          title: "Subsidy & net metering handled",
          description: "Complete PM Surya Ghar documentation and JVVNL net-metering process support.",
        },
        {
          title: "Transparent pricing",
          description: "Clear commercials, genuine materials, and no surprise add-ons after booking.",
        },
        {
          title: "Expert installation team",
          description: "Trained engineers, safety-first workmanship, and neat rooftop finishing.",
        },
        {
          title: "Best value guarantee",
          description: "Premium systems priced fairly — quality that protects your investment for decades.",
        },
        {
          title: "After-sales you can reach",
          description: "Phone & WhatsApp support, health checks, and fast on-site assistance when needed.",
        },
      ],
    },
    process: {
      title: "From enquiry to generation",
      subtitle: "A simple path so you always know what happens next.",
      steps: [
        {
          title: "Free site survey",
          description: "We assess roof, shading, and your bill to recommend the right capacity.",
        },
        {
          title: "Proposal & booking",
          description: "Transparent quote with brands, warranty, and subsidy estimate.",
        },
        {
          title: "Install & commission",
          description: "Quality materials, professional mounting, and system commissioning.",
        },
        {
          title: "Subsidy & handover",
          description: "Net metering, paperwork support, app monitoring, and warranty activation.",
        },
      ],
    },
    warranty: {
      title: "Warranty & assurance",
      subtitle: "Coverage that gives you confidence for the long run.",
      items: [
        { label: "Solar panels", value: "Up to 30 years performance" },
        { label: "Inverter", value: "Up to 10 years manufacturer" },
        { label: "Structure", value: "10 years" },
        { label: "Workmanship", value: "5 years installation" },
        { label: "Maintenance", value: "5 years free service support" },
        { label: "Monitoring", value: "Mobile app generation tracking" },
      ],
    },
    scheme: {
      title: "PM Surya Ghar: Muft Bijli Yojana",
      subtitle:
        "Mahi Solar helps eligible homeowners unlock central subsidy benefits with end-to-end documentation and DISCOM coordination under the Jaipur Discom (JVVNL) area.",
      points: [
        "Eligibility guidance for residential rooftop systems",
        "Application & documentation support",
        "Quality installation as per scheme norms",
        "Net metering liaison with JVVNL",
      ],
    },
    contactCta: {
      title: "Ready to cut your electricity bill?",
      subtitle: "Call for a free site survey and personalised solar proposal.",
    },
    footerLine: "Clean Energy · Bright Future",
  };
}
