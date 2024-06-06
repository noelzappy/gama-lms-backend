import { Schema, Document, FilterQuery } from 'mongoose';

interface PaginateOptions {
  sortBy?: string;
  populate?: string;
  limit?: number;
  page?: number;
}

interface PaginateResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

function paginate<T extends Document>(schema: Schema) {
  schema.statics.paginate = async function (filter: FilterQuery<T>, options: PaginateOptions): Promise<PaginateResult<T>> {
    let sort = '';
    if (options.sortBy) {
      const sortingCriteria = [];
      options.sortBy.split(',').forEach(sortOption => {
        const [key, order] = sortOption.split(':');
        sortingCriteria.push((order === 'desc' ? '-' : '') + key);
      });
      sort = sortingCriteria.join(' ');
    } else {
      sort = '-createdAt';
    }

    const page = parseInt(options.page?.toString() ?? '1', 10);
    const limit = parseInt(options.limit?.toString() ?? '10', 10);
    const skip = (page - 1) * limit;

    let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);
    const countPromise = this.countDocuments(filter).exec();

    if (options.populate) {
      options.populate.split(',').forEach(populateOption => {
        docsPromise.populate(populateOption);
      });
    }

    docsPromise = docsPromise.exec();

    const [docs, totalDocs] = await Promise.all([docsPromise, countPromise]);

    const totalPages = Math.ceil(totalDocs / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    return {
      docs,
      totalDocs,
      limit,
      totalPages,
      page,
      pagingCounter: (page - 1) * limit + 1,
      hasPrevPage,
      hasNextPage,
      prevPage: hasPrevPage ? page - 1 : null,
      nextPage: hasNextPage ? page + 1 : null,
    };
  };
}

export { paginate, PaginateOptions, PaginateResult };
