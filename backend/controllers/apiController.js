const prisma = require("../config/prismaConfig");

exports.getThreats = async (req, res) => {
    let { page = "1", limit = "20", category, search } = req.query;

    page = Math.max(1, parseInt(page));
    limit = Math.max(1, parseInt(limit));

    console.log(req.query);

    try {
        const results = await prisma.cybersecurityIncident.findMany({
            skip: (page-1) * limit,
            take: limit ?? 20,
            where: {
                AND: [
                    category ? {
                        threatCategory: {
                            contains: category,
                            mode: "insensitive",
                        },
                    } : {},
                    search ? {
                        cleanedThreatDescription: {
                            search: search,
                            mode: "insensitive",
                        },
                    } : {},
                ],
            },
        });
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getThreatsById = async (req, res) => {
    threatId = parseInt(req.params.threatId)
    console.log(req.params)

    try {
        const result = await prisma.cybersecurityIncident.findUnique({
            where: {
                id: threatId,
            }
        })

        if (!result) {
            return res.status(404).json({ error: "Not found" })
        }

        res.json(result)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

exports.getThreatStats = async (req, res) => {
    try {
        const [totalThreats, threatCountsByCategory, threatCountsBySeverity, threatCountsByRiskLevel] = await Promise.all([
            prisma.cybersecurityIncident.count(),
            prisma.cybersecurityIncident.groupBy({
                by: ['threatCategory'],
                _count: { id: true },
            }),
            prisma.cybersecurityIncident.groupBy({
                by: ['severityScore'],
                _count: { id: true },
            }),
            prisma.cybersecurityIncident.groupBy({
                by: ['riskLevelPrediction'],
                _count: {
                    id: true
                }
            })
        ]);

        const normalize = (arr, fieldName) => {
            return arr.reduce((acc, item) => {
                acc[item[fieldName]] = item._count.id;
                return acc;
            }, {});
        };

        console.log({
            totalThreats,
            threatCountsByCategory: normalize(threatCountsByCategory, 'threatCategory'),
            threatCountsBySeverity: normalize(threatCountsBySeverity, 'severityScore'),
            threatCountsByRiskLevel: normalize(threatCountsByRiskLevel, "predictedRiskLevel")
        })

        res.json({
            totalThreats,
            threatCountsByCategory: normalize(threatCountsByCategory, 'threatCategory'),
            threatCountsBySeverity: normalize(threatCountsBySeverity, 'severityScore'),
            threatCountsByRiskLevel: normalize(threatCountsByRiskLevel, "riskLevelPrediction")
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};