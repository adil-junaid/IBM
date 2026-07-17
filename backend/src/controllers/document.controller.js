const { getDocuments } = require("../ai/documentRegistry");

const listDocuments = (req, res) => {
  return res.json({
    success: true,
    count: getDocuments().length,
    documents: getDocuments(),
  });
};

module.exports = {
  listDocuments,
};