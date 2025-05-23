
import Question from "../models/question.model.js";

export const getAllQuestions = async(req,res)=>{
      try {
        const questions = await Question.find()
          .sort({ createdAt: -1 })
          .populate('author', 'username avatar');
        res.json(questions);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
}

export const getById= async(req,res)=>{
     try {
        const question = await Question.findById(req.params.id)
          .populate('author', 'username avatar');
        
        if (!question) {
          return res.status(404).json({ msg: 'Question not found' });
        }
        
        res.json(question);
      } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
          return res.status(404).json({ msg: 'Question not found' });
        }
        res.status(500).send('Server error');
      }
}

export const createQuestion=async(req,res)=>{
     try {
        const { title, body, tags } = req.body;
        console.log(req.user.id);
        
        const newQuestion = new Question({
          title,
          body,
          author: req.user.id,
          tags: tags ? tags.split(',').map(tag => tag.trim()) : []
        });
        
        const question = await newQuestion.save();
        console.log(question);
        
        await question.populate('author', 'username avatar');

        
        res.json(question);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
}

export const updateQuestion=async(req,res)=>{
    try {
    const { title, body, tags } = req.body;
    
    let question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }
    
    // Check user ownership
    if (question.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    question.title = title || question.title;
    question.body = body || question.body;
    if (tags) {
      question.tags = tags.split(',').map(tag => tag.trim());
    }
    
    await question.save();
    await question.populate('author', 'username avatar').execPopulate();
    
    res.json(question);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Question not found' });
    }
    res.status(500).send('Server error');
  }
}

export const deleteQuestion=async(req,res)=>{
     try {
        const question = await Question.findById(req.params.id);
        
        if (!question) {
          return res.status(404).json({ msg: 'Question not found' });
        }
        
        // Check user ownership
        if (question.author.toString() !== req.user.id) {
          return res.status(401).json({ msg: 'User not authorized' });
        }
        
        await question.remove();
        
        res.json({ msg: 'Question removed' });
      } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
          return res.status(404).json({ msg: 'Question not found' });
        }
        res.status(500).send('Server error');
      }
}

export const upvoteQuestion=async(req,res)=>{
    try {
        const question = await Question.findById(req.params.id);
        
        if (!question) {
          return res.status(404).json({ msg: 'Question not found' });
        }
        
        // Check if already upvoted
        if (question.upvotes.includes(req.user.id)) {
          // Remove upvote
          question.upvotes = question.upvotes.filter(id => id.toString() !== req.user.id);
        } else {
          // Add upvote and remove downvote if exists
          question.upvotes.push(req.user.id);
          question.downvotes = question.downvotes.filter(id => id.toString() !== req.user.id);
        }
        
        await question.save();
        
        res.json({
          upvotes: question.upvotes.length,
          downvotes: question.downvotes.length
        });
      } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
          return res.status(404).json({ msg: 'Question not found' });
        }
        res.status(500).send('Server error');
      }
}

export const downvoteQuestion=async(req,res)=>{
    try {
        const question = await Question.findById(req.params.id);
        
        if (!question) {
          return res.status(404).json({ msg: 'Question not found' });
        }
        
        // Check if already downvoted
        if (question.downvotes.includes(req.user.id)) {
          // Remove downvote
          question.downvotes = question.downvotes.filter(id => id.toString() !== req.user.id);
        } else {
          // Add downvote and remove upvote if exists
          question.downvotes.push(req.user.id);
          question.upvotes = question.upvotes.filter(id => id.toString() !== req.user.id);
        }
        
        await question.save();
        
        res.json({
          upvotes: question.upvotes.length,
          downvotes: question.downvotes.length
        });
      } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
          return res.status(404).json({ msg: 'Question not found' });
        }
        res.status(500).send('Server error');
      }
}