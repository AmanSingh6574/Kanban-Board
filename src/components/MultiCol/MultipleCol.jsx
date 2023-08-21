import { Droppable } from "react-beautiful-dnd";
import Task from "../Task/Task";
import { BsCircle } from "react-icons/bs"
import "./MultipleCol.css"
function MultipleCol({ title, tasks, id }) {
    console.log(tasks)
    return (
        <div className="container">
            <div className="title">
                <div><BsCircle size={12} /></div>
                <div>{title}</div>
                {
                    tasks.length > 0 && (
                        <div>{tasks.length}</div>
                    )
                }
            </div>
            <Droppable droppableId={`${id}`} key={id}>
                {(provided, snapshot) => (
                    <div key={id}
                        className="task-list"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        {
                            tasks.length > 0 && (
                                
                                    tasks.map((task, index) => (
                                        <Task key={task.id} index={index} task={task} />
                                    ))
                                
                            )
                        }
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}

export default MultipleCol;