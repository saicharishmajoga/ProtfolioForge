import { Request, Response } from 'express';
import { portfolioService } from '../services/portfolio.service';
import { catchAsync } from '../utils/catch-async';
import { sendSuccess } from '../utils/response-formatter';
import {
  skillSchema,
  projectSchema,
  experienceSchema,
  educationSchema,
  certificateSchema,
  achievementSchema,
  reorderSchema,
} from '../validators/section.validator';
import { BadRequestError } from '../utils/custom-errors';

export class SectionController {
  // Skills CRUD
  addSkill = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const { portfolioId } = req.params;
    const validated = skillSchema.parse(req.body);
    const data = await portfolioService.addSkill(portfolioId, req.user.id, validated);
    return sendSuccess(res, data, 'Skill added successfully', 201);
  });

  updateSkill = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const { portfolioId, id } = req.params;
    const validated = skillSchema.parse(req.body);
    const data = await portfolioService.updateSkill(id, portfolioId, req.user.id, validated);
    return sendSuccess(res, data, 'Skill updated successfully', 200);
  });

  deleteSkill = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const { portfolioId, id } = req.params;
    await portfolioService.deleteSkill(id, portfolioId, req.user.id);
    return sendSuccess(res, null, 'Skill deleted successfully', 200);
  });

  reorderSkills = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const { portfolioId } = req.params;
    const validated = reorderSchema.parse(req.body);
    await portfolioService.reorderSkills(portfolioId, req.user.id, validated.ids);
    return sendSuccess(res, null, 'Skills reordered successfully', 200);
  });

  // Projects CRUD
  addProject = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const { portfolioId } = req.params;
    const validated = projectSchema.parse(req.body);
    const data = await portfolioService.addProject(portfolioId, req.user.id, validated);
    return sendSuccess(res, data, 'Project added successfully', 201);
  });

  updateProject = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const { portfolioId, id } = req.params;
    const validated = projectSchema.parse(req.body);
    const data = await portfolioService.updateProject(id, portfolioId, req.user.id, validated);
    return sendSuccess(res, data, 'Project updated successfully', 200);
  });

  deleteProject = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const { portfolioId, id } = req.params;
    await portfolioService.deleteProject(id, portfolioId, req.user.id);
    return sendSuccess(res, null, 'Project deleted successfully', 200);
  });

  reorderProjects = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const { portfolioId } = req.params;
    const validated = reorderSchema.parse(req.body);
    await portfolioService.reorderProjects(portfolioId, req.user.id, validated.ids);
    return sendSuccess(res, null, 'Projects reordered successfully', 200);
  });

  // Experiences CRUD
  addExperience = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const { portfolioId } = req.params;
    const validated = experienceSchema.parse(req.body);
    const data = await portfolioService.addExperience(portfolioId, req.user.id, validated);
    return sendSuccess(res, data, 'Experience added successfully', 201);
  });

  updateExperience = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const { portfolioId, id } = req.params;
    const validated = experienceSchema.parse(req.body);
    const data = await portfolioService.updateExperience(id, portfolioId, req.user.id, validated);
    return sendSuccess(res, data, 'Experience updated successfully', 200);
  });

  deleteExperience = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const { portfolioId, id } = req.params;
    await portfolioService.deleteExperience(id, portfolioId, req.user.id);
    return sendSuccess(res, null, 'Experience deleted successfully', 200);
  });

  reorderExperiences = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const { portfolioId } = req.params;
    const validated = reorderSchema.parse(req.body);
    await portfolioService.reorderExperiences(portfolioId, req.user.id, validated.ids);
    return sendSuccess(res, null, 'Experiences reordered successfully', 200);
  });

  // Educations CRUD
  addEducation = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const { portfolioId } = req.params;
    const validated = educationSchema.parse(req.body);
    const data = await portfolioService.addEducation(portfolioId, req.user.id, validated);
    return sendSuccess(res, data, 'Education added successfully', 201);
  });

  updateEducation = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const { portfolioId, id } = req.params;
    const validated = educationSchema.parse(req.body);
    const data = await portfolioService.updateEducation(id, portfolioId, req.user.id, validated);
    return sendSuccess(res, data, 'Education updated successfully', 200);
  });

  deleteEducation = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const { portfolioId, id } = req.params;
    await portfolioService.deleteEducation(id, portfolioId, req.user.id);
    return sendSuccess(res, null, 'Education deleted successfully', 200);
  });

  reorderEducations = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const { portfolioId } = req.params;
    const validated = reorderSchema.parse(req.body);
    await portfolioService.reorderEducations(portfolioId, req.user.id, validated.ids);
    return sendSuccess(res, null, 'Educations reordered successfully', 200);
  });

  // Certificates CRUD
  addCertificate = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const { portfolioId } = req.params;
    const validated = certificateSchema.parse(req.body);
    const data = await portfolioService.addCertificate(portfolioId, req.user.id, validated);
    return sendSuccess(res, data, 'Certificate added successfully', 201);
  });

  updateCertificate = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const { portfolioId, id } = req.params;
    const validated = certificateSchema.parse(req.body);
    const data = await portfolioService.updateCertificate(id, portfolioId, req.user.id, validated);
    return sendSuccess(res, data, 'Certificate updated successfully', 200);
  });

  deleteCertificate = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const { portfolioId, id } = req.params;
    await portfolioService.deleteCertificate(id, portfolioId, req.user.id);
    return sendSuccess(res, null, 'Certificate deleted successfully', 200);
  });

  reorderCertificates = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const { portfolioId } = req.params;
    const validated = reorderSchema.parse(req.body);
    await portfolioService.reorderCertificates(portfolioId, req.user.id, validated.ids);
    return sendSuccess(res, null, 'Certificates reordered successfully', 200);
  });

  // Achievements CRUD
  addAchievement = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const { portfolioId } = req.params;
    const validated = achievementSchema.parse(req.body);
    const data = await portfolioService.addAchievement(portfolioId, req.user.id, validated);
    return sendSuccess(res, data, 'Achievement added successfully', 201);
  });

  updateAchievement = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const { portfolioId, id } = req.params;
    const validated = achievementSchema.parse(req.body);
    const data = await portfolioService.updateAchievement(id, portfolioId, req.user.id, validated);
    return sendSuccess(res, data, 'Achievement updated successfully', 200);
  });

  deleteAchievement = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const { portfolioId, id } = req.params;
    await portfolioService.deleteAchievement(id, portfolioId, req.user.id);
    return sendSuccess(res, null, 'Achievement deleted successfully', 200);
  });

  reorderAchievements = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestError('User context required');
    const { portfolioId } = req.params;
    const validated = reorderSchema.parse(req.body);
    await portfolioService.reorderAchievements(portfolioId, req.user.id, validated.ids);
    return sendSuccess(res, null, 'Achievements reordered successfully', 200);
  });
}

export const sectionController = new SectionController();
