import { MdGroupAdd as AddOwnerIcon, MdAttachMoney as MoneyIcon, MdCalendarMonth as CalendarIcon } from 'react-icons/md'
import { RegisterOwnerForm } from '~/components/admin/forms/RegisterOwnerForm';
import { Modal } from '~/components/common/modals/Modal';

import { QuickActionProps } from "~/components/common/navigation/QuickAction";

export const ADMIN_QUICK_ACTIONS: QuickActionProps[] = [
    {
        id: 'NEW_OWNER',
        title: 'Registrar nuevo propietario',
        description: 'Agrega un nuevo propietario a la base de datos del condominio.',
        icon: <AddOwnerIcon size={48} />,
        modal: <RegisterOwnerForm id='NEW_OWNER' title='Registrar nuevo propietario' owner={null} />,
        color: 'bg-emerald-600'
    },
    {
        id: 'NEW_MONTHLY_PAYMENT',
        title: 'Registrar mensualidad',
        description: 'Agrega un nuevo pago de mensualidad proveniente de un propietario.',
        icon: <MoneyIcon size={48} />,
        modal: <Modal id='NEW_MONTHLY_PAYMENT' />,
        color: 'bg-orange-400'
    },
    {
        id: 'NEW_COMMON_AREA_RESERVATION',
        title: 'Reservar áreas comunes',
        description: 'Permite a los propietarios realizar reservaciones de áreas comunes.',
        icon: <CalendarIcon size={48} />,
        modal: <Modal id='NEW_COMMON_AREA_RESERVATION' />,
        color: 'bg-blue-400'
    }
]