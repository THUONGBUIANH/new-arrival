# Mock Server

This is a mock server built using [json-server](https://www.npmjs.com/package/json-server/v/0.17.4) to provide a quick and easy API for a frontend mock project. The server serves a set of mock data from a JSON file and supports basic CRUD operations, search, pagination, filtering, and sorting.

## Features

- Serve mock data from `db.json`.
- Supports GET, POST, PUT, DELETE, and PATCH HTTP methods.
- Search, sorting, pagination, and filtering through query parameters.
- TypeScript model definition for easier type checking and development.
- Ideal for prototyping and testing frontend applications.
- **Customizable raw data**: JSON files are provided separately so candidates can use them with other services or adapt them as needed.


## Installation

```bash
npm install
```

## Usage

To start the mock server, run the following command:
```bash
npm run start
```

This will start the server at http://localhost:5005 by default. You can then access your mock API endpoints.


## TypeScript Models

In the `model.ts` file, you will find the TypeScript interfaces that define the structure of the mock database. This can be used as a reference for understanding the data structure and ensuring type safety while working on the project. If you prefer using JavaScript, feel free to ignore this file.

## Example Endpoints

- **GET** `/products`: Returns a list of products.
  
  Example: `http://localhost:5005/products`

### Search and Filter Examples

- **GET** `/products?q=keyword`: Full-text search across all fields.

  Example: `http://localhost:5005/products?q=phantom`  
  (Returns products that contain "phantom" in any field.)

- **GET** `/products?title_like=DJ`: Search specific fields using `_like` for partial matches.

  Example: `http://localhost:5005/products?title_like=DJ`  
  (Returns products where the `title` contains "DJ".)

### Sorting Examples

- **GET** `/products?_sort=price&_order=asc`: Sort products by a specific field.

  Example: `http://localhost:5005/products?_sort=price&_order=asc`  
  (Returns products sorted by `price` in ascending order.)

- **GET** `/products?_sort=createdAt&_order=desc`: Sort products by creation date in descending order.

  Example: `http://localhost:5005/products?_sort=createdAt&_order=desc`  
  (Returns products sorted by `createdAt` date in descending order.)

### Pagination Examples

- **GET** `/products?_page=2&_limit=5`: Pagination to limit results per page.

  Example: `http://localhost:5005/products?_page=2&_limit=5`  
  (Returns the second page of products with 5 products per page.)

### Combined Example: Search, Sort, and Pagination

- **GET** `/products?q=phantom&_sort=price&_order=asc&_page=1&_limit=3`: Combine search, sorting, and pagination.

  Example: `http://localhost:5005/products?q=phantom&_sort=price&_order=asc&_page=1&_limit=3`  
  (Search for products containing "phantom", sort by price in ascending order, and return the first page with 3 results per page.)

### CRUD Operations

- **GET** `/products/{id}`: Returns a single product by ID.
  
  Example: `http://localhost:5005/products/1`

- **POST** `/products`: Adds a new product.
  
  Example: Make a POST request to `http://localhost:5005/products` with the product data in the request body.

- **PUT** `/products/{id}`: Updates an existing product.
  
  Example: Make a PUT request to `http://localhost:5005/products/1` to update the product with ID 1.

- **DELETE** `/products/{id}`: Deletes a product by ID.
  
  Example: Make a DELETE request to `http://localhost:5005/products/1` to delete the product with ID 1.

## Configuration

You can modify the mock data in the db.json file to fit your project needs. This file serves as the database for json-server, and any changes to it will be reflected in the API.

## Raw Data

In the raw-data folder, you will find the individual JSON files that contain the raw data used in this project. This allows you to:

	•	Customize the mock data to fit your specific needs for the assignment.
	•	Use these JSON files with another backend or service (if you decide not to use json-server).
	•	Modify or extend the data to create additional endpoints or logic as needed.

Feel free to use these files independently or as part of the mock server setup.

## Official Documentation

For more information on how to use json-server and its features, check out the official documentation:
[json-server v0.17.4 Documentation](https://www.npmjs.com/package/json-server/v/0.17.4)

## License

This project is licensed under the terms outlined in the LICENSE file.