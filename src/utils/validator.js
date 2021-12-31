const axios = require("axios");
const e = require("express");

module.exports = async function validator(handles, type) {
  const contestMap = new Map();
  const contests = [];
  const err = [];

  await axios
    .get(
      `https://codeforces.com/api/contest.list?${
        type !== "gym" ? "" : "gym=true"
      }`
    )
    .then(async (response) => {
      if (response.data.status !== "OK") {
        err.push(response.data.comment);
      } else {
        await response.data.result.forEach((gym) => {
          contestMap.set(gym.id, gym);
        });
        for (var i = 0; i < handles.length; i++) {
          await axios
            .get("https://codeforces.com/api/user.status?handle=" + handles[i])
            .then((response) => {
              if (response.data.status !== "OK") {
                err.push(response.data.comment);
              } else {
                response.data.result.forEach((subb) => {
                  contestMap.delete(subb.contestId);
                });
              }
            })
            .catch((error) => {
              err.push("Bad user");
            });
        }
      }
    })
    .catch((error) => {
      err.push("Bad user");
    });
  contestMap.forEach((value) => {
    contests.push(value);
  });
  if (type !== "gym") contests.reverse();
  return { contests: contests, err };
};
