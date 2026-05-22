import crypto from 'node:crypto';

function sha256(value) {
  return `sha256:${crypto.createHash('sha256').update(String(value)).digest('hex')}`;
}

export class EcosystemContractExporter {
  export({ storyboardPayload, verificationReport, packageData }) {
    const contract = {
      contract_type: 'nex.visual_engine.handoff.v1',
      generated_at: new Date().toISOString(),
      topic: storyboardPayload.topic,
      ready_for_visual_engine: Boolean(verificationReport?.ready_for_video),
      research_package: {
        package_id: packageData.package_id,
        package_hash: packageData.package_hash,
        source_manifest_hash: packageData.source_manifest_hash,
      },
      verification: {
        verified: verificationReport?.verified,
        citation_coverage: verificationReport?.citation_coverage,
        unsupported_claims: verificationReport?.unsupported_claims || [],
        weak_sources: verificationReport?.weak_sources || [],
      },
      storyboard_payload: storyboardPayload,
    };

    return {
      ...contract,
      contract_hash: sha256(JSON.stringify(contract)),
    };
  }
}

export { sha256 };
