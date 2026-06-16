import { ModulePlaceholder } from "../components/ModulePlaceholder";
import { PageHeader } from "../components/PageHeader";
import type { TrackHubModule } from "../data/modules";
import { NotesTodoPage } from "./NotesTodoPage";

type ModulePageProps = {
  module: TrackHubModule;
};

export function ModulePage({ module }: ModulePageProps) {
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
