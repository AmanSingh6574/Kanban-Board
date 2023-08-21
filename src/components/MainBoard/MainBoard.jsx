import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import MultipleCol from "../MultiCol/MultipleCol";

import { GiSettingsKnobs } from "react-icons/gi"
import { FiChevronDown } from "react-icons/fi"
import "./MainBoard.css"

function MainBoard() {
    const [tasks, setTasks] = useState([]);
    const [userTask, setuserTask] = useState([]);
    const [priTask, setpriTask] = useState([]);
    const [statusTasks, setStatusTasks] = useState([]);
    const [userMap, setUserMap] = useState({});
    const [groupingOption, setGroupingOption] = useState(""); // Default grouping option
    const [sortingOption, setSortingOption] = useState(""); // Default sorting option

    const [displayOptionsVisible, setDisplayOptionsVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://api.quicksell.co/v1/internal/frontend-assignment");
                const data = await response.json();
                setTasks(data.tickets);

                const userMapping = {};
                data.users.forEach((user) => {
                    userMapping[user.id] = user.name;
                });
                setUserMap(userMapping);
                applyGrouping(data.tickets, "status");

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    function checkid(id) {
        if (id === "0") {
            return "Todo"
        }
        else if (id === "1") {
            return "inProgress"
        }
        else if (id === "2") {
            return "Backlog"
        }
        else if (id === "3") {
            return "Done"
        }
    }

    const handleDrag = (result) => {
        const { destination, source, draggableId } = result;

        // Check if there's no valid destination
        if (!destination) {
            return;
        }

        // Find the task that was dragged
        const draggedTask = tasks.find((task) => task.id === draggableId);

        // Create a new array of tasks with the dragged task removed
        const updatedTasks = tasks.filter((task) => task.id !== draggableId);

        // Determine the status of the dragged task based on the destination column
        let status = "Todo";
        if (destination.droppableId === "1") {
            status = "Backlog";
        } else if (destination.droppableId === "2") {
            status = "Todo";
        } else if (destination.droppableId === "3") {
            status = "In progress";
        } else if (destination.droppableId === "4") {
            status = "Done";
        }

        const updatedDraggedTask = {
            ...draggedTask,
            status: status,
        };

        // Insert the updated dragged task at the destination index
        updatedTasks.splice(destination.index, 0, updatedDraggedTask);

        // Update the state with the new tasks array
        setTasks(updatedTasks);
    };













    const applyGroupingAndSorting = (option, groupingOption) => {
        if (groupingOption === "status") {
            let updated = [...statusTasks];
            if (option === "priority") {
                updated = updated.map(statusTaskList => statusTaskList.sort((a, b) => b.priority - a.priority));
            } else if (option === "title") {
                updated = updated.map(statusTaskList => statusTaskList.sort((a, b) => a.title.localeCompare(b.title)));
            }
            setStatusTasks(updated);
        } else if (groupingOption === "priority") {
            let updated = [...priTask];
            if (option === "priority") {
                updated = updated.map(priorityTasks => priorityTasks.sort((a, b) => b.priority - a.priority));
            } else if (option === "title") {
                updated = updated.map(priorityTasks => priorityTasks.sort((a, b) => a.title.localeCompare(b.title)));
            }
            setpriTask(updated);
        } else if (groupingOption === "user") {
            let updated = [...userTask];
            if (option === "priority") {
                updated = updated.map(userTasks => userTasks.sort((a, b) => b.priority - a.priority));
            } else if (option === "title") {
                updated = updated.map(userTasks => userTasks.sort((a, b) => a.title.localeCompare(b.title)));
            }
            setuserTask(updated);


        }
        else {
            let updated = [...tasks];
            if (option === "priority") {
                updated.sort((a, b) => b.priority - a.priority);
            } else if (option === "title") {
                updated.sort((a, b) => a.title.localeCompare(b.title));
            }
            setTasks(updated);
        }

    };


    const applyGrouping = (tasks, option) => {


        if (option === "user") {
            // Group by user
            const userTasksMap = new Map(); // Map to store tasks grouped by user

            tasks.forEach((task) => {
                const userName = userMap[task.userId];
                if (!userTasksMap.has(userName)) {
                    userTasksMap.set(userName, []);
                }
                userTasksMap.get(userName).push(task);
            });

            // Create an array of user task lists
            const userTaskLists = Array.from(userTasksMap.values());
            console.log(userTaskLists)

            // Flatten the user task lists into a single array
            setuserTask(userTaskLists);
            console.log(userTask)
        }
        else if (option === "priority") {
            const priorityTasksMap = new Map(); // Map to store tasks grouped by priority

            tasks.forEach((task) => {
                const priorityName = getPriorityName(task.priority); // Get priority name based on priority level
                if (!priorityTasksMap.has(priorityName)) {
                    priorityTasksMap.set(priorityName, []);
                }
                priorityTasksMap.get(priorityName).push(task);
            });

            // Create an array of priority task lists
            const priorityTaskLists = Array.from(priorityTasksMap.values());
            console.log(priorityTaskLists)
            // Set the priority task lists as columns
            setpriTask(priorityTaskLists);
            console.log(priTask);
        }
        else {
            const statusTasksMap = new Map(); // Map to store tasks grouped by status

            tasks.forEach((task) => {
                const status = task.status;
                if (!statusTasksMap.has(status)) {
                    statusTasksMap.set(status, []);
                }
                statusTasksMap.get(status).push(task);
            });

            // Create an array of status task lists
            const statusTaskLists = Array.from(statusTasksMap.values());
            console.log("in")

            // Set the status task lists as columns
            setStatusTasks(statusTaskLists);
            // setUserTasks([]);     // Reset userTasks
            // setPriorityTasks([]);
        }

    };



    const getPriorityName = (priority) => {
        switch (priority) {
            case 4:
                return "Urgent";
            case 3:
                return "High";
            case 2:
                return "Medium";
            case 1:
                return "Low";
            default:
                return "No priority";
        }
    };

    const handleDisplay = () => {
        setDisplayOptionsVisible(!displayOptionsVisible);

    };

    const handleGroupingChange = (option) => {
        setGroupingOption(option);
        if (["priority", "status", "user"].includes(option)) {
            applyGrouping(tasks, option);
        }
    };

    const handleSortingChange = (option) => {
        setSortingOption(option);
        if (["priority", "title"].includes(option)) {
            applyGroupingAndSorting(option, groupingOption);
        }
    };


    return (
        <div className="main-block">
            <div className="main-block-heading">
                <button onClick={handleDisplay} className="main-block-heading-button">
                    <div>
                        <GiSettingsKnobs />
                    </div>
                    <div>
                        Display
                    </div>
                    <div>
                        <FiChevronDown size={16} />
                    </div>
                </button>
                <div
                    style={{
                        visibility: displayOptionsVisible ? "visible" : "hidden",
                        top: "50px",
                        position: "absolute",
                        width: "200px",
                        display: "flex",
                        gap: "10px",
                        flexDirection: "column",
                        backgroundColor: "white",
                        padding: "10px",
                        justifyContent: "space-between",
                        alignItems: "center",
                        left: "20px",
                        borderRadius: "10px"
                    }}
                >
                    <div
                        className="grouping-options"
                        style={{ visibility: displayOptionsVisible ? "visible" : "hidden" }}
                    >
                        <label>Group By:</label>
                        <select
                            value={groupingOption}
                            onChange={(e) => handleGroupingChange(e.target.value)}
                            style={{ padding: "5px", border: "1px solid #ccc", borderRadius: "5px" }}
                        >
                            <option value="#">Select</option>
                            <option value="status">Status</option>
                            <option value="user">User</option>
                            <option value="priority">Priority</option>
                        </select>
                    </div>
                    <div
                        className="sorting-options"
                        style={{ visibility: displayOptionsVisible ? "visible" : "hidden" }}
                    >
                        <label>Sort By:</label>
                        <select
                            value={sortingOption}
                            onChange={(e) => handleSortingChange(e.target.value)}
                            style={{ padding: "5px", border: "1px solid #ccc", borderRadius: "5px" }}
                        >
                            <option value="#">Select</option>
                            <option value="priority">Priority</option>
                            <option value="title">Title</option>
                        </select>
                    </div>
                </div>
            </div>
            <DragDropContext onDragEnd={handleDrag}>
                <div className="main-container">
                    {groupingOption === "user" && userTask.map((userTasks, index) => (
                        <MultipleCol
                            key={index}
                            title={userTasks[0] ? userMap[userTasks[0].userId] : "No User"}
                            img = {userTasks[0] ? `https://api.dicebear.com/5.x/initials/svg?seed=${userMap[userTasks[0].userId]}` : "#"  }
                            tasks={userTasks}
                            id={index.toString()}
                        />
                    ))}
                    {groupingOption === "priority" && priTask.map((priorityTasks, index) => (
                        <MultipleCol
                            key={index}
                            title={priorityTasks[0] ? getPriorityName(priorityTasks[0].priority) : "No Priority"}
                            tasks={priorityTasks}
                            id={index.toString()}
                        />
                    ))}
                    {/* Render all status columns */}
                    {groupingOption === "status" && (
                        <>
                            {statusTasks.map((statusTaskList, index) => (
                                <MultipleCol
                                    key={index}
                                    title={statusTaskList[0] ? statusTaskList[0].status : "No Status"}
                                    tasks={statusTaskList}
                                    id={index.toString()}
                                />
                            ))}
                            {/* Add a column for the "Done" status */}
                            <MultipleCol
                                title="Done"
                                tasks={tasks.filter(task => task.status === "Done")}
                                id="done"
                            />
                        </>
                    )}


                </div>
            </DragDropContext>
            {
                (groupingOption === "" || groupingOption === "#") && (

                    <DragDropContext onDragEnd={handleDrag}>
                        <h2>Main Board</h2>
                        <div className="main-container" >
                            <MultipleCol
                                title={"Backlog"}
                                tasks={tasks.filter((task) => task.status === "Backlog")}
                                id={"1"}
                            />
                            <MultipleCol
                                title={"To-Do"}
                                tasks={tasks.filter((task) => task.status === "Todo")}
                                id={"2"}
                            />
                            <MultipleCol
                                title={"In progress"}
                                tasks={tasks.filter((task) => task.status === "In progress")}
                                id={"3"}
                            />
                            <MultipleCol
                                title={"Done"}
                                tasks={tasks.filter((task) => task.status === "Done")}
                                id={"4"}
                            />
                        </div>
                    </DragDropContext>

                )
            }

        </div>
    );
}

export default MainBoard;
