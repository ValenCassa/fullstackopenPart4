const { test } = require('@jest/globals')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const blog = require('../models/blog')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { request, response } = require('../app')


beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObj = helper.initialBlogs.map(b => new Blog(b))
    const promiseArray = blogObj.map(blog => blog.save())

    await Promise.all(promiseArray)
}, 10000)




test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('a specific blog title is within the retuned blogs', async () => {
    const response = await api.get('/api/blogs')

    const title = response.body.map(r => r.title)
    expect(title).toContain(
        'Go To Statement Considered Harmful'
    )
})


test('a valid blog can be added', async () => {
    await User.deleteMany({})

    const newUser = {
        username: "test",
        name: "tester",
        password: "testPass"
    }

    await api
        .post('/api/users')
        .send(newUser)
    
    const logUser = {
        username: "test",
        password: "testPass"
    }

    const login = await api
        .post('/api/login')
        .send(logUser)
    
    const token = login.body.token

    const newBlog = {
        title: 'how async/await works',
        author: 'Valen',
        likes: 5,
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const title = blogsAtEnd.map(r => r.title)

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    expect(title).toContain(
        'how async/await works'
    )
}, 100000)

test('invalid token not added', async () => {
    await User.deleteMany({})

    const newBlog = {
        title: 'how async/await works',
        author: 'Valen',
        likes: 5,
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `bearer testtoken`)
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

}, 100000)


test('blog without title is not added', async () => {
    await User.deleteMany({})

    const newUser = {
        username: "test",
        name: "tester",
        password: "testPass"
    }

    await api
        .post('/api/users')
        .send(newUser)
    
    const logUser = {
        username: "test",
        password: "testPass"
    }

    const login = await api
        .post('/api/login')
        .send(logUser)
    
    const token = login.body.token

    const newBlog = {
    author: 'hi',
    likes: 3
    }
  
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(400)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

test('a specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToView = blogsAtStart[0]

    const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const proceseedBlogToView = JSON.parse(JSON.stringify(blogToView))

    expect(resultBlog.body).toEqual(proceseedBlogToView)
})

test('a blog can be deleted', async () => {
    await User.deleteMany({})

    const newUser = {
        username: "test",
        name: "tester",
        password: "testPass"
    }

    await api
        .post('/api/users')
        .send(newUser)
    
    const logUser = {
        username: "test",
        password: "testPass"
    }

    const login = await api
        .post('/api/login')
        .send(logUser)
    
    const token = login.body.token

    const newBlog = {
        title: 'how async/await works',
        author: 'Valen',
        likes: 5,
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(newBlog)
        
    const blogs = await helper.blogsInDb()
    const blogToDelete = blogs.find(b => b.title === 'how async/await works')

    expect(blogs).toContain(blogToDelete)

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `bearer ${token}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length
    )

    const title = blogsAtEnd.map(b => b.title)

    expect(title).not.toContain(blogToDelete.title)
})

test('blogs have ID', async () => {
    const blogsInDb = await helper.blogsInDb()
    const blogTester = blogsInDb[0]

    expect(blogTester.id).toBeDefined()

})

test('likes default to 0', async () => {
    await User.deleteMany({})

    const newUser = {
        username: "test",
        name: "tester",
        password: "testPass"
    }

    await api
        .post('/api/users')
        .send(newUser)
    
    const logUser = {
        username: "test",
        password: "testPass"
    }

    const login = await api
        .post('/api/login')
        .send(logUser)
    
    const token = login.body.token

    const newBlog = {
        author: 'valen',
        title: 'likes to 0'
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(newBlog)

    const blogsAtEnd = await helper.blogsInDb()

    const testBlog = blogsAtEnd.find(b => b.title === 'likes to 0')
    
    expect(testBlog.likes).toEqual(0)

})

test('update blog', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const newBlog = {
        title: 'updates blog',
        author: 'test author'
    }

    const blogToUpdate = blogsAtStart[0]

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(newBlog)

    const blogsAtEnd = await helper.blogsInDb()
    const blogsArray = blogsAtEnd.map(b => b.title)

    expect(blogsArray).toContain(newBlog.title)
    expect(blogsArray).not.toContain(blogToUpdate.title)
})


afterAll(done => {
    mongoose.connection.close()

    done()
})