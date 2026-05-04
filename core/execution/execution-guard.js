export function enforceContract(contract, generatedFiles) {
  for (const file of generatedFiles) {
    if (!contract.isValidFile(file.name)) throw new Error(`INVALID_ARTIFACT: ${file.name}`);
    if (!contract.isValidExtension(file.name)) throw new Error(`INVALID_EXTENSION: ${file.name}`);
  }
}
