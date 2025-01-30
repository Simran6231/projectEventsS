const Event = require("../models/Event");
const mongoose = require("mongoose");
/**
 * GET /
 * Homepage 
*/
/*
async function insertDummyCategoryData(){
    try{
        await Event.insertMany([
            {
                user:"679b9b45e1b448d38cd1f5ad",
                title:"Arijit Singh - LIVE in Concert",
                body:"The Voice of the generation makes a much awaited comeback to the stage.After two sold out cities, Arijit Singh’s India tour comes to yours! Get ready for an unforgettable musical journey with India’s most beloved voice.",
                venue:"Gate 2 Leisure Valley Park Parking Gurugram, Gurugram",
                createdAt:"1671634422539"
            },
            {
                user:"679b9b45e1b448d38cd1f5ad",
                title:"Indian Sneaker Festival ft. 21 Savage",
                body:"India, Are You Ready? The Indian Sneaker Festival Returns in 2025!",
                venue:"Backyard Sports Club, Gurugram",
                createdAt:"1671634422539"
            },
            {
                user:"679b9b45e1b448d38cd1f5ad",
                title:"Royal Stag Boombox Season 3 I Gurugram",
                body:"Royal Stag Boombox Season 3 is Here !!!Get ready for an unforgettable multi-city festival of music, food, and fun!Experience the ultimate fusion of Bollywood and Hip-Hop with electrifying performance by Armaan Malik, the melodious Neeti Mohan, along with India’s hip-hop sensation Raftaar.",
                venue:"Huda Ground, Gurugram",
                createdAt:"1671634422539"
            },
            {
                user:"679b9b45e1b448d38cd1f5ad",
                title:"Mughal-E-Azam | Delhi",
                body:"Mughal-e-Azam: The Musical (Hindi, with sub-titles in English) is a stage adaptation of K. Asif’s timeless 1960 classic film Mughal-e-Azam. Post its premiere in 2016, the musical has delighted audiences with over 275 performances across eight nations (India, Canda, Malaysia, Oman, Qatar, Singapore, UAE & USA).",
                venue:"Jawahar Lal Nehru Indoor Weightlifting Auditorium, Delhi",
                createdAt:"1671634422539"
            },
            {
                user:"679b9b45e1b448d38cd1f5ad",
                title:"Kathakar – International Storytellers Festival",
                body:"Kathakar is India`s first and Asia’s biggest storytelling festival. The festival features Storytelling sessions from India and abroad, Conversations with acclaimed artists and performers, Musical performances by renowned folk artists.",
                venue:"Sunder Nursery, Delhi",
                createdAt:"1671634422539"
            },
            {
                user:"679b9b45e1b448d38cd1f5ad",
                title:"Paradox and RoomXO presents Marsh - Gurugram",
                body:"Get ready for an unforgettable night as Marsh, one of the most dynamic and sought-after talents in the electronic music scene, makes his highly anticipated return to Delhi! Presented by Paradox and RoomXO,",
                venue:"ROOM XO Gurgaon, Gurugram",
                createdAt:"1671634422539"
            },
            {
                user:"679b9b45e1b448d38cd1f5ad",
                title:"The Hip Hop Take Over",
                body:"Get ready for the wildest night of 2025! The Hip Hop Take Over is taking over Black Lotus, and it’s going to be a night to remember.",
                venue:"Black Lotus Gurugram, Gurugram",
                createdAt:"1671634422539"
            },
            {
                user:"679b9b45e1b448d38cd1f5ad",
                title:"TIËSTO India Tour 2025 | Delhi NCR",
                body:"The legendary DJ and Grammy Award-winning artist Tiësto is bringing his electrifying beats to Delhi on 13th February 2025! Known as the Godfather of EDM,",
                venue:"Backyard Sports Club, Gurugram",
                createdAt:"1671634422539"
            },
            {
                user:"679b9b45e1b448d38cd1f5ad",
                title:"Boho Bazaar – The Epic Flea Market 6.0",
                body:"It’s that magical time of the year again! The 6th edition of Boho Bazaar is here to make your February unforgettable. Join us on 15th & 16th February 2025 at Gate No. 14, JLN Stadium, from 12 PM to 10 PM, and get ready for a weekend like no other.",
                venue:"JLN Stadium, Gate No. 14, Delhi",
                createdAt:"1671634422539"
            },
            {
                user:"679b9b45e1b448d38cd1f5ad",
                title:"Delhi's Finest Standup",
                body:"Best Sunday Plans have laughter in them, that's why you need to be here for a laughter ride with the best comics from Delhi Comedy Circuit, who will be performing in this lineup.Buckle up for an unforgettable evening of hilarious jokes and side-splitting laughter as the best comics in town come together for one epic comedy night in the hub of Hauz Khas Village just above Social.",
                venue:"LIGHT ROOM, Delhi",
                createdAt:"1671634422539"
            }  
        ]);
    }catch(error){
        console.log(error);
    }
    
}
insertDummyCategoryData();
*/
exports.dashboard = async (req, res) => {

    let perPage = 12;
    let page = req.query.page || 1;
  
    const locals = {
      title: "Dashboard",
      description: "Free NodeJS Notes App.",
    };
  
    try {
      // Mongoose "^7.0.0 Update
      const event = await Event.aggregate([
        { $sort: { updatedAt: -1 } },
        { $match: { user: mongoose.Types.ObjectId(req.user.id) } },
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
  
      const count = await Event.count();
  
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
  