export type SiteDiagramProject = {
  id: string;
  name: string;
  capacityKw: number;
  capacityLabel: string;
  location: string;
  status: "ready" | "draft";
  summary: string;
};

export const SITE_DIAGRAM_PROJECTS: SiteDiagramProject[] = [
  {
    id: "mukesh-kumawat-80kw",
    name: "Mukesh Kumawat",
    capacityKw: 80,
    capacityLabel: "80 kW",
    location: "Jaipur",
    status: "ready",
    summary: "Working + max-panels rooftop layouts",
  },
  {
    id: "hemanth-tanwani-90kw",
    name: "Hemant Tanwani",
    capacityKw: 90,
    capacityLabel: "90 kW",
    location: "Jaipur",
    status: "draft",
    summary: "Max panel pack · 4 exhausts",
  },
];

export function getSiteDiagramProject(id: string): SiteDiagramProject | undefined {
  return SITE_DIAGRAM_PROJECTS.find((project) => project.id === id);
}
