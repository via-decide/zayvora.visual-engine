import { StoryboardPayloadBuilder } from './storyboard_payload_builder.js';
import { EcosystemContractExporter } from './ecosystem_contract_exporter.js';
import { HandoffValidator } from './handoff_validator.js';

export class VisualEngineHandoff {
  constructor({ storyboardBuilder = new StoryboardPayloadBuilder(), contractExporter = new EcosystemContractExporter(), validator = new HandoffValidator() } = {}) {
    this.storyboardBuilder = storyboardBuilder;
    this.contractExporter = contractExporter;
    this.validator = validator;
  }

  build({ packageData, verificationReport }) {
    const storyboardPayload = this.storyboardBuilder.build(packageData);
    const contract = this.contractExporter.export({
      storyboardPayload,
      verificationReport,
      packageData,
    });

    const validation = this.validator.validate({
      packageData,
      verificationReport,
      storyboardPayload,
      contract,
    });

    if (!validation.compatible) {
      throw new Error(`Handoff validation failed: ${validation.issues.join(', ')}`);
    }

    return {
      flow: ['TOPIC', 'SOURCES', 'EVIDENCE', 'RESEARCH BRIEF', 'VIDEO RESEARCH PACKAGE', 'VERIFIED HANDOFF', 'VISUAL ENGINE'],
      storyboard_payload: storyboardPayload,
      ecosystem_contract: contract,
      validation,
    };
  }
}
