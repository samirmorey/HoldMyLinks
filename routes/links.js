const CategoryLink = require("../models/Categorylink");
const { ensureAuth } = require("../middleware/auth");

const express = require("express");

const router = new express.Router();


//Adding a new category with at least one link
router.post("/add", ensureAuth, async (req, res) => {
  const link = req.body.link
  if(link.indexOf('https://') == -1){
    // console.log('yes')
    req.body.link = 'https://' + req.body.link
  }
	const validCreation = {
		categoryName: req.body.categoryName,
		links: [
			{
				link: req.body.link,
				description: req.body.description
			}
		],
    user: req.user.id
	}
  const newCategory = new CategoryLink(validCreation);

  try {
    const newC = await newCategory.save();
    // res.status(201).send(newC);
    res.redirect('/dashboard')
  } catch (e) {
    console.log(e);
    res.status(500).send({ e });
  }
});

//Get request to adding new link to existing category
router.get('/add/:id',ensureAuth,async (req,res) => {
  try{
    const category = await CategoryLink.findById({_id: req.params.id });
    res.render('catadd',{
      userprof: req.user,
      helper: require('../helpers/dateparse'),
      id: req.params.id,
      name: category.categoryName
    })
  } catch(e){
    console.log(e);
    res.redirect('/dashboard')
  }
})

//Adding new link to existing category
router.patch("/add/:id", ensureAuth, async (req, res) => {
  const link = req.body.link
  if(link.indexOf('https://') == -1){
    // console.log('yes')
    req.body.link = 'https://' + req.body.link
  }
  const category_id = req.params.id;
  CategoryLink.findByIdAndUpdate(
    category_id,
    { $push: { links: req.body } },
    { safe: true, upsert: true },
    function (err, model) {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      return res.redirect('/dashboard');
    }
  );
});

router.get("/update/:id",ensureAuth,async (req,res) => {
  try{
    const category = await CategoryLink.findById({_id: req.params.id });
    res.render('catedit',{
      userprof: req.user,
      helper: require('../helpers/dateparse'),
      id: req.params.id,
      name: category.categoryName
    })
  } catch(e) {
    console.log(e);
    res.redirect('/dashboard')
  }
})

router.get('/updatelink/:catid/:id', ensureAuth , async (req,res) => {
  try{
    const category = await CategoryLink.findById({_id: req.params.catid });
    console.log(category)
    const userupadtionlink = category.links.find((el) => el._id == req.params.id)
     console.log(userupadtionlink)
     res.render('updatelink',{
    userprof: req.user,
      helper: require('../helpers/dateparse'),
      id: req.params.id,
      name: category.categoryName,
      desc: userupadtionlink.description,
      link: userupadtionlink.link

  })
  }catch(e){
    console.log(e);
    res.redirect('/dashboard')

  }
 
})

//Updating a name of category
router.patch("/update/:id", ensureAuth, async (req, res) => {
  const catid = req.params.id;
  const validUpdates = ["categoryName"];
  const userUpdates = Object.keys(req.body);
  const isValid = userUpdates.every((el) => validUpdates.includes(el));
  if (!isValid) {
    return res.send({ error: "Invalid Updates" });
  }
  try {
    const existCat = await CategoryLink.findOne({ _id: catid });

    if (!existCat) {
      return res.status(404).send();
    }
    console.log(existCat);

    userUpdates.forEach((update) => (existCat[update] = req.body[update]));

    await existCat.save();

    res.redirect('/dashboard');
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

//Updating a link inside a existing category
router.patch("/updatelink/:id", ensureAuth, async (req, res) => {
  const link_id = req.params.id;
  CategoryLink.update(
    { "links._id": link_id },
    {
      $set: {
        "links.$.link": req.body.link,
        "links.$.description": req.body.description,
      },
    },
    function (err, model) {
      if (err) {
        console.log(err);
        return res.redirect('/dashboard');
      }
      return res.redirect('/dashboard');
    }
  );
});

//Deleting a link in a existing category
router.delete("/deletelink/:catid/:id", ensureAuth, async (req, res) => {
  const catid = req.params.catid;
  const linkid = req.params.id;

  CategoryLink.findByIdAndUpdate(
    catid,
    { $pull: { links: { _id: linkid } } },
    function (err, model) {
      if (err) {
        console.log(err);
        return res.redirect('/dashboard');

      }
      return res.redirect('/dashboard');
    }
  );
});

//Deleting a category
router.delete("/delete/:id", ensureAuth, async (req, res) => {
  const _id = req.params.id;
  try {
    const existCat = await CategoryLink.findOneAndDelete({ _id });
    if (!existCat) {
      return res.status(404).send();
    }
    // res.send(existCat);
   res.redirect('/dashboard')
  } catch (e) {
    console.log(e);
    res.redirect('/dashboard')
  }
});

module.exports = router;
