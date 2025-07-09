-- CreateTable
CREATE TABLE "CybersecurityIncident" (
    "id" SERIAL NOT NULL,
    "threatCategory" TEXT,
    "iocs" TEXT[],
    "threatActor" TEXT,
    "attackVector" TEXT,
    "geographicalLocation" TEXT,
    "sentimentInForums" DOUBLE PRECISION,
    "severityScore" INTEGER,
    "predictedThreatCategory" TEXT,
    "suggestedDefenseMechanism" TEXT,
    "riskLevelPrediction" INTEGER,
    "cleanedThreatDescription" TEXT,
    "keywordExtraction" TEXT[],
    "namedEntities" TEXT[],
    "topicModelingLabels" TEXT,
    "wordCount" INTEGER,

    CONSTRAINT "CybersecurityIncident_pkey" PRIMARY KEY ("id")
);
