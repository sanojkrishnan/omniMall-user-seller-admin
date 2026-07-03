
function DataTable({
  title,
  columns = [],
  data = [],
  onRowClick,
  rowKey = "_id",
  className = "",
  tableClassName = "",
  striped = true,
  hover = true,
  footer,
}) {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className={`w-full border-collapse ${tableClassName}`}>
        {/* Title */}
        {title && (
          <thead>
            <tr>
              <th
                colSpan={columns.length}
                className="p-6 text-lg font-semibold border-b"
              >
                {title}
              </th>
            </tr>

            <tr className="bg-slate-100 border-b">
              {columns.map((column) => (
                <th
                  key={column.header}
                  className={`p-3 text-left ${column.headerClassName ?? ""}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
        )}

        {!title && (
          <thead>
            <tr className="bg-slate-100 border-b">
              {columns.map((column) => (
                <th
                  key={column.header}
                  className={`p-3 text-left ${column.headerClassName ?? ""}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
        )}

        <tbody>
          {data.map((row, index) => (
            <tr
              key={row[rowKey] ?? index}
              onClick={() => onRowClick?.(row)}
              className={`
                ${
                  striped
                    ? index % 2 === 0
                      ? "bg-slate-50"
                      : "bg-white"
                    : ""
                }
                ${hover ? "hover:bg-slate-200 cursor-pointer" : ""}
                border-y
              `}
            >
              {columns.map((column) => (
                <td
                  key={column.header}
                  className={`p-3 ${column.cellClassName ?? ""}`}
                >
                  {column.render
                    ? column.render(row, index)
                    : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {footer}
    </div>
  );
}

export default DataTable;