export function loadRenderContract(contract) {
  if (!contract) throw new Error('render contract is required');
  return contract;
}

export function deriveDurationFrames(contract) {
  return contract.duration_frames;
}

export function deriveDimensions(contract) {
  return { width: contract.width, height: contract.height };
}

export function deriveFPS(contract) {
  return contract.fps;
}

export function registerComposition(contract) {
  const loaded = loadRenderContract(contract);
  const dimensions = deriveDimensions(loaded);
  return {
    id: loaded.contract_id ?? 'ZayvoraComposition',
    component: 'ZayvoraComposition',
    width: dimensions.width,
    height: dimensions.height,
    fps: deriveFPS(loaded),
    durationInFrames: deriveDurationFrames(loaded),
    defaultProps: loaded,
    deterministic: true,
  };
}
