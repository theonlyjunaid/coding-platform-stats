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
app.get('/codeforces/:handle', async (req, res) => {
    try {
        let data = await axios.get(`https://codeforces.com/profile/${req.params.handle}`);
        let dom = new JSDOM(data.data);
        let document = dom.window.document;
        const items1 = document.getElementsByClassName("info")[0].children[1].children[0].textContent.trim().split(" ").pop().split(")")[0]
        res.status(200).send({
            success: true,
            Rating: Number(items1)
        });
    } catch (err) {
        res.send({ success: false, error: err });
    }
})
app.get('/leetcode/:handle', async (req, res) => {
    try {
        const dataStreak = await fetch(`https://leetcode-stats-api.herokuapp.com/${req.params.handle}`)
        const commitData = await dataStreak.json()
        res.status(200).send({
            success: true,
            Rating: commitData
        });
    } catch (err) {
        res.send({ success: false, error: err });
    }
})
app.get('/geekforgeeks/:handle', async (req, res) => {
    try {
        let data = await axios.get(`https://auth.geeksforgeeks.org/user/${req.params.handle}/practice/`);
        let dom = new JSDOM(data.data);
        let document = dom.window.document;
        const SCHOOL = document.querySelector(".tabs.tabs-fixed-width.linksTypeProblem").children[0].textContent.split("(")[1].split(")")[0]
        const BASIC = document.querySelector(".tabs.tabs-fixed-width.linksTypeProblem").children[1].textContent.split("(")[1].split(")")[0]
        const EASY = document.querySelector(".tabs.tabs-fixed-width.linksTypeProblem").children[2].textContent.split("(")[1].split(")")[0]
        const MEDIUM = document.querySelector(".tabs.tabs-fixed-width.linksTypeProblem").children[3].textContent.split("(")[1].split(")")[0]
        const HARD = document.querySelector(".tabs.tabs-fixed-width.linksTypeProblem").children[4].textContent.split("(")[1].split(")")[0]

        console.log(SCHOOL)
        res.status(200).send({
            success: true,
            SCHOOL: Number(SCHOOL),
            BASIC: Number(BASIC),
            EASY: Number(EASY),
            MEDIUM: Number(MEDIUM),
            HARD: Number(HARD)
        });
    } catch (err) {
        res.status(404).send({ success: false, error: err });
    }
})
app.get('/getdata', async (req, res) => {
    try {
        let leetcode = 0
        let github = 0
        let codechef = 0
        let codeforces = 0
        let geekforgeeks = 0
        if (req.query.leetcode) {
            try {
                const dataStreak = await fetch(`https://leetcode-stats-api.herokuapp.com/${req.params.handle}`)
                const commitData = await dataStreak.json()
                if (commitData.status !== "error") {
                    leetcode = commitData.easySolved * 1 + commitData.mediumSolved * 2 + commitData.hardSolved * 3
                }
                console.log(commitData)
            } catch (err) {
                leetcode = 0
                console.log(err)
            }
        }
        if (req.query.geekforgeeks) {
            try {
                let data = await axios.get(`https://auth.geeksforgeeks.org/user/${req.params.handle}/practice/`);
                let dom = new JSDOM(data.data);
                let document = dom.window.document;
                const SCHOOL = document.querySelector(".tabs.tabs-fixed-width.linksTypeProblem").children[0].textContent.split("(")[1].split(")")[0]
                const BASIC = document.querySelector(".tabs.tabs-fixed-width.linksTypeProblem").children[1].textContent.split("(")[1].split(")")[0]
                const EASY = document.querySelector(".tabs.tabs-fixed-width.linksTypeProblem").children[2].textContent.split("(")[1].split(")")[0]
                const MEDIUM = document.querySelector(".tabs.tabs-fixed-width.linksTypeProblem").children[3].textContent.split("(")[1].split(")")[0]
                const HARD = document.querySelector(".tabs.tabs-fixed-width.linksTypeProblem").children[4].textContent.split("(")[1].split(")")[0]
                geekforgeeks = Number(SCHOOL) * 0 + Number(BASIC) * 0.5 + Number(EASY) * 0.75 + Number(MEDIUM) * 1.6 + Number(HARD) * 2.25
            } catch (err) {
                geekforgeeks = 0
                console.log(err)
            }
        }
        res.status(200).send({
            success: true,
            leetcode,
            github,
            codechef,
            codeforces,
            geekforgeeks
        });
    } catch (err) {
        res.status(404).send({ success: false, error: err });
    }
})

const PORT = process.env.PORT || 8800;
app.listen(PORT);
