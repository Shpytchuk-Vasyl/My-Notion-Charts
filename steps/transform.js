const fs = require('fs');
const FILE_PATH = 'C:\\Users\\vasil\\Downloads\\Telegram Desktop\\steps_data.csv';

const formattedUS = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

function main() {
    const data = fs.readFileSync(FILE_PATH, 'utf-8');
    const lines = data
    .split('\n')
    .map(line => line.split(' , '))
    .map(([date, count]) => {
        return `${count},"${formattedUS.format(new Date(date.split('.').reverse().join('-')))}"`;
    });
    console.log(lines.join('\n'));
}

main();

// run
// node .\transform.js