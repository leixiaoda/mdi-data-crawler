const fetch = require('node-fetch');
const fs = require('fs')

const START_PAGE = 0;
const END_PAGE = 273;

async function getPageData(page) {
    const res = await fetch(`https://raider.io/api/mythic-plus/rankings/teams?region=world&season=season-sl-2&eventId=10059&page=${page}`)
    .then(response => response.json())
    .then(json => json.rankings.rankedTeams)
    .catch(err => console.log('Request Failed', err));
    return res;
}

function getZone(zoneId) {
    if (zoneId === 13228) {
        return 'PF';
    } else if (zoneId === 13334){
        return 'MISTS';
    }
    return 'unknown';
}

async function getContent() {
    for (let page = START_PAGE; page <= END_PAGE; page++) {
        console.log('page: ', page);

        const teams = await getPageData(page);
        const content = teams.map(team => {
            const memberStr = team.members.map(member => member.character.name).join(', ');
            const additionalStr = team.runs.map(run => `[${run.keystoneRunId}: ${run.mythicLevel}${getZone(run.zoneId)}]`).join(' ');
            return `${team.rank}: ${memberStr} ${additionalStr}`;
        }).join('\n') + '\n';
        fs.appendFile('./output/result.txt', content, err => {
            if (err) {
              console.error(`page ${page}, err: ${err}`)
            }
        });
    }
}

getContent();