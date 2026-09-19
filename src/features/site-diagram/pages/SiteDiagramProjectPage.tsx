import { Navigate, useParams } from "react-router-dom";
import { getSiteDiagramProject } from "../lib/site-diagram-projects";
import { HemanthTanwaniDiagramPage } from "./HemanthTanwaniDiagramPage";
import { MukeshKumawatDiagramPage } from "./MukeshKumawatDiagramPage";

export function SiteDiagramProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const project = projectId ? getSiteDiagramProject(projectId) : undefined;

  if (!project) {
    return <Navigate replace to="/site-diagram" />;
  }

  switch (project.id) {
    case "mukesh-kumawat-80kw":
      return <MukeshKumawatDiagramPage />;
    case "hemanth-tanwani-90kw":
      return <HemanthTanwaniDiagramPage />;
    default:
      return <Navigate replace to="/site-diagram" />;
  }
}
