const path = require("path");

const { extractPdfText } = require("./pdf.service");
// We'll add these later
// const { extractDocxText } = require("./docx.service");
// const { extractTxtText } = require("./txt.service");
// const { extractMarkdownText } = require("./markdown.service");

const parseDocument = async (filePath) => {
  const extension = path.extname(filePath).toLowerCase();

  switch (extension) {
    case ".pdf":
      return await extractPdfText(filePath);

    // We'll implement these later
    // case ".docx":
    //   return await extractDocxText(filePath);

    // case ".txt":
    //   return await extractTxtText(filePath);

    // case ".md":
    //   return await extractMarkdownText(filePath);

    default:
      throw new Error("Unsupported file type.");
  }
};

module.exports = {
  parseDocument,
};