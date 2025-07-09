import { useState, useEffect } from "react";
import { getThreatsData, getThreatsStats } from "../api/threatsData";
import styles from "./css/ThreatInstancesTable.module.css";
import { FaForward, FaBackward } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";


const SearchBar = ({
  setSearch,
  searchInput,
  setSearchInput,
  category,
  setCategory,
}) => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  let categories = [];

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await getThreatsStats();
        if (response) {
          setStats(response);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (stats !== null) {
    categories = Object.keys(stats?.threatCountsByCategory || {});
  }

  return (
    <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        placeholder="search..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setSearch(searchInput);
          }
        }}
      />
      <label>
        category{" "}
        <select
          name="category"
          id="category-select"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
          }}
        >
          <option value="">--Choose an option--</option>
          {categories.map((category, index) => {
            return (
              <option key={index} value={category}>
                {category}
              </option>
            );
          })}
        </select>
      </label>
    </form>
  );
};

const PaginationBar = ({ limit, setLimit, page, setPage }) => {
  return (
    <div className={styles.paginationBar}>
      <label>
        Limit {""}
        <input
          type="number"
          min={10}
          max={100}
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        />
      </label>
      <button onClick={() => setPage(Math.max(1, page - 1))}>
        <FaBackward />
      </button>
      <button onClick={() => setPage(page + 1)}>
        <FaForward />
      </button>
    </div>
  );
};

export const ThreatInstancesTable = () => {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRow, setexpandedRow] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  let headerData = [];

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getThreatsData(page, limit, category, search);
        if (response) {
          setData(response);
        }
        console.log(response);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [page, limit, category, search]);

  useEffect(() => {
    setPage(1);
  }, [category, search, limit]);

  useEffect(() => {
    setexpandedRow(null);
  }, [category, search, limit, page]);

  if (isLoading) return <div>Loading...</div>;

  if (data && data.length > 0) {
    headerData = Object.keys(data[0]);
  }

  const TableHeader = (headerData) => {
    if (headerData.length > 0) {
      return headerData.map((header, index) => (
        <th key={index} className={styles.table_header}>
          {header}
        </th>
      ));
    }
  };

  function toggleexpandedRow(index) {
    if (expandedRow === index) {
      setexpandedRow(null);
    } else {
      setexpandedRow(index);
    }
  }

  const TableRow = ({ threat, index }) => {
    let isExpanded = expandedRow === index;

    return (
      <>
        <tr className={styles.table_row}>
          {Object.entries(threat).map(([key, value]) => (
            <td
              className={styles.table_cell}
              key={key}
              onClick={() => toggleexpandedRow(index)}
            >
              {value}
            </td>
          ))}
        </tr>
        {isExpanded && (
          <tr>
            <td colSpan={headerData.length + 1} className={styles.expanded_row}>
              {Object.entries(threat).map(([key, value]) => {
                return (
                  <div key={key}>
                    <strong>{key}:</strong>
                    {value}
                  </div>
                );
              })}
            </td>
          </tr>
        )}
      </>
    );
  };

  return (
    <>
      <h2 className={styles.sub_heading}>Threat Instances</h2>
      <SearchBar
        setSearch={setSearch}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        category={category}
        setCategory={setCategory}
        setPage={setPage}
      />
      <div>
        <table className={styles.threats_table}>
          <thead>
            <tr>{TableHeader(headerData)}</tr>
          </thead>
          <tbody>
            {data &&
              data.map((threat, index) => (
                <TableRow key={index} threat={threat} index={index} />
              ))}
          </tbody>
        </table>
      </div>
      <PaginationBar
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
      />
      <button
          onClick={async () => {
            await logout();
            navigate("/sign-in");
          }}
          className={styles.logout_button}
        >
          Logout
        </button>
    </>
  );
};

export default ThreatInstancesTable;
