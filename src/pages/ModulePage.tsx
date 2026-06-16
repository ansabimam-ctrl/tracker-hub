import { ModulePlaceholder } from "../components/ModulePlaceholder";
import { PageHeader } from "../components/PageHeader";
import type { TrackHubModule } from "../data/modules";
import { NotesTodoPage } from "./NotesTodoPage";
import { ProposalDetailsPage } from "./ProposalDetailsPage";

type ModulePageProps = {
  module: TrackHubModule;
};

export function ModulePage({ module }: ModulePageProps) {
  if (module.path === "/proposal-details") {
    return <ProposalDetailsPage />;
  }

  if (module.path === "/notes-todo") {
    return <NotesTodoPage />;
  }

  return (
    <>
      <PageHeader
        eyebrow="Module"
        title={module.name}
        description={module.description}
      />
      <ModulePlaceholder module={module} />
    </>
  );
}
