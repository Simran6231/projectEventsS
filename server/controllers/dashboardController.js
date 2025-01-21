const Note= require('../models/Notes');
const mongoose=require('mongoose');
/**
 * GET 
 * homepage
 */
/*async function insertDummyCategoryData(){
    try{
        await Note.insertMany([
            {
                user:"111464846749887144539",
                title:"Module-1",
                body:"this is the basics of networking",
                createdAt:new Date(1671634422539)
            },
            {
                user:"111464846749887144539",
                title:"Module-2",
                body:"this is the basics of packet tracer in networking",
                createdAt:new Date(1671634422539)
            },
            {
                user:"111464846749887144539",
                title:"Module-1",
                body:"these are some of the protocols in networking",
                createdAt:new Date(1671634422539)
            },

        ])

    }catch(error){
        console.log("err",error);

    }
    
}
insertDummyCategoryData();*/


exports.dashboard = async (req, res) => {

    let perPage = 12;
    let page = req.query.page || 1;
  
    const locals = {
      title: "Dashboard",
      description: "Free NodeJS Notes App.",
    };
  
    try {
      
      const notes = await Note.aggregate([
        { $sort: { updatedAt: -1 } },
        { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
        {
          $project: {
            title: { $substr: ["$title", 0, 30] },
            body: { $substr: ["$body", 0, 100] },
          },
        }
      ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
  
      const count = await Note.countDocuments();
  
      res.render('dashboard/index', {
        userName: req.user.firstName,
        locals,
        notes,
        layout: "../views/layouts/dashboard",
        current: page,
        pages: Math.ceil(count / perPage)
      });
     } catch (error) {
      console.log(error);
    }
  };