const replaceTemplate = require("./modules/replateTemplate");
const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");
// const input = fs.readFile('txt/input.txt', 'utf8');
// console.log(`${input}, create at ${Date.now()}`);
// fs.writeFileSync('txt/output.txt', `this is what we know about ${input}!`);
// console.log('File written!');

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));
console.log(slugs);
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join(""); //join all the elements in the array
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardHtml);
    res.end(output);
  }

  //product page
  else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
    //API
  } else if (pathname === "/api") {
    //read file=>parse JSON to js=> send back the result to client
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  }
  //Not found
  else {
    res.writeHead(404);
    res.end("Page not found");
  }
});
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
