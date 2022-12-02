import {useContext, useState} from "react";
import dayjs from "dayjs";

import {ServiceContext} from "Context";

import styles from "./task.less";

function Task({id, title, description, date, status}) {
    const service = useContext(ServiceContext);
    const dayjsDate = dayjs(date.seconds * 1000);
    const formatDate = dayjsDate.format("MM/DD/YYYY");
    const expired = dayjsDate.diff(dayjs(new Date())) < 0 ? true : false;
    const statusClass = (status === 'done') ? styles.done : '';
    const expiredClass = expired ? styles.expired : statusClass; // no clsx :(
    const [files, setFiles] = useState(null);

    if (files === null) {
        service.getFiles(id).then((res) => {
            setFiles(res);
        })
    }

    function editField(field) {
        const newValue = prompt(`Enter new ${field}`);

        if (newValue !== null) {
            service.editTask(id, field, newValue);
        }
    }

    function editDate() {
        const promptedValue = prompt('Enter new date in format MM/DD/YYYY');

        if (promptedValue === null) {
            return;
        }

        const newValue = dayjs(promptedValue, "MM/DD/YYYY");

        if (newValue.isValid()) {
            service.editTask(id, 'date', new Date(promptedValue));
        } else {
            alert('Invalid input');
        }
    }

    function showFiles() {
        const names = files.names;
        const links = files.links;

        if (names.length === 0) {
            return;
        }

        const renderFiles =
            <div>
                <span>Files:</span>

                <ul>
                    {names.map((name, key) => {
                        return (
                            <li key={key}>
                                <a href={links[key]}>
                                    {name}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>;

        return renderFiles;
    }

    function changeStatus(status) {
        service.editTask(id, 'status', status);
    }

    return (
        <div className={`${styles.container} ${expiredClass}`}>
            <p
                className={styles.title}
                onClick={() => editField('title')}
            >
                {title}
            </p>

            <p
                className={styles.description}
                onClick={() => editField('description')}
            >
                {description}
            </p>

            <p
                className={styles.date}
                onClick={editDate}
            >
                {formatDate}
            </p>

            <div>
                {files === null
                    ? 'Checking for files...'
                    : showFiles()
                }
            </div>

            <p
                className={styles.close}
                onClick={() => service.deleteTask(id)}
            >
                [x]
            </p>

            {
                !expired
                    ? status === 'done'
                        ? <button
                            className={styles.button}
                            onClick={() => changeStatus('undone')}
                        >
                            Undone
                        </button>

                        : <button
                            className={styles.button}
                            onClick={() => changeStatus('done')}
                        >
                            Done
                        </button>
                    : <p>expired</p>
            }
        </div>
    );
}

export default Task;