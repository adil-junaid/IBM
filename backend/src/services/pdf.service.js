const fs = require("fs");
const pdfParse = require("pdf-parse");

const extractPdfText = async (filePath) => {
  try {
    // Read the uploaded PDF
    const buffer = fs.readFileSync(filePath);

    // Parse the PDF
    const data = await pdfParse(buffer);

    return {
      success: true,
      text: data.text,
      pages: data.numpages,
      metadata: data.info,
    };
  } catch (error) {
    throw new Error(`PDF Parsing Failed: ${error.message}`);
  }
};

module.exports = {
  extractPdfText,
};