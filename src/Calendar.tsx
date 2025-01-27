import { useState } from "react";
import "./Calendar.css";


let currentYear = 2025;
let currentMonth = 1;


function DaysInMonth(year:number, month:number) {
    return new Date(year, month, 0).getDate();
}


const CreateCalendarGrid = () => {
    const totalDays = DaysInMonth(currentYear, currentMonth);

  const [selectedDay, setSelectedDay] = useState<boolean>(false);

    const HandleClick = (day: number) => {
      alert(`You clicked on Day ${day}`);
      setSelectedDay(true);
    };
  
    const gridOfDivs = Array.from({ length: totalDays }, (_, i) => {
      const index = i + 1; // Start index from 1 directly
      return (
        <div
          key={index}
          id={index.toString()}
          className="calendar-day"
          onClick={() => HandleClick(index)}
        > Day {index}
        </div>
      );
    });
    
  
    return <>
      <div className="calendar-grid">{gridOfDivs}</div>
    </>
  };

export const DisplayCalendar = () => {

    return <>

        <div className="top-side-div">

        </div>

        <div className="middle-side-div">
            {CreateCalendarGrid()}
            
        </div>

        <div className="bottom-side-div"> 
        </div>

    </>
}