const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const DB_OPS_URL = process.env.DB_OPS_URL;

// Tool: Get sentiment breakdown
app.post('/tools/get_sentiment_breakdown', async (req, res) => {
  try {
    const { videoId } = req.body;
    console.log(`📥 get_sentiment_breakdown for video: ${videoId}`);

    const summary = await axios.get(`${DB_OPS_URL}/analysis/summary/${videoId}`);

    res.json({
      videoId,
      positive: summary.data.positiveCount,
      negative: summary.data.negativeCount,
      neutral: summary.data.neutralCount,
      total: summary.data.totalComments
    });

  } catch (error) {
    console.error('Tool error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Tool: Get top comments by type
app.post('/tools/get_top_comments', async (req, res) => {
  try {
    const { videoId, type, limit = 10 } = req.body;
    console.log(`📥 get_top_comments: ${type} for video ${videoId}`);

    const analysis = await axios.get(`${DB_OPS_URL}/analysis/video/${videoId}`);
    const allAnalysis = analysis.data;

    let filtered = [];
    switch (type) {
      case 'positive':
        filtered = allAnalysis.filter(a => a.sentiment === 'positive');
        break;
      case 'negative':
        filtered = allAnalysis.filter(a => a.sentiment === 'negative');
        break;
      case 'controversial':
        filtered = allAnalysis.filter(a => a.isControversial);
        break;
      case 'questions':
        filtered = allAnalysis.filter(a => a.isQuestion);
        break;
      case 'suggestions':
        filtered = allAnalysis.filter(a => a.isSuggestion);
        break;
    }

    const topComments = filtered.slice(0, limit).map(a => ({
      commentId: a.commentId,
      text: a.comment?.commentText || 'N/A',
      sentiment: a.sentiment,
      score: a.sentimentScore
    }));

    res.json({
      videoId,
      type,
      count: filtered.length,
      comments: topComments
    });

  } catch (error) {
    console.error('Tool error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Tool: Search comments
app.post('/tools/search_comments', async (req, res) => {
  try {
    const { videoId, keyword } = req.body;
    console.log(`📥 search_comments: "${keyword}" in video ${videoId}`);

    const comments = await axios.get(`${DB_OPS_URL}/comments/video/${videoId}?limit=100`);

    const matching = comments.data.comments.filter(c =>
      c.commentText.toLowerCase().includes(keyword.toLowerCase())
    );

    res.json({
      videoId,
      keyword,
      matchCount: matching.length,
      matches: matching.slice(0, 10).map(c => ({
        commentId: c.commentId,
        text: c.commentText,
        author: c.authorName
      }))
    });

  } catch (error) {
    console.error('Tool error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Tool: Get top liked comments
app.post('/tools/get_top_likes', async (req, res) => {
  try {
    const { videoId, limit = 10 } = req.body;
    console.log(`📥 get_top_likes for video: ${videoId}`);

    console.log(`${DB_OPS_URL}/comments/video/${videoId}/top-likes?limit=${limit}`);


    const topLiked = await axios.get(`${DB_OPS_URL}/comments/video/${videoId}/top-likes?limit=${limit}`);

    console.log(`${DB_OPS_URL}/comments/video/${videoId}/top-likes?limit=${limit}`);


    console.log(topLiked);

    res.json({
      videoId,
      count: topLiked.data.topLiked.length,
      comments: topLiked.data.topLiked.map(c => ({
        commentId: c.commentId,
        text: c.commentText,
        author: c.authorName,
        likeCount: c.likeCount,
        replyCount: c.replyCount
      }))
    });

  } catch (error) {
    console.error('Tool error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Tool: Get top replied comments
app.post('/tools/get_top_replies', async (req, res) => {
  try {
    const { videoId, limit = 10 } = req.body;
    console.log(`📥 get_top_replies for video: ${videoId}`);

    const topReplied = await axios.get(`${DB_OPS_URL}/comments/video/${videoId}/top-replies?limit=${limit}`);

    res.json({
      videoId,
      count: topReplied.data.topReplied.length,
      comments: topReplied.data.topReplied.map(c => ({
        commentId: c.commentId,
        text: c.commentText,
        author: c.authorName,
        likeCount: c.likeCount,
        replyCount: c.replyCount
      }))
    });

  } catch (error) {
    console.error('Tool error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'MCP Gateway' });
});

const PORT = process.env.PORT || 5001

app.listen(PORT, () => {
  console.log(`🐳 MCP Gateway running on port ${PORT}`);
  console.log('📍 Endpoints:');
  console.log('   POST /tools/get_sentiment_breakdown');
  console.log('   POST /tools/get_top_comments');
  console.log('   POST /tools/search_comments');
  console.log('   POST /tools/get_top_likes');
  console.log('   POST /tools/get_top_replies');
  console.log('   GET  /health');
});
