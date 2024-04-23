const axios = require('axios');
const jsdom = require("jsdom");
const express = require('express')
const app = express();
const { JSDOM } = jsdom;

app.get('/codechef/:handle', async (req, res) => {
    try {
        let data = await axios.get(`https://www.codechef.com/users/${req.params.handle}`);
        let dom = new JSDOM(data.data);
        let document = dom.window.document;
        res.status(200).send({
            success: true,
            profile: document.querySelector('.user-details-container').children[0].children[0].src,
            name: document.querySelector('.user-details-container').children[0].children[1].textContent,
            currentRating: parseInt(document.querySelector(".rating-number").textContent),
            highestRating: parseInt(document.querySelector(".rating-number").parentNode.children[4].textContent.split('Rating')[1]),
            countryFlag: document.querySelector('.user-country-flag').src,
            countryName: document.querySelector('.user-country-name').textContent,
            globalRank: parseInt(document.querySelector('.rating-ranks').children[0].children[0].children[0].children[0].innerHTML),
            countryRank: parseInt(document.querySelector('.rating-ranks').children[0].children[1].children[0].children[0].innerHTML),
            stars: document.querySelector('.rating').textContent || "unrated",
        });
    } catch (err) {
        res.send({ success: false, error: err });
    }
})
app.get('/github/:handle', async (req, res) => {
    try {
        let data = await axios.get(`https://github-readme-stats.vercel.app/api/top-langs/?username=${req.params.handle}&theme=vue-dark&show_icons=true&hide_border=true&layout=compact&langs_count=100`);
        let dom = new JSDOM(data.data);
        let document = dom.window.document;
        const items = document.getElementsByClassName("lang-name")
        const dataStreak = await fetch(`https://streak-stats.demolab.com?user=${req.params.handle}&type=json`)
        const commitData = await dataStreak.json()
        const totalCommits = commitData.totalContributions
        const finalData = []

        for (let i = 0; i < items.length; i++) {
            const item = items[i].innerHTML.trim().split(" ")
            const itemToPush = {
                "language": item[0],
                "percent_contribute": item[item.length - 1],
                "total_contribution": Math.round(((totalCommits * Number(item[item.length - 1].split("%")[0])) / 100))
            }
            finalData.push(itemToPush)
        }
        res.status(200).send({
            success: true,
            profile: finalData,
        });
    } catch (err) {
        res.send({ success: false, error: err });
    }
})

const PORT = process.env.PORT || 8800;
app.listen(PORT);
