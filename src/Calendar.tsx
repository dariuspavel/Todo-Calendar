import { useEffect, useState } from "react";
import "./Calendar.css";

let currentYear = 2025;
let currentMonth = 1;

type Task = {
  isDone: boolean;
  taskText: string;
  isPrio: boolean;
};

function DaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function CreateTask({ task, updateTask, deleteTask }: { task: Task; updateTask: (updatedTask: Task) => void; deleteTask: () => void }) {
  const handleIsCheckedChange = () => {
    const updatedTask = { ...task, isDone: !task.isDone };
    updateTask(updatedTask);
  };

  const handleIsPrioChange = () => {
    const updatedTask = { ...task, isPrio: !task.isPrio };
    updateTask(updatedTask);
  };

  return (
    <div className="box-panel-task">
      <input type="checkbox" checked={task.isDone} onChange={handleIsCheckedChange} />
      <p style={{ textDecoration: task.isDone ? "line-through" : "none", color: task.isPrio ? "red" : "white" }}>
        {task.taskText}
      </p>
      <input type="checkbox" checked={task.isPrio} onChange={handleIsPrioChange} />
      <label>Prio</label>
      <button onClick={deleteTask} className="remove-task-button">
        X
      </button>
    </div>
  );
}

const CreateCalendarGrid = () => {
  const totalDays = DaysInMonth(currentYear, currentMonth);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [getInputText, setInputText] = useState<string>("");
  const [listOfTask, setListOfTask] = useState<Task[]>([]);

  useEffect(() => {
    if (selectedDay !== null) {
      const savedTasks = localStorage.getItem(`MY_TASKS_DAY_${selectedDay}`);
      setListOfTask(savedTasks ? JSON.parse(savedTasks) : []);
    }
  }, [selectedDay]);

  const HandleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const HandleAddTask = () => {
    if (getInputText.trim() !== "" && selectedDay !== null) {
      const newTask: Task = {
        isDone: false,
        taskText: getInputText,
        isPrio: false,
      };

      const updatedTasks = [...listOfTask, newTask];
      setListOfTask(updatedTasks);
      setInputText("");

      localStorage.setItem(`MY_TASKS_DAY_${selectedDay}`, JSON.stringify(updatedTasks));
    }
  };

  const updateTask = (updatedTask: Task) => {
    if (selectedDay !== null) {
      const updatedTasks = listOfTask.map((task) =>
        task.taskText === updatedTask.taskText ? updatedTask : task
      );

      setListOfTask(updatedTasks);
      localStorage.setItem(`MY_TASKS_DAY_${selectedDay}`, JSON.stringify(updatedTasks));
    }
  };

  const deleteTask = (taskToDelete: Task) => {
    if (selectedDay !== null) {
      const updatedTasks = listOfTask.filter((task) => task.taskText !== taskToDelete.taskText);

      setListOfTask(updatedTasks);
      localStorage.setItem(`MY_TASKS_DAY_${selectedDay}`, JSON.stringify(updatedTasks));
    }
  };

  const CreateBoxPanel = () => {
    return (
      <div className="box-panel" style={{ visibility: selectedDay !== null ? "visible" : "hidden" }}>
        <div className="box-panel-close-button">
          <button onClick={() => setSelectedDay(null)}> <p>X</p> </button>
        </div>
        <div className="box-panel-header">
          <h1>To-Do List - Day {selectedDay}</h1>
        </div>
        <div className="box-panel-input">
          <input type="text" placeholder="Add task" value={getInputText} onChange={HandleInputChange} />
          <button onClick={HandleAddTask}>Add</button>
        </div>
        <div className="box-panel-container-task">
          {listOfTask.length > 0 ? (
            listOfTask.map((task, index) => (
              <CreateTask key={index} task={task} updateTask={updateTask} deleteTask={() => deleteTask(task)} />
            ))
          ) : (
            <p>No tasks yet</p>
          )}
        </div>
      </div>
    );
  };

  const HandleClick = (day: number) => {
    setSelectedDay(day);
  };

  const gridOfDivs = Array.from({ length: totalDays }, (_, i) => {
    const index = i + 1;
    return (
      <div key={index} id={index.toString()} className="calendar-day" onClick={() => HandleClick(index)}>
        Day {index}
      </div>
    );
  });

  return (
    <>
      <div className="calendar-grid">{gridOfDivs}</div>
      {CreateBoxPanel()}
    </>
  );
};

export const DisplayCalendar = () => {
  return (
    <>
      <div className="top-side-div"></div>
      <div className="middle-side-div">
        <CreateCalendarGrid />
      </div>
      <div className="bottom-side-div"></div>
    </>
  );
};
