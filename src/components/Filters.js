import { Group, Select } from "@mantine/core";
import React, { useEffect } from "react";
import { DateRangePicker, DateRangePickerValue } from "@mantine/dates";

function Filters({ setFilters, filters }) {


  return (
    <Group>
      <Select
        label="Select Frequency"
        placeholder="Select Frequency"
        data={[
          { label: "Son Hafta", value: "7" },
          { label: "Son Ay", value: "30" },
          { label: "Son Yıl", value: "365" },
          { label: "Özel", value: "custom-range" },
        ]}
        value={filters.frequency}
        onChange={(value) => setFilters({ ...filters, frequency: value })}
        name="frequency"
      />
      {filters.frequency === "custom-range" && (
        <div className="w-full">
          <DateRangePicker
            sx={{ width: "350px" }}
            label="Select Date Range"
            placeholder="Pick dates range"
          
            zIndex={10000}
            dropdownPosition="bottom"
            fullWidth
            onChange={(value) => setFilters({ ...filters, dateRange: value })}
          />
        </div>
      )}
      <Select
        label="Filtreleme"
        placeholder="Filtreleme"
        data={[
          { label: "Hepsi", value: "" },
          { label: "Aktif", value: "true" },
          { label: "Pasif", value: "false" },
        ]}
        value={filters.active}
        onChange={(value) => setFilters({ ...filters, active: value })}
        name="active"
        dropdownPosition="bottom"
       />
    </Group>
  );
}

export default Filters;
