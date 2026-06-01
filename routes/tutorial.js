const express = require('express');
const router = express.Router();

const tutoriais = {
  samsung: require('../tutoriais/samsung'),
  lg: require('../tutoriais/lg'),
  roku: require('../tutoriais/roku'),
  androidtv: require('../tutoriais/androidtv'),
  tvbox: require('../tutoriais/tvbox'),
  firetv: require('../tutoriais/firetv'),
  android: require('../tutoriais/android'),
  iphone: require('../tutoriais/iphone')
};

router.get('/:id', (req, res) => {
  const tutorial = tutoriais[req.params.id];

  if (!tutorial) {
    return res.status(404).json({
      success: false,
      mensagem: 'Tutorial não encontrado.'
    });
  }

  return res.json({
    success: true,
    tutorial
  });
});

module.exports = router;
