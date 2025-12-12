"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";

// Styled Components
const CalendarWrapper = styled.div`
    width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: Arial, sans-serif;
  background-color: #fff;
  overflow: hidden;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  padding: 8px 12px;
  font-weight: bold;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 8px;
`;

const DayLabel = styled.div`
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  color: #999;
  padding: 4px 0;
`;

const DayCell = styled.div`
  height: 32px;
  text-align: center;
  padding-top: 6px;
  margin: 2px 0;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: #f0f0f0;
  }

  &.today {
    background-color: #007bff;
    color: #fff;
    font-weight: bold;
  }

  &.selected {
    background-color: #28a745;
    color: white;
    font-weight: bold;
  }
`;

const CustomCalendar = ({ value, onChange }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(value);



  useEffect(() => {
    if (value) {
      setCurrentDate(value);
      setSelectedDate(value);
    }
  }, [value]);

  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();

    const calendarDays = [];
    for (let i = 0; i < startDay; i++) calendarDays.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push(new Date(year, month, i));
    }

    return calendarDays;
  };

  const prevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const isSameDate = (a, b) => {
    return (
      a?.getDate() === b?.getDate() &&
      a?.getMonth() === b?.getMonth() &&
      a?.getFullYear() === b?.getFullYear()
    );
  };

  const handleDateClick = (date) => {
    const updatedDate = new Date(date);
    if (selectedDate) {
      updatedDate.setHours(selectedDate.getHours());
      updatedDate.setMinutes(selectedDate.getMinutes());
    }
    setSelectedDate(updatedDate);
    onChange && onChange(updatedDate);
  };


  const monthYear = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <CalendarWrapper className="w-full">
      <CalendarHeader>
        <NavButton onClick={prevMonth}>❮</NavButton>
        <span>{monthYear}</span>
        <NavButton onClick={nextMonth}>❯</NavButton>
      </CalendarHeader>

      <CalendarGrid>
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <DayLabel key={d}>{d}</DayLabel>
        ))}

        {getMonthDays().map((day, index) => (
          <DayCell
            key={index}
            onClick={() => day && handleDateClick(day)}
            className={[
              isSameDate(day, today) ? "today" : "",
              isSameDate(day, selectedDate) ? "selected" : "",
            ].join(" ")}
          >
            {day ? day.getDate() : ""}
          </DayCell>
        ))}
      </CalendarGrid>
    </CalendarWrapper>
  );
};

export default CustomCalendar;
