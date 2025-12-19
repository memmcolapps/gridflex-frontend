import * as React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { differenceInCalendarDays } from "date-fns";
import { ChevronLeft, ChevronRight, X, Clock, CalendarIcon } from "lucide-react";
import {
  DayPicker,
  labelNext,
  labelPrevious,
  useDayPicker,
  type DayPickerProps,
} from "react-day-picker";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  setHours,
  setMinutes,
  setSeconds,
} from "date-fns";

interface SimplifiedCalendarProps {
  selected?: Date;
  timeValue?: string;
  onSelect?: (date: Date | undefined) => void;
  onTimeChange?: (time: string) => void;
  onClose?: () => void;
  className?: string;
  showSeconds?: boolean;
}

export type CalendarProps = DayPickerProps & {
  /**
   * In the year view, the number of years to display at once.
   * @default 12
   */
  yearRange?: number;

  /**
   * Wether to show the year switcher in the caption.
   * @default true
   */
  showYearSwitcher?: boolean;

  monthsClassName?: string;
  monthCaptionClassName?: string;
  weekdaysClassName?: string;
  weekdayClassName?: string;
  monthClassName?: string;
  captionClassName?: string;
  captionLabelClassName?: string;
  buttonNextClassName?: string;
  buttonPreviousClassName?: string;
  navClassName?: string;
  monthGridClassName?: string;
  weekClassName?: string;
  dayClassName?: string;
  dayButtonClassName?: string;
  rangeStartClassName?: string;
  rangeEndClassName?: string;
  selectedClassName?: string;
  todayClassName?: string;
  outsideClassName?: string;
  disabledClassName?: string;
  rangeMiddleClassName?: string;
  hiddenClassName?: string;
};

type NavView = "days" | "years";

/**
 * A custom calendar component built on top of react-day-picker.
 * @param props The props for the calendar.
 * @default yearRange 12
 * @returns
 */
function Calendar({
  className,
  showOutsideDays = true,
  showYearSwitcher = true,
  yearRange = 12,
  numberOfMonths,
  components,
  ...props
}: CalendarProps) {
  const [navView, setNavView] = React.useState<NavView>("days");
  const [displayYears, setDisplayYears] = React.useState<{
    from: number;
    to: number;
  }>(
    React.useMemo(() => {
      const currentYear = new Date().getFullYear();
      return {
        from: currentYear - Math.floor(yearRange / 2 - 1),
        to: currentYear + Math.ceil(yearRange / 2),
      };
    }, [yearRange]),
  );

  const { onNextClick, onPrevClick, startMonth, endMonth } = props;

  const columnsDisplayed = navView === "years" ? 1 : numberOfMonths;

  const _monthsClassName = cn("relative flex", props.monthsClassName);
  const _monthCaptionClassName = cn(
    "relative mx-10 flex h-7 items-center justify-center",
    props.monthCaptionClassName,
  );
  const _weekdaysClassName = cn("flex flex-row", props.weekdaysClassName);
  const _weekdayClassName = cn(
    "w-8 text-sm font-normal text-muted-foreground",
    props.weekdayClassName,
  );
  const _monthClassName = cn("w-full", props.monthClassName);
  const _captionClassName = cn(
    "relative flex items-center justify-center pt-1",
    props.captionClassName,
  );
  const _captionLabelClassName = cn(
    "truncate text-sm font-medium",
    props.captionLabelClassName,
  );
  const buttonNavClassName = buttonVariants({
    variant: "outline",
    className:
      "absolute h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
  });
  const _buttonNextClassName = cn(
    buttonNavClassName,
    "right-0",
    props.buttonNextClassName,
  );
  const _buttonPreviousClassName = cn(
    buttonNavClassName,
    "left-0",
    props.buttonPreviousClassName,
  );
  const _navClassName = cn("flex items-start", props.navClassName);
  const _monthGridClassName = cn("mx-auto mt-4", props.monthGridClassName);
  const _weekClassName = cn("mt-2 flex w-max items-start", props.weekClassName);
  const _dayClassName = cn(
    "flex size-8 flex-1 items-center justify-center p-0 text-sm",
    props.dayClassName,
  );
  const _dayButtonClassName = cn(
    buttonVariants({ variant: "ghost" }),
    "size-8 rounded-md p-0 font-normal transition-none aria-selected:opacity-100",
    props.dayButtonClassName,
  );
  const buttonRangeClassName =
    "bg-accent [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground";
  const _rangeStartClassName = cn(
    buttonRangeClassName,
    "day-range-start rounded-s-md",
    props.rangeStartClassName,
  );
  const _rangeEndClassName = cn(
    buttonRangeClassName,
    "day-range-end rounded-e-md",
    props.rangeEndClassName,
  );
  const _rangeMiddleClassName = cn(
    "bg-accent !text-foreground [&>button]:bg-transparent [&>button]:!text-foreground [&>button]:hover:bg-transparent [&>button]:hover:!text-foreground",
    props.rangeMiddleClassName,
  );
  const _selectedClassName = cn(
    "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground",
    props.selectedClassName,
  );
  const _todayClassName = cn(
    "[&>button]:bg-accent [&>button]:text-accent-foreground",
    props.todayClassName,
  );
  const _outsideClassName = cn(
    "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
    props.outsideClassName,
  );
  const _disabledClassName = cn(
    "text-muted-foreground opacity-50",
    props.disabledClassName,
  );
  const _hiddenClassName = cn("invisible flex-1", props.hiddenClassName);

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      style={{
        width: 248.8 * (columnsDisplayed ?? 1) + "px",
      }}
      classNames={{
        months: _monthsClassName,
        month_caption: _monthCaptionClassName,
        weekdays: _weekdaysClassName,
        weekday: _weekdayClassName,
        month: _monthClassName,
        caption: _captionClassName,
        caption_label: _captionLabelClassName,
        button_next: _buttonNextClassName,
        button_previous: _buttonPreviousClassName,
        nav: _navClassName,
        month_grid: _monthGridClassName,
        week: _weekClassName,
        day: _dayClassName,
        day_button: _dayButtonClassName,
        range_start: _rangeStartClassName,
        range_middle: _rangeMiddleClassName,
        range_end: _rangeEndClassName,
        selected: _selectedClassName,
        today: _todayClassName,
        outside: _outsideClassName,
        disabled: _disabledClassName,
        hidden: _hiddenClassName,
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
          return <Icon className="h-3 w-3" />;
        },
        Nav: ({ className }) => (
          <Nav
            className={className}
            displayYears={displayYears}
            navView={navView}
            setDisplayYears={setDisplayYears}
            startMonth={startMonth}
            endMonth={endMonth}
            onPrevClick={onPrevClick}
            onNextClick={onNextClick}
          />
        ),
        CaptionLabel: (props) => (
          <CaptionLabel
            showYearSwitcher={showYearSwitcher}
            navView={navView}
            setNavView={setNavView}
            displayYears={displayYears}
            {...props}
          />
        ),
        MonthGrid: ({ className, children, ...props }) => (
          <MonthGrid
            className={className}
            displayYears={displayYears}
            startMonth={startMonth}
            endMonth={endMonth}
            navView={navView}
            setNavView={setNavView}
            {...props}
          >
            {children}
          </MonthGrid>
        ),
        ...components,
      }}
      numberOfMonths={columnsDisplayed}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

function Nav({
  className,
  navView,
  startMonth,
  endMonth,
  displayYears,
  setDisplayYears,
  onPrevClick,
  onNextClick,
}: {
  className?: string;
  navView: NavView;
  startMonth?: Date;
  endMonth?: Date;
  displayYears: { from: number; to: number };
  setDisplayYears: React.Dispatch<
    React.SetStateAction<{ from: number; to: number }>
  >;
  onPrevClick?: (date: Date) => void;
  onNextClick?: (date: Date) => void;
}) {
  const { nextMonth, previousMonth, goToMonth } = useDayPicker();

  const isPreviousDisabled = (() => {
    if (navView === "years") {
      return (
        (startMonth &&
          differenceInCalendarDays(
            new Date(displayYears.from - 1, 0, 1),
            startMonth,
          ) < 0) ??
        (endMonth &&
          differenceInCalendarDays(
            new Date(displayYears.from - 1, 0, 1),
            endMonth,
          ) > 0)
      );
    }
    return !previousMonth;
  })();

  const isNextDisabled = (() => {
    if (navView === "years") {
      return (
        (startMonth &&
          differenceInCalendarDays(
            new Date(displayYears.to + 1, 0, 1),
            startMonth,
          ) < 0) ??
        (endMonth &&
          differenceInCalendarDays(
            new Date(displayYears.to + 1, 0, 1),
            endMonth,
          ) > 0)
      );
    }
    return !nextMonth;
  })();

  const handlePreviousClick = React.useCallback(() => {
    if (!previousMonth) return;
    if (navView === "years") {
      setDisplayYears((prev) => ({
        from: prev.from - (prev.to - prev.from + 1),
        to: prev.to - (prev.to - prev.from + 1),
      }));
      onPrevClick?.(
        new Date(
          displayYears.from - (displayYears.to - displayYears.from),
          0,
          1,
        ),
      );
      return;
    }
    goToMonth(previousMonth);
    onPrevClick?.(previousMonth);
  }, [
    previousMonth,
    goToMonth,
    displayYears.from,
    displayYears.to,
    navView,
    onPrevClick,
    setDisplayYears,
  ]);

  const handleNextClick = React.useCallback(() => {
    if (!nextMonth) return;
    if (navView === "years") {
      setDisplayYears((prev) => ({
        from: prev.from + (prev.to - prev.from + 1),
        to: prev.to + (prev.to - prev.from + 1),
      }));
      onNextClick?.(
        new Date(
          displayYears.from + (displayYears.to - displayYears.from),
          0,
          1,
        ),
      );
      return;
    }
    goToMonth(nextMonth);
    onNextClick?.(nextMonth);
  }, [
    goToMonth,
    nextMonth,
    displayYears.from,
    displayYears.to,
    navView,
    onNextClick,
    setDisplayYears,
  ]);
  return (
    <nav className={cn("flex items-center", className)}>
      <Button
        variant="outline"
        className="absolute left-0 h-7 w-7 bg-transparent p-0 opacity-80 hover:opacity-100"
        type="button"
        tabIndex={isPreviousDisabled ? undefined : -1}
        disabled={isPreviousDisabled}
        aria-label={
          navView === "years"
            ? `Go to the previous ${
                displayYears.to - displayYears.from + 1
              } years`
            : labelPrevious(previousMonth)
        }
        onClick={handlePreviousClick}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        className="absolute right-0 h-7 w-7 bg-transparent p-0 opacity-80 hover:opacity-100"
        type="button"
        tabIndex={isNextDisabled ? undefined : -1}
        disabled={isNextDisabled}
        aria-label={
          navView === "years"
            ? `Go to the next ${displayYears.to - displayYears.from + 1} years`
            : labelNext(nextMonth)
        }
        onClick={handleNextClick}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}

function CaptionLabel({
  children,
  showYearSwitcher,
  navView,
  setNavView,
  displayYears,
  ...props
}: {
  showYearSwitcher?: boolean;
  navView: NavView;
  setNavView: React.Dispatch<React.SetStateAction<NavView>>;
  displayYears: { from: number; to: number };
} & React.HTMLAttributes<HTMLSpanElement>) {
  if (!showYearSwitcher) return <span {...props}>{children}</span>;
  return (
    <Button
      className="h-7 w-full truncate text-sm font-medium"
      variant="ghost"
      size="sm"
      onClick={() => setNavView((prev) => (prev === "days" ? "years" : "days"))}
    >
      {navView === "days"
        ? children
        : displayYears.from + " - " + displayYears.to}
    </Button>
  );
}

function MonthGrid({
  className,
  children,
  displayYears,
  startMonth,
  endMonth,
  navView,
  setNavView,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
  displayYears: { from: number; to: number };
  startMonth?: Date;
  endMonth?: Date;
  navView: NavView;
  setNavView: React.Dispatch<React.SetStateAction<NavView>>;
} & React.TableHTMLAttributes<HTMLTableElement>) {
  if (navView === "years") {
    return (
      <YearGrid
        displayYears={displayYears}
        startMonth={startMonth}
        endMonth={endMonth}
        setNavView={setNavView}
        navView={navView}
        className={className}
        {...props}
      />
    );
  }
  return (
    <table className={className} {...props}>
      {children}
    </table>
  );
}

function YearGrid({
  className,
  displayYears,
  startMonth,
  endMonth,
  setNavView,
  navView,
  ...props
}: {
  className?: string;
  displayYears: { from: number; to: number };
  startMonth?: Date;
  endMonth?: Date;
  setNavView: React.Dispatch<React.SetStateAction<NavView>>;
  navView: NavView;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { goToMonth, selected } = useDayPicker();

  return (
    <div className={cn("grid grid-cols-4 gap-y-2", className)} {...props}>
      {Array.from(
        { length: displayYears.to - displayYears.from + 1 },
        (_, i) => {
          const isBefore =
            differenceInCalendarDays(
              new Date(displayYears.from + i, 11, 31),
              startMonth!,
            ) < 0;

          const isAfter =
            differenceInCalendarDays(
              new Date(displayYears.from + i, 0, 0),
              endMonth!,
            ) > 0;

          const isDisabled = isBefore || isAfter;
          return (
            <Button
              key={i}
              className={cn(
                "text-foreground h-7 w-full text-sm font-normal",
                displayYears.from + i === new Date().getFullYear() &&
                  "bg-accent text-accent-foreground font-medium",
              )}
              variant="ghost"
              onClick={() => {
                setNavView("days");
                goToMonth(
                  new Date(
                    displayYears.from + i,
                    (selected as Date | undefined)?.getMonth() ?? 0,
                  ),
                );
              }}
              disabled={navView === "years" ? isDisabled : undefined}
            >
              {displayYears.from + i}
            </Button>
          );
        },
      )}
    </div>
  );
}

export { Calendar };

export function SimplifiedCalendar({
  selected,
  timeValue: externalTimeValue,
  onSelect,
  onTimeChange,
  onClose,
  className,
  showSeconds = false,
}: SimplifiedCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(
    selected ?? new Date(),
  );

  // Use external time value or default
  const timeValue = externalTimeValue ?? (showSeconds ? "00:00:00" : "00:00");

  const [dateValue, setDateValue] = React.useState(
    selected
      ? format(selected, "dd/MM/yyyy")
      : format(new Date(), "dd/MM/yyyy"),
  );

  // Update internal state when selected prop changes
  React.useEffect(() => {
    if (selected) {
      setCurrentMonth(selected);
      setDateValue(format(selected, "dd/MM/yyyy"));
    }
  }, [selected]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;

  // Create calendar grid
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      days.push(
        <button
          key={day.toString()}
          className={cn(
            "h-10 w-10 rounded-lg font-medium transition-all hover:bg-gray-50 hover:shadow-sm",
            !isSameMonth(day, monthStart) && "text-gray-300",
            isSameDay(day, selected ?? new Date()) &&
              "bg-blue-600 text-white hover:bg-blue-700 shadow-md",
            isSameDay(day, new Date()) &&
              !isSameDay(day, selected ?? new Date()) &&
              "bg-blue-50 text-blue-600",
          )}
          onClick={() => handleDayClick(cloneDay)}
          type="button"
        >
          <span className="text-sm">{format(day, dateFormat)}</span>
        </button>,
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="flex w-full justify-between" key={day.toString()}>
        {days}
      </div>,
    );
    days = [];
  }

  const handleDayClick = (day: Date) => {
    // Parse time and apply to selected date
    const timeParts = timeValue.split(":");
    const hoursStr = timeParts[0];
    const minutesStr = timeParts[1];
    const secondsStr = showSeconds ? (timeParts[2] || "0") : "0";

    let newDate = new Date(day);
    if (hoursStr && minutesStr) {
      const hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10);
      const seconds = parseInt(secondsStr, 10);

      if (!isNaN(hours) && !isNaN(minutes) && !isNaN(seconds)) {
        newDate = setHours(setMinutes(setSeconds(day, seconds), minutes), hours);
      }
    }

    setDateValue(format(day, "dd/MM/yyyy"));
    onSelect?.(newDate);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    onTimeChange?.(time);

    // Apply time to the currently selected date or current date
    const baseDate = selected ?? new Date();
    const timeParts = time.split(":");
    const hoursStr = timeParts[0];
    const minutesStr = timeParts[1];
    const secondsStr = showSeconds ? (timeParts[2] || "0") : "0";

    if (hoursStr && minutesStr) {
      const hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10);
      const seconds = parseInt(secondsStr, 10);

      if (!isNaN(hours) && !isNaN(minutes) && !isNaN(seconds)) {
        const newDate = setHours(setMinutes(setSeconds(baseDate, seconds), minutes), hours);
        onSelect?.(newDate);
      }
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDateValue = e.target.value;
    const oldDateValue = dateValue;

    // Allow the user to delete characters without triggering auto-formatting
    if (newDateValue.length < oldDateValue.length) {
      setDateValue(newDateValue);
      return;
    }

    let dateStr = newDateValue.replace(/[^\d/]/g, "");

    // Add slashes automatically after two digits for day and month
    if (dateStr.length === 2 && !dateStr.includes("/")) {
      dateStr = dateStr + "/";
    } else if (dateStr.length === 5 && dateStr.split("/").length === 2) {
      dateStr = dateStr + "/";
    }

    // Limit to DD/MM/YYYY format
    if (dateStr.length > 10) {
      dateStr = dateStr.substring(0, 10);
    }

    setDateValue(dateStr);

    // Only process valid date format (DD/MM/YYYY)
    if (dateStr.length === 10) {
      const dateParts = dateStr.split("/");
      if (dateParts.length === 3) {
        const dayStr = dateParts[0];
        const monthStr = dateParts[1];
        const yearStr = dateParts[2];

        if (dayStr && monthStr && yearStr) {
          const day = parseInt(dayStr, 10);
          const month = parseInt(monthStr, 10) - 1; // Month is 0-indexed
          const year = parseInt(yearStr, 10);

          if (
            !isNaN(day) &&
            !isNaN(month) &&
            !isNaN(year) &&
            day >= 1 &&
            day <= 31 &&
            month >= 0 &&
            month <= 11 &&
            year >= 1900
          ) {
            const newDate = new Date(year, month, day);

            // Check if the date is valid
            if (
              newDate.getDate() === day &&
              newDate.getMonth() === month &&
              newDate.getFullYear() === year
            ) {
              setCurrentMonth(newDate);

              // Apply current time
              const timeParts = timeValue.split(":");
              const hoursStr = timeParts[0];
              const minutesStr = timeParts[1];
              const secondsStr = showSeconds ? (timeParts[2] || "0") : "0";

              if (hoursStr && minutesStr) {
                const hours = parseInt(hoursStr, 10);
                const minutes = parseInt(minutesStr, 10);
                const seconds = parseInt(secondsStr, 10);

                if (!isNaN(hours) && !isNaN(minutes) && !isNaN(seconds)) {
                  const finalDate = setHours(
                    setMinutes(setSeconds(newDate, seconds), minutes),
                    hours,
                  );
                  onSelect?.(finalDate);
                } else {
                  onSelect?.(newDate);
                }
              } else {
                onSelect?.(newDate);
              }
            }
          }
        }
      }
    }
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDone = () => {
    // Apply the final time to the selected date before closing
    if (selected && timeValue) {
      const timeParts = timeValue.split(":");
      const hoursStr = timeParts[0];
      const minutesStr = timeParts[1];
      const secondsStr = showSeconds ? (timeParts[2] || "0") : "0";

      if (hoursStr && minutesStr) {
        const hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);
        const seconds = parseInt(secondsStr, 10);

        if (!isNaN(hours) && !isNaN(minutes) && !isNaN(seconds)) {
          const finalDate = setHours(setMinutes(setSeconds(selected, seconds), minutes), hours);
          onSelect?.(finalDate);
        }
      }
    }
    onClose?.();
  };

  return (
    <div
      className={cn(
        "w-[320px] rounded-lg bg-white p-4 shadow-lg border border-gray-200",
        className,
      )}
    >
      {/* Header with close button */}
      <div className="mb-3 flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-6 w-6 p-0 hover:bg-gray-100"
        >
          <X size={14} />
        </Button>
      </div>

      {/* Date and Time inputs */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
            <div className="relative">
              <CalendarIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                value={dateValue}
                onChange={handleDateChange}
                placeholder="DD/MM/YYYY"
                maxLength={10}
                className="h-10 w-full rounded-lg border-gray-200 bg-white pl-10 pr-3 py-2 text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">Time</label>
            <div className="relative">
              <Clock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="time"
                step={showSeconds ? "1" : "60"}
                value={timeValue}
                onChange={handleTimeChange}
                className="h-10 w-full rounded-lg border-gray-200 bg-white pl-10 pr-3 py-2 text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Month navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePreviousMonth}
          className="h-9 w-9 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={18} className="text-gray-600" />
        </Button>

        <h2 className="text-lg font-semibold text-gray-800">
          {format(currentMonth, "MMMM yyyy")}
        </h2>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextMonth}
          className="h-9 w-9 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronRight size={18} className="text-gray-600" />
        </Button>
      </div>

      {/* Weekday headers */}
      <div className="mb-4 flex justify-between">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
          <div
            key={day}
            className="w-10 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="mb-6 space-y-2">{rows}</div>

      {/* Done button */}
      <Button
        onClick={handleDone}
        className="w-full bg-blue-600 text-white hover:bg-blue-700"
      >
        Done
      </Button>
    </div>
  );
}
