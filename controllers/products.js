const Products = require('../models/product')

const getAllProductStatic = async ( req, res) => {
    const getItems = await Products.find({ price: { $gt: 10}})
        .sort('name')//sorting Alphabetic oder
        .select('name price')//selecting property from each item
    res.status(200).json({getItems, nbHits: getItems.length})
}

const getAllProduct = async( req, res) => {
    const {featured, company, name, sort, fields, numericFilters} = req.query;
    const queryObject = {}
    //Using the peremeter to call out a product from the postman
    if (featured) {
        queryObject.featured = featured === 'true' ? true : false
    }
    if (company) {
        queryObject.company = company
    }
    if (name) {
        queryObject.name = {$regex: name, $options: ''}
    }
    if(numericFilters){
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        }
        const regEx = /\b(<|>|>=|=|<|<=)\b/g
        let filters = numericFilters.replace(
            regEx,
            (match) => `-${operatorMap[match]}-`
        )
        const options = ['price', 'rating']
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-')
            if (options.includes(field)) {
                queryObject[field] = { [operator]: Number(value)}
            }
        });
    }
    console.log(queryObject)
    let result = Products.find(queryObject)
    //sort: sorting out a peremeter from the tiem
    if (sort) {
        const sortList = sort.split(',').join(' ')//creating a space in between the sort instead of a commer
        result = result.sort(sortList)
    } else {
        result = result.sort('createdAt')
    }
    if (fields) {
        const fieldList = fields.split(',').join(' ')
        result = result.select(fieldList)
    }
    
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 15 //Limiting the numbers
    const skip = (page-1) * limit //Multiply by the limite (1)
    result = result.skip(skip).limit(limit)


    const getAllItems = await result
    res.status(200).json({getAllItems, nbHits: getAllItems.length})
}


module.exports = {
    getAllProductStatic,
    getAllProduct
}
