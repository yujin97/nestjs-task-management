import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v1 as uuid } from 'uuid'
import { CreateTaskDto } from './dto/create-task-dto';
import { UpdateTaskDto } from './dto/update-task-dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
    private tasks = [];
    
    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTasksWithFilters(filterDto: GetTasksFilterDto): Task[]{
        const { status, search } = filterDto;
        let tasks = this.getAllTasks();
        if(status) {
            tasks = tasks.filter(task => task.status === status);
        }

        if(search) {
            tasks = tasks.filter(task => 
                task.title.includes(search) ||
                task.description.includes(search)
                );
        }

        return tasks
    }

    getTaskById(id: string): Task {
        const found = this.tasks.find( task => task.id === id)
        if(!found) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }

        return found
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
        const found  = this.getTaskById(id);
        this.tasks.forEach( (task, i) => {
            if(task.id == found.id) {
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
