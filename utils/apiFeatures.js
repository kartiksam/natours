class APIfeatures {
  // this is constructor in java same as classname
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  //1st method
  filter() {
    const queryObj = { ...this.queryString };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$ ${match}`
    );
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  //2 method
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort(split(',').join(' '));
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  // 3rd method
  limitFields() {
    if (this.queryString.Fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
    }
    return this;
  }

  //4 th method
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIfeatures;
