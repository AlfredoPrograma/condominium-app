import { HeaderGroup, RowModel, flexRender } from "@tanstack/react-table";

interface TableProps<T> {
    headers: HeaderGroup<T>[]
    rowsModel: RowModel<T>
}

export function Table<T>({ headers, rowsModel }: TableProps<T>) {
    return (
        <div className="overflow-x-auto">
            <table className="table">
                <thead>
                    {headers.map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {rowsModel.rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}