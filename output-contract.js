class OutputContract {
  constructor({ files = [], allowedExtensions = [] }) {
    this.files = files;
    this.allowedExtensions = allowedExtensions;
    Object.freeze(this);
  }

  isValidFile(file) {
    return this.files.includes(file);
  }

  isValidExtension(file) {
    return this.allowedExtensions.some(ext => file.endsWith(ext));
  }
}

module.exports = { OutputContract };
