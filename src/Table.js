import React, { useState } from 'react';
import './Table.css';
import ReactPaginate from 'react-paginate';
import axios from 'axios';

const Table = () => {
  const data = [
    // Aqui, você pode adicionar os dados da tabela
    // como um array de objetos
    { id: 1, nome: 'João', email: 'joao@example.com', telefone: '(00) 00000-0000' },
    { id: 2, nome: 'Maria', email: 'maria@example.com', telefone: '(11) 11111-1111' },
    { id: 3, nome: 'Carlos', email: 'carlos@example.com', telefone: '(22) 22222-2222' },
    // ... Adicione mais dados se necessário
  ];

  const itemsPerPage = 2; // Número de itens por página
  const [currentPage, setCurrentPage] = useState(0);
  const pageCount = Math.ceil(data.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentData = data.slice(offset, offset + itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="table-container">
      <table className="responsive-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item) => (
            <tr key={item.id}>
              <td>{item.nome}</td>
              <td>{item.email}</td>
              <td>{item.telefone}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ReactPaginate
        previousLabel={'Anterior'}
        nextLabel={'Próxima'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />
    </div>
  );
};

export default Table;
