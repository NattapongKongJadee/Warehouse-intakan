import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project } from './project.entities';
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  findAll(): Promise<Project[]> {
    return this.projectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Project | null> {
    return this.projectService.findOne(id);
  }

  @Post()
  create(@Body() projectData: Partial<Project>): Promise<Project> {
    return this.projectService.create(projectData);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() projectData: Partial<Project>,
  ): Promise<Project | null> {
    return this.projectService.update(id, projectData);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.projectService.delete(id);
  }
}
