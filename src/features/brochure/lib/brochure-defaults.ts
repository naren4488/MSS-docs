import type { BrochureData } from "../types/brochure";

export function createDefaultBrochureData(): BrochureData {
  return {
    company: {
      name: "Mahi Solar Solution Private Limited",
      tagline: "SMART | SUSTAINABLE | COST EFFECTIVE",
      logo: "/assets/mss-logo.png",
      phone: "+91 9928413501",
      email: "mahisolarsolution@gmail.com",
      website: "mahisolarsolution.com",
      address: "Plot No. 44, Jai Bhawani Vihar Vistar, Radha Vihar, Govindpura, Jaipur, Rajasthan – 302044",
    },
    hero: {
      title: "SOLAR ENERGY SOLUTIONS",
      subtitle: "Transform Your Home with Clean, Renewable Energy",
    },
    services: {
      id: "services",
      title: "SERVICE & WARRANTY COMMITMENT",
      items: [
        "FREE SITE SURVEY & ENERGY ANALYSIS\n• Free site inspection before installation.\n• Proper system design as per customer's electricity consumption.",
        "PREMIUM QUALITY MATERIAL\n• A-Grade TopCon/Bifacial Solar Panels\n• BIS Approved Products\n• Branded Inverter & Genuine Accessories Only",
        "PROFESSIONAL INSTALLATION\n• Installation by trained and experienced engineers\n• Installation as per JVVNL & MNRE guidelines\n• Complete safety standards followed",
        "NET METERING & SUBSIDY SUPPORT\n• Complete JVVNL Net Metering Process\n• PM Surya Ghar Yojana Documentation\n• Government Subsidy Assistance",
        "WARRANTY COVERAGE\n• Solar Panel Performance Warranty – Up to 30 Years\n• Inverter Manufacturer Warranty – Up to 10 Years\n• Structure Warranty – 10 Years\n• Installation Workmanship Warranty – 5 Years",
        "FREE AFTER-SALES SERVICE (5 YEARS)\n• Periodic System Health Check-up\n• ACDB/DCDB Inspection\n• Earthing Inspection\n• Generation Performance Check\n• Mobile App Monitoring Support\n• Technical Assistance on Call",
        "CUSTOMER SUPPORT\n• Dedicated Customer Care\n• Phone & WhatsApp Support\n• Quick Response Team\n• Fast Complaint Resolution",
        "EMERGENCY SERVICE\n• Priority Technical Support\n• Breakdown Assistance\n• Fast On-Site Service",
        "PERFORMANCE COMMITMENT\n• Proper System Performance\n• Professional Installation Quality\n• Long-Term Reliable Operation",
        "WARRANTY EXCLUSIONS CLEARLY DEFINED\n• Natural Disasters (Flood, Fire, Earthquake, Storm, Lightning)\n• Physical Damage or Theft\n• Unauthorized Repair or Modification\n• Customer Negligence or Misuse",
      ],
    },
    warranty: {
      id: "warranty",
      title: "COMPREHENSIVE WARRANTY",
      items: [
        "30-year Solar Panel Warranty",
        "10-year Inverter Warranty",
        "5-year Installation Workmanship Warranty",
        "10-year Structure Warranty",
        "5-year Free Maintenance Service",
        "Manufacturer-backed support",
      ],
    },
    whyChoose: {
      id: "whyChoose",
      title: "WHY CHOOSE MAHI SOLAR?",
      items: [
        "JVVNL Authorised Solar Vendor",
        "Premium Quality Products",
        "Transparent Pricing",
        "Professional Installation Team",
        "Complete Net Metering & Subsidy Support",
        "Genuine Warranty Support",
        "Reliable After-Sales Service",
        "Trusted Local Service Partner",
      ],
    },
    contact: {
      phone: "+91 9928413501",
      email: "mahisolarsolution@gmail.com",
      website: "mahisolarsolution.com",
      address: "Plot No. 44, Jai Bhawani Vihar Vistar, Radha Vihar, Govindpura, Jaipur, Rajasthan – 302044",
    },
  };
}
