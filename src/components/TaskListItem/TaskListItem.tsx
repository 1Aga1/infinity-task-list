import React, {FC, useEffect, useState} from 'react';
import {ITaskListItemProps} from "./ITaskListItemProps";
import {ITask} from "../../type/task";
import tasks from "../../store/Tasks";
import style from './TaskListItem.module.scss'
import {Checkbox, message} from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import {observer} from "mobx-react-lite";

const TaskListItem: FC<ITaskListItemProps> = ({task, childrenStyle}) => {
    const [childrenList, setChildrenList] = useState<ITask[]>([]);
    const [childrenOpen, setChildrenOpen] = useState<boolean>(false);

    useEffect(() => {
        setChildrenList(tasks.getChildrenTaskList(task.id))
    }, [tasks.tasks])

    const onCheck = (e: CheckboxChangeEvent) => {
        if (e.target.checked) tasks.selectTask(task.id)
        else tasks.deselectTask(task.id);
    }

    const taskClickHandler = () => {
        if (!childrenOpen) {
            try {
                tasks.getTask(task.id);
                setChildrenOpen(true);
            } catch (e) {
                message.error('Ошибка загрузки задач!');
            }
        } else setChildrenOpen(false);
    }

    return (
        <div style={childrenStyle}>
            <div className={style.task} onClick={taskClickHandler}>
                {
                    childrenList.length > 0
                        ?
                        <div className={childrenOpen ? style.arrow__open : style.arrow__close}></div>
                        : null
                }
                <p className={style.task__name}>{task.name}</p>
                <Checkbox onChange={onCheck}
                          checked={!!tasks.selectedTasks.find(selectedTask => selectedTask.id === task.id)}
                ></Checkbox>
            </div>
            <>
                {
                    childrenList.length > 0 && childrenOpen
                        ?
                        childrenList.map(childrenTask =>
                            <TaskListItem task={childrenTask} childrenStyle={{margin: '5px 0 5px 10px'}} key={childrenTask.id}/>
                        )
                        : null
                }
            </>
        </div>
    );
};

export default observer(TaskListItem);