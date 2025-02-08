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

// Task component to render individual tasks
const CreateTask = ({ task, UpdateTask, DeleteTask }: { 
  task: Task; 
  UpdateTask: (updatedTask: Task) => void; 
  DeleteTask: () => void; 
}) => (
  <div className="box-panel-task">
      <input className="box-panel-task-checkbox" type="checkbox" checked={task.isDone} onChange={() => UpdateTask({ ...task, isDone: !task.isDone })} />
      <p style={{ textDecoration: task.isDone ? "line-through" : "none", color: task.isPrio ? "red" : "white" }}>
        {task.taskText}
      </p>
      <input className="box-panel-task-checkbox" type="checkbox" checked={task.isPrio} onChange={() => UpdateTask({ ...task, isPrio: !task.isPrio })} />
      <label>Prio</label>
      <button onClick={DeleteTask} className="remove-task-button">X</button>
  </div>
);

// Calendar component that renders the grid and task list
const CreateCalendarGrid = () => {
  const today = new Date();

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [getInputText, setInputText] = useState<string>("");
  const [listOfTask, setListOfTask] = useState<Task[]>([]);
  
  const totalDays = DaysInMonth(currentYear, currentMonth);

   // Load tasks from local storage when a new day is selected
  useEffect(() => {
    if (selectedDay !== null) {
      const savedTasks = localStorage.getItem(`MY_TASKS_${currentYear}_${currentMonth}_${selectedDay}`);
      setListOfTask(savedTasks ? JSON.parse(savedTasks) : []);
    }
  }, [selectedDay, currentYear, currentMonth]);

   // Function to handle navigation (next/previous month, year, or today)
  const HandleNavigation = (type: string) => {
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

   // Function to add a new task
  const HandleAddTask = () => {
    if (getInputText.trim() !== "" && selectedDay !== null) {
      const newTask: Task = { id: Date.now(), isDone: false, taskText: getInputText, isPrio: false };
      const updatedTasks = [...listOfTask, newTask];
      setListOfTask(updatedTasks);
      setInputText("");
      localStorage.setItem(`MY_TASKS_${currentYear}_${currentMonth}_${selectedDay}`, JSON.stringify(updatedTasks));
    }
  };

   // Function to update a task
  const UpdateTask = (updatedTask: Task) => {
    if (selectedDay !== null) {
      const updatedTasks = listOfTask.map((task) => 
        task.id === updatedTask.id ? updatedTask : task
      );
      setListOfTask(updatedTasks);
      localStorage.setItem(`MY_TASKS_${currentYear}_${currentMonth}_${selectedDay}`, JSON.stringify(updatedTasks));
    }
  };

  // Function to delete a task
  const DeleteTask = (taskId: number) => {
    if (selectedDay !== null) {
      const updatedTasks = listOfTask.filter((task) => task.id !== taskId);
      setListOfTask(updatedTasks);
      localStorage.setItem(`MY_TASKS_${currentYear}_${currentMonth}_${selectedDay}`, JSON.stringify(updatedTasks));
    }
  };

  return (
    <>
      <div className="calendar-navigation">
        <button onClick={() => HandleNavigation("prev-year")}>{"<<"}</button>
        <button onClick={() => HandleNavigation("prev-month")}>{"<"}</button>
        <span>{`${currentYear} - ${new Date(currentYear, currentMonth - 1).toLocaleString("en-US", { month: "long" })}`}</span>
        <button onClick={() => HandleNavigation("today")} className="today-button">Today</button>
        <button onClick={() => HandleNavigation("next-month")}>{">"}</button>
        <button onClick={() => HandleNavigation("next-year")}>{">>"}</button>
      </div>

      <div className="calendar-grid">
        {Array.from({ length: totalDays }, (_, i) => {
          const dayNumber = i + 1;
          const isToday =
            currentYear === today.getFullYear() &&
            currentMonth === today.getMonth() + 1 &&
            dayNumber === today.getDate();

          const storedTasks = localStorage.getItem(`MY_TASKS_${currentYear}_${currentMonth}_${dayNumber}`);
          const hasTasks = storedTasks ? JSON.parse(storedTasks).length > 0 : false;

          return (
            <div
              key={dayNumber}
              className={`calendar-day ${isToday ? "today-highlight" : ""} ${hasTasks ? "has-task" : ""}`}
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
              <button onClick={HandleAddTask}>Add</button>
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
                      UpdateTask={UpdateTask}
                      DeleteTask={() => DeleteTask(task.id)}
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
  <div className="middle-side-div">
    <CreateCalendarGrid />
  </div>
);
