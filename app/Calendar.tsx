'use client';

import { SelectEvento } from '@/lib/db';
import {
  DayPilot,
  DayPilotCalendar,
  DayPilotNavigator
} from '@daypilot/daypilot-lite-react';
import { Button, Tab, Tabs } from '@nextui-org/react';
import { data } from 'autoprefixer';
import { useEffect, useState } from 'react';

export default function Calendar({ eventos }: { eventos: SelectEvento[] }) {
  const styles = {
    wrap: {
      display: 'flex'
    },
    left: {
      marginRight: '10px'
    },
    main: {
      flexGrow: '1'
    }
  };

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

  const editEvent = async (e: DayPilot.Event) => {
    const form = [
      { name: 'Título', id: 'text', type: 'text' },
      { name: 'Detalle', id: 'text', type: 'text' },
      { name: 'Color', id: 'backColor', type: 'select', options: colors }
    ];

    const modal = await DayPilot.Modal.form(form, e.data);
    if (modal.canceled) {
      return;
    }
    e.data.text = modal.result.text;
    // e.data.backColor = modal.result.backColor;
    calendar?.events.update(e);
  };

  const contextMenu = new DayPilot.Menu({
    items: [
      {
        text: 'Eliminar',
        onClick: async (args) => {
          calendar?.events.remove(args.source);
        }
      },
      {
        text: '-'
      },
      {
        text: 'Editar...',
        onClick: async (args) => {
          await editEvent(args.source);
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
    setEvents(mappedEvents);
  }, [eventos]);

  useEffect(() => {
    if (!calendar || calendar?.disposed()) {
      return;
    }
    calendar.update({ startDate: selectedDate, events, viewType: view });
  }, [calendar, view, selectedDate]);

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
    calendar?.events.add({
      start: args.start,
      end: args.end,
      id: DayPilot.guid(),
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
            color="primary"
            onPress={() => setSelectedDate(DayPilot.Date.today())}
          >
            Hoy
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
            <Tab key="Days" title="Días" />
            <Tab key="Week" title="Semana" />
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
