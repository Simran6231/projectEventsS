/**
 * GET /
 * Homepage 
*/
exports.homepage = async (req, res) => {
    const locals = {
      title: "NodeJs Events",
      description: "Free NodeJS Events App.",
    }
    res.render('index', {
      locals,
      layout: '../views/layouts/front-page'
    });
  }
  

  /**
 * About 
*/
exports.about = async (req, res) => {
    const locals = {
      title: "About - NodeJs Events",
      description: "Free NodeJS Events App.",
    }
    res.render('about', locals);
  }