export class apiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const filterObj = {};
    // create list of fields That i don't want to filter them
    const excludingFields = ["sort", "page", "limit", "fields"];

    const shallowCopyQuery = { ...this.queryString };

    excludingFields.forEach((field) => delete shallowCopyQuery[field]);

    const daysAgo = parseInt(shallowCopyQuery["createdAt"]);

    if (daysAgo) {
      if (!isNaN(daysAgo)) {
        const dayInMill = daysAgo * 24 * 3600 * 1000;

        const targetDate = new Date(Date.now() - dayInMill);

        const startOfDate = new Date(targetDate);
        startOfDate.setUTCHours(0, 0, 0, 0);

        const endOfDate = new Date(targetDate);
        endOfDate.setUTCHours(23, 59, 59, 999);

        filterObj.createdAt = { $gte: startOfDate, $lte: endOfDate };
      }
    }
    if (shallowCopyQuery.Done) {
      filterObj.Done = shallowCopyQuery.Done === "true";
    }
    this.query = this.query.find(filterObj);
    return this;
  }
  sort() {
    this.query = this.query.sort("Done -createdAt");
    return this;
  }
  paginate() {
    const page = this.queryString.page || 1;

    const limit = this.queryString.page || 10;

    const skip = (page - 1) * limit;

    this.query.skip(skip).limit(limit);

    return this;
  }
}
