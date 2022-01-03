const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        likes: 5,
      },
      {
        title: 'nfinfonne',
        author: 'Edsger W. Dijkstra',
        likes: 10,
      }
]

const nonExistingId = async () => {
    const blog = new Blog({ title: 'willremovesoon', author: 'hey' })
    await blog.save()
    await blog.remove()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blog = await Blog.find({})
    return blog.map(b => b.toJSON())
  }

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }
  
  
  module.exports = {
    initialBlogs, nonExistingId, blogsInDb, usersInDb
  }