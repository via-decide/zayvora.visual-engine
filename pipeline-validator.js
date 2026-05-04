const fs = require("fs");

function validatePipeline(writtenFiles, contract) {
  if (writtenFiles.length !== contract.files.length) {
    throw new Error("FILE_COUNT_MISMATCH");
  }

  for (const file of writtenFiles) {
    if (!fs.existsSync(file)) {
      throw new Error(`MISSING_ON_DISK: ${file}`);
    }

    if (!contract.allowedExtensions.some(ext => file.endsWith(ext))) {
      throw new Error(`INVALID_FILE_TYPE: ${file}`);
    }
  }

  return true;
}

module.exports = { validatePipeline };
