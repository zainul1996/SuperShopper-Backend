const vision = require("@google-cloud/vision");

const detectText = async function detectText(fileName) {
  const client = new vision.ImageAnnotatorClient();
  const [result] = await client.textDetection(fileName);
  const detections = result.textAnnotations;
  const numList = [];
  detections.forEach(function (text, index) {
    var number = parseFloat(text.description.match(/\d+\.\d\d(?!\d)/));
    if (!isNaN(number)) {
      numList.push(number);
    }
  });
  console.log("Price: $" + Math.min(...numList));
  return Math.min(...numList);
};

exports.detectText = detectText;
