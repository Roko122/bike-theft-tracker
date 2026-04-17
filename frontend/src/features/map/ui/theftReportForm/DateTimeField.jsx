import DatePicker, { registerLocale } from 'react-datepicker';
import { CalendarDays, Clock3 } from 'lucide-react';
import { enGB, fi } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { useI18n } from '../../../app/i18n/LanguageContext.jsx';
import InfoLabel from './InfoLabel.jsx';
import { getFormTooltips } from './formOptions.js';

registerLocale('fi', fi);
registerLocale('en', enGB);

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
  const nextDate =
    date instanceof Date && !Number.isNaN(date.getTime())
      ? new Date(date)
      : new Date();

  nextDate.setHours(hours, minutes, 0, 0);
  return nextDate;
}

export default function DateTimeField({ value, onChange }) {
  const { language, t } = useI18n();
  const formTooltips = getFormTooltips(t);
  const selectedDate =
    value instanceof Date && !Number.isNaN(value.getTime()) ? value : new Date();

  return (
    <div className="report-field">
      <span className="report-field__label">
        <InfoLabel
          label={t('theftForm.theftTime')}
          tooltipId="tooltip-theft-time"
          tooltipText={formTooltips.theftTime}
        />
      </span>

      <div className="report-date-time">
        <label className="report-time-select report-time-select--date">
          <CalendarDays size={16} />
          <DatePicker
            selected={selectedDate}
            onChange={(nextDate) =>
              onChange(updateTime(nextDate ?? new Date(), getTimeValue(selectedDate)))
            }
            dateFormat="d.M.yyyy"
            locale={language}
            className="report-date-picker__input"
            calendarClassName="report-date-picker__calendar"
            placeholderText={t('theftForm.theftTimePlaceholder')}
            maxDate={new Date()}
          />
        </label>

        <label className="report-time-select">
          <span className="visually-hidden">{t('theftForm.theftTime')}</span>
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
