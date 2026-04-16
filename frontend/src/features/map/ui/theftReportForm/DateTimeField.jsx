import DatePicker, { registerLocale } from 'react-datepicker';
import { CalendarDays, Clock3 } from 'lucide-react';
import { fi } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import InfoLabel from './InfoLabel.jsx';
import { FORM_TOOLTIPS } from './formOptions.js';

registerLocale('fi', fi);

const TIME_OPTIONS = Array.from({ length: 24 * 4 }, (_, index) => {
  const hours = String(Math.floor(index / 4)).padStart(2, '0');
  const minutes = String((index % 4) * 15).padStart(2, '0');
  return `${hours}:${minutes}`;
});

function getTimeValue(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return '12:00';
  }

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function updateTime(date, timeValue) {
  const [hours, minutes] = timeValue.split(':').map(Number);
  const nextDate = date instanceof Date && !Number.isNaN(date.getTime())
    ? new Date(date)
    : new Date();

  nextDate.setHours(hours, minutes, 0, 0);
  return nextDate;
}

export default function DateTimeField({ value, onChange }) {
  const selectedDate =
    value instanceof Date && !Number.isNaN(value.getTime()) ? value : new Date();

  return (
    <div className="report-field">
      <span className="report-field__label">
        <InfoLabel
          label="Tapahtuma-aika"
          tooltipId="tooltip-theft-time"
          tooltipText={FORM_TOOLTIPS.theftTime}
        />
      </span>

      <div className="report-date-time">
        <div className="report-date-picker">
          <DatePicker
            selected={selectedDate}
            onChange={(nextDate) =>
              onChange(updateTime(nextDate ?? new Date(), getTimeValue(selectedDate)))
            }
            dateFormat="d.M.yyyy"
            locale="fi"
            className="report-date-picker__input"
            calendarClassName="report-date-picker__calendar"
            placeholderText="Valitse päivä"
            maxDate={new Date()}
          />
          <span className="report-date-picker__icon report-date-picker__icon--calendar">
            <CalendarDays size={16} />
          </span>
        </div>

        <label className="report-time-select">
          <span className="visually-hidden">Valitse aika</span>
          <Clock3 size={16} />
          <select
            className="report-time-select__input"
            value={getTimeValue(selectedDate)}
            onChange={(event) => onChange(updateTime(selectedDate, event.target.value))}
          >
            {TIME_OPTIONS.map((timeValue) => (
              <option key={timeValue} value={timeValue}>
                {timeValue}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
