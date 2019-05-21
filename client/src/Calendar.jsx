import React from 'react';
import moment from 'moment';
import dateFns from 'date-fns';

import '../../public/styles.css';

class Calendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      weekDays: moment.weekdaysShort(),
      currentMonth: new Date(),
      currentDay: new Date(),
      clickedDay: new Date(),
    };

    this.prevMonthClick = this.prevMonthClick.bind(this);
    this.nextMonthClick = this.nextMonthClick.bind(this);
    this.changeDayClick = this.changeDayClick.bind(this);
  }

  currentDay() {
    return dateFns.format(this.state.currentDay, 'D');
  }

  changeDayClick(e) {
    // change red hover to day clicked and hide calendar view
    // when calendar is clicked, show calendar with clicked date with red border instead of today's date

    if (dateFns.compareAsc(e, dateFns.subDays(new Date(), 1)) === 1) {
      this.setState({
        clickedDay: e,
      });
    }
  }

  prevMonthClick() {
    const todayDate = moment().format('MMMM YYYY');
    if (dateFns.format(this.state.currentMonth, 'MMMM YYYY') !== todayDate) {
      this.setState({
        currentMonth: dateFns.subMonths(this.state.currentMonth, 1),
      });
    }
  }

  nextMonthClick() {
    this.setState({
      currentMonth: dateFns.addMonths(this.state.currentMonth, 1),
    });
  }

  renderDays() {
    const dateFormat = 'dddd';
    const days = [];

    const startDate = dateFns.startOfWeek(this.state.currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <td key={i} className="calendar-day-res">{dateFns.format(dateFns.addDays(startDate, i), dateFormat)}</td>,
      );
    }
  }

  renderCells() {
    const monthStart = dateFns.startOfMonth(this.state.currentMonth);
    const startDate = dateFns.startOfWeek(monthStart);

    const dateFormat = 'D';
    const rows = [];
    let rowCount = 0;
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (rowCount < 6) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        const cloneDay = day;
        let currentDay = '';

        if (dateFns.format(this.state.currentMonth, 'MMMM') === dateFns.format(new Date(), 'MMMM')) {
          currentDay = formattedDate === this.currentDay() ? 'today' : '';
        }

        // conditional styling for dates older than today's date
        let pastCurrentDay = '';
        if (dateFns.compareAsc(day, dateFns.subDays(new Date(), 1)) === -1) {
          pastCurrentDay = 'pastCurrentDay';
        }

        // conditional styling for prev month dates
        let prevMonthStyle = '';
        const getPrevMonth = dateFns.subMonths(this.state.currentMonth, 1);
        const prevMonth = dateFns.format(getPrevMonth, 'MMMM');

        if (prevMonth === dateFns.format(day, 'MMMM')) {
          prevMonthStyle = 'prevMonthStyle';
        }

        // conditional styling for next month dates
        let nextMonthStyle = '';
        const getNextMonth = dateFns.addMonths(this.state.currentMonth, 1);
        const nextMonth = dateFns.format(getNextMonth, 'MMMM');

        if (nextMonth === dateFns.format(day, 'MMMM')) {
          nextMonthStyle = 'nextMonthStyle';
        }

        const classes = `${prevMonthStyle} ${nextMonthStyle} ${pastCurrentDay} calendar-day-res${currentDay}`;

        days.push(
          <td key={i} onClick={() => this.changeDayClick(dateFns.parse(cloneDay))} className={classes}>
            {formattedDate}
          </td >,
        );

        day = dateFns.addDays(day, 1);
      }

      rows.push(
        <tr key={day}>{days}</tr>,
      );

      rowCount++;
      days = [];
    }

    return rows;
  }

  render() {
    const weekDaysName = this.state.weekDays.map((day) => {
      return <th key={day} className="week-day-res">{day}</th>;
    });

    return (
      <div className="res-calendar-wrapper">

        <div className="res-month-title">
          <div className="col-start">
            <div className="prev-month" onClick={this.prevMonthClick}></div>
          </div>

          <div className="col col-center">
            <span className="res-calendar-nav">{dateFns.format(this.state.currentMonth, 'MMMM YYYY')}</span>
          </div>

          <div className="col-end">
            <div className="next-month" onClick={this.nextMonthClick}></div>
          </div>
        </div>

        <table className="reservations-calendar">
          <thead>
            <tr>{weekDaysName}</tr>
          </thead>
          <tbody>
            {this.renderDays()}
            {this.renderCells()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Calendar;
