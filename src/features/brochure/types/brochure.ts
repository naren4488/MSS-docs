export interface BrochureCompany {
  name: string;
  shortName: string;
  tagline: string;
  slogan: string;
  logo: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  gst: string;
}

export interface BrochureHero {
  title: string;
  subtitle: string;
  promises: string[];
}

export interface BrochureService {
  title: string;
  description: string;
}

export interface BrochureBrandGroup {
  label: string;
  brands: string[];
}

export interface BrochureProcessStep {
  title: string;
  description: string;
}

export interface BrochureWarrantyItem {
  label: string;
  value: string;
}

export interface BrochureData {
  company: BrochureCompany;
  hero: BrochureHero;
  services: {
    title: string;
    subtitle: string;
    items: BrochureService[];
  };
  brands: {
    title: string;
    subtitle: string;
    groups: BrochureBrandGroup[];
  };
  whyChoose: {
    title: string;
    subtitle: string;
    items: { title: string; description: string }[];
  };
  process: {
    title: string;
    subtitle: string;
    steps: BrochureProcessStep[];
  };
  warranty: {
    title: string;
    subtitle: string;
    items: BrochureWarrantyItem[];
  };
  scheme: {
    title: string;
    subtitle: string;
    points: string[];
  };
  contactCta: {
    title: string;
    subtitle: string;
  };
  footerLine: string;
}
