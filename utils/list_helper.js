const _ = require('lodash')

const dummy = (blogs) => {
    const newArray = []
    return blogs.length === 0
    ? 1
    : newArray.concat(blogs.shift()).length
  }

const totalLikes = (blogs) => {
  const likes = blogs.map(b => b.likes)
  const reducer = (prev, curr) => {
    return prev + curr
  }

  return likes.reduce(reducer)
}

const favoriteBlog = (blogs) => {
  const likes = blogs.map(b => b.likes)
  const max = Math.max(...likes)
  const favorite = blogs.find(b => b.likes === max)

  return favorite
}

const mostBlogs = (blogs) => {
  const authors = blogs.map(b => b.author)

  const mostB = (_(authors)
    .countBy()
    .entries()
    .maxBy(_.last())  
  )

  const mostBlogObj = {
    author: _.first(mostB),
    blogs: _.last(mostB)
  }

  return mostBlogObj
}

const mostLikedAuthor = (blogs) => {
  const newBlogs = blogs.map(b => _.pick(b, ['author', 'likes']))
  const result = 
    _(newBlogs)
      .groupBy('author')
      .map((objs, key) => ({
        'author': key,
        'likes': _.sumBy(objs, 'likes')
      }))
      .value()
      
    const likes = result.map(l => l.likes)
    const max = Math.max(...likes)
    const favorite = result.find(b => b.likes === max)
    
  return favorite
}



module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikedAuthor
}