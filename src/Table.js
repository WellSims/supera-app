import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./Table.css";
import ReactPaginate from "react-paginate";

const Table = () => {
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState([]);
  const [transferenciaTotal, setTransferenciaTotal] = useState([]);
  const [transferenciaPeriodo, setTransferenciaPeriodo] = useState([]);
  const pageCount = Math.ceil(data.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentData = data.slice(offset, offset + itemsPerPage);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [operatorName, setOperatorName] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setTransferenciaPeriodo("");
    setCurrentPage(0);
    axios
      .get("http://localhost:8080/transferencia")
      .then((response) => {
        setData(response.data);
        let t = 0;
        for (var i = 0; i < response.data.length; i++) {
          if (
            response.data[i].tipo === "DEPOSITO" ||
            response.data[i].tipo === "TRANSFERENCIA"
          ) {
            t = t + response.data[i].valor;
          }

          if (response.data[i].tipo === "SAQUE") {
            t = t - response.data[i].valor * -1;
          }
        }
        setTransferenciaTotal(t.toFixed(2));
      })
      .catch((error) => {
        console.error("Erro ao realizar a requisição:", error);
      });
  };

  const handleSubmitted = useCallback(() => {
    setCurrentPage(0);
    axios
      .get("http://localhost:8080/transferencia/", {
        params: {
          dataInicio: startDate || null,
          dataFim: endDate || null,
          operador: operatorName || "",
        },
      })
      .then((response) => {
        setData(response.data);
        let t = 0;
        for (var i = 0; i < response.data.length; i++) {
          if (
            response.data[i].tipo === "DEPOSITO" ||
            response.data[i].tipo === "TRANSFERENCIA"
          ) {
            t = t + response.data[i].valor;
          }

          if (response.data[i].tipo === "SAQUE") {
            t = t - response.data[i].valor * -1;
          }
        }
        setTransferenciaPeriodo(t.toFixed(2));
      });
  }, [startDate, endDate, operatorName]);

  const handleClear = () => {
    setCurrentPage(0);
    fetchData();
    setStartDate("");
    setEndDate("");
    setOperatorName("");
  };

  return (
    <div className="table-container">
      <div className="input-container">
        <label htmlFor="start-date">Data de início:</label>
        <input
          type="datetime-local"
          id="start-date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label htmlFor="end-date">Data de fim:</label>
        <input
          type="datetime-local"
          id="end-date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label htmlFor="operator-name">Nome do operador transacionado:</label>
        <input
          type="text"
          id="operator-name"
          value={operatorName}
          onChange={(e) => setOperatorName(e.target.value)}
        />
      </div>
      <div className="search-container">
        <button className="button" onClick={handleSubmitted}>
          Pesquisar
        </button>
        <button className="button" onClick={handleClear}>
          Limpar
        </button>
      </div>
      <div>
        <div className="saldo-container">
          <h4>Saldo Total: R${transferenciaTotal}</h4>
        </div>
        <div className="saldo-container">
          <h4>
            Saldo no Período: R$
            {transferenciaPeriodo === ""
              ? transferenciaTotal
              : transferenciaPeriodo}
          </h4>
        </div>
        <table className="responsive-table">
          <thead style={{ backgroundColor: "orange" }}>
            <tr>
              <th>Dados</th>
              <th>Valencia</th>
              <th>Tipo</th>
              <th>Nome do operador transacionado</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr key={item.id}>
                <td>
                  {new Date(item.dataTransferencia).toLocaleString("pt-BR")}
                </td>
                <td>
                  R$ {parseFloat(item.valor).toFixed(2).replace(".", ",")}
                </td>
                <td>{item.tipo}</td>
                <td>{item.operador}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ReactPaginate
          previousLabel={"Anterior"}
          nextLabel={"Próxima"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={({ selected }) => setCurrentPage(selected)}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
        <footer style={{ textAlign: "center", marginTop: "20px" }}>
          <a href="http://localhost:8080/swagger-ui.html#/" target="blank">
            API Swagger Documentation
          </a>
        </footer>
      </div>
    </div>
  );
};

export default Table;
