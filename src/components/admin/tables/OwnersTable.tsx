import { User } from "@prisma/client";
import { useReactTable, createColumnHelper, getCoreRowModel, flexRender } from '@tanstack/react-table'
import { MdEdit as EditIcon, MdDelete as DeleteIcon } from 'react-icons/md'

type Owner = Pick<User, 'email' | 'userId' | 'identifierCode' | 'firstName' | 'lastName' | 'phoneNumber'>

interface OwnersTableProps {
    owners: Owner[]
}

export function OwnersTable({ owners }: OwnersTableProps) {
    const columnHelper = createColumnHelper<Owner>()
    const columns = [
        columnHelper.accessor(row => row.identifierCode, {
            id: 'identifierCode',
            cell: info => info.getValue(),
            header: () => "Cédula de identidad",
        }),
        columnHelper.accessor(row => `${row.firstName} ${row.lastName}`, {
            id: 'fullName',
            cell: info => info.getValue(),
            header: () => "Nombre completo",
        }),
        columnHelper.accessor(row => row.email, {
            id: 'email',
            cell: info => info.getValue(),
            header: () => "Correo electrónico"
        }),
        columnHelper.accessor(row => row.phoneNumber, {
            id: 'phoneNumber',
            cell: info => info.getValue(),
            header: () => "Número telefónico"
        }),
        columnHelper.display({
            id: 'actions',
            cell: () => (
                <div className="flex gap-2">
                    <button className="btn btn-warning btn-square btn-sm">
                        <EditIcon size={20} />
                    </button>
                    <button className="btn btn-error btn-square btn-sm">
                        <DeleteIcon size={20} />
                    </button>
                </div>
            ),
            header: "Acciones"
        })
    ]

    const table = useReactTable({ columns, data: owners, getCoreRowModel: getCoreRowModel() })

    return (
        <div className="overflow-x-auto">
            <table className="table">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
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
                    {table.getRowModel().rows.map((row) => (
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