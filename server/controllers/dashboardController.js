const Note = require('../models/Notes');
const mongoose = require('mongoose');
/**
 * GET 
 * homepage
 */
/*async function insertDummyCategoryData() {
    try {
        await Note.insertMany([
            {
                user: "678e667c5a51e81185865bb7",
                title: "Module-1",
                body: "this is the basics of networking",
                createdAt: new Date(1671634422539),
            },
            {
                user: "678e667c5a51e81185865bb7",
                title: "Module-2",
                body: "this is the basics of packet tracer in networking",
                createdAt: new Date(1671634422539),
            },
            {
                user: "678e667c5a51e81185865bb7",
                title: "Module-3",
                body: "these are some of the protocols in networking",
                createdAt: new Date(1671634422539),
            },
            {
                user: "678e667c5a51e81185865bb7",
                title: "Module-4",
                body: "Let's look into JS animations",
                createdAt: "1671634422539",
                updatedAt: "1671634422539"
            },
            {
                user: "678e667c5a51e81185865bb7",
                title: "Module-5",
                body: "Let's look into JS animations",
                createdAt: "1671634422539",
                updatedAt: "1671634422539"
            },
            {
                user: "678e667c5a51e81185865bb7",
                title: "Module-6",
                body: "JavaScript Animations are pretty cool.",
                createdAt: "1671634422539",
                updatedAt: "1671634422539"
            },
            {
                user: "678e667c5a51e81185865bb7",
                title: "Module-7",
                body: "In this short tutorial, I will re-use some of the code I wrote for a YouTube tutorial creating an Apex Legend-inspired menu. I will make a simple function that fetches data from a dummy API and display some of it on the page.",
                createdAt: "1671634422539",
                updatedAt: "1671634422539"
            },
            {
                user: "678e667c5a51e81185865bb7",
                title: "Module-7",
                body: "Node.js runs on the V8 JavaScript Engine and executes JavaScript code outside a web browser.",
                createdAt: "1671634422539",
                updatedAt: "1671634422539"
            },
            {
                user: "678e667c5a51e81185865bb7",
                title: "Module-8",
                body: "Node.js is an open-source server environment. Node.js is cross-platform and runs on Windows Linux Unix and macOS. Node.js is a back-end JavaScript runtime environment. Node.js runs on the V8 JavaScript Engine and executes JavaScript code outside a web browser.",
                createdAt: "1671634422539",
                updatedAt: "1671634422539"
            },
            {
                user: "678e667c5a51e81185865bb7",
                title: "Module-9",
                body: "Morgan is a Node.js middleware to log HTTP requests. Monitoring and reading logs can help you better understand how your application behaves.",
                createdAt: "1671634422539",
                updatedAt: "1671634422539"
            },
            {
                user: "678e667c5a51e81185865bb7",
                title: "Module-10",
                body: "Learn how to add TailwindCSS to your React project and build a portfolio with Tailwind's grid layouts, typography, and responsive design.",
                createdAt: "1671634422539",
                updatedAt: "1671634422539"
            },
        ]);
    } catch (error) {
        console.log("Error inserting dummy data:", error);
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
/**
 * GET/
 * View Specific Note
 */
exports.dashboardViewNote = async (req, res) => {
    const note = await Note.findById({ _id: req.params.id })
      .where({ user: req.user.id })
      .lean();
  
    if (note) {
      res.render("dashboard/view-note", {
        noteID: req.params.id,
        note,
        layout: "../views/layouts/dashboard",
      });
    } else {
      res.send("Something went wrong.");
    }
  };

/**
 * PUT /
 * Update Specific Note
 */
exports.dashboardUpdateNote = async (req, res) => {
    try {
      await Note.findOneAndUpdate(
        { _id: req.params.id },
        { title: req.body.title, body: req.body.body, updatedAt: Date.now() }
      ).where({ user: req.user.id });
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };
  
  /**
   * DELETE /
   * Delete Note
   */
  exports.dashboardDeleteNote = async (req, res) => {
    try {
      await Note.deleteOne({ _id: req.params.id }).where({ user: req.user.id });
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };
  
  /**
   * GET /
   * Add Notes
   */
  exports.dashboardAddNote = async (req, res) => {
    res.render("dashboard/add", {
      layout: "../views/layouts/dashboard",
    });
  };
  
  /**
   * POST /
   * Add Notes
   */
  exports.dashboardAddNoteSubmit = async (req, res) => {
    try {
      req.body.user = req.user.id;
      await Note.create(req.body);
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };
  
  /**
   * GET /
   * Search
   */
  exports.dashboardSearch = async (req, res) => {
    try {
      res.render("dashboard/search", {
        searchResults: "",
        layout: "../views/layouts/dashboard",
      });
    } catch (error) {}
  };
  
  /**
   * POST /
   * Search For Notes
   */
  exports.dashboardSearchSubmit = async (req, res) => {
    try {
      let searchTerm = req.body.searchTerm;
      const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
  
      const searchResults = await Note.find({
        $or: [
          { title: { $regex: new RegExp(searchNoSpecialChars, "i") } },
          { body: { $regex: new RegExp(searchNoSpecialChars, "i") } },
        ],
      }).where({ user: req.user.id });
  
      res.render("dashboard/search", {
        searchResults,
        layout: "../views/layouts/dashboard",
      });
    } catch (error) {
      console.log(error);
    }
  };