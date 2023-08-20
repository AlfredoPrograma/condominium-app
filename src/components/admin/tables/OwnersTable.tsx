import { User } from "@prisma/client";
import DataTable, { TableColumn } from 'react-data-table-component'

type Owner = Pick<User, 'email' | 'id'>

interface OwnersTableProps {
    owners: Owner[]
}

export function OwnersTable({ owners }: OwnersTableProps) {
    const columns: TableColumn<Owner>[] = [
        {
            name: 'ID',
            selector: row => row.id,
        },
        {
            name: 'Correo electrónico',
            selector: row => row.email!
        }
    ]

    return <DataTable columns={columns} data={owners} />
}