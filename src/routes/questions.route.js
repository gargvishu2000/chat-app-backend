import { Router } from 'express';
const router = Router();
import { protectRoute } from '../middleware/auth.middleware.js'
import { getById,getAllQuestions,createQuestion,updateQuestion,deleteQuestion,upvoteQuestion, downvoteQuestion } from "../controllers/question.controller.js"
// Get all questions
router.get('/', getAllQuestions);

// Get question by ID
router.get('/:id', getById);

// Create a question
router.post('/', protectRoute,createQuestion);

// Update a question
router.put('/:id', protectRoute, updateQuestion);

// Delete a question
router.delete('/:id', protectRoute, deleteQuestion);

// Upvote a question
router.put('/upvote/:id', protectRoute, upvoteQuestion);

// Downvote a question
router.put('/downvote/:id', protectRoute,downvoteQuestion);

export default router;