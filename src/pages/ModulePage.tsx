import { ModulePlaceholder } from "../components/ModulePlaceholder";
import { PageHeader } from "../components/PageHeader";
import type { TrackHubModule } from "../data/modules";

type ModulePageProps = {
  module: TrackHubModule;
};

export function ModulePage({ module }: ModulePageProps) {
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
