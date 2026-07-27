import { Router } from 'express';
import { portfolioController } from '../controllers/portfolio.controller';
import { sectionController } from '../controllers/section.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/public/:slug', portfolioController.getPublic);

// Protected routes (Requires Auth)
router.use(requireAuth);

// Root Portfolio CRUD
router.route('/')
  .get(portfolioController.getList)
  .post(portfolioController.create);

router.route('/:id')
  .get(portfolioController.getOne)
  .put(portfolioController.update)
  .delete(portfolioController.delete);

router.post('/:id/duplicate', portfolioController.duplicate);

// 1-to-1 Sections
router.put('/:portfolioId/theme', portfolioController.updateTheme);
router.put('/:portfolioId/profile', portfolioController.updateProfile);
router.put('/:portfolioId/about', portfolioController.updateAbout);
router.put('/:portfolioId/contact', portfolioController.updateContact);
router.put('/:portfolioId/socials', portfolioController.updateSocialLinks);

// Skills CRUD
router.post('/:portfolioId/skills', sectionController.addSkill);
router.put('/:portfolioId/skills/reorder', sectionController.reorderSkills);
router.route('/:portfolioId/skills/:id')
  .put(sectionController.updateSkill)
  .delete(sectionController.deleteSkill);

// Projects CRUD
router.post('/:portfolioId/projects', sectionController.addProject);
router.put('/:portfolioId/projects/reorder', sectionController.reorderProjects);
router.route('/:portfolioId/projects/:id')
  .put(sectionController.updateProject)
  .delete(sectionController.deleteProject);

// Experiences CRUD
router.post('/:portfolioId/experiences', sectionController.addExperience);
router.put('/:portfolioId/experiences/reorder', sectionController.reorderExperiences);
router.route('/:portfolioId/experiences/:id')
  .put(sectionController.updateExperience)
  .delete(sectionController.deleteExperience);

// Educations CRUD
router.post('/:portfolioId/educations', sectionController.addEducation);
router.put('/:portfolioId/educations/reorder', sectionController.reorderEducations);
router.route('/:portfolioId/educations/:id')
  .put(sectionController.updateEducation)
  .delete(sectionController.deleteEducation);

// Certificates CRUD
router.post('/:portfolioId/certificates', sectionController.addCertificate);
router.put('/:portfolioId/certificates/reorder', sectionController.reorderCertificates);
router.route('/:portfolioId/certificates/:id')
  .put(sectionController.updateCertificate)
  .delete(sectionController.deleteCertificate);

// Achievements CRUD
router.post('/:portfolioId/achievements', sectionController.addAchievement);
router.put('/:portfolioId/achievements/reorder', sectionController.reorderAchievements);
router.route('/:portfolioId/achievements/:id')
  .put(sectionController.updateAchievement)
  .delete(sectionController.deleteAchievement);

export default router;
