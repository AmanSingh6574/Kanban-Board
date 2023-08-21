import React, { useEffect, useRef, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import MultipleCol from "../MultiCol/MultipleCol";

import { GiSettingsKnobs } from "react-icons/gi"
import { FiChevronDown } from "react-icons/fi"
import "./MainBoard.css"

function MainBoard() {
    const [tasks, setTasks] = useState(() => {
        const storedTasks = localStorage.getItem("tasks");
        return storedTasks ? JSON.parse(storedTasks) : [];
    });

    const [userTask, setuserTask] = useState(() => {
        const storedUserTask = localStorage.getItem("userTask");
        return storedUserTask ? JSON.parse(storedUserTask) : [];
    });

    const [priTask, setpriTask] = useState(() => {
        const storedPriTask = localStorage.getItem("priTask");
        return storedPriTask ? JSON.parse(storedPriTask) : [];
    });

    const [statusTasks, setStatusTasks] = useState(() => {
        const storedStatusTasks = localStorage.getItem("statusTasks");
        return storedStatusTasks ? JSON.parse(storedStatusTasks) : [];
    });

    const [userMap, setUserMap] = useState(() => {
        const storedUserMap = localStorage.getItem("userMap");
        return storedUserMap ? JSON.parse(storedUserMap) : {};
    });

    const [groupingOption, setGroupingOption] = useState("");
    const [sortingOption, setSortingOption] = useState("");

    const [displayOptionsVisible, setDisplayOptionsVisible] = useState(false);
    const displayOptionsRef = useRef(null);


    useEffect(() => {
        const storedTasks = localStorage.getItem("tasks");
        if (storedTasks) {

            setTasks(JSON.parse(storedTasks));
            const storedUserTask = localStorage.getItem("userTask");
            setuserTask(storedUserTask ? JSON.parse(storedUserTask) : []);
            const storedPriTask = localStorage.getItem("priTask");
            setpriTask(storedPriTask ? JSON.parse(storedPriTask) : []);
            const storedStatusTasks = localStorage.getItem("statusTasks");
            setStatusTasks(storedStatusTasks ? JSON.parse(storedStatusTasks) : []);
            const storedUserMap = localStorage.getItem("userMap");
            setUserMap(storedUserMap ? JSON.parse(storedUserMap) : {});
            const storedGroupingOption = localStorage.getItem("groupingOption");
            setGroupingOption(storedGroupingOption || "");
            const storedSortingOption = localStorage.getItem("sortingOption");
            setSortingOption(storedSortingOption || "");
        } else {

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
        }
    }, []);

    const handleOutsideClick = (event) => {
        if (displayOptionsRef.current && !displayOptionsRef.current.contains(event.target)) {
            setDisplayOptionsVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);


    const handleDrag = (result) => {
        const { destination, source, draggableId } = result;

        // Check if there's no valid destination
        if (!destination) {
            return;
        }


        const draggedTask = tasks.find((task) => task.id === draggableId);


        const updatedTasks = tasks.filter((task) => task.id !== draggableId);


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

        updatedTasks.splice(destination.index, 0, updatedDraggedTask);

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

            const userTasksMap = new Map();

            tasks.forEach((task) => {
                const userName = userMap[task.userId];
                if (!userTasksMap.has(userName)) {
                    userTasksMap.set(userName, []);
                }
                userTasksMap.get(userName).push(task);
            });


            const userTaskLists = Array.from(userTasksMap.values());
            console.log(userTaskLists)


            setuserTask(userTaskLists);
            console.log(userTask)
        }
        else if (option === "priority") {
            const priorityTasksMap = new Map();

            tasks.forEach((task) => {
                const priorityName = getPriorityName(task.priority);
                if (!priorityTasksMap.has(priorityName)) {
                    priorityTasksMap.set(priorityName, []);
                }
                priorityTasksMap.get(priorityName).push(task);
            });


            const priorityTaskLists = Array.from(priorityTasksMap.values());
            console.log(priorityTaskLists)

            setpriTask(priorityTaskLists);
            console.log(priTask);
        }
        else {
            const statusTasksMap = new Map();

            tasks.forEach((task) => {
                const status = task.status;
                if (!statusTasksMap.has(status)) {
                    statusTasksMap.set(status, []);
                }
                statusTasksMap.get(status).push(task);
            });


            const statusTaskLists = Array.from(statusTasksMap.values());
            console.log("in")

            // Set the status task lists as columns
            setStatusTasks(statusTaskLists);

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

    const saveStateToLocalStorage = () => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
        localStorage.setItem("userTask", JSON.stringify(userTask));
        localStorage.setItem("priTask", JSON.stringify(priTask));
        localStorage.setItem("statusTasks", JSON.stringify(statusTasks));
        localStorage.setItem("groupingOption", groupingOption);
        localStorage.setItem("sortingOption", sortingOption);
        localStorage.setItem("userMap", JSON.stringify(userMap));
    };

    useEffect(() => {
        saveStateToLocalStorage();
    }, [tasks, userTask, priTask, statusTasks, groupingOption, sortingOption, userMap])


    return (
        <div className="main-block">
            <div className="main-block-heading">
                <button onClick={handleDisplay} className="main-block-heading-button">
                    <div>
                        <GiSettingsKnobs />
                    </div>
                    <div style={{
                        fontSize: "16px",
                        fontWeight: "bold"
                    }}>
                        Display
                    </div>
                    <div>
                        <FiChevronDown size={16} />
                    </div>
                </button>
                <div
                    ref={displayOptionsRef}
                    className="main-option-container"
                    style={{
                        visibility: displayOptionsVisible ? "visible" : "hidden",
                        top: "50px",
                        position: "absolute",
                        width: "250px",
                        display: "flex",
                        gap: "10px",
                        flexDirection: "column",
                        backgroundColor: "lightgray",
                        padding: "10px",
                        alignItems: "center",
                        left: "20px",
                        borderRadius: "10px"
                    }}
                >
                    <div
                        className="grouping-options"
                        style={{ visibility: displayOptionsVisible ? "visible" : "hidden" }}
                    >
                        <label>Group By:  </label>
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
                        <label>Sort By: </label>
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
                <div>
                    *Note Drang and Drop Facility is only for initial state
                </div>
            </div>
            <DragDropContext onDragEnd={handleDrag}>
                <div className="main-container">
                    {groupingOption === "user" && Object.keys(userMap).length > 0 && userTask.map((userTasks, index) => (
                        <MultipleCol
                            key={index}
                            title={userTasks[0] ? userMap[userTasks[0].userId] : "No User"}
                            img={userTasks[0] ? `https://api.dicebear.com/5.x/initials/svg?seed=${userMap[userTasks[0].userId]}` : "#"}
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
