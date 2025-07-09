const fs = require('fs');
const { parse } = require('csv-parse');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const csvFilePath = './dataset/Cybersecurity_Dataset.csv'; 

const parseArray = (val) => {
  if (!val || val.trim() === '') return [];
  try {
    return JSON.parse(val.replace(/'/g, '"'));
  } catch {
    return [];
  }
};

(async () => {
  const records = [];

  const parser = fs
    .createReadStream(csvFilePath)
    .pipe(parse({ columns: true, trim: true }));

  for await (const row of parser) {
    records.push({
      threatCategory: row['Threat Category'],
      iocs: parseArray(row['IOCs (Indicators of Compromise)']),
      threatActor: row['Threat Actor'],
      attackVector: row['Attack Vector'],
      geographicalLocation: row['Geographical Location'],
      sentimentInForums: parseFloat(row['Sentiment in Forums']),
      severityScore: parseInt(row['Severity Score']),
      predictedThreatCategory: row['Predicted Threat Category'],
      suggestedDefenseMechanism: row['Suggested Defense Mechanism'],
      riskLevelPrediction: parseInt(row['Risk Level Prediction']),
      cleanedThreatDescription: row['Cleaned Threat Description'],
      keywordExtraction: parseArray(row['Keyword Extraction']),
      namedEntities: parseArray(row['Named Entities (NER)']),
      topicModelingLabels: row['Topic Modeling Labels'],
      wordCount: parseInt(row['Word Count']),
    });
  }

  const BATCH_SIZE = 100;
  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    await prisma.cybersecurityIncident.createMany({ data: batch, skipDuplicates: true });
  }

  console.log('✅ Ingestion complete');
  await prisma.$disconnect();
})();
