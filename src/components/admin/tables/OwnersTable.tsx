import { User } from "@prisma/client";
import DataTable, { TableColumn } from 'react-data-table-component'

type Owner = Pick<User, 'email' | 'userId'>

interface OwnersTableProps {
    owners: Owner[]
}

export function OwnersTable({ owners }: OwnersTableProps) {
    const columns: TableColumn<Owner>[] = [
        {
            name: 'ID',
            selector: row => row.userId,
        },
        {
            name: 'Correo electrónico',
            selector: row => row.email!
        }
    ]

    return <DataTable columns={columns} data={owners} />
}