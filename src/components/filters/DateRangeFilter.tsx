import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';

export const DateRangeFilter = () => {
  const { customDateRange, setCustomDateRange } = useDashboardStore();
  const [startDate, setStartDate] = useState(customDateRange?.startDate || '');
  const [endDate, setEndDate] = useState(customDateRange?.endDate || '');

  const handleApply = () => {
    if (startDate && endDate) {
      setCustomDateRange({ startDate, endDate });
    }
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    setCustomDateRange(null);
  };

  return (
    <div className="date-range-filter">
      <div className="date-range-header">
        <Calendar size={18} />
        <span>Custom Date Range</span>
      </div>
      <div className="date-inputs">
        <div className="date-input-group">
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="date-input"
          />
        </div>
        <div className="date-input-group">
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="date-input"
          />
        </div>
      </div>
      <div className="date-actions">
        <button onClick={handleApply} className="btn btn-primary" disabled={!startDate || !endDate}>
          Apply
        </button>
        <button onClick={handleClear} className="btn btn-secondary">
          Clear
        </button>
      </div>
    </div>
  );
};
