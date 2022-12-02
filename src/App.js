import {useCallback, useState, useRef} from "react";
import {ref, getDownloadURL, uploadBytes, listAll, deleteObject} from "firebase/storage";

import TodoList from "./components/todoList/TodoList";

import {ServiceContext} from "./Context";
import {db, storage} from "./Firebase";
import "./app.less";

function App() {
    const [list, setList] = useState([]);
    const dbList = db.collection("todoList");
    let formRef = useRef(null);

    const getTodoList = useCallback(async () => {
        const list = await dbList.get();
        const data = [];

        list.forEach((item) => {
            data.push(item);
        });

        setList(data);
    }, [dbList]);

    function editTask(id, field, value) {
        dbList.doc(id).update({
            [field]: value,
        })
            .then(() => {
                console.log("Document successfully updated!");
                getTodoList();
            })
            .catch((error) => {
                console.error("Error updating document: ", error);
            });
    }

    const getFiles = useCallback(async (id) => {
        const filesRef = ref(storage, id);
        let names = [];
        let links = [];

        const itemsRefs = (await listAll(filesRef)).items;

        for (const item of itemsRefs) {
            names.push(item.name);
            links.push(await getDownloadURL(item));
        }

        return {names, links};
    }, []);

    const deleteTask = useCallback((id) => {
        dbList.doc(id).delete().then(() => {
            console.log("Document successfully deleted!");
            getTodoList();
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });

        const filesRef = ref(storage, id);

        listAll(filesRef).then((res) => {
            res.items.forEach((item) => {
                deleteObject(item).then(() => {
                    console.log("Files successfully deleted!");
                }).catch((error) => {
                    console.error("Error removing files: ", error);
                });
            })
        });
    }, [dbList, getTodoList]);

    function addTask(title, description, date, files) {
        dbList.add({
            title: title,
            description: description,
            date: date,
        })
            .then((docRef) => {
                if (files.length > 0) {
                    uploadFiles(docRef.id, files);
                } else {
                    formRef.current.reset();
                    getTodoList();
                }
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    }

    function uploadFiles(id, files) {
        let names = [];
        let refs = [];

        for (const file of files) {
            const fileRef = ref(storage, `${id}/${file.name}`);

            uploadBytes(fileRef, file).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((url) => {
                    refs.push(url);
                    names.push(file.name);
                    getTodoList();
                });
            });
        }

        formRef.current.reset();
    }

    return (
        <ServiceContext.Provider value={{editTask, getFiles, deleteTask, addTask, formRef}}>
            <TodoList
                list={list}
                getTodoList={getTodoList}
            />
        </ServiceContext.Provider>
    );
}

export default App;
