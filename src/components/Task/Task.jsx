import { BsThreeDots ,BsCircleFill } from "react-icons/bs"
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import "./Task.css";

function Task({ task, index }) {

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div
                    className="container-task"
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                 
                >
           
                    <div>
                        <span className="task-id" style={{ color: "gray", fontSize: "14px" }} >{task.id}</span>
                    </div>
                    <div>
                        <span className="task-title">{task.title}</span>
                    </div>

                    <div className="task-list-last">
                        <div className="ThreeDots">
                            <BsThreeDots />
                        </div>
                        <div className="task-list-tag">

                            <div>
                            <BsCircleFill fontSize={10}/>
                            </div>
                            <div>
                            {task?.tag[0]}

                            </div>

                        </div>
                    </div>

                    <div>
                        Task Priority {task.priority}
                    </div>

                    {provided.placeholder}
                </div>
            )}
        </Draggable>
    );
}

export default Task;
