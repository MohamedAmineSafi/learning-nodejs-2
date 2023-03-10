class APIFeatures {
  /*
  In this code, the 'return this' statement appears at the end of each method.
  It is used to enable method chaining for the APIFeatures class.
  This means that you can call multiple methods on the same instance of the APIFeatures class in a single line of code
  
  The return this statement at the end of each method ensures that the modified this.query object is returned after each method is called,
  so that it can be used as the input for the next method in the chain.
  */
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // removes __v
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 /*convert to number*/ || 1; // default value is 1
    const limit = this.queryString.limit * 1 || 100;
    const skip = limit * (page - 1);
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
