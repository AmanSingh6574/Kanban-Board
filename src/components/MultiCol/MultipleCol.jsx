import { Droppable } from "react-beautiful-dnd";
import Task from "../Task/Task";
import { BsCircle, BsThreeDots } from "react-icons/bs"
import { AiOutlinePlus } from "react-icons/ai"
import "./MultipleCol.css"
function MultipleCol({ title, img, tasks, id }) {
    return (
        <div className="container">
            <div className="container-header" >
                <div className="title">
                    {
                        !img && (
                            <div><BsCircle size={12} /></div>
                        )
                    }
                    {
                        img && (
                            <img src={img} style={{ borderRadius: "10px", textAlign: "right" }} width={25} alt="#" />
                        )
                    }
                    <div>{title}</div>
                    {
                        tasks.length > 0 && (
                            <div>{tasks.length}</div>
                        )
                    }
                </div>

                <div className="title-add">
                    <div>
                        <AiOutlinePlus />
                    </div>
                    <div>
                        <BsThreeDots />
                    </div>

                </div>

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