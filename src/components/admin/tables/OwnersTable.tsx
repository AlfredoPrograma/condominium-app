import { User } from "@prisma/client";
import { useReactTable, createColumnHelper, getCoreRowModel, flexRender } from '@tanstack/react-table'
import { MdEdit as EditIcon, MdDelete as DeleteIcon } from 'react-icons/md'
import { toast } from "react-toastify";
import { api } from "~/utils/api";


interface ActionProps {
    handleDeleteOwner: () => void
}

function Actions({ handleDeleteOwner }: ActionProps) {
    return (
        <div className="flex gap-1">
            <button className="btn btn-ghost btn-square btn-sm">
                <EditIcon size={20} className="fill-sky-500" />
            </button>
            <button onClick={handleDeleteOwner} className="btn btn-ghost btn-square btn-sm">
                <DeleteIcon size={20} className="fill-red-500" />
            </button>
        </div>
    )
}


type Owner = Pick<User, 'email' | 'userId' | 'identifierCode' | 'firstName' | 'lastName' | 'phoneNumber'>

interface OwnersTableProps {
    owners: Owner[]
}

export function OwnersTable({ owners }: OwnersTableProps) {
    const trpcUtils = api.useContext()

    const { mutate: mutateDeleteOwner } = api.owners.delete.useMutation({
        onSuccess: () => {
            trpcUtils.invalidate(undefined, { queryKey: ['owners.getAll'] })
            toast('Propietario eliminado exitosamente', { type: 'success' })
        }
    })

    const columnHelper = createColumnHelper<Owner>()

    const columns = [
        columnHelper.accessor(row => row.userId, {
            id: 'userId'
        }),

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
            cell: ({ row }) => <Actions handleDeleteOwner={() => mutateDeleteOwner({ userId: row.original.userId })} />,
            header: "Acciones"
        })
    ]

    const { getHeaderGroups, getRowModel } = useReactTable({
        initialState: {
            columnVisibility: { userId: false }
        },
        columns,
        data: owners,
        getCoreRowModel: getCoreRowModel()
    })



    return (
        <div className="overflow-x-auto">
            <table className="table">
                <thead>
                    {getHeaderGroups().map((headerGroup) => (
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
                    {getRowModel().rows.map((row) => (
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