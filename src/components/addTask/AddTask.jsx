import {useContext} from "react";

import {ServiceContext} from "Context";

import styles from "./addTask.less";

function AddTask() {
    const service = useContext(ServiceContext);

    function resetForm(e) {
        e.preventDefault();
        service.formRef.current.reset();
    }

    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const title = form.title.value;
        const description = form.description.value;
        const date = new Date(form.date.value);
        const files = form.files.files;

        service.addTask(title, description, date, files);
    }

    return (
        <div className={styles.container}>
            <p className={styles.title}>
                Add Task:
            </p>

            <form
                ref={service.formRef}
                onSubmit={(e) => handleSubmit(e)}
            >
                <input
                    name="title"
                    className={styles.input}
                    placeholder="Title"
                    type="text"
                    required
                />

                <textarea
                    name="description"
                    className={styles.input}
                    placeholder="Description"
                    cols="30"
                    rows="5"
                    required
                />

                <input
                    name="date"
                    className={styles.input}
                    type="date"
                    required
                />

                <input
                    name="files"
                    className={styles.input}
                    type="file"
                    multiple
                />

                <button
                    className={styles.button}
                    onClick={(e) => resetForm(e)}
                >
                    reset form
                </button>

                <button
                    className={styles.button}
                    type={"submit"}
                >
                    add task
                </button>
            </form>
        </div>
    );
}

export default AddTask;