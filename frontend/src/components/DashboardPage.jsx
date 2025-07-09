import { useState, useEffect } from "react";
import { getThreatsStats } from "../api/threatsData";
import styles from "./css/DashboardPage.module.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
const COLORS = ["#fcd34d", "#fbbf24", "#f59e0b", "#ea580c", "#c2410c"];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const CategoryListItems = [];

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await getThreatsStats();
        console.log(response);
        if (response) {
          setData(response);
        }
      } catch (error) {
        console.error("Failed to fetch threat stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div>Loading threat statistics...</div>;
  if (!data) return <div>Failed to load data.</div>;

  const categoryData = Object.entries(data.threatCountsByCategory).map(
    ([category, count]) => ({
      name: category,
      value: count,
    })
  );

  const severityData = Object.entries(data.threatCountsBySeverity).map(
    ([level, count]) => ({
      name: `Severity ${level}`,
      value: count,
    })
  );

  const riskLevelData = Object.entries(data.threatCountsByRiskLevel).map(
    ([level, count]) => ({
      name: `Predicted Risk: ${level}`,
      value: count,
    })
  );
  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Cyber Threat Intelligence Dashboard</h1>
        
      </div>
      <div className={styles.dashboard_grid}>
        <div className={styles.card}>
          <h2 className={styles.card_title}>Threats by Category</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.card}>
          <h2 className={styles.card_title}>Threats by Severity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={severityData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
              >
                {severityData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.card}>
          <h2 className={styles.card_title}>Threats by Predicted Risk</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskLevelData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
              >
                {severityData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              {/* <Legend /> */}
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
    </>
  );
};

export default Dashboard;
