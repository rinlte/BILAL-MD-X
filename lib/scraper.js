const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const BodyForm = require("form-data");
let {
  fromBuffer
} = require("file-type");
const {
  spawn
} = require("child_process");
function pinterest(_0x2f8ba8) {
  return new Promise(async (_0x291602, _0x50133a) => {
    axios.get("https://id.pinterest.com/search/pins/?autologin=true&q=" + _0x2f8ba8, {
      headers: {
        cookie: "_auth=1; _b=\"AVna7S1p7l1C5I9u0+nR3YzijpvXOPc6d09SyCzO+DcwpersQH36SmGiYfymBKhZcGg=\"; _pinterest_sess=TWc9PSZHamJOZ0JobUFiSEpSN3Z4a2NsMk9wZ3gxL1NSc2k2NkFLaUw5bVY5cXR5alZHR0gxY2h2MVZDZlNQalNpUUJFRVR5L3NlYy9JZkthekp3bHo5bXFuaFZzVHJFMnkrR3lTbm56U3YvQXBBTW96VUgzVUhuK1Z4VURGKzczUi9hNHdDeTJ5Y2pBTmxhc2owZ2hkSGlDemtUSnYvVXh5dDNkaDN3TjZCTk8ycTdHRHVsOFg2b2NQWCtpOWxqeDNjNkk3cS85MkhhSklSb0hwTnZvZVFyZmJEUllwbG9UVnpCYVNTRzZxOXNJcmduOVc4aURtM3NtRFo3STlmWjJvSjlWTU5ITzg0VUg1NGhOTEZzME9SNFNhVWJRWjRJK3pGMFA4Q3UvcHBnWHdaYXZpa2FUNkx6Z3RNQjEzTFJEOHZoaHRvazc1c1UrYlRuUmdKcDg3ZEY4cjNtZlBLRTRBZjNYK0lPTXZJTzQ5dU8ybDdVS015bWJKT0tjTWYyRlBzclpiamdsNmtpeUZnRjlwVGJXUmdOMXdTUkFHRWloVjBMR0JlTE5YcmhxVHdoNzFHbDZ0YmFHZ1VLQXU1QnpkM1FqUTNMTnhYb3VKeDVGbnhNSkdkNXFSMXQybjRGL3pyZXRLR0ZTc0xHZ0JvbTJCNnAzQzE0cW1WTndIK0trY05HV1gxS09NRktadnFCSDR2YzBoWmRiUGZiWXFQNjcwWmZhaDZQRm1UbzNxc21pV1p5WDlabm1UWGQzanc1SGlrZXB1bDVDWXQvUis3elN2SVFDbm1DSVE5Z0d4YW1sa2hsSkZJb1h0MTFpck5BdDR0d0lZOW1Pa2RDVzNySWpXWmUwOUFhQmFSVUpaOFQ3WlhOQldNMkExeDIvMjZHeXdnNjdMYWdiQUhUSEFBUlhUVTdBMThRRmh1ekJMYWZ2YTJkNlg0cmFCdnU2WEpwcXlPOVZYcGNhNkZDd051S3lGZmo0eHV0ZE42NW8xRm5aRWpoQnNKNnNlSGFad1MzOHNkdWtER0xQTFN5Z3lmRERsZnZWWE5CZEJneVRlMDd2VmNPMjloK0g5eCswZUVJTS9CRkFweHc5RUh6K1JocGN6clc1JmZtL3JhRE1sc0NMTFlpMVErRGtPcllvTGdldz0=; _ir=0"
      }
    }).then(({
      data: _0xef683e
    }) => {
      const _0x31d09f = cheerio.load(_0xef683e);
      const _0x245bdf = [];
      const _0x582248 = [];
      _0x31d09f("div > a").get().map(_0x1aadc8 => {
        const _0x53e6f0 = _0x31d09f(_0x1aadc8).find("img").attr("src");
        _0x245bdf.push(_0x53e6f0);
      });
      _0x245bdf.forEach(_0x554807 => {
        if (_0x554807 == undefined) {
          return;
        }
        _0x582248.push(_0x554807.replace(/236/g, "736"));
      });
      _0x582248.shift();
      _0x291602(_0x582248);
    });
  });
}
function TelegraPh(_0x2c8f6f) {
  return new Promise(async (_0x57be54, _0x2325da) => {
    if (!fs.existsSync(_0x2c8f6f)) {
      return _0x2325da(new Error("File not Found"));
    }
    try {
      const _0x3b4bf9 = new BodyForm();
      _0x3b4bf9.append("file", fs.createReadStream(_0x2c8f6f));
      const _0x5dd8d3 = await axios({
        url: "https://telegra.ph/upload",
        method: "POST",
        headers: {
          ..._0x3b4bf9.getHeaders()
        },
        data: _0x3b4bf9
      });
      return _0x57be54("https://telegra.ph" + _0x5dd8d3.data[0].src);
    } catch (_0x168ebe) {
      return _0x2325da(new Error(String(_0x168ebe)));
    }
  });
}
async function UploadFileUgu(_0x443690) {
  return new Promise(async (_0x3c1093, _0x47a242) => {
    const _0x4cd7cd = new BodyForm();
    _0x4cd7cd.append("files[]", fs.createReadStream(_0x443690));
    await axios({
      url: "https://uguu.se/upload.php",
      method: "POST",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
        ..._0x4cd7cd.getHeaders()
      },
      data: _0x4cd7cd
    }).then(_0x378d64 => {
      _0x3c1093(_0x378d64.data.files[0]);
    }).catch(_0x2574f5 => _0x47a242(_0x2574f5));
  });
}
async function createUrl(_0x128c16, _0x4f4112 = "1") {
  try {
    if (!_0x128c16) {
      return;
    }
    if (!_0x4f4112 || _0x4f4112 === "1" || _0x4f4112.toLowerCase() === "telegraph") {
      return await TelegraPh(_0x128c16);
    }
    if (_0x4f4112 === "2" || _0x4f4112.toLowerCase().includes("ugu")) {
      return await UploadFileUgu(_0x128c16);
    }
  } catch (_0x21a973) {
    console.log("ERROR IN SCRAPPING FOR CREATE URL()\n", _0x21a973);
  }
}
function webp2mp4File(_0x30cb53) {
  return new Promise((_0x4ebaf9, _0x4bc015) => {
    const _0x22cf6f = new BodyForm();
    _0x22cf6f.append("new-image-url", "");
    _0x22cf6f.append("new-image", fs.createReadStream(_0x30cb53));
    axios({
      method: "post",
      url: "https://s6.ezgif.com/webp-to-mp4",
      data: _0x22cf6f,
      headers: {
        "Content-Type": "multipart/form-data; boundary=" + _0x22cf6f._boundary
      }
    }).then(({
      data: _0x3dfa4a
    }) => {
      const _0x1851a6 = new BodyForm();
      const _0x5c4599 = cheerio.load(_0x3dfa4a);
      const _0x10df29 = _0x5c4599("input[name=\"file\"]").attr("value");
      _0x1851a6.append("file", _0x10df29);
      _0x1851a6.append("convert", "Convert WebP to MP4!");
      axios({
        method: "post",
        url: "https://ezgif.com/webp-to-mp4/" + _0x10df29,
        data: _0x1851a6,
        headers: {
          "Content-Type": "multipart/form-data; boundary=" + _0x1851a6._boundary
        }
      }).then(({
        data: _0x560f16
      }) => {
        const _0x3247d2 = cheerio.load(_0x560f16);
        const _0x2c0ca3 = "https:" + _0x3247d2("div#output > p.outfile > video > source").attr("src");
        _0x4ebaf9({
          status: true,
          message: "Created By Secktor Botto",
          result: _0x2c0ca3
        });
      }).catch(_0x4bc015);
    }).catch(_0x4bc015);
  });
}
function wikimedia(_0x1868ba) {
  return new Promise((_0x2bc707, _0xd97134) => {
    axios.get("https://commons.wikimedia.org/w/index.php?search=" + _0x1868ba + "&title=Special:MediaSearch&go=Go&type=image").then(_0x1f54aa => {
      let _0x35752e = cheerio.load(_0x1f54aa.data);
      let _0xd58fd2 = [];
      _0x35752e(".sdms-search-results__list-wrapper > div > a").each(function (_0x2e6c41, _0x3093a8) {
        _0xd58fd2.push({
          title: _0x35752e(_0x3093a8).find("img").attr("alt"),
          source: _0x35752e(_0x3093a8).attr("href"),
          image: _0x35752e(_0x3093a8).find("img").attr("data-src") || _0x35752e(_0x3093a8).find("img").attr("src")
        });
      });
      _0x2bc707(_0xd58fd2);
    });
  });
}
function ffmpeg(_0x3f259d, _0x31af2c = [], _0x5729b0 = "", _0x357d10 = "") {
  return new Promise(async (_0xba570a, _0x502055) => {
    try {
      let _0x5a9045 = path.join(__dirname, "./", +new Date() + "." + _0x5729b0);
      let _0x2352fa = _0x5a9045 + "." + _0x357d10;
      await fs.promises.writeFile(_0x5a9045, _0x3f259d);
      spawn("ffmpeg", ["-y", "-i", _0x5a9045, ..._0x31af2c, _0x2352fa]).on("error", _0x502055).on("close", async _0xf77d97 => {
        try {
          await fs.promises.unlink(_0x5a9045);
          if (_0xf77d97 !== 0) {
            return _0x502055(_0xf77d97);
          }
          _0xba570a(await fs.promises.readFile(_0x2352fa));
          await fs.promises.unlink(_0x2352fa);
        } catch (_0x3e53b9) {
          _0x502055(_0x3e53b9);
        }
      });
    } catch (_0x485d65) {
      _0x502055(_0x485d65);
    }
  });
}
function toAudio(_0x5f1e7e, _0x12b262) {
  return ffmpeg(_0x5f1e7e, ["-vn", "-ac", "2", "-b:a", "128k", "-ar", "44100", "-f", "mp3"], _0x12b262, "mp3");
}
function toPTT(_0x5a80de, _0x24cd47) {
  return ffmpeg(_0x5a80de, ["-vn", "-c:a", "libopus", "-b:a", "128k", "-vbr", "on", "-compression_level", "10"], _0x24cd47, "opus");
}
function toVideo(_0x1f7083, _0x142ba6) {
  return ffmpeg(_0x1f7083, ["-c:v", "libx264", "-c:a", "aac", "-ab", "128k", "-ar", "44100", "-crf", "32", "-preset", "slow"], _0x142ba6, "mp4");
}
const Config = require("../config");
if (fs.existsSync("./source/" + Config.LANG + ".json")) {
  var json = JSON.parse(fs.readFileSync("./source/" + Config.LANG + ".json"));
} else {
  var json = JSON.parse(fs.readFileSync("./source/WASI.json"));
}
function ffancy(_0x48e16e) {
  return new Promise((_0x321dba, _0x34268c) => {
    axios.get("http://qaz.wtf/u/convert.cgi?text=" + _0x48e16e).then(({
      data: _0x3a4376
    }) => {
      let _0x3dacf1 = cheerio.load(_0x3a4376);
      let _0x2a2436 = [];
      _0x3dacf1("table > tbody > tr").each(function (_0x5b4a04, _0xc640ea) {
        _0x2a2436.push({
          name: _0x3dacf1(_0xc640ea).find("td:nth-child(1) > span").text(),
          result: _0x3dacf1(_0xc640ea).find("td:nth-child(2)").text().trim()
        });
      });
      _0x321dba(_0x2a2436);
    });
  });
}
async function fancy(_0x5b1e58, _0x13e0d0) {
  try {
    let _0x1830de = await ffancy(_0x5b1e58);
    return _0x1830de[_0x13e0d0].result;
  } catch (_0x40ef2a) {
    console.log(_0x40ef2a);
  }
}
async function randomfancy(_0x5c5181) {
  try {
    let _0x5ac180 = await ffancy(_0x5c5181);
    return _0x5ac180[0].result;
  } catch (_0x61d17) {
    console.log("ERRO IN RANDOME FANCY SCRAPPER\n", _0x61d17);
    return _0x5c5181;
  }
}
function getString(_0x51273c) {
  return json.STRINGS[_0x51273c];
}
function tlang(_0x241740 = false) {
  let _0x4e9dfc = getString("global");
  if (_0x241740) {
    return _0x4e9dfc[_0x241740];
  } else {
    return _0x4e9dfc;
  }
}
function botpic() {
  return new Promise((_0x2b19e2, _0x596d7c) => {
    let _0x169afc = getString("global");
    let _0x255444 = ["" + _0x169afc.pic1, "" + _0x169afc.pic2, "" + _0x169afc.pic3, "" + _0x169afc.pic4, "" + _0x169afc.pic5, "" + _0x169afc.pic6];
    const _0x33f510 = _0x255444[Math.floor(Math.random() * _0x255444.length)];
    _0x2b19e2(_0x33f510);
  });
}
async function isAdmin(_0x234375, _0x5b87cc, _0x509e42) {
  let _0x44a379 = await _0x234375.groupMetadata(_0x5b87cc);
  let _0x4f5480 = _0x44a379.participants.reduce((_0x598567, _0x16141e) => (_0x16141e.admin ? _0x598567.push({
    id: _0x16141e.id,
    admin: _0x16141e.admin
  }) : [..._0x598567]) && _0x598567, []);
  var _0x111c5f = _0x4f5480.find(_0x19416a => _0x19416a.id === _0x509e42);
  return _0x111c5f;
}
async function syncgit() {
  const _0x5e22e2 = require("simple-git");
  const _0x1d13cb = _0x5e22e2();
  await _0x1d13cb.fetch();
  var _0xecb7fc = await _0x1d13cb.log(["main..origin/main"]);
  return _0xecb7fc;
}
async function sync() {
  const _0x5ce6b3 = require("simple-git");
  const _0xcf079d = _0x5ce6b3();
  await _0xcf079d.fetch();
  var _0x3f267e = await _0xcf079d.log(["main..origin/main"]);
  var _0x3af3b6 = "";
  _0x3f267e.all.map(_0x4602cd => {
    _0x3af3b6 += "● [" + _0x4602cd.date.substring(0, 10) + "]: " + _0x4602cd.message + "\n- By:" + _0x4602cd.author_name + "\n";
  });
  return _0x3af3b6;
}
function ringtone(_0x2fc4c5) {
  return new Promise((_0x28e1d8, _0x2d6a77) => {
    axios.get("https://meloboom.com/en/search/" + _0x2fc4c5).then(_0x3dc63c => {
      let _0x5eb95f = cheerio.load(_0x3dc63c.data);
      let _0x450043 = [];
      _0x5eb95f("#__next > main > section > div.jsx-2244708474.container > div > div > div > div:nth-child(4) > div > div > div > ul > li").each(function (_0x212a7f, _0x2abbe0) {
        _0x450043.push({
          title: _0x5eb95f(_0x2abbe0).find("h4").text(),
          source: "https://meloboom.com/" + _0x5eb95f(_0x2abbe0).find("a").attr("href"),
          audio: _0x5eb95f(_0x2abbe0).find("audio").attr("src")
        });
      });
      _0x28e1d8(_0x450043);
    });
  });
}
function styletext(_0x546f44) {
  return new Promise((_0x452fff, _0xb199b7) => {
    axios.get("http://qaz.wtf/u/convert.cgi?text=" + _0x546f44).then(({
      data: _0x52dd9a
    }) => {
      let _0x1e1fdb = cheerio.load(_0x52dd9a);
      let _0x2b4436 = [];
      _0x1e1fdb("table > tbody > tr").each(function (_0x3d0567, _0x5e0acf) {
        _0x2b4436.push({
          name: _0x1e1fdb(_0x5e0acf).find("td:nth-child(1) > span").text(),
          result: _0x1e1fdb(_0x5e0acf).find("td:nth-child(2)").text().trim()
        });
      });
      _0x452fff(_0x2b4436);
    });
  });
}
function adultvid() {
  return new Promise((_0x75660e, _0x481c10) => {
    axios.get("https://tikporntok.com/?random=1").then(_0x2aa3c0 => {
      const _0x5a9f62 = cheerio.load(_0x2aa3c0.data);
      const _0x10ea21 = {};
      _0x10ea21.title = _0x5a9f62("article > h1").text();
      _0x10ea21.source = _0x5a9f62("article > div.video-wrapper.vxplayer").attr("data-post") || "Web Not Response";
      _0x10ea21.thumb = _0x5a9f62("article > div.video-wrapper.vxplayer > div.vx_el").attr("data-poster") || "https://4.bp.blogspot.com/-hyMqjmQQq4o/W6al-Rk4IpI/AAAAAAAADJ4/m-lVBA_GC9Q5d4BIQg8ZO3fYmQQC3LqSACLcBGAs/s1600/404_not_found.png";
      _0x10ea21.desc = _0x5a9f62("article > div.intro").text();
      _0x10ea21.upload = _0x5a9f62("article > div.single-pre-meta.ws.clearfix > time").text();
      _0x10ea21.like = _0x5a9f62("article > div.single-pre-meta.ws.clearfix > div > span:nth-child(1) > span").text();
      _0x10ea21.dislike = _0x5a9f62("article > div.single-pre-meta.ws.clearfix > div > span:nth-child(2) > span").text();
      _0x10ea21.favorite = _0x5a9f62("article > div.single-pre-meta.ws.clearfix > div > span:nth-child(3) > span").text();
      _0x10ea21.views = _0x5a9f62("article > div.single-pre-meta.ws.clearfix > div > span:nth-child(4) > span").text();
      _0x10ea21.tags = _0x5a9f62("article > div.post-tags").text();
      _0x10ea21.video = _0x5a9f62("article > div.video-wrapper.vxplayer > div.vx_el").attr("src") || _0x5a9f62("article > div.video-wrapper.vxplayer > div.vx_el").attr("data-src") || "https://4.bp.blogspot.com/-hyMqjmQQq4o/W6al-Rk4IpI/AAAAAAAADJ4/m-lVBA_GC9Q5d4BIQg8ZO3fYmQQC3LqSACLcBGAs/s1600/404_not_found.png";
      _0x75660e(_0x10ea21);
    });
  });
}
function hentai() {
  return new Promise((_0x24384b, _0x48739c) => {
    const _0x6f78c6 = Math.floor(Math.random() * 1153);
    axios.get("https://sfmcompile.club/page/" + _0x6f78c6).then(_0x4d532c => {
      const _0x3596b1 = cheerio.load(_0x4d532c.data);
      const _0x4210e7 = [];
      _0x3596b1("#primary > div > div > ul > li > article").each(function (_0xbb4011, _0x525d04) {
        _0x4210e7.push({
          title: _0x3596b1(_0x525d04).find("header > h2").text(),
          link: _0x3596b1(_0x525d04).find("header > h2 > a").attr("href"),
          category: _0x3596b1(_0x525d04).find("header > div.entry-before-title > span > span").text().replace("in ", ""),
          share_count: _0x3596b1(_0x525d04).find("header > div.entry-after-title > p > span.entry-shares").text(),
          views_count: _0x3596b1(_0x525d04).find("header > div.entry-after-title > p > span.entry-views").text(),
          type: _0x3596b1(_0x525d04).find("source").attr("type") || "image/jpeg",
          video_1: _0x3596b1(_0x525d04).find("source").attr("src") || _0x3596b1(_0x525d04).find("img").attr("data-src"),
          video_2: _0x3596b1(_0x525d04).find("video > a").attr("href") || ""
        });
      });
      _0x24384b(_0x4210e7);
    });
  });
}
async function Insta(_0x492c6f) {
  const _0x217316 = [];
  try {
    const _0x42cb1e = {
      url: _0x492c6f,
      submit: ""
    };
    const {
      data: _0x5c0f46
    } = await axios("https://downloadgram.org/", {
      method: "POST",
      data: _0x42cb1e
    });
    const _0x550bbd = cheerio.load(_0x5c0f46);
    _0x550bbd("#downloadhere > a").each(function (_0x4eb611, _0xeb3309) {
      var _0x2bc433 = _0x550bbd(_0xeb3309).attr("href");
      if (_0x2bc433) {
        _0x217316.push(_0x2bc433);
      }
    });
  } catch (_0x31b4d0) {
    console.log("ERROR IN INSTA SCRAPING()\n", _0x31b4d0);
    return;
  }
  return _0x217316;
}
const mediafireDl = async _0x3c3223 => {
  const _0x41b949 = await axios.get(_0x3c3223);
  const _0x283931 = cheerio.load(_0x41b949.data);
  const _0x48ce58 = [];
  const _0x4206a5 = _0x283931("a#downloadButton").attr("href");
  const _0x2c0400 = _0x283931("a#downloadButton").text().replace("Download", "").replace("(", "").replace(")", "").replace("\n", "").replace("\n", "").replace("                         ", "");
  const _0x23f6b6 = _0x4206a5.split("/");
  const _0x5aa112 = _0x23f6b6[5];
  mime = _0x5aa112.split(".");
  mime = mime[1];
  _0x48ce58.push({
    nama: _0x5aa112,
    mime: mime,
    size: _0x2c0400,
    link: _0x4206a5
  });
  return _0x48ce58;
};
const embarrassing_questions_truth = "What was the last thing you searched for on your phone?,If you had to choose between going naked or having your thoughts appear in thought bubbles above your head for everyone to read which would you choose?,Have you ever walked in on your parents doing it?,After you've dropped a piece of food what's the longest time you've left it on the ground and then ate it?,Have you ever tasted a booger?,Have you ever played Cards Against Humanity with your parents?,What's the first thing you would do if you woke up one day as the opposite sex?,Have you ever peed in the pool?,Who do you think is the worst dressed person in this room?,Have you ever farted in an elevator?,Of the people in this room who do you want to trade lives with?,What are some things you think about when sitting on the toilet?,Did you have an imaginary friend growing up?,Do you cover your eyes during a scary part in a movie?,Have you ever practiced kissing in a mirror?,Did your parents ever give you the “birds and the bees” talk?,What is your guilty pleasure?,What is your worst habit?,Has anyone ever walked in on you when going #2 in the bathroom?,Have you ever had a wardrobe malfunction?,Have you ever walked into a wall?,Do you pick your nose?,Do you sing in the shower?,Have you ever peed yourself?,What was your most embarrassing moment in public?,Have you ever farted loudly in class?,Do you ever talk to yourself in the mirror?,You’re in a public restroom and just went #2 then you realized your stall has no toilet paper. What do you do?,What would be in your web history that you’d be embarrassed if someone saw?,Have you ever tried to take a sexy picture of yourself?,Do you sleep with a stuffed animal?,Do you drool in your sleep?,Do you talk in your sleep?,Who is your secret crush?,Who do you like the least in this room and why?,What does your dream boy or girl look like?,What is your go-to song for the shower?,Who is the sexiest person in this room?,How would you rate your looks on a scale of 1 to 10?,Would you rather have sex with [insert name] in secret or not have sex with that person but everyone thinks you did?,What don't you like about me?,What color underwear are you wearing right now?,What was the last thing you texted?,If you were rescuing people from a burning building and you had to leave one person behind from this room who would it be?,Do you think you'll marry your current girlfriend/boyfriend?,How often do you wash your undergarments?,Have you ever tasted ear wax?,Have you ever farted and then blamed someone else?,Have you ever tasted your sweat?,What is the most illegal thing you have ever done?,Who is your favorite? Mom or Dad?,Would you trade your sibling in for a million dollars?,Would you trade in your dog for a million dollars?,What is your biggest pet peeve?,If you were allowed to marry more than one person would you? Who would you choose to marry?,Would you rather lose your sex organs forever or gain 200 pounds?,Would you choose to save 100 people without anyone knowing about it or not save them but have everyone praise you for it?,If you could only hear one song for the rest of your life what would it be?,If you lost one day of your life every time you said a swear word would you try not to do it?,Who in this room would be the worst person to date? Why?,Would you rather live with no internet or no A/C or heating?,If someone offered you $1 million to break up with your girlfriend/boyfriend would you do it?,If you were reborn what decade would you want to be born in?,If you could go back in time in erase one thing you said or did what would it be?,Has your boyfriend or girlfriend ever embarrassed you?,Have you ever thought about cheating on your partner?,If you could suddenly become invisible what would you do?,Have you ever been caught checking someone out?,Have you ever waved at someone thinking they saw you when really they didn't? What di
