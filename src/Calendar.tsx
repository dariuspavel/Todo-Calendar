import { useEffect, useState } from "react";
import "./Calendar.css";

type Task = {
  id: number;
  isDone: boolean;
  taskText: string;
  isPrio: boolean;
};

function DaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

const CreateTask = ({ task, updateTask, deleteTask }: { 
  task: Task; 
  updateTask: (updatedTask: Task) => void; 
  deleteTask: () => void; 
}) => (
  <div className="box-panel-task">
      <input className="box-panel-task-checkbox" type="checkbox" checked={task.isDone} onChange={() => updateTask({ ...task, isDone: !task.isDone })} />
      <p style={{ textDecoration: task.isDone ? "line-through" : "none", color: task.isPrio ? "red" : "white" }}>
        {task.taskText}
      </p>
      <input className="box-panel-task-checkbox" type="checkbox" checked={task.isPrio} onChange={() => updateTask({ ...task, isPrio: !task.isPrio })} />
      <label>Prio</label>
      <button onClick={deleteTask} className="remove-task-button">X</button>
  </div>
  
);

const CreateCalendarGrid = () => {

  const today = new Date();

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [getInputText, setInputText] = useState<string>("");
  const [listOfTask, setListOfTask] = useState<Task[]>([]);
  
  const totalDays = DaysInMonth(currentYear, currentMonth);

  useEffect(() => {
    if (selectedDay !== null) {
      const savedTasks = localStorage.getItem(`MY_TASKS_${currentYear}_${currentMonth}_${selectedDay}`);
      setListOfTask(savedTasks ? JSON.parse(savedTasks) : []);
    }
  }, [selectedDay, currentYear, currentMonth]);

  const handleNavigation = (type: string) => {
    if (type === "prev-year") setCurrentYear(currentYear - 1);
    if (type === "next-year") setCurrentYear(currentYear + 1);
    if (type === "prev-month") {
      if (currentMonth === 1) {
        setCurrentYear(currentYear - 1);
        setCurrentMonth(12);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    }
    if (type === "next-month") {
      if (currentMonth === 12) {
        setCurrentYear(currentYear + 1);
        setCurrentMonth(1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
    if (type === "today") {
      setCurrentYear(today.getFullYear());
      setCurrentMonth(today.getMonth() + 1);
    }
  };

  const handleAddTask = () => {
    if (getInputText.trim() !== "" && selectedDay !== null) {
      const newTask: Task = { id: Date.now(), isDone: false, taskText: getInputText, isPrio: false };
      const updatedTasks = [...listOfTask, newTask];
      setListOfTask(updatedTasks);
      setInputText("");
      localStorage.setItem(`MY_TASKS_${currentYear}_${currentMonth}_${selectedDay}`, JSON.stringify(updatedTasks));
    }
  };

  const updateTask = (updatedTask: Task) => {
    if (selectedDay !== null) {
      const updatedTasks = listOfTask.map((task) => 
        task.id === updatedTask.id ? updatedTask : task
      );
      
      setListOfTask(updatedTasks);
      localStorage.setItem(`MY_TASKS_${currentYear}_${currentMonth}_${selectedDay}`, JSON.stringify(updatedTasks));
    }
  };

  const deleteTask = (taskId: number) => {
    if (selectedDay !== null) {
      const updatedTasks = listOfTask.filter((task) => task.id !== taskId);
      setListOfTask(updatedTasks);
      localStorage.setItem(`MY_TASKS_${currentYear}_${currentMonth}_${selectedDay}`, JSON.stringify(updatedTasks));
    }
  };

  return (
    <>
      <div className="calendar-navigation">
        <button onClick={() => handleNavigation("prev-year")}>{"<<"}</button>
        <button onClick={() => handleNavigation("prev-month")}>{"<"}</button>
        <span>{`${currentYear} - ${new Date(currentYear, currentMonth - 1).toLocaleString("en-US", { month: "long" })}`}</span>
        <button onClick={() => handleNavigation("today")} className="today-button">Today</button>
        <button onClick={() => handleNavigation("next-month")}>{">"}</button>
        <button onClick={() => handleNavigation("next-year")}>{">>"}</button>
      </div>

      <div className="calendar-grid">
        {Array.from({ length: totalDays }, (_, i) => {
          const dayNumber = i + 1;
          const isToday =
            currentYear === today.getFullYear() &&
            currentMonth === today.getMonth() + 1 &&
            dayNumber === today.getDate();
          return (
            <div
              key={dayNumber}
              className={`calendar-day ${isToday ? "today-highlight" : ""}`}
              onClick={() => setSelectedDay(dayNumber)}
            >
              Day {dayNumber}
            </div>
          );
        })}
      </div>

      {selectedDay !== null && (
        <>
          <div className="overlay"></div>
          <div className="box-panel">
            <div className="box-panel-close-button">
              <button onClick={() => setSelectedDay(null)}>
                <p>X</p>
              </button>
            </div>
            <div className="box-panel-header">
              <h1>
                To-Do List - {new Date(currentYear, currentMonth - 1, selectedDay).toLocaleDateString()}
              </h1>
            </div>
            <div className="box-panel-input">
              <input
                type="text"
                placeholder="Add task"
                value={getInputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button onClick={handleAddTask}>Add</button>
            </div>
            <div className="box-panel-container-task">
            {listOfTask.length > 0 ? (
  [...listOfTask]
    .sort((a, b) => {
      if (a.isDone !== b.isDone) return a.isDone ? 1 : -1;

      if (a.isPrio !== b.isPrio) return b.isPrio ? 1 : -1;
      return 0;
    })
    .map((task) => (
      <CreateTask
        key={task.id}
        task={task}
        updateTask={updateTask}
        deleteTask={() => deleteTask(task.id)}
      />
    ))
) : (
  <p>No tasks yet</p>
)}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export const DisplayCalendar = () => (
  <>
    <div className="middle-side-div">
      <CreateCalendarGrid />
    </div>
  </>
);
