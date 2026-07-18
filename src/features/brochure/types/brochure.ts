export interface BrochureSection {
  id: string;
  title: string;
  items: string[];
}

export interface BrochureData {
  company: {
    name: string;
    tagline: string;
    logo: string;
    phone: string;
    email: string;
    website: string;
    address: string;
  };
  hero: {
    title: string;
    subtitle: string;
  };
  services: BrochureSection;
  warranty: BrochureSection;
  whyChoose: BrochureSection;
  contact: {
    phone: string;
    email: string;
    website: string;
    address: string;
  };
}
