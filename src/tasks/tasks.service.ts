import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v1 as uuid } from 'uuid'
import { CreateTaskDto } from './dto/create-task-dto';
import { UpdateTaskDto } from './dto/update-task-dto';

@Injectable()
export class TasksService {
    private tasks = [];
    
    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTaskById(id: string): Task {
        return this.tasks.find( task => task.id === id)
    } 

    createTask(createTaskDto: CreateTaskDto) {
        const { title, description } = createTaskDto; 

        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN
        }
        this.tasks.push(task);
        return task;
    }

    deleteTaskById(id: string): void{
        this.tasks.forEach( (task, i) => {
            if(task.id == id) {
                this.tasks.splice(i,1);
            }
        })
    }

    updateTask(id: string, updateTaskDto: UpdateTaskDto): Task {
        const task = this.getTaskById(id);
        const { status } = updateTaskDto;
        task.status = status
        return task;

    }

}
