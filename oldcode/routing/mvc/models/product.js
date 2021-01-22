// const PRODUCTS = [];

const fs = require('fs');
const path = require('path');

const p = path.join(
		path.dirname(
			process.mainModule.filename
		), 
		'data', 
		'products.json'
	);

const getProductsFromFile = cb => {
	fs.readFile(p, (err, fileContent) => {
		if (err) {
			return cb([]);
		}
		cb(JSON.parse(fileContent));
	})
}

module.exports = class Product {
	constructor(title) {
		this.title= title
	}

	save() {
		getProductsFromFile(products => {
			products.push(this);
			fs.writeFile(p, JSON.stringify(products), err => console.log(err));
		});

		// PRODUCTS.push(this);
		// const p = path.join(
		// 	path.dirname(
		// 		process.mainModule.filename
		// 	), 
		// 	'data', 
		// 	'products.json'
		// );
		// fs.readFile(p, (err, fileContent) => {
		// 	let PRODUCTS = [];
			// if (!err) {
			// 	PRODUCTS = JSON.parse(fileContent);
			// }
		// 	PRODUCTS.push(this);
		// 	fs.writeFile(p, JSON.stringify(PRODUCTS), err => console.log(err));
		// });
	}

	static fetchAll(cb) {
		getProductsFromFile(cb);
	}

	// static fetchAll(cb) {
		// const p = path.join(
		// 	path.dirname(
		// 		process.mainModule.filename
		// 	), 
		// 	'data', 
		// 	'products.json'
		// );
		// fs.readFile(p, (err, fileContent) => {
		// 	if (err) {
		// 		cb([]);
		// 	}
		// 	cb(JSON.parse(fileContent));
		// })
		// return PRODUCTS;
	// }
}