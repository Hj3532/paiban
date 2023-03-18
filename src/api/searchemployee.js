import axios from 'axios'

export async function searchEmployee(shopID, page, limit, name, position) {
  const path = '/' + limit
  const path2 = '?name=' + name
  const path3 = '&position=' + position
  const { data } = await axios.get('/emp/' + shopID + '/' + page + path + path2 + path3)
  return data
}
