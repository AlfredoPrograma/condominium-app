import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { useState } from "react";
import { MdDelete as DeleteIcon, MdEdit as EditIcon } from "react-icons/md"
import { toast } from "react-toastify";
import { Table } from "~/components/common/tables/Table";
import { type RouterOutputs, api } from "~/utils/api";
import { RegisterOwnerForm } from "../forms/RegisterOwnerForm";

interface ActionProps {
    handleEditOwner: () => void
    handleDeleteOwner: () => void
}

function Actions({ handleDeleteOwner, handleEditOwner }: ActionProps) {
    return (
        <div className="flex gap-1">
            <label htmlFor='UPDATE_OWNER' onClick={(e) => {
                handleEditOwner()
                e.currentTarget.click()
            }} className="btn btn-ghost btn-square btn-sm">
                <EditIcon size={20} className="fill-sky-500" />
            </label>
            <button onClick={handleDeleteOwner} className="btn btn-ghost btn-square btn-sm">
                <DeleteIcon size={20} className="fill-red-500" />
            </button>
        </div>
    )
}

type OwnersList = RouterOutputs["owners"]["getAll"]["owners"]
export type Owner = OwnersList[number]

interface OwnersTableProps {
    owners: OwnersList
}

export function OwnersTable({ owners }: OwnersTableProps) {
    const trpcUtils = api.useContext()
    const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null)


    console.log(selectedOwner)
    const { mutate: mutateDeleteOwner } = api.owners.delete.useMutation({
        onSuccess: () => {
            trpcUtils.invalidate(undefined, { queryKey: ["owners.getAll"] })
            toast("Propietario eliminado exitosamente", { type: "success" })
        }
    })

    const columnHelper = createColumnHelper<Owner>()

    const columns = [
        columnHelper.accessor(row => row.userId, {
            id: "userId"
        }),

        columnHelper.accessor(row => row.identifierCode, {
            id: "identifierCode",
            cell: info => info.getValue(),
            header: () => "Cédula de identidad",
        }),
        columnHelper.accessor(row => `${row.firstName} ${row.lastName}`, {
            id: "fullName",
            cell: info => info.getValue(),
            header: () => "Nombre completo",
        }),
        columnHelper.accessor(row => row.properties.map(p => p.code).join(","), {
            id: "code",
            cell: info => info.getValue(),
            header: () => "Código de propiedad(es)",
        }),
        columnHelper.accessor(row => row.email, {
            id: "email",
            cell: info => info.getValue(),
            header: () => "Correo electrónico"
        }),
        columnHelper.accessor(row => row.phoneNumber, {
            id: "phoneNumber",
            cell: info => info.getValue(),
            header: () => "Número telefónico"
        }),
        columnHelper.display({
            id: "actions",
            cell: ({ row }) => <Actions handleEditOwner={() => setSelectedOwner(row.original)} handleDeleteOwner={() => mutateDeleteOwner({ userId: row.original.userId })} />,
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
        <>
            <Table headers={getHeaderGroups()} rowsModel={getRowModel()} />
            <RegisterOwnerForm id='UPDATE_OWNER' owner={selectedOwner} onClose={() => setSelectedOwner(null)} />
        </>
    )
}