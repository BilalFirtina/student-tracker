declare module "react-calendar-heatmap" {
  import * as React from "react";

  export interface CalendarHeatmapValue {
    date: string | Date;
    count?: number;
  }

  export interface CalendarHeatmapProps {
    values: CalendarHeatmapValue[];
    startDate?: string | Date;
    endDate?: string | Date;
    classForValue?: (value: CalendarHeatmapValue) => string;
    tooltipDataAttrs?: (value: CalendarHeatmapValue) => object;
    showWeekdayLabels?: boolean;
    onClick?: (value: CalendarHeatmapValue) => void;
  }

  const CalendarHeatmap: React.FC<CalendarHeatmapProps>;
  export default CalendarHeatmap;
}
