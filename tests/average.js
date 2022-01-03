const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
    const blogs = [{"hola": "hola", "chau": "chau"}, {"hola": "hola", "chau": "chau"}]
  
    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
  })

describe('total likes', () => {
    const listWithOneBlog = [
      {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        likes: 5,
      },
      {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        likes: 10,
      },
      {
        title: 'Go To Statement Considered Harmful',
        author: 'Edgar Ter',
        likes: 1,
      },
      {
        title: 'Go To Statement Considered Harmful',
        author: 'Edgar Ter',
        likes: 3,
      }
    ]
  
    test('sum blogs likes', () => {
      const result = listHelper.totalLikes(listWithOneBlog)
      expect(result).toBe(19)
    }) 

    test('find most liked blog', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        expect(result).toEqual(listWithOneBlog[1])
    })

    test('find most blogs', () => {
        const result = listHelper.mostBlogs(listWithOneBlog)
        expect(result).toEqual({"author": "Edsger W. Dijkstra", "blogs": 2})
    })

    test('find most liked blogger', () => {
        const result = listHelper.mostLikedAuthor(listWithOneBlog)
        expect(result).toEqual({"author": "Edsger W. Dijkstra", "likes": 15})
    })
  })