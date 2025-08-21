module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({ 
    message: 'Test API funcionando!',
    timestamp: new Date().toISOString()
  });
};
