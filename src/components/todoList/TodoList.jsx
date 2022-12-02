import Task from "components/task/Task";
import AddTask from "components/addTask/AddTask";

import styles from "./todoList.less";

function TodoList({list, getTodoList}) {
    if (list.length === 0) {
        getTodoList();

        return (
            <div className={styles.list}>
                <h1 className={styles.title}>Task List:</h1>

                <p className={styles.loader}>Loading...</p>
            </div>
        )
    }

    return (
        <div className={styles.list}>
            <h1 className={styles.title}>Task List:</h1>

            {list.map((task) =>
                <Task
                    key={task.id}
                    id={task.id}
                    title={task.data().title}
                    description={task.data().description}
                    date={task.data().date}
                    status={task.data().status}
                />
            )}

            <AddTask/>
        </div>
    );
}

export default TodoList;