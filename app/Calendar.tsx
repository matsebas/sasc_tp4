'use client';

import { ModifiedEvento, SelectEvento } from '@/lib/db';
import {
  DayPilot,
  DayPilotCalendar,
  DayPilotNavigator
} from '@daypilot/daypilot-lite-react';
import { Button, Tab, Tabs } from '@nextui-org/react';
import { data } from 'autoprefixer';
import { useEffect, useState } from 'react';
import { deleteEvento, editEvento, saveEvento } from './actions';

export default function Calendar({ eventos }: { eventos: SelectEvento[] }) {
  const colors = [
    { name: 'Verde', id: '#6aa84f95' },
    { name: 'Azul', id: '#3d85c695' },
    { name: 'Turquesa', id: '#00aba995' },
    { name: 'Celeste', id: '#56c5ff95' },
    { name: 'Amarillo', id: '#f1c23295' },
    { name: 'Anaranjado', id: '#e6913895' },
    { name: 'Naranja', id: '#cc412595' },
    { name: 'Rojo', id: '#ff000095' },
    { name: 'Violeta', id: '#af8ee595' }
  ];
  const [calendar, setCalendar] = useState<DayPilot.Calendar>();

  const [selectedDate, setSelectedDate] = useState(DayPilot.Date.today());

  const [events, setEvents] = useState<DayPilot.EventData[]>([]);

  const [view, setView] = useState<
    'Week' | 'Day' | 'Days' | 'WorkWeek' | 'Resources' | undefined
  >('Week');

  const handleDeleteEvent = async (args: DayPilot.MenuItemClickArgs) => {
    const evento = args.source.data;
    try {
      await deleteEvento(evento.id);
      // Report.success('Pedido confirmado', '', 'Aceptar');
      console.log('handleDeleteEvent', args);
    } catch (error: any) {
      // Report.failure('Error al eliminar evento', error.message, 'Aceptar');
      console.error('handleDeleteEvent', args);
    }
  };

  // const handleEditEvent = async (args: DayPilot.MenuItemClickArgs) => {
  //   const evento = args.source.data;
  //   try {
  //     await editEvento(evento);
  //     // Report.success('Pedido confirmado', '', 'Aceptar');
  //     console.log('handleEditEvent', args);
  //   } catch (error: any) {
  //     // Report.failure('Error al eliminar evento', error.message, 'Aceptar');
  //     console.error('handleEditEvent', args);
  //   }
  // };

  const editEvent = async (e: DayPilot.Event) => {
    const form = [
      { name: 'Título', id: 'text', type: 'text' },
      { name: 'Detalle', id: 'description', type: 'text' },
      { name: 'Color', id: 'backColor', type: 'select', options: colors }
    ];

    const modal = await DayPilot.Modal.form(form, e.data);
    if (modal.canceled) {
      return;
    }

    e.data.text = modal.result.text;
    e.data.description = modal.result.description;
    e.data.backColor = modal.result.backColor;

    const evento: ModifiedEvento = {
      id: e.data.id,
      start: e.data.start.toDate().toJSON(),
      end: e.data.end.toDate().toJSON(),
      text: e.data.text,
      backColor: e.data.backColor
    };
    console.log('editEvent', evento);
    editEvento(evento);
    calendar?.events.update(e);
  };

  const contextMenu = new DayPilot.Menu({
    items: [
      {
        text: 'Eliminar',
        onClick: handleDeleteEvent
      },
      {
        text: '-'
      },
      {
        text: 'Editar...',
        onClick: async (args) => {
          editEvent(args.source);
        }
      }
    ]
  });

  const onBeforeEventRender = (
    args: DayPilot.CalendarBeforeEventRenderArgs
  ) => {
    console.log('onBeforeEventRender', args);
    args.data.areas = [
      {
        top: 5,
        right: 5,
        width: 20,
        height: 20,
        symbol: 'icons/daypilot.svg#hamburger-menu',
        fontColor: '#fff',
        backColor: '#00000033',
        style: 'border-radius: 25%; cursor: pointer;',
        toolTip: 'Show context menu',
        action: 'ContextMenu'
      }
    ];
  };

  const config: DayPilot.CalendarConfig = {
    viewType: view,
    durationBarVisible: false,
    locale: 'es-ES'
  };

  useEffect(() => {
    if (!eventos) {
      return;
    }
    const mappedEvents = eventos.map((e) => {
      return {
        id: e.id,
        start: e.start,
        end: e.end,
        text: e.text,
        backColor: e.backColor,
        borderColor: e.borderColor,
        data
      } as DayPilot.EventData;
    });
    console.log('mappedEvents', mappedEvents);
    setEvents(mappedEvents);
  }, [eventos]);

  useEffect(() => {
    if (!calendar || calendar?.disposed()) {
      return;
    }
    calendar.update({ startDate: selectedDate, events, viewType: view });
  }, [calendar, view, selectedDate, events]);

  const onTimeRangeSelected = async (
    args: DayPilot.CalendarTimeRangeSelectedArgs
  ) => {
    const modal = await DayPilot.Modal.prompt(
      'Crear Nuevo Evento:',
      'Evento #'
    );
    calendar?.clearSelection();
    if (modal.canceled) {
      return;
    }
    // console.log("modal.result", modal.result, calendar);
    const newEvent = {
      start: args.start,
      end: args.end,
      id: DayPilot.guid(),
      text: modal.result
    };
    calendar?.events.add(newEvent);
    saveEvento({
      id: newEvent.id,
      start: args.start.toDate().toJSON(),
      end: args.end.toDate().toJSON(),
      text: modal.result
    });
  };

  return (
    <div className="flex flex-row  gap-4">
      <div className="flex-1">
        <DayPilotNavigator
          selectMode="Day"
          showMonths={3}
          selectionDay={selectedDate}
          onTimeRangeSelected={(args) => {
            setSelectedDate(args.day);
          }}
          events={events}
        />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4 items-center">
          <Button
            radius="full"
            size="md"
            variant='flat'
            color="warning"
            onPress={() => setSelectedDate(DayPilot.Date.today())}
          >
            Ir a Hoy
          </Button>
          <Tabs
            className="flex-0"
            color="secondary"
            radius="full"
            size="lg"
            aria-label="Calendar views"
            onSelectionChange={(e) => setView(e.valueOf() as 'Days' | 'Week')}
            selectedKey={view}
          >
            <Tab key="Days" title="Visa diaria" />
            <Tab key="Week" title="Vista semanal" />
          </Tabs>
        </div>
        <div className="flex-grow">
          <DayPilotCalendar
            {...config}
            onTimeRangeSelected={onTimeRangeSelected}
            onEventClick={async (args) => {
              await editEvent(args.e);
            }}
            contextMenu={contextMenu}
            onBeforeEventRender={onBeforeEventRender}
            controlRef={setCalendar}
          />
        </div>
      </div>
    </div>
  );
}
