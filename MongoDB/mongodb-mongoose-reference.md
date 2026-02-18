# MongoDB & Mongoose Complete Reference Guide

## Table of Contents
1. [Query Methods](#query-methods)
2. [Model Methods](#model-methods)
3. [Document Methods](#document-methods)
4. [Query Modifiers](#query-modifiers)
5. [Aggregation Methods](#aggregation-methods)
6. [Middleware (Hooks)](#middleware-hooks)
7. [Schema Methods](#schema-methods)
8. [Validation](#validation)
9. [Population](#population)
10. [Indexes](#indexes)

---

## Query Methods

### Basic Query Methods

#### `find(filter, projection, options)`
Returns an array of documents matching the filter.
```javascript
User.find({ age: { $gte: 18 } })
```

#### `findOne(filter, projection, options)`
Returns the first document matching the filter.
```javascript
User.findOne({ email: 'user@example.com' })
```

#### `findById(id, projection, options)`
Finds a document by its `_id`.
```javascript
User.findById('507f1f77bcf86cd799439011')
```

#### `findByIdAndUpdate(id, update, options)`
Finds a document by id and updates it.
```javascript
User.findByIdAndUpdate(id, { name: 'New Name' }, { new: true })
```

#### `findByIdAndDelete(id, options)`
Finds a document by id and deletes it.
```javascript
User.findByIdAndDelete(id)
```

#### `findOneAndUpdate(filter, update, options)`
Finds one document and updates it.
```javascript
User.findOneAndUpdate(
  { email: 'user@example.com' },
  { name: 'Updated Name' },
  { new: true, upsert: true }
)
```

#### `findOneAndDelete(filter, options)`
Finds one document and deletes it.
```javascript
User.findOneAndDelete({ email: 'user@example.com' })
```

#### `findOneAndReplace(filter, replacement, options)`
Finds one document and replaces it entirely.
```javascript
User.findOneAndReplace({ _id: id }, { name: 'New Name', age: 25 })
```

---

## Model Methods

### Create Operations

#### `create(doc(s), options)`
Creates one or more documents.
```javascript
User.create({ name: 'John', email: 'john@example.com' })
User.create([{ name: 'John' }, { name: 'Jane' }])
```

#### `insertMany(docs, options)`
Inserts multiple documents in one operation.
```javascript
User.insertMany([{ name: 'John' }, { name: 'Jane' }], { ordered: false })
```

### Update Operations

#### `updateOne(filter, update, options)`
Updates the first document matching the filter.
```javascript
User.updateOne({ name: 'John' }, { age: 30 })
```

#### `updateMany(filter, update, options)`
Updates all documents matching the filter.
```javascript
User.updateMany({ status: 'inactive' }, { status: 'active' })
```

#### `replaceOne(filter, replacement, options)`
Replaces the first document matching the filter.
```javascript
User.replaceOne({ _id: id }, { name: 'New Name', age: 25 })
```

### Delete Operations

#### `deleteOne(filter, options)`
Deletes the first document matching the filter.
```javascript
User.deleteOne({ email: 'user@example.com' })
```

#### `deleteMany(filter, options)`
Deletes all documents matching the filter.
```javascript
User.deleteMany({ status: 'inactive' })
```

### Count Operations

#### `countDocuments(filter, options)`
Counts documents matching the filter.
```javascript
User.countDocuments({ age: { $gte: 18 } })
```

#### `estimatedDocumentCount(options)`
Returns an estimate of document count (faster but less accurate).
```javascript
User.estimatedDocumentCount()
```

### Other Model Methods

#### `exists(filter, options)`
Checks if a document exists.
```javascript
User.exists({ email: 'user@example.com' })
```

#### `bulkWrite(operations, options)`
Performs multiple write operations in bulk.
```javascript
User.bulkWrite([
  { insertOne: { document: { name: 'John' } } },
  { updateOne: { filter: { name: 'Jane' }, update: { age: 30 } } },
  { deleteOne: { filter: { name: 'Old' } } }
])
```

#### `watch(pipeline, options)`
Creates a change stream on the collection.
```javascript
const changeStream = User.watch()
changeStream.on('change', (change) => console.log(change))
```

---

## Document Methods

### Save and Validation

#### `save(options)`
Saves the document (inserts if new, updates if exists).
```javascript
const user = new User({ name: 'John' })
await user.save()
```

#### `validate(pathsToValidate, options)`
Validates the document.
```javascript
await user.validate()
```

#### `validateSync(pathsToValidate, options)`
Synchronously validates the document.
```javascript
const error = user.validateSync()
```

### Update Methods

#### `updateOne(update, options)`
Updates the document in the database.
```javascript
await user.updateOne({ age: 30 })
```

#### `update(update, options)` (deprecated)
Legacy method, use `updateOne()` instead.

### Delete Methods

#### `deleteOne(options)`
Deletes the document from the database.
```javascript
await user.deleteOne()
```

#### `remove(options)` (deprecated)
Legacy method, use `deleteOne()` instead.

### State Methods

#### `isNew`
Boolean indicating if the document is new (not saved yet).
```javascript
console.log(user.isNew) // true before first save
```

#### `isModified(path)`
Checks if a path has been modified.
```javascript
user.isModified('name') // true if name was changed
```

#### `isDirectModified(path)`
Checks if a path was directly modified.
```javascript
user.isDirectModified('name')
```

#### `modifiedPaths()`
Returns an array of modified paths.
```javascript
user.modifiedPaths() // ['name', 'age']
```

#### `isSelected(path)`
Checks if a path is selected in the query.
```javascript
user.isSelected('name')
```

### Populate Methods

#### `populate(path, select)`
Populates document references.
```javascript
await user.populate('posts')
await user.populate({ path: 'posts', select: 'title' })
```

#### `populated(path)`
Returns the value used to populate a path.
```javascript
user.populated('posts')
```

#### `depopulate(path)`
Removes populated values and restores to ObjectIds.
```javascript
user.depopulate('posts')
```

### Other Document Methods

#### `toObject(options)`
Converts the document to a plain JavaScript object.
```javascript
const obj = user.toObject()
const obj = user.toObject({ virtuals: true, getters: true })
```

#### `toJSON(options)`
Converts the document to JSON (used by JSON.stringify).
```javascript
const json = user.toJSON()
```

#### `equals(doc)`
Checks if this document has the same _id as another.
```javascript
user.equals(anotherUser)
```

#### `get(path, type)`
Gets the value of a path.
```javascript
user.get('name')
```

#### `set(path, value, type, options)`
Sets the value of a path.
```javascript
user.set('name', 'John')
user.set({ name: 'John', age: 30 })
```

#### `markModified(path)`
Marks a path as modified.
```javascript
user.markModified('nestedObject')
```

#### `unmarkModified(path)`
Unmarks a path as modified.
```javascript
user.unmarkModified('name')
```

#### `overwrite(obj)`
Overwrites all document values with a new object.
```javascript
user.overwrite({ name: 'New Name', age: 25 })
```

---

## Query Modifiers

### Execution Methods

#### `exec(callback)`
Executes the query and returns a promise.
```javascript
User.find().exec()
User.find().exec((err, users) => {})
```

#### `then(onFulfilled, onRejected)`
Executes the query (returns a promise).
```javascript
User.find().then(users => {})
```

#### `catch(onRejected)`
Catches query errors.
```javascript
User.find().catch(err => {})
```

### Lean

#### `lean(value)`
Returns plain JavaScript objects instead of Mongoose documents (faster, no methods).
```javascript
User.find().lean()
User.find().lean({ virtuals: true })
```

### Select

#### `select(projection)`
Specifies which fields to include/exclude.
```javascript
User.find().select('name email')
User.find().select('-password')
User.find().select({ name: 1, email: 1 })
```

### Sorting

#### `sort(fields)`
Sorts the results.
```javascript
User.find().sort('name')
User.find().sort('-age') // descending
User.find().sort({ age: -1, name: 1 })
```

### Limiting and Skipping

#### `limit(value)`
Limits the number of documents returned.
```javascript
User.find().limit(10)
```

#### `skip(value)`
Skips a specified number of documents.
```javascript
User.find().skip(20)
```

### Pagination

Combine `limit()` and `skip()` for pagination:
```javascript
const page = 2
const perPage = 10
User.find().skip((page - 1) * perPage).limit(perPage)
```

### Distinct

#### `distinct(field, filter)`
Finds distinct values for a field.
```javascript
User.distinct('age')
User.distinct('age', { status: 'active' })
```

### Collation

#### `collation(options)`
Specifies language-specific rules for string comparison.
```javascript
User.find().collation({ locale: 'en', strength: 2 })
```

### Hint

#### `hint(index)`
Forces MongoDB to use a specific index.
```javascript
User.find().hint({ age: 1 })
```

### Read Preferences

#### `read(preference, tags)`
Sets the read preference.
```javascript
User.find().read('secondary')
User.find().read('secondaryPreferred')
```

### Session

#### `session(session)`
Associates the query with a session (for transactions).
```javascript
const session = await mongoose.startSession()
User.find().session(session)
```

### Projection

#### `projection(spec)`
Sets query projection.
```javascript
User.find().projection({ name: 1, email: 1 })
```

### Query Conditions

#### `where(path, value)`
Creates a query condition.
```javascript
User.find().where('age').gte(18).lte(65)
```

#### `equals(value)`
Specifies an $eq condition.
```javascript
User.find().where('name').equals('John')
```

#### `gt(value)`, `gte(value)`, `lt(value)`, `lte(value)`
Greater than, greater than or equal, less than, less than or equal.
```javascript
User.find().where('age').gt(18).lt(65)
```

#### `in(array)`, `nin(array)`
Matches values in or not in an array.
```javascript
User.find().where('status').in(['active', 'pending'])
```

#### `regex(pattern, options)`
Matches against a regular expression.
```javascript
User.find().where('name').regex(/john/i)
```

#### `exists(boolean)`
Matches documents where the field exists.
```javascript
User.find().where('email').exists(true)
```

#### `size(value)`
Matches arrays with a specific size.
```javascript
User.find().where('tags').size(3)
```

#### `all(array)`
Matches arrays containing all specified elements.
```javascript
User.find().where('tags').all(['mongodb', 'nodejs'])
```

#### `elemMatch(criteria)`
Matches array elements.
```javascript
User.find().where('items').elemMatch({ price: { $gt: 100 } })
```

#### `mod(divisor, remainder)`
Performs modulo operation.
```javascript
User.find().where('age').mod(5, 0)
```

#### `ne(value)`
Not equal to.
```javascript
User.find().where('status').ne('deleted')
```

### Logical Operators

#### `or(array)`
Logical OR operation.
```javascript
User.find().or([{ name: 'John' }, { age: { $gt: 30 } }])
```

#### `and(array)`
Logical AND operation.
```javascript
User.find().and([{ name: 'John' }, { age: { $gt: 30 } }])
```

#### `nor(array)`
Logical NOR operation.
```javascript
User.find().nor([{ name: 'John' }, { age: { $gt: 30 } }])
```

### Other Query Methods

#### `comment(comment)`
Adds a comment to the query.
```javascript
User.find().comment('Finding active users')
```

#### `maxTimeMS(ms)`
Sets maximum time for query execution.
```javascript
User.find().maxTimeMS(5000)
```

#### `merge(source)`
Merges another query into this one.
```javascript
const query1 = User.find({ age: { $gte: 18 } })
const query2 = User.find().merge(query1)
```

#### `getOptions()`
Gets query options.
```javascript
User.find().getOptions()
```

#### `getQuery()`
Gets the query filter.
```javascript
User.find({ name: 'John' }).getQuery() // { name: 'John' }
```

#### `getUpdate()`
Gets the update operation.
```javascript
User.updateOne({ name: 'John' }, { age: 30 }).getUpdate()
```

---

## Aggregation Methods

### Pipeline Stages

#### `aggregate(pipeline)`
Runs an aggregation pipeline.
```javascript
User.aggregate([
  { $match: { age: { $gte: 18 } } },
  { $group: { _id: '$country', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])
```

### Common Pipeline Stages

#### `$match`
Filters documents.
```javascript
{ $match: { status: 'active' } }
```

#### `$group`
Groups documents by a specified expression.
```javascript
{ $group: { _id: '$category', total: { $sum: '$amount' } } }
```

#### `$project`
Reshapes documents.
```javascript
{ $project: { name: 1, age: 1, isAdult: { $gte: ['$age', 18] } } }
```

#### `$sort`
Sorts documents.
```javascript
{ $sort: { age: -1 } }
```

#### `$limit`
Limits the number of documents.
```javascript
{ $limit: 10 }
```

#### `$skip`
Skips documents.
```javascript
{ $skip: 20 }
```

#### `$unwind`
Deconstructs an array field.
```javascript
{ $unwind: '$tags' }
{ $unwind: { path: '$tags', preserveNullAndEmptyArrays: true } }
```

#### `$lookup`
Performs a left outer join (populate in aggregation).
```javascript
{
  $lookup: {
    from: 'posts',
    localField: '_id',
    foreignField: 'userId',
    as: 'userPosts'
  }
}
```

#### `$addFields`
Adds new fields to documents.
```javascript
{ $addFields: { fullName: { $concat: ['$firstName', ' ', '$lastName'] } } }
```

#### `$replaceRoot`
Replaces the root document.
```javascript
{ $replaceRoot: { newRoot: '$address' } }
```

#### `$count`
Counts the number of documents.
```javascript
{ $count: 'totalUsers' }
```

#### `$facet`
Processes multiple aggregation pipelines.
```javascript
{
  $facet: {
    categorizedByAge: [{ $bucket: { groupBy: '$age', boundaries: [0, 18, 65, 100] } }],
    categorizedByCountry: [{ $group: { _id: '$country', count: { $sum: 1 } } }]
  }
}
```

#### `$bucket`
Categorizes documents into buckets.
```javascript
{
  $bucket: {
    groupBy: '$age',
    boundaries: [0, 18, 30, 50, 100],
    default: 'Other'
  }
}
```

#### `$bucketAuto`
Automatically categorizes documents into buckets.
```javascript
{ $bucketAuto: { groupBy: '$age', buckets: 5 } }
```

#### `$sample`
Randomly selects documents.
```javascript
{ $sample: { size: 10 } }
```

#### `$out`
Writes results to a collection.
```javascript
{ $out: 'aggregationResults' }
```

#### `$merge`
Merges results into a collection.
```javascript
{
  $merge: {
    into: 'targetCollection',
    whenMatched: 'merge',
    whenNotMatched: 'insert'
  }
}
```

### Aggregation Operators

#### Arithmetic Operators
```javascript
{ $add: ['$price', '$tax'] }
{ $subtract: ['$total', '$discount'] }
{ $multiply: ['$quantity', '$price'] }
{ $divide: ['$total', '$count'] }
{ $mod: ['$number', 10] }
{ $pow: ['$base', 2] }
{ $sqrt: '$area' }
```

#### String Operators
```javascript
{ $concat: ['$firstName', ' ', '$lastName'] }
{ $substr: ['$description', 0, 100] }
{ $toLower: '$email' }
{ $toUpper: '$name' }
{ $split: ['$fullName', ' '] }
{ $strLenCP: '$name' }
```

#### Array Operators
```javascript
{ $size: '$tags' }
{ $arrayElemAt: ['$items', 0] }
{ $slice: ['$comments', 5] }
{ $filter: { input: '$items', as: 'item', cond: { $gte: ['$$item.price', 100] } } }
{ $map: { input: '$items', as: 'item', in: '$$item.price' } }
{ $reduce: { input: '$items', initialValue: 0, in: { $add: ['$$value', '$$this.price'] } } }
```

#### Date Operators
```javascript
{ $year: '$createdAt' }
{ $month: '$createdAt' }
{ $dayOfMonth: '$createdAt' }
{ $hour: '$createdAt' }
{ $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
{ $dateDiff: { startDate: '$start', endDate: '$end', unit: 'day' } }
```

#### Conditional Operators
```javascript
{ $cond: { if: { $gte: ['$age', 18] }, then: 'Adult', else: 'Minor' } }
{ $ifNull: ['$nickname', '$name'] }
{ $switch: { branches: [{ case: { $eq: ['$status', 'active'] }, then: 'Active' }], default: 'Other' } }
```

---

## Middleware (Hooks)

### Document Middleware

Runs on document methods: `save`, `validate`, `remove`, `updateOne`, `deleteOne`, `init`.

#### Pre Hooks
```javascript
userSchema.pre('save', function(next) {
  // 'this' refers to the document
  this.updatedAt = Date.now()
  next()
})

userSchema.pre('save', async function() {
  // Async/await style
  this.password = await bcrypt.hash(this.password, 10)
})
```

#### Post Hooks
```javascript
userSchema.post('save', function(doc, next) {
  console.log('User saved:', doc._id)
  next()
})

userSchema.post('save', async function(doc) {
  // Async/await style
  await sendWelcomeEmail(doc.email)
})
```

#### Error Handling
```javascript
userSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('Email already exists'))
  } else {
    next(error)
  }
})
```

### Query Middleware

Runs on query methods: `find`, `findOne`, `findOneAndUpdate`, `findOneAndDelete`, `update`, `updateOne`, `updateMany`, `deleteOne`, `deleteMany`.

#### Pre Hooks
```javascript
userSchema.pre('find', function() {
  // 'this' refers to the query
  this.where({ deleted: { $ne: true } })
})

userSchema.pre(/^find/, function() {
  // Runs on all find queries
  this.start = Date.now()
})
```

#### Post Hooks
```javascript
userSchema.post('find', function(docs) {
  console.log(`Found ${docs.length} documents`)
})

userSchema.post(/^find/, function(docs) {
  console.log(`Query took ${Date.now() - this.start}ms`)
})
```

### Aggregate Middleware

Runs on `aggregate` method.

```javascript
userSchema.pre('aggregate', function() {
  // 'this' refers to the aggregation object
  this.pipeline().unshift({ $match: { deleted: { $ne: true } } })
})

userSchema.post('aggregate', function(result) {
  console.log(`Aggregation returned ${result.length} results`)
})
```

### Model Middleware

Runs on model methods: `insertMany`.

```javascript
userSchema.pre('insertMany', function(next, docs) {
  docs.forEach(doc => {
    doc.createdAt = Date.now()
  })
  next()
})

userSchema.post('insertMany', function(docs) {
  console.log(`Inserted ${docs.length} documents`)
})
```

### Middleware Options

#### Skip Middleware
```javascript
await User.findOne().where('email').equals('test@test.com')
  .setOptions({ skipMiddleware: true })
```

#### Context
```javascript
userSchema.pre('save', function() {
  if (this.isModified('password')) {
    // Document is 'this'
  }
})

userSchema.pre('find', function() {
  // Query is 'this'
  console.log(this.getQuery())
})
```

---

## Schema Methods

### Instance Methods

Custom methods on documents.

```javascript
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Usage
const user = await User.findOne({ email: 'test@test.com' })
const isValid = await user.comparePassword('password123')
```

### Static Methods

Custom methods on the model.

```javascript
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email })
}

// Usage
const user = await User.findByEmail('test@test.com')
```

### Query Helpers

Custom query methods.

```javascript
userSchema.query.byAge = function(age) {
  return this.where({ age })
}

// Usage
const users = await User.find().byAge(25)
```

### Virtual Properties

Virtual fields that are not stored in the database.

```javascript
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`
})

userSchema.virtual('fullName').set(function(value) {
  const parts = value.split(' ')
  this.firstName = parts[0]
  this.lastName = parts[1]
})

// Must enable virtuals in toObject/toJSON
userSchema.set('toJSON', { virtuals: true })
userSchema.set('toObject', { virtuals: true })
```

### Virtual Populate

Populate from other collections without storing references.

```javascript
userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'userId'
})

// Usage
const user = await User.findById(id).populate('posts')
```

---

## Validation

### Built-in Validators

```javascript
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
    trim: true,
    lowercase: true,
    uppercase: true,
    match: [/^[a-zA-Z]+$/, 'Name can only contain letters']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v)
      },
      message: props => `${props.value} is not a valid email`
    }
  },
  age: {
    type: Number,
    min: [18, 'Must be at least 18'],
    max: [120, 'Age cannot exceed 120']
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'inactive', 'pending'],
      message: '{VALUE} is not a valid status'
    }
  },
  tags: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.length <= 5
      },
      message: 'Cannot have more than 5 tags'
    }
  }
})
```

### Custom Validators

```javascript
userSchema.path('email').validate(async function(value) {
  const count = await this.model('User').countDocuments({ email: value })
  return count === 0
}, 'Email already exists')
```

### Async Validators

```javascript
userSchema.path('username').validate({
  validator: async function(value) {
    const user = await User.findOne({ username: value })
    return !user
  },
  message: 'Username already taken'
})
```

### Update Validators

Enable validators on update operations.

```javascript
const options = {
  runValidators: true,
  context: 'query'
}

await User.updateOne({ _id: id }, { age: 15 }, options)
```

---

## Population

### Basic Population

```javascript
// Schema definition
const postSchema = new mongoose.Schema({
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

// Populate
const post = await Post.findById(id).populate('author')

// Multiple fields
const post = await Post.findById(id).populate('author comments')

// Select specific fields
const post = await Post.findById(id).populate('author', 'name email')

// Populate with options
const post = await Post.findById(id).populate({
  path: 'author',
  select: 'name email',
  match: { status: 'active' },
  options: { sort: { name: 1 }, limit: 10 }
})
```

### Multiple Populate

```javascript
const post = await Post.findById(id)
  .populate('author')
  .populate('comments')
  .populate({
    path: 'likes',
    populate: { path: 'user' }
  })
```

### Nested Populate

```javascript
const user = await User.findById(id).populate({
  path: 'posts',
  populate: {
    path: 'comments',
    populate: { path: 'author' }
  }
})
```

### Dynamic References

```javascript
const commentSchema = new mongoose.Schema({
  content: String,
  onModel: { type: String, enum: ['Post', 'Product'] },
  commentable: { type: mongoose.Schema.Types.ObjectId, refPath: 'onModel' }
})

const comment = await Comment.findById(id).populate('commentable')
```

### Populate Virtuals

```javascript
const post = await Post.findById(id).populate({
  path: 'comments',
  options: { virtuals: true }
})
```

---

## Indexes

### Creating Indexes

```javascript
// Single field index
userSchema.index({ email: 1 })

// Compound index
userSchema.index({ firstName: 1, lastName: 1 })

// Unique index
userSchema.index({ email: 1 }, { unique: true })

// Text index
userSchema.index({ name: 'text', bio: 'text' })

// TTL index (auto-delete after expiration)
userSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 })

// Sparse index
userSchema.index({ phone: 1 }, { sparse: true })

// Partial index
userSchema.index(
  { email: 1 },
  { partialFilterExpression: { status: 'active' } }
)

// 2dsphere index (geospatial)
userSchema.index({ location: '2dsphere' })
```

### Index Options

```javascript
userSchema.index({ email: 1 }, {
  unique: true,
  sparse: true,
  background: true,
  name: 'email_unique_index',
  expireAfterSeconds: 3600,
  weights: { name: 10, bio: 5 },
  default_language: 'english',
  language_override: 'lang'
})
```

### Getting Indexes

```javascript
User.collection.getIndexes()
```

### Syncing Indexes

```javascript
await User.syncIndexes()
```

### Dropping Indexes

```javascript
await User.collection.dropIndex('email_1')
await User.collection.dropIndexes()
```

---

## Additional Schema Options

### Schema Options

```javascript
const userSchema = new mongoose.Schema({
  name: String
}, {
  timestamps: true, // adds createdAt, updatedAt
  versionKey: false, // removes __v
  collection: 'users', // custom collection name
  strict: true, // reject fields not in schema
  strictQuery: true, // apply strict mode to queries
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
  id: false, // don't create virtual id
  _id: true, // create _id field
  minimize: true, // remove empty objects
  validateBeforeSave: true,
  autoIndex: true, // build indexes
  autoCreate: true // create collection
})
```

### Schema Types Options

```javascript
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Anonymous',
    get: v => v.toUpperCase(),
    set: v => v.toLowerCase(),
    alias: 'fullName',
    immutable: true,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  }
})
```

---

## Transaction Methods

### Sessions

```javascript
const session = await mongoose.startSession()

try {
  session.startTransaction()
  
  await User.create([{ name: 'John' }], { session })
  await Post.create([{ title: 'Hello' }], { session })
  
  await session.commitTransaction()
} catch (error) {
  await session.abortTransaction()
  throw error
} finally {
  session.endSession()
}
```

### With Transaction Helper

```javascript
await mongoose.connection.transaction(async (session) => {
  await User.create([{ name: 'John' }], { session })
  await Post.create([{ title: 'Hello' }], { session })
})
```

---

## Connection Methods

### Connecting

```javascript
await mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
```

### Disconnecting

```javascript
await mongoose.disconnect()
```

### Connection Events

```javascript
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB')
})

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err)
})

mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from MongoDB')
})
```

---

## Query Options Reference

Common options for query methods:

```javascript
{
  session: mongooseSession,
  new: true, // return updated document
  upsert: true, // create if not exists
  runValidators: true, // run validators on update
  setDefaultsOnInsert: true, // apply defaults on upsert
  rawResult: true, // return driver result
  strict: true, // enforce schema
  timestamps: true, // update timestamps
  lean: true, // return plain objects
  populate: 'author', // populate paths
  select: 'name email', // select fields
  sort: { age: -1 }, // sort results
  limit: 10, // limit results
  skip: 20, // skip documents
  maxTimeMS: 5000, // query timeout
  collation: { locale: 'en', strength: 2 }
}
```

---

## Best Practices

1. **Use lean() for read-only operations** - Better performance
2. **Use select() to limit fields** - Reduce data transfer
3. **Create indexes for frequent queries** - Improve query performance
4. **Use populate() sparingly** - Can impact performance
5. **Use transactions for related writes** - Ensure data consistency
6. **Validate data at schema level** - Data integrity
7. **Use middleware for cross-cutting concerns** - Keep logic centralized
8. **Handle errors in middleware** - Better error handling
9. **Use static methods for reusable queries** - Code organization
10. **Enable timestamps** - Track document changes

---

## Common Query Examples

```javascript
// Pagination
const page = 2
const limit = 10
const users = await User.find()
  .limit(limit)
  .skip((page - 1) * limit)
  .sort({ createdAt: -1 })

// Search with regex
const users = await User.find({
  name: { $regex: searchTerm, $options: 'i' }
})

// Date range query
const users = await User.find({
  createdAt: {
    $gte: new Date('2024-01-01'),
    $lte: new Date('2024-12-31')
  }
})

// Complex query with multiple conditions
const users = await User.find({
  $or: [
    { status: 'active' },
    { premium: true }
  ],
  age: { $gte: 18 },
  email: { $exists: true }
})
.select('name email age')
.populate('posts', 'title')
.limit(20)
.lean()
```

---

This comprehensive guide covers the most commonly used MongoDB and Mongoose methods. For the most up-to-date information, always refer to the official [Mongoose documentation](https://mongoosejs.com/docs/).
